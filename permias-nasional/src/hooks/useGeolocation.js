import { useCallback, useState } from 'react';

/** Browser geolocation, requested only on a user action. Location never leaves the device. */
export function useGeolocation() {
  const [state, setState] = useState({ status: 'idle', coords: null });

  const request = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState({ status: 'unavailable', coords: null });
      return;
    }
    setState((s) => ({ ...s, status: 'asking' }));
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ status: 'ok', coords: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
      (err) => setState({ status: err.code === 1 ? 'denied' : 'error', coords: null }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }, []);

  return { ...state, request };
}
