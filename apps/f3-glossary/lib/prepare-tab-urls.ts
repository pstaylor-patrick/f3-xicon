// utils/prepare-tab-url.ts
import {
  stashExerciseFilters,
  getExerciseFilters,
  stashRegionFilters,
  getRegionFilters,
} from '@/lib/filter-stash';

export function prepareParamsForTabSwitch({
  currentTab,
  newTab,
  searchParams,
}: {
  currentTab: string;
  newTab: string;
  searchParams: URLSearchParams;
}): URLSearchParams {
  const params = new URLSearchParams(searchParams.toString());

  // Stash and clear filters
  if (currentTab === 'exercise') {
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const operator = searchParams.get('tagsOperator') === 'AND' ? 'AND' : 'OR';
    stashExerciseFilters(tags, operator);
    params.delete('tags');
    params.delete('tagsOperator');
  }

  if (currentTab === 'region') {
    const country = searchParams.get('country') || undefined;
    const state = searchParams.get('state') || undefined;
    const city = searchParams.get('city') || undefined;
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined;
    stashRegionFilters(country, state, city, lat, lng);
    params.delete('country');
    params.delete('state');
    params.delete('city');
    params.delete('lat');
    params.delete('lng');
  }

  // Set new tab
  if (newTab === 'all') {
    params.delete('kind');
  } else {
    params.set('kind', newTab);
  }

  // Restore filters
  if (newTab === 'exercise') {
    const { tags, operator } = getExerciseFilters();
    if (tags.length) {
      params.set('tags', tags.join(','));
    }
    if (operator === 'AND') {
      params.set('tagsOperator', 'AND');
    }
  }

  if (newTab === 'region') {
    const { country, state, city, lat, lng } = getRegionFilters();
    if (country) params.set('country', country);
    if (state) params.set('state', state);
    if (city) params.set('city', city);
    if (lat) params.set('lat', lat.toString());
    if (lng) params.set('lng', lng.toString());
  }

  return params;
}
