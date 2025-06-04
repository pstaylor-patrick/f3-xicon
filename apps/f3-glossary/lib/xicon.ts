import type { XiconItem } from '@/lib/types';
import { getArticles } from '@/lib/articles';
import { getItems } from '@/lib/items';
import { getRegions } from '@/lib/regions';
import type { ItemTypeFilter } from '@/components/xicon-header';
import { haversineDistance, LatLng } from './mapUtils';

export type XiconFilter = {
  kind?: ItemTypeFilter;
  tags?: string[];
  query?: string;
  tagsOperator?: 'AND' | 'OR';
  country?: string;
  city?: string;
  state?: string;
  latLng?: LatLng;
};

export type XiconEntry = XiconItem;

export async function getAllXicons(): Promise<XiconItem[]> {
  const items: XiconItem[] = (await getItems()).map(item => ({
    id: `${item.type}-${item.slug}`,
    title: item.name,
    text: item.description,
    type: item.type,
    tags: item.tags,
  }));

  const articles: XiconItem[] = (await getArticles()).map(item => ({
    id: `article-${item.slug}`,
    title: item.name,
    text: item.fullText,
    type: 'article' as const,
    tags: item.tags,
    articleUrl: item.srcUrl,
    featuredImageUrl: item.thumbnailUrl,
  }));

  const regions: XiconItem[] = (await getRegions()).map(item => ({
    id: `region-${item.slug}`,
    title: item.name,
    text: `${item.city ? item.city + ', ' : ''}${item.state}`,
    type: 'region' as const,
    slug: item.slug,
    city: item.city,
    state: item.state,
    country: item.country,
    websiteUrl: item.regionPageUrl,
    mapUrl: item.mapUrl,
    latLng: { lat: item.lat, lng: item.lng } as LatLng,
  }));

  return [...items, ...articles, ...regions];
}

export async function getXiconById(id: string): Promise<XiconItem | undefined> {
  const allItems = await getAllXicons();
  return allItems.find(item => item.id === id);
}

export async function getFilteredXicons(filter: XiconFilter): Promise<XiconItem[]> {
  /** @todo avoid double fetching for filtered views */
  let items = await getAllXicons();
  const regionsNearMe = filter.latLng ? await getRegions(filter.latLng) : [];

  // Filter by kind
  if (filter.kind) {
    items = items.filter(item => item.type === filter.kind);
  }

  // Filter by query
  if (filter.query) {
    const searchLower = filter.query.toLowerCase();
    items = items.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const textMatch = item.text.toLowerCase().includes(searchLower);
      const tagMatch = item.tags?.some(tag => tag.toLowerCase().includes(searchLower));

      // Special handling for regions
      /** @todo integrate latLng into filter */
      const cityMatch = item.type === 'region' && item.city?.toLowerCase().includes(searchLower);
      const stateMatch = item.type === 'region' && item.state?.toLowerCase().includes(searchLower);

      return titleMatch || textMatch || tagMatch || cityMatch || stateMatch;
    });
  }

  // Filter by tags (for exercises)
  if (filter.tags && filter.tags.length > 0) {
    items = items.filter(item => {
      if (!item.tags) return false;

      if (filter.tagsOperator === 'AND') {
        return filter.tags!.every(tag =>
          item.tags!.some(itemTag => itemTag.toLowerCase() === tag.toLowerCase())
        );
      } else {
        return filter.tags!.some(tag =>
          item.tags!.some(itemTag => itemTag.toLowerCase() === tag.toLowerCase())
        );
      }
    });
  }

  // Filter by country (for regions)
  if (filter.country) {
    const countryLower = filter.country.toLowerCase();
    items = items.filter(item => {
      if (item.type !== 'region') return true;
      return item.country?.toLowerCase() === countryLower;
    });
  }

  // Filter by city (for regions)
  if (filter.city) {
    const cityLower = filter.city.toLowerCase();
    items = items.filter(item => {
      if (item.type !== 'region') return true;
      return item.city?.toLowerCase() === cityLower;
    });
  }

  // Filter by state (for regions)
  if (filter.state) {
    const stateLower = filter.state.toLowerCase();
    items = items.filter(item => {
      if (item.type !== 'region') return true;
      return item.state?.toLowerCase() === stateLower;
    });
  }

  // Fix: Use synchronous filter for latLng
  if (filter.latLng) {
    items = items.filter(item => {
      if (item.type !== 'region') return true;
      return regionsNearMe.some(region => region.slug === item.slug);
    });
    items.sort((a, b) => {
      // If a.latLng is missing, sort a after b
      if (!a.latLng) return 1;
      // If b.latLng is missing, sort b after a
      if (!b.latLng) return -1;
      // Both have latLng, compare distances
      return (
        haversineDistance(a.latLng, filter.latLng!) - haversineDistance(b.latLng, filter.latLng!)
      );
    });
  }

  return items;
}

