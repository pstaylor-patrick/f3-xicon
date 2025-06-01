'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchBar } from '@/components/search-bar';
import { TagFilter } from '@/components/tag-filter';
import { RegionFilter } from '@/components/region-filter';
import { prepareParamsForTabSwitch } from '@/lib/prepare-tab-urls';

export type ItemTypeFilter = 'all' | 'exercise' | 'term' | 'article' | 'region';

export function XiconHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ItemTypeFilter>(
    (searchParams.get('kind') as ItemTypeFilter) || 'all'
  );

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const newTab = value as ItemTypeFilter;
    const currentKind = (searchParams.get('kind') as ItemTypeFilter) || 'all';

    setActiveTab(newTab);

    const newParams = prepareParamsForTabSwitch({
      currentTab: currentKind,
      newTab,
      searchParams,
    });

    router.push(`/?${newParams.toString()}`);
  };

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md pb-4">
      <div className="mb-4">
        <SearchBar />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide sm:overflow-visible">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
            <TabsList className="flex-nowrap min-w-fit">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="exercise">Exercises</TabsTrigger>
              <TabsTrigger value="term">Glossary</TabsTrigger>
              <TabsTrigger value="article">Articles</TabsTrigger>
              <TabsTrigger value="region">Regions</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {activeTab === 'exercise' && <TagFilter />}
        {activeTab === 'region' && <RegionFilter />}
      </div>
    </div>
  );
}
