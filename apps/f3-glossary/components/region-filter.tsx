'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Filter, X } from 'lucide-react';
import { getAllStates, getAllCities } from '@/lib/xicon';

export function RegionFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>(searchParams.get('state') || 'all');
  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get('city') || 'all');
  const [open, setOpen] = useState(false);

  // Load all states and cities
  useEffect(() => {
    (async () => {
      const [states, cities] = await Promise.all([getAllStates(), getAllCities()]);
      setStates(states);
      setCities(cities);
    })();
  }, []);

  // Update URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedState !== 'all') {
      params.set('state', selectedState);
    } else {
      params.delete('state');
    }

    if (selectedCity !== 'all') {
      params.set('city', selectedCity);
    } else {
      params.delete('city');
    }

    router.push(`/xicon?${params.toString()}`);
    setOpen(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedState('all');
    setSelectedCity('all');

    const params = new URLSearchParams(searchParams.toString());
    params.delete('state');
    params.delete('city');

    router.push(`/xicon?${params.toString()}`);
    setOpen(false);
  };

  const hasFilters = selectedState !== 'all' || selectedCity !== 'all';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${hasFilters ? 'border-primary text-primary' : ''}`}
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {hasFilters && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
              {(selectedState !== 'all' ? 1 : 0) + (selectedCity !== 'all' ? 1 : 0)}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 popover-transparent">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Filter by Location</h3>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
              <X className="mr-1 h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="state-filter">State</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger id="state-filter">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent className="popover-transparent">
                <SelectItem value="all">All States</SelectItem>
                {states.map(state => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city-filter">City</Label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger id="city-filter">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent className="popover-transparent">
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button variant="default" className="mt-4 w-full text-white" onClick={updateFilters}>
          Apply Filters
        </Button>
      </PopoverContent>
    </Popover>
  );
}
