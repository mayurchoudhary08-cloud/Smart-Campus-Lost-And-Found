import React from 'react';
import { RotateCcw } from 'lucide-react';
import { FilterState, CATEGORIES, LOCATIONS } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const handleClear = () => {
    onChange({
      type: 'all',
      category: '',
      location: '',
      status: 'all',
      dateRange: 'all',
    });
  };

  const selectClass = "block w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs transition";

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap gap-3 items-end">
      
      {/* Type */}
      <div className="flex-1 min-w-[120px]">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
          Type
        </label>
        <select
          value={filters.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className={selectClass}
        >
          <option value="all">All Types</option>
          <option value="lost">Lost Items</option>
          <option value="found">Found Items</option>
        </select>
      </div>

      {/* Category */}
      <div className="flex-1 min-w-[140px]">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className={selectClass}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="flex-1 min-w-[140px]">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className={selectClass}
        >
          <option value="">All Locations</option>
          {LOCATIONS.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="flex-1 min-w-[110px]">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className={selectClass}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Date */}
      <div className="flex-1 min-w-[110px]">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
          Date
        </label>
        <select
          value={filters.dateRange}
          onChange={(e) => handleChange('dateRange', e.target.value)}
          className={selectClass}
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">Past 7 Days</option>
          <option value="month">Past 30 Days</option>
        </select>
      </div>

      {/* Reset button */}
      <div className="flex-none">
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 py-2 px-3.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition shadow-2xs"
          title="Reset filter dropdowns"
        >
          <RotateCcw size={13} className="text-slate-400" />
          <span>Reset</span>
        </button>
      </div>

    </div>
  );
};

export default FilterBar;
