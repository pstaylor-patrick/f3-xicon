// utils/filter-stash.ts

type ExerciseFilter = {
  tags: string[];
  operator: 'AND' | 'OR';
};

type RegionFilter = {
  state?: string;
  city?: string;
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

export function stashRegionFilters(state?: string, city?: string) {
  regionStash = { state, city };
}

export function getRegionFilters(): RegionFilter {
  return regionStash;
}
