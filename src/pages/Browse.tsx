import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { Item, FilterState, SortOption, CATEGORIES } from '../types';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ItemCard from '../components/ItemCard';
import { searchItems } from '../algorithms/search';
import { sortItems } from '../algorithms/sorting';
import { findMatches } from '../algorithms/matching';
import { isWithinRange } from '../utils/dateUtils';

interface BrowseProps {
  items: Map<string, Item>;
}

const Browse: React.FC<BrowseProps> = ({ items }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL query parameters
  const initialQuery = searchParams.get('q') || '';
  const initialType = (searchParams.get('type') as 'all' | 'lost' | 'found') || 'all';
  const initialCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>({
    type: initialType,
    category: initialCategory,
    location: '',
    status: 'all',
    dateRange: 'all',
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Sync state if URL search parameters change externally
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const typeParam = (searchParams.get('type') as 'all' | 'lost' | 'found') || 'all';
    const catParam = searchParams.get('category') || '';

    if (qParam !== query) setQuery(qParam);
    if (typeParam !== filters.type || catParam !== filters.category) {
      setFilters(prev => ({
        ...prev,
        type: typeParam,
        category: catParam,
      }));
    }
  }, [searchParams]);

  const itemsList = useMemo(() => Array.from(items.values()), [items]);

  // Precalculate matches for each item (for match badges and sorting)
  const itemMatchesMap = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const item of itemsList) {
      map.set(item.id, findMatches(item, items));
    }
    return map;
  }, [itemsList, items]);

  const matchScoresMap = useMemo(() => {
    const map = new Map<string, number>();
    itemMatchesMap.forEach((matches, id) => {
      map.set(id, matches[0]?.matchScore || 0);
    });
    return map;
  }, [itemMatchesMap]);

  const filteredAndSortedItems = useMemo(() => {
    let result = itemsList;

    // Search
    if (query) {
      result = searchItems(result, query);
    }

    // Filter
    result = result.filter(item => {
      if (filters.type !== 'all' && item.type !== filters.type) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.location && item.location !== filters.location) return false;
      if (filters.status !== 'all' && item.status !== filters.status) return false;
      if (filters.dateRange !== 'all' && !isWithinRange(item.createdAt || item.date, filters.dateRange as 'today' | 'week' | 'month')) return false;
      return true;
    });

    // Sort
    return sortItems(result, sortBy, matchScoresMap);
  }, [itemsList, query, filters, sortBy, matchScoresMap]);

  const handleCategoryChipClick = (cat: string) => {
    const newCategory = filters.category === cat ? '' : cat;
    setFilters(prev => ({ ...prev, category: newCategory }));
  };

  const handleClearAllFilters = () => {
    setQuery('');
    setFilters({
      type: 'all',
      category: '',
      location: '',
      status: 'all',
      dateRange: 'all',
    });
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    query ||
    filters.type !== 'all' ||
    filters.category ||
    filters.location ||
    filters.status !== 'all' ||
    filters.dateRange !== 'all'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Browse Lost &amp; Found</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore all active and reported items across campus locations
        </p>
      </div>
      
      {/* Search Input */}
      <div className="mb-6">
        <SearchBar 
          value={query} 
          onChange={(val) => {
            setQuery(val);
            if (!val) {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('q');
              setSearchParams(newParams);
            }
          }}
          placeholder="Search by keywords, ASUS laptop, blue backpack, central library, ID card..."
        />
      </div>

      {/* Quick Category Chips */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 w-max">
          <button
            onClick={() => handleCategoryChipClick('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
              filters.category === ''
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChipClick(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border whitespace-nowrap ${
                filters.category === cat
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar & Sort Selector */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <FilterBar filters={filters} onChange={setFilters} />
        </div>
        <div className="w-full lg:w-56 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown size={15} />
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none appearance-none cursor-pointer shadow-xs"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name-asc">Sort: Item Name (A-Z)</option>
              <option value="name-desc">Sort: Item Name (Z-A)</option>
              <option value="match-high">Sort: Highest Match Score</option>
              <option value="match-low">Sort: Lowest Match Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Result Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            Showing <strong className="text-slate-900">{filteredAndSortedItems.length}</strong> {filteredAndSortedItems.length === 1 ? 'item' : 'items'}
          </span>

          {filters.type !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-primary text-xs font-semibold border border-blue-100">
              Type: {filters.type.toUpperCase()}
              <button onClick={() => setFilters(f => ({ ...f, type: 'all' }))} className="hover:text-primary-dark">
                <X size={12} />
              </button>
            </span>
          )}

          {filters.category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-primary text-xs font-semibold border border-blue-100">
              Category: {filters.category}
              <button onClick={() => setFilters(f => ({ ...f, category: '' }))} className="hover:text-primary-dark">
                <X size={12} />
              </button>
            </span>
          )}

          {filters.location && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-primary text-xs font-semibold border border-blue-100">
              Location: {filters.location}
              <button onClick={() => setFilters(f => ({ ...f, location: '' }))} className="hover:text-primary-dark">
                <X size={12} />
              </button>
            </span>
          )}

          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-primary text-xs font-semibold border border-blue-100">
              Status: {filters.status}
              <button onClick={() => setFilters(f => ({ ...f, status: 'all' }))} className="hover:text-primary-dark">
                <X size={12} />
              </button>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button 
            onClick={handleClearAllFilters}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Item Grid */}
      {filteredAndSortedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedItems.map(item => {
            const matches = itemMatchesMap.get(item.id) || [];
            return (
              <ItemCard 
                key={item.id} 
                item={item} 
                matchCount={matches.length}
                topMatchScore={matches[0]?.matchScore}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200/80 px-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Package size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No items match your search.</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Try adjusting your search keywords, clearing your filters, or broadening your criteria.
          </p>
          <button 
            onClick={handleClearAllFilters}
            className="btn-primary text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Browse;
