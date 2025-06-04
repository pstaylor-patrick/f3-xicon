'use client';

import { Button } from '@/components/ui/button';
import { LocateFixed } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function RegionsNearMeButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine if lat/lng are present in the URL
  const isActive = searchParams.has('lat') && searchParams.has('lng');

  const handleClick = () => {
    setError(null);
    if (isActive) {
      // Remove lat/lng from URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete('lat');
      params.delete('lng');
      router.push(`/?${params.toString()}`);
      return;
    }
    setLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const params = new URLSearchParams(searchParams.toString());
        params.set('lat', latitude.toString());
        params.set('lng', longitude.toString());
        router.push(`/?${params.toString()}`);
        setLoading(false);
      },
      err => {
        setError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        variant={isActive ? 'default' : 'outline'}
        className={`flex items-center gap-2 ${isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
        onClick={handleClick}
        disabled={loading}
      >
        <LocateFixed className="h-4 w-4" />
        <span>{loading ? 'Coming in hot...' : isActive ? 'All Regions' : 'Regions Near Me'}</span>
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
