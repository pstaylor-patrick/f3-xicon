'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Filter, X } from 'lucide-react';
import { getAllTags } from '@/lib/xicon';
import { set } from 'date-fns';

export function TagFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags')?.split(',').filter(Boolean) || []
  );
  const [isAnd, setIsAnd] = useState<boolean>(searchParams.get('tagsOperator') === 'AND');
  const [open, setOpen] = useState(false);

  // Load all tags
  useEffect(() => {
    (async () => {
      const tags = await getAllTags();
      setTags(tags);
    })();
    setSelectedTags(searchParams.get('tags')?.split(',').filter(Boolean) || []);
    setIsAnd(searchParams.get('tagsOperator') === 'AND');
  }, [searchParams]);

  // Update URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','));
    } else {
      params.delete('tags');
    }

    if (isAnd) {
      params.set('tagsOperator', 'AND');
    } else {
      params.delete('tagsOperator');
    }

    router.push(`/?${params.toString()}`);
    setOpen(false);
  };

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([]);
    setIsAnd(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('tags');
    params.delete('tagsOperator');

    router.push(`/?${params.toString()}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${selectedTags.length > 0 ? 'border-primary text-primary' : ''}`}
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {selectedTags.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
              {selectedTags.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 popover-transparent">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Filter by Tags</h3>
          {selectedTags.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
              <X className="mr-1 h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Switch id="operator-mode" checked={isAnd} onCheckedChange={setIsAnd} />
          <Label htmlFor="operator-mode">
            {isAnd ? 'Match ALL tags (AND)' : 'Match ANY tag (OR)'}
          </Label>
        </div>

        <div className="mt-4 max-h-60 overflow-y-auto">
          <div className="space-y-2">
            {tags.map(tag => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                />
                <Label htmlFor={`tag-${tag}`} className="text-sm capitalize cursor-pointer">
                  {tag}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button variant="default" className="mt-4 w-full text-white" onClick={updateFilters}>
          Apply Filters
        </Button>
      </PopoverContent>
    </Popover>
  );
}
