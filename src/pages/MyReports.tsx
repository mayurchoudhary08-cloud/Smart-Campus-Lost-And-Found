import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FolderClock, PlusCircle, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Item } from '../types';
import ItemCard from '../components/ItemCard';
import { findMatches } from '../algorithms/matching';

interface MyReportsProps {
  items: Map<string, Item>;
}

const MyReports: React.FC<MyReportsProps> = ({ items }) => {
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  
  const itemsList = useMemo(() => Array.from(items.values()), [items]);
  
  const lostItems = useMemo(() => itemsList.filter(item => item.type === 'lost'), [itemsList]);
  const foundItems = useMemo(() => itemsList.filter(item => item.type === 'found'), [itemsList]);
  
  const currentTypeItems = activeTab === 'lost' ? lostItems : foundItems;

  const displayItems = useMemo(() => {
    if (statusFilter === 'all') return currentTypeItems;
    return currentTypeItems.filter(item => item.status === statusFilter);
  }, [currentTypeItems, statusFilter]);

  // Precompute matches
  const matchData = useMemo(() => {
    const map = new Map<string, { count: number; topScore?: number }>();
    for (const item of displayItems) {
      const matches = findMatches(item, items);
      map.set(item.id, {
        count: matches.length,
        topScore: matches[0]?.matchScore
      });
    }
    return map;
  }, [displayItems, items]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderClock size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Student Activity</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Campus Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track, update, and manage your reported items. In this viva demo mode, all campus reports are accessible.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/report-lost"
            className="btn-primary text-xs"
          >
            <PlusCircle size={14} className="mr-1.5" />
            Report Lost
          </Link>
          <Link
            to="/report-found"
            className="btn-secondary text-xs"
          >
            Report Found
          </Link>
        </div>
      </div>

      {/* Main Tabs (Lost vs Found) */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 mb-8 gap-4">
        <div className="flex space-x-2">
          <button
            className={`py-3 px-5 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'lost' 
                ? 'border-primary text-primary bg-primary/5 rounded-t-xl' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setActiveTab('lost')}
          >
            <AlertCircle size={16} className={activeTab === 'lost' ? 'text-primary' : 'text-slate-400'} />
            <span>Lost Reports ({lostItems.length})</span>
          </button>
          
          <button
            className={`py-3 px-5 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'found' 
                ? 'border-primary text-primary bg-primary/5 rounded-t-xl' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setActiveTab('found')}
          >
            <CheckCircle2 size={16} className={activeTab === 'found' ? 'text-primary' : 'text-slate-400'} />
            <span>Found Reports ({foundItems.length})</span>
          </button>
        </div>

        {/* Sub-status filter pills */}
        <div className="flex items-center gap-1.5 pb-2 sm:pb-0">
          <span className="text-xs text-slate-400 font-semibold mr-1">Status:</span>
          {(['all', 'active', 'resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition capitalize ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Item Grid */}
      {displayItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map(item => {
            const data = matchData.get(item.id);
            return (
              <ItemCard 
                key={item.id} 
                item={item} 
                matchCount={data?.count}
                topMatchScore={data?.topScore}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-200/80 px-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <FolderClock size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No {statusFilter !== 'all' ? statusFilter : ''} {activeTab} reports found.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            You currently have no {activeTab} items listed under this status.
          </p>
          <Link
            to={activeTab === 'lost' ? '/report-lost' : '/report-found'}
            className="btn-primary text-xs"
          >
            Create New {activeTab === 'lost' ? 'Lost' : 'Found'} Report
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyReports;
