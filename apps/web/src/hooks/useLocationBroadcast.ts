'use client';

import { useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/auth.store';

interface UseLocationBroadcastOptions {
  /** Alert ID to broadcast location for. Pass null to stop broadcasting. */
  alertId: string | null;
  /** Interval in milliseconds between location sends. Default: 5000 (5s) */
  intervalMs?: number;
}

/**
 * Continuously broadcasts the user's GPS location to the socket server
 * while an active SOS alert is in progress.
 *
 * Stops broadcasting when alertId becomes null or the component unmounts.
 */
export function useLocationBroadcast({
  alertId,
  intervalMs = 5000,
}: UseLocationBroadcastOptions): void {
  const { accessToken, isAuthenticated } = useAuthStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!alertId || !isAuthenticated || !navigator.geolocation) return;

    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const socket = getSocket(accessToken ?? undefined);
          if (!socket.connected) return;

          socket.emit('SEND_LOCATION', {
            alertId,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        () => {
          // Silently ignore geolocation errors during broadcast
        },
        { timeout: 4000, enableHighAccuracy: true, maximumAge: 2000 }
      );
    };

    // Send immediately on first mount
    sendLocation();

    // Then repeat at the given interval
    intervalRef.current = setInterval(sendLocation, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [alertId, intervalMs, isAuthenticated, accessToken]);
}
