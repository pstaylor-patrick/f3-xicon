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
import { getCountryStateCityMap } from '@/lib/xicon';

export function RegionFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [locationMap, setLocationMap] = useState<Record<string, Record<string, string[]>>>({});
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string>(
    searchParams.get('country') || 'all'
  );
  const [selectedState, setSelectedState] = useState<string>(searchParams.get('state') || 'all');
  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get('city') || 'all');
  const [open, setOpen] = useState(false);

  // Load location map and countries
  useEffect(() => {
    (async () => {
      const map = await getCountryStateCityMap();
      setLocationMap(map);
      setCountries(Object.keys(map).sort());
    })();
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (selectedCountry === 'all' || !locationMap[selectedCountry]) {
      setStates([]);
      setSelectedState('all');
      setCities([]);
      setSelectedCity('all');
      return;
    }

    const statesForCountry = Object.keys(locationMap[selectedCountry]);
    setStates(statesForCountry.sort());
    setSelectedState('all');
    setCities([]);
    setSelectedCity('all');
  }, [selectedCountry, locationMap]);

  // Update cities when state changes
  useEffect(() => {
    if (
      selectedCountry === 'all' ||
      selectedState === 'all' ||
      !locationMap[selectedCountry]?.[selectedState]
    ) {
      setCities([]);
      setSelectedCity('all');
      return;
    }

    const citiesForState = locationMap[selectedCountry][selectedState];
    setCities(citiesForState.sort());
    setSelectedCity('all');
  }, [selectedState, selectedCountry, locationMap]);

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    selectedCountry !== 'all' ? params.set('country', selectedCountry) : params.delete('country');
    selectedState !== 'all' ? params.set('state', selectedState) : params.delete('state');
    selectedCity !== 'all' ? params.set('city', selectedCity) : params.delete('city');

    router.push(`/?${params.toString()}`);
    setOpen(false);
  };

  const clearFilters = () => {
    setSelectedCountry('all');
    setSelectedState('all');
    setSelectedCity('all');

    const params = new URLSearchParams(searchParams.toString());
    params.delete('country');
    params.delete('state');
    params.delete('city');

    router.push(`/?${params.toString()}`);
    setOpen(false);
  };

  const hasFilters = selectedCountry !== 'all' || selectedState !== 'all' || selectedCity !== 'all';

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
              {(selectedCountry !== 'all' ? 1 : 0) +
                (selectedState !== 'all' ? 1 : 0) +
                (selectedCity !== 'all' ? 1 : 0)}
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
            <Label htmlFor="country-filter">Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger id="country-filter">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent className="popover-transparent">
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
