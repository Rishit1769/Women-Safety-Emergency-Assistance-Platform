'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api/fetcher';

const CATEGORIES = [
  { value: 'unsafe_area', label: '⚠️ Unsafe Area' },
  { value: 'stalking', label: '👁️ Stalking' },
  { value: 'broken_streetlight', label: '💡 Broken Streetlight' },
  { value: 'suspicious_behavior', label: '🔍 Suspicious Behavior' },
  { value: 'unsafe_transport', label: '🚌 Unsafe Transport' },
  { value: 'harassment', label: '🚨 Harassment' },
  { value: 'poor_lighting', label: '🌑 Poor Lighting' },
  { value: 'other', label: '📋 Other' },
] as const;

export default function CreateReportPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [form, setForm] = useState({
    category: '' as string,
    title: '',
    description: '',
    address: '',
    city: '',
    latitude: 0,
    longitude: 0,
    isAnonymous: true,
  });
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  useEffect(() => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      (p) => {
        setForm((f) => ({ ...f, latitude: p.coords.latitude, longitude: p.coords.longitude }));
        setLocating(false);
      },
      () => setLocating(false)
    );
  }, []);

  const mutation = useMutation({
    mutationFn: () => api.post('/community', form),
    onSuccess: () => router.push('/community'),
  });

  if (!isAuthenticated) return null;

  const isValid = form.category && form.description.length >= 5 && form.latitude !== 0;

  return (
    <div className="min-h-screen bg-light">
      <header className="bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-muted hover:text-navy p-1 rounded hover:bg-gray-100">←</button>
        <h1 className="text-base font-bold text-navy">Submit Safety Report</h1>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {/* Location status */}
        <div className={`card flex items-center gap-2 text-sm ${locating ? 'text-muted' : form.latitude !== 0 ? 'text-safe' : 'text-emergency'}`}>
          <span>{locating ? '📡' : form.latitude !== 0 ? '✅' : '❌'}</span>
          <span>{locating ? 'Acquiring GPS location…' : form.latitude !== 0 ? `Location acquired (${form.latitude.toFixed(4)}, ${form.longitude.toFixed(4)})` : 'Could not get location. Please try again.'}</span>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-navy">Incident Type *</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, category: cat.value }))}
                className={`text-sm py-2 px-3 rounded-xl text-left font-medium transition-colors ${
                  form.category === cat.value
                    ? 'bg-primary text-white'
                    : 'bg-white border border-border text-navy hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-navy">Title (optional)</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="input-field w-full"
            placeholder="Brief title…"
            maxLength={200}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-navy">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="input-field w-full resize-none"
            rows={4}
            placeholder="Describe what happened or what you observed…"
            maxLength={2000}
          />
          <p className="text-xs text-muted text-right">{form.description.length}/2000</p>
        </div>

        {/* Address */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-navy">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="input-field w-full"
              placeholder="Street / landmark"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-navy">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="input-field w-full"
              placeholder="City"
            />
          </div>
        </div>

        {/* Anonymity toggle */}
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-navy">Submit Anonymously</p>
            <p className="text-xs text-muted">Your identity will not be disclosed</p>
          </div>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, isAnonymous: !f.isAnonymous }))}
            className={`w-12 h-6 rounded-full transition-colors ${form.isAnonymous ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.isAnonymous ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {mutation.isError && (
          <p className="text-xs text-emergency text-center">Failed to submit report. Please try again.</p>
        )}

        <button
          onClick={() => mutation.mutate()}
          disabled={!isValid || mutation.isPending || locating}
          className="btn-primary w-full py-3 disabled:opacity-50"
        >
          {mutation.isPending ? 'Submitting…' : 'Submit Report'}
        </button>
      </main>
    </div>
  );
}
