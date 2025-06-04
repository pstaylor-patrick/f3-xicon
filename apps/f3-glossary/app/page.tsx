'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getFilteredXicons } from '@/lib/xicon';
import { useInView } from 'react-intersection-observer';
import { Suspense } from 'react';
import { XiconList } from '@/components/xicon-list';
import { XiconHeader } from '@/components/xicon-header';
import type { XiconEntry, XiconFilter } from '@/lib/xicon';
import type { LatLng } from '@/lib/mapUtils';

const ITEMS_PER_PAGE = 12;

export default function XiconPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'all' | 'exercise' | 'term' | 'article'>(
    (searchParams.get('kind') as any) || 'all'
  );

  /** @todo make a util function for this */
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const latLng =
    lat && lng ? ({ lat: parseFloat(lat), lng: parseFloat(lng) } as LatLng) : undefined;
  const [filter, setFilter] = useState<XiconFilter>({
    kind: activeTab === 'all' ? undefined : activeTab,
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
    query: searchParams.get('q') || '',
    tagsOperator: (searchParams.get('tagsOperator') as 'AND' | 'OR') || 'OR',
    latLng: latLng,
  });

  const [allResults, setAllResults] = useState<XiconEntry[]>([]);
  const [displayedResults, setDisplayedResults] = useState<XiconEntry[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Update filter when URL params change
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const latLng =
      lat && lng ? ({ lat: parseFloat(lat), lng: parseFloat(lng) } as LatLng) : undefined;
    const newFilter: XiconFilter = {
      kind: activeTab === 'all' ? undefined : activeTab,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
      query: searchParams.get('q') || '',
      tagsOperator: (searchParams.get('tagsOperator') as 'AND' | 'OR') || 'OR',
      latLng: latLng,
    };

    setFilter(newFilter);
    setPage(1);

    // Get filtered results
    (async () => {
      const results = await getFilteredXicons(newFilter);
      setAllResults(results);
      setDisplayedResults(results.slice(0, ITEMS_PER_PAGE));
      setHasMore(results.length > ITEMS_PER_PAGE);
    })();
  }, [searchParams, activeTab]);

  // Load more results when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView]);

  const loadMore = () => {
    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const nextPage = page + 1;
      const nextResults = allResults.slice(0, nextPage * ITEMS_PER_PAGE);

      setDisplayedResults(nextResults);
      setPage(nextPage);
      setHasMore(nextResults.length < allResults.length);
      setLoading(false);
    }, 500);
  };

  const handleTabChange = (value: string) => {
    const newTab = value as 'all' | 'exercise' | 'term' | 'article';
    setActiveTab(newTab);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());

    if (newTab === 'all') {
      params.delete('kind');
    } else {
      params.set('kind', newTab);
    }

    window.history.pushState({}, '', `/?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <XiconHeader />
      <Suspense fallback={<div className="mt-8 text-center">Loading...</div>}>
        <XiconList />
      </Suspense>
    </div>
  );
}
