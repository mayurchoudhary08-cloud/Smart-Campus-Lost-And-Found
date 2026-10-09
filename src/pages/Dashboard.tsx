import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Package, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  MapPin, 
  Tag, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { Item } from '../types';
import { findMatches } from '../algorithms/matching';
import { formatDateShort, timeAgo } from '../utils/dateUtils';
import StatusBadge from '../components/StatusBadge';

interface DashboardProps {
  items: Map<string, Item>;
}

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  const itemsList = useMemo(() => Array.from(items.values()), [items]);
  
  const total = itemsList.length;
  const lost = itemsList.filter(i => i.type === 'lost').length;
  const found = itemsList.filter(i => i.type === 'found').length;
  const resolved = itemsList.filter(i => i.status === 'resolved').length;
  
  // Calculate items with potential matches
  const potentialMatchesCount = useMemo(() => {
    return itemsList.filter(item => {
      return findMatches(item, items).length > 0;
    }).length;
  }, [itemsList, items]);

  const categoryCounts = useMemo(() => {
    return itemsList.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [itemsList]);

  const locationCounts = useMemo(() => {
    return itemsList.reduce((acc, item) => {
      acc[item.location] = (acc[item.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [itemsList]);

  const recentActivity = useMemo(() => {
    return [...itemsList].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 10);
  }, [itemsList]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={18} className="text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Live Campus Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campus Overview Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time metrics, department location breakdown, and recent campus reports
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-3">
            <FileText size={20} />
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Reports</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">{total}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
            <Search size={20} />
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Lost Items</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">{lost}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Package size={20} />
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Found Items</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">{found}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Reunited</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">{resolved}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Zap size={20} />
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Smart Matches</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">{potentialMatchesCount}</p>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Categories Bar Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Tag size={18} className="text-primary" />
            <h2 className="text-base font-bold text-slate-900">Reports by Category</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(categoryCounts).sort((a,b)=>b[1]-a[1]).map(([cat, count]) => (
              <div key={cat} className="flex items-center text-xs">
                <div className="w-1/3 text-slate-700 font-medium truncate pr-3">{cat}</div>
                <div className="w-2/3 flex items-center gap-3">
                  <div className="h-2.5 bg-slate-100 rounded-full flex-grow overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-slate-900 font-bold w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Locations Bar Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <MapPin size={18} className="text-primary" />
            <h2 className="text-base font-bold text-slate-900">Reports by Campus Location</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(locationCounts).sort((a,b)=>b[1]-a[1]).map(([loc, count]) => (
              <div key={loc} className="flex items-center text-xs">
                <div className="w-1/3 text-slate-700 font-medium truncate pr-3">{loc}</div>
                <div className="w-2/3 flex items-center gap-3">
                  <div className="h-2.5 bg-slate-100 rounded-full flex-grow overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full transition-all duration-500" 
                      style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-slate-900 font-bold w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Activity Table with Clickable Links */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            <h2 className="text-base font-bold text-slate-900">Recent Campus Submissions</h2>
          </div>
          <Link to="/browse" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/80 font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Status</th>
                <th className="px-4 py-3">Item Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Event Date</th>
                <th className="px-4 py-3 rounded-r-xl">Reported</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentActivity.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge type={item.type} status={item.status} />
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                    <Link 
                      to={`/item/${item.id}`} 
                      className="hover:text-primary transition flex items-center gap-1.5"
                    >
                      <span>{item.name}</span>
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.location}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateShort(item.date)}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{timeAgo(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
