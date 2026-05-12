'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api/fetcher';

interface AlertItem {
  id: string;
  alertCode: string;
  alertType: string;
  severity: string;
  status: string;
  triggerLatitude: number;
  triggerLongitude: number;
  triggerAddress?: string;
  description?: string;
  escalationReason?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  active: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  escalated: 'bg-red-100 text-red-800',
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 border border-red-200',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-blue-100 text-blue-800',
};

export default function PoliceDashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [escalateId, setEscalateId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  const { data: profileData, isError: noProfile } = useQuery({
    queryKey: ['police-profile'],
    queryFn: () => api.get('/police/profile'),
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: alertsData, isLoading } = useQuery({
    queryKey: ['police-alerts'],
    queryFn: () => api.get('/police/alerts'),
    refetchInterval: 10_000,
    enabled: isAuthenticated && !noProfile,
  });

  const dutyMutation = useMutation({
    mutationFn: (isOnDuty: boolean) => api.patch('/police/duty', { isOnDuty }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['police-profile'] }),
  });

  const assignMutation = useMutation({
    mutationFn: (alertId: string) => api.post('/police/assign', { alertId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['police-alerts'] }),
  });

  const escalateMutation = useMutation({
    mutationFn: ({ alertId, reason: r }: { alertId: string; reason: string }) =>
      api.post('/police/escalate', { alertId, reason: r }),
    onSuccess: () => {
      setEscalateId(null);
      setReason('');
      queryClient.invalidateQueries({ queryKey: ['police-alerts'] });
    },
  });

  if (!isAuthenticated) return null;

  const profile = (profileData as { data?: { isOnDuty?: boolean; verificationStatus?: string; badgeNumber?: string; rank?: string; station?: { name?: string } } } | undefined)?.data;
  const alerts = ((alertsData as { data?: AlertItem[] } | undefined)?.data) ?? [];

  if (noProfile) {
    return (
      <div className="min-h-screen bg-light flex flex-col items-center justify-center p-6">
        <div className="card max-w-sm w-full text-center space-y-4">
          <div className="text-4xl">🚔</div>
          <h1 className="text-xl font-bold text-navy">Police Officer Registration</h1>
          <p className="text-muted text-sm">Register your police account to access the emergency feed.</p>
          <button onClick={() => router.push('/police/register')} className="btn-primary w-full">
            Register Police Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <header className="bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-muted hover:text-navy p-1 rounded hover:bg-gray-100">←</button>
          <div>
            <p className="text-sm font-bold text-navy">{profile?.rank ? `${profile.rank} ` : ''}{profile?.badgeNumber}</p>
            <p className="text-xs text-muted">{profile?.station?.name}</p>
          </div>
        </div>
        <button
          onClick={() => dutyMutation.mutate(!profile?.isOnDuty)}
          disabled={dutyMutation.isPending}
          className={`text-xs px-3 py-1.5 rounded-xl font-semibold ${
            profile?.isOnDuty ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {profile?.isOnDuty ? '🟢 On Duty' : '⚫ Off Duty'}
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Escalate modal */}
        {escalateId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
            <div className="bg-white rounded-2xl p-4 w-full max-w-sm space-y-3">
              <h3 className="text-sm font-bold text-navy">Escalation Reason</h3>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-field w-full resize-none"
                rows={3}
                placeholder="Describe why this alert needs escalation…"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setEscalateId(null); setReason(''); }}
                  className="flex-1 py-2 rounded-xl bg-gray-100 text-navy text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  disabled={reason.length < 5 || escalateMutation.isPending}
                  onClick={() => escalateMutation.mutate({ alertId: escalateId, reason })}
                  className="flex-1 py-2 rounded-xl bg-emergency text-white text-sm font-semibold disabled:opacity-50"
                >
                  {escalateMutation.isPending ? 'Escalating…' : 'Escalate'}
                </button>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-sm font-bold text-navy px-1">Live Emergency Feed</h2>

        {isLoading && <p className="text-center text-muted text-sm py-8">Loading alerts…</p>}
        {!isLoading && alerts.length === 0 && (
          <div className="card text-center py-8">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-muted text-sm">No active alerts</p>
          </div>
        )}

        {alerts.map((alert) => (
          <div key={alert.id} className="card space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono text-muted">{alert.alertCode}</p>
                <p className="text-sm font-semibold text-navy capitalize">{alert.alertType.replace(/_/g, ' ')}</p>
                {alert.triggerAddress && <p className="text-xs text-muted">{alert.triggerAddress}</p>}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[alert.status] ?? ''}`}>
                  {alert.status}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${SEVERITY_COLORS[alert.severity] ?? ''}`}>
                  {alert.severity}
                </span>
              </div>
            </div>

            {alert.description && <p className="text-xs text-muted">{alert.description}</p>}
            {alert.escalationReason && (
              <p className="text-xs text-emergency font-medium">⚠️ {alert.escalationReason}</p>
            )}

            <div className="flex gap-2 pt-1">
              {alert.status !== 'accepted' && (
                <button
                  onClick={() => assignMutation.mutate(alert.id)}
                  disabled={assignMutation.isPending || !profile?.isOnDuty}
                  className="flex-1 btn-primary text-sm py-2 disabled:opacity-50"
                >
                  Assign to Me
                </button>
              )}
              {alert.status !== 'escalated' && (
                <button
                  onClick={() => setEscalateId(alert.id)}
                  disabled={!profile?.isOnDuty}
                  className="flex-1 py-2 rounded-xl border border-emergency text-emergency text-sm font-semibold hover:bg-red-50 disabled:opacity-50"
                >
                  Escalate
                </button>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