export async function getAllTags(): Promise<string[]> {
  const tagSet = new Set<string>();
  const exercises = (await getAllXicons()).filter(item => item.type === 'exercise');

  exercises.forEach(item => {
    item.tags?.forEach(tag => {
      if (tag) tagSet.add(tag);
    });
  });

  return Array.from(tagSet).sort();
}

export async function getAllStates(): Promise<string[]> {
  const stateSet = new Set<string>();
  const regionItems = (await getAllXicons()).filter(item => item.type === 'region');

  regionItems.forEach(item => {
    if (item.state && item.state.trim() !== '') {
      stateSet.add(item.state);
    }
  });

  return Array.from(stateSet).sort();
}

export async function getAllCities(): Promise<string[]> {
  const citySet = new Set<string>();
  const regionItems = (await getAllXicons()).filter(item => item.type === 'region');

  regionItems.forEach(item => {
    if (item.city && item.city.trim() !== '') {
      citySet.add(item.city);
    }
  });

  return Array.from(citySet).sort();
}

export async function getAllCountries(): Promise<string[]> {
  const countrySet = new Set<string>();
  const regionItems = (await getAllXicons()).filter(item => item.type === 'region');

  regionItems.forEach(item => {
    if (item.country && item.country.trim() !== '') {
      countrySet.add(item.country);
    }
  });

  return Array.from(countrySet).sort();
}

export async function getRelatedXicons(entry: XiconItem, limit = 5): Promise<XiconItem[]> {
  const allItems = await getAllXicons();
  let related: XiconItem[] = [];

  // First, find items of the same type
  const sameTypeItems = allItems.filter(item => item.id !== entry.id && item.type === entry.type);

  switch (entry.type) {
    case 'exercise':
      if (entry.tags && entry.tags.length > 0) {
        // Find exercises with similar tags
        related = sameTypeItems
          .filter(item => item.tags?.some(tag => entry.tags!.includes(tag)))
          .sort((a, b) => {
            // Sort by number of matching tags (descending)
            const aMatches = a.tags?.filter(tag => entry.tags!.includes(tag)).length || 0;
            const bMatches = b.tags?.filter(tag => entry.tags!.includes(tag)).length || 0;
            return bMatches - aMatches;
          });
      }
      break;

    case 'term':
      // For terms, find items with similar words in title or text
      const titleWords = entry.title
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3);
      const textWords = entry.text
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3);

      related = sameTypeItems.filter(item => {
        const itemTitleWords = item.title.toLowerCase().split(/\s+/);
        const itemTextWords = item.text.toLowerCase().split(/\s+/);

        return (
          titleWords.some(word => itemTitleWords.includes(word) || itemTextWords.includes(word)) ||
          textWords.some(word => itemTitleWords.includes(word) || itemTextWords.includes(word))
        );
      });
      break;

    case 'article':
      // For articles, prioritize same quadrant
      if (entry.quadrant) {
        related = sameTypeItems.filter(item => item.quadrant === entry.quadrant);
      }
      break;

    case 'region':
      if (entry.latLng) {
        const latLng = entry.latLng as LatLng;
        related = (
          await getFilteredXicons({
            kind: 'region',
            latLng: latLng,
          })
        ).filter(item => item.id !== entry.id);
        related.sort((a, b) => {
          const latLngA = a.latLng as LatLng;
          const latLngB = b.latLng as LatLng;
          return haversineDistance(latLngA, latLng) - haversineDistance(latLngB, latLng);
        });
      } else {
        related = await getFilteredXicons({
          kind: 'region',
          state: entry.state,
        });
      }
      break;
  }

  // If we don't have enough related items, add some random items of the same type
  if (related.length < limit) {
    const randomItems = sameTypeItems
      .filter(item => !related.some(r => r.id === item.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, limit - related.length);

    related = [...related, ...randomItems];
  }

  return related.slice(0, limit);
}

export async function getNextPrevXicons(
  entry: XiconItem,
  filter: XiconFilter
): Promise<{ next?: XiconItem; prev?: XiconItem }> {
  // Get filtered items based on the current filter
  const latLng = entry.latLng ? (entry.latLng as LatLng) : undefined;
  const _filter = latLng ? { ...filter, latLng: latLng } : filter;
  const filteredItems = await getFilteredXicons(_filter);

  // Find the index of the current item
  const currentIndex = filteredItems.findIndex(item => item.id === entry.id);

  // If item not found in filtered list, return empty
  if (currentIndex === -1) {
    return { next: undefined, prev: undefined };
  }

  // Get next and previous items
  const next =
    currentIndex < filteredItems.length - 1 ? filteredItems[currentIndex + 1] : undefined;
  const prev = currentIndex > 0 ? filteredItems[currentIndex - 1] : undefined;

  return { next, prev };
}
