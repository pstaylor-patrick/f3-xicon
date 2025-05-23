'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchBar } from '@/components/search-bar';
import { TagFilter } from '@/components/tag-filter';
import { RegionFilter } from '@/components/region-filter';

export function XiconHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'all' | 'exercise' | 'term' | 'article' | 'region'>(
    (searchParams.get('kind') as any) || 'all'
  );

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const newTab = value as 'all' | 'exercise' | 'term' | 'article' | 'region';
    setActiveTab(newTab);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());

    if (newTab === 'all') {
      params.delete('kind');
    } else {
      params.set('kind', newTab);
    }

    router.push(`/xicon?${params.toString()}`);
  };

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md pb-4">
      <div className="mb-4">
        <SearchBar />
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="exercise">Exercises</TabsTrigger>
            <TabsTrigger value="term">Glossary</TabsTrigger>
            <TabsTrigger value="article">Articles</TabsTrigger>
            <TabsTrigger value="region">Regions</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === 'exercise' && <TagFilter />}
        {activeTab === 'region' && <RegionFilter />}
      </div>
    </div>
  );
}
