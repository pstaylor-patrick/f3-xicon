'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { RelatedItems } from '@/components/related-items';
import type { XiconEntry } from '@/lib/xicon';

const DEFAULT_MAP_URL = 'https://map.f3nation.com/';

interface RegionDetailProps {
  entry: XiconEntry;
  related: XiconEntry[];
  next?: XiconEntry;
  prev?: XiconEntry;
}

export function RegionDetail({ entry, related, next, prev }: RegionDetailProps) {
  const { title, city, state, slug, mapUrl } = entry;

  // Generate F3 Nation region URL
  const f3RegionUrl = `https://freemensworkout.org/regions/${slug}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/xicon" className="text-muted-foreground hover:text-foreground">
          ← Back to search
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
              Region
            </Badge>
          </div>

          <h1 className="mb-8 text-4xl font-bold tracking-tight">{title}</h1>

          <div className="mb-6 rounded-lg bg-muted p-4">
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

          <div className="mt-12 flex justify-between">
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

        <div className="lg:mt-0">
          <RelatedItems
            items={related.filter(item => item.type === 'region')}
            title="Nearby Regions"
          />
        </div>
      </div>
    </div>
  );
}
