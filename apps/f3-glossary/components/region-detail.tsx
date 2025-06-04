'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { RelatedItems } from '@/components/related-items';
import type { XiconEntry } from '@/lib/xicon';
import { badgeColor } from './xicon-card';
import { useSearchParams } from 'next/navigation';
import { haversineDistance, LatLng } from '@/lib/mapUtils';
import { useEffect, useState } from 'react';

const DEFAULT_WEBSITE_URL = 'https://freemensworkout.org/regions';
const DEFAULT_MAP_URL = 'https://map.f3nation.com/';

interface RegionDetailProps {
  entry: XiconEntry;
  related: XiconEntry[];
  next?: XiconEntry;
  prev?: XiconEntry;
}

export function RegionDetail({ entry, related, next, prev }: RegionDetailProps) {
  const { title, city, state, slug, websiteUrl, mapUrl, latLng } = entry;

  const searchParams = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const filterLatLng =
    lat && lng ? ({ lat: parseFloat(lat), lng: parseFloat(lng) } as LatLng) : undefined;
  if (!latLng) {
    throw new Error('latLng is undefined');
  }

  /** @todo more dynamic back href including other tabs like terms or exercises */
  const backHref = latLng && filterLatLng ? `/?kind=region&lat=${lat}&lng=${lng}` : '/';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={backHref} className="text-muted-foreground hover:text-foreground">
          ← Back to search
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Badge className={badgeColor.region}>Region</Badge>
          </div>

          <h1 className="mb-8 text-4xl font-bold tracking-tight">{title}</h1>

          <div className="mb-6 rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-f3-red" />
              <span className="text-lg">
                {city ? city + ', ' : ''}
                {state}
                {latLng && filterLatLng ? (
                  <span>
                    {' (' +
                      (Math.round(haversineDistance(latLng, filterLatLng) * 10) / 10).toFixed(1) +
                      ' mi away)'}
                  </span>
                ) : null}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={websiteUrl ? websiteUrl : DEFAULT_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-f3-red text-white hover:bg-f3-red/90">Visit Region Page</Button>
            </Link>

            <Link
              href={mapUrl ? mapUrl : DEFAULT_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>View on Map</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:mt-0">
          <RelatedItems
            entry={entry}
            items={related.filter(item => item.type === 'region')}
            title="Nearby Regions"
          />
        </div>
      </div>
    </div>
  );
}
