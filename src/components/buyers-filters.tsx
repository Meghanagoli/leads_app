'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { cityOptions, propertyTypeOptions, statusOptions, timelineOptions } from '@/lib/validations/buyer';

interface BuyersFiltersProps {
  currentFilters: {
    search: string;
    city: string;
    propertyType: string;
    status: string;
    timeline: string;
    sort: string;
  };
}

export function BuyersFilters({ currentFilters }: BuyersFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentFilters.search);
  const [debouncedSearch, setDebouncedSearch] = useState(currentFilters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== currentFilters.search) {
      updateFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  const updateFilters = (newFilters: Partial<typeof currentFilters>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    // Use replace to avoid scroll to top and preserve scroll position
    router.replace(`/buyers?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearch('');
    router.replace('/buyers', { scroll: false });
  };

  const hasActiveFilters = Object.values(currentFilters).some(value => value && value !== 'updatedAt-desc');

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-500">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-500 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-500 mb-1">
            City
          </label>
          <Select
            value={currentFilters.city || "all"}
            onValueChange={(value) => updateFilters({ city: value === "all" ? "" : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white z-50 max-h-60 overflow-y-auto w-full min-w-[var(--radix-select-trigger-width)]">
              <SelectItem value="all" className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">All cities</SelectItem>
              {cityOptions.map((city) => (
                <SelectItem key={city} value={city} className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-500 mb-1">
            Property Type
          </label>
          <Select
            value={currentFilters.propertyType || "all"}
            onValueChange={(value) => updateFilters({ propertyType: value === "all" ? "" : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white z-50 max-h-60 overflow-y-auto w-full min-w-[var(--radix-select-trigger-width)]">
              <SelectItem value="all" className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">All types</SelectItem>
              {propertyTypeOptions.map((type) => (
                <SelectItem key={type} value={type} className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-500 mb-1">
            Status
          </label>
          <Select
            value={currentFilters.status || "all"}
            onValueChange={(value) => updateFilters({ status: value === "all" ? "" : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white z-50 max-h-60 overflow-y-auto w-full min-w-[var(--radix-select-trigger-width)]">
              <SelectItem value="all" className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">All statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status} className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-500 mb-1">
            Timeline
          </label>
          <Select
            value={currentFilters.timeline || "all"}
            onValueChange={(value) => updateFilters({ timeline: value === "all" ? "" : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All timelines" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white z-50 max-h-60 overflow-y-auto w-full min-w-[var(--radix-select-trigger-width)]">
              <SelectItem value="all" className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">All timelines</SelectItem>
              {timelineOptions.map((timeline) => (
                <SelectItem key={timeline} value={timeline} className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">
                  {timeline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center space-x-4">
        <label htmlFor="sort" className="text-sm font-medium text-gray-500">
          Sort by:
        </label>
        <Select
          value={currentFilters.sort}
          onValueChange={(value) => updateFilters({ sort: value })}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white z-50 max-h-60 overflow-y-auto w-full min-w-[var(--radix-select-trigger-width)]">
            <SelectItem value="updatedAt-desc" className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">Recently Updated</SelectItem>
            <SelectItem value="updatedAt-asc" className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">Oldest Updated</SelectItem>
            <SelectItem value="fullName-asc" className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">Name A-Z</SelectItem>
            <SelectItem value="fullName-desc" className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">Name Z-A</SelectItem>
            <SelectItem value="createdAt-desc" className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">Recently Created</SelectItem>
            <SelectItem value="createdAt-asc" className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">Oldest Created</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
