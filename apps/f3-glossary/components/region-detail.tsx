'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import type { XiconEntry } from '@/lib/xicon';

interface RegionDetailProps {
  entry: XiconEntry;
  related: XiconEntry[];
  next?: XiconEntry;
  prev?: XiconEntry;
}

export function RegionDetail({ entry, related, next, prev }: RegionDetailProps) {
  const { title, city, state, slug } = entry;

  // Generate Google Maps URL
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${title} F3 ${city} ${state}`
  )}`;

  // Generate F3 Nation region URL
  const f3RegionUrl = `https://f3nation.com/regions/${slug}`;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/xicon" className="text-gray-500 hover:text-gray-700">
          ← Back to search
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-4">
            <Badge className="bg-yellow-100 text-yellow-800">Region</Badge>
          </div>

          <h1 className="mb-6 text-3xl font-bold">{title}</h1>

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-f3-red" />
              <span className="text-lg">
                {city ? city + ', ' : ''}
                {state}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link href={f3RegionUrl} target="_blank" rel="noopener noreferrer">
              <Button className="bg-f3-red hover:bg-f3-red/90">Visit Region Page</Button>
            </Link>

            <Link href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>View on Map</span>
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex justify-between">
            {prev ? (
              <Link href={`/xicon/${prev.id}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link href={`/xicon/${next.id}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Nearby Regions</h2>
          <div className="space-y-4">
            {related.length > 0 ? (
              related
                .filter(item => item.type === 'region')
                .map(item => (
                  <Link key={item.id} href={`/xicon/${item.id}`}>
                    <div className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.city ? item.city + ', ' : ''}
                        {item.state}
                      </p>
                    </div>
                  </Link>
                ))
            ) : (
              <p className="text-gray-500">No nearby regions found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
