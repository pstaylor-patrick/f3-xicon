'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { getFilteredXicons } from '@/lib/xicon';
import type { XiconEntry } from '@/lib/xicon';
import { badgeColor } from './xicon-card';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState<XiconEntry[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    (async () => {
      const results = await getFilteredXicons({ query: debouncedQuery });
      setSuggestions(results.slice(0, 5));
    })();
  }, [debouncedQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update URL when query changes
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }

    router.push(`/?${params.toString()}`);
    setShowSuggestions(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (id: string) => {
    router.push(`/${id}`);
    setShowSuggestions(false);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex w-full items-center">
        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search exercises, terms, and articles..."
          className="pl-9 pr-9 h-12 w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyPress={handleKeyPress}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"
        >
          <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
            {suggestions.map(suggestion => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.id)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              >
                <div className="font-medium">{suggestion.title}</div>
                <div className="text-sm text-gray-500 truncate">
                  {suggestion.text.substring(0, 60)}...
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${badgeColor[suggestion.type]}`}
                  >
                    {suggestion.type}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
