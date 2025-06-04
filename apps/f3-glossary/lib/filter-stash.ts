// utils/filter-stash.ts

type ExerciseFilter = {
  tags: string[];
  operator: 'AND' | 'OR';
};

type RegionFilter = {
  country?: string;
  state?: string;
  city?: string;
  lat?: number;
  lng?: number;
};

let exerciseStash: ExerciseFilter = {
  tags: [],
  operator: 'OR',
};

let regionStash: RegionFilter = {};

export function stashExerciseFilters(tags: string[], operator: 'AND' | 'OR') {
  exerciseStash = { tags, operator };
}

export function getExerciseFilters(): ExerciseFilter {
  return exerciseStash;
}

export function stashRegionFilters(
  country?: string,
  state?: string,
  city?: string,
  lat?: number,
  lng?: number
) {
  regionStash = { country, state, city, lat, lng };
}

export function getRegionFilters(): RegionFilter {
  return regionStash;
}
