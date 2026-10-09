import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Backpack, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  ClipboardList, 
  Zap, 
  HeartHandshake, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  Clock
} from 'lucide-react';
import { Item } from '../types';
import ItemCard from '../components/ItemCard';
import { sortItems } from '../algorithms/sorting';
import { findMatches } from '../algorithms/matching';

interface HomeProps {
  items: Map<string, Item>;
}

const Home: React.FC<HomeProps> = ({ items }) => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [recentFilter, setRecentFilter] = useState<'all' | 'lost' | 'found'>('all');

  const itemsList = useMemo(() => Array.from(items.values()), [items]);
  
  // Real dynamic statistics
  const totalReports = itemsList.length;
  const itemsReunited = itemsList.filter(i => i.status === 'resolved').length;
  const currentlyMissing = itemsList.filter(i => i.type === 'lost' && i.status === 'active').length;
  const foundItems = itemsList.filter(i => i.type === 'found' && i.status === 'active').length;

  // Filtered recent items
  const filteredRecent = useMemo(() => {
    let list = itemsList;
    if (recentFilter !== 'all') {
      list = list.filter(i => i.type === recentFilter);
    }
    return sortItems(list, 'newest').slice(0, 6);
  }, [itemsList, recentFilter]);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/browse?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/60 border-b border-slate-200/80 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline, Search, Actions */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              
              {/* College Notice Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold w-fit shadow-2xs">
                <ShieldCheck size={14} className="text-primary" />
                <span>Official Campus Lost &amp; Found Portal</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Lost something <br />
                <span className="text-primary bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
                  on campus?
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Report missing belongings, browse items turned into security desks, and let our explainable Data Structures matching engine reunite you with what matters.
              </p>

              {/* In-Hero Search Bar */}
              <form onSubmit={handleHeroSearchSubmit} className="max-w-xl mt-1">
                <div className="relative flex items-center shadow-md rounded-2xl bg-white border-2 border-slate-200/90 focus-within:border-primary transition-all duration-200">
                  <div className="pl-4 text-slate-400 pointer-events-none">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search by item name, location, brand, color..."
                    className="w-full py-3.5 pl-3 pr-28 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                  />
                  <div className="absolute right-1.5">
                    <button
                      type="submit"
                      className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-primary-dark transition shadow-xs"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Quick Search Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">Popular:</span>
                  {['ASUS Laptop', 'Student ID', 'Wallet', 'Keys', 'Backpack', 'Water Bottle'].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => navigate(`/browse?q=${encodeURIComponent(tag)}`)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-primary/50 hover:text-primary transition-colors text-[11px] font-medium"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/report-lost"
                  className="btn-primary"
                >
                  <AlertCircle size={16} className="mr-2" />
                  Report Lost Item
                </Link>
                <Link
                  to="/browse?type=found"
                  className="btn-secondary"
                >
                  Browse Found Items
                  <ArrowRight size={16} className="ml-2 text-slate-400" />
                </Link>
              </div>

            </div>

            {/* Right Column: Campus Illustration & Floating Match Demo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col gap-4 text-left">
                
                {/* Top Badge: Smart Match Detected */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">DSA Matching Engine</span>
                      <span className="text-xs font-bold text-slate-900">Black ASUS Laptop</span>
                    </div>
                  </div>
                  <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-300">
                    92% Match
                  </span>
                </div>

                {/* Campus Center Hub Graphic */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Building2 size={36} />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-primary">Central Campus Registry</span>
                  <span className="text-xs text-slate-500 mt-0.5">Automated Match &amp; Secure Return Portal</span>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-200">
                      ● Active Campus Network
                    </span>
                    <span className="px-2.5 py-1 bg-blue-50 text-primary rounded-lg text-[10px] font-bold border border-blue-200">
                      12 Locations
                    </span>
                  </div>
                </div>

                {/* Bottom Priority Queue Indicator */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Cpu size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Priority Queue (Max-Heap)</span>
                      <span className="text-[10px] text-slate-500 font-mono">Insert: O(log n) • Extract: O(log n)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    Verified DSA
                  </span>
                </div>

              </div>
            </div>

          </div>

          {/* Campus Statistics Section (Cleanly integrated without overlapping line) */}
          <div className="mt-14 pt-8 border-t border-slate-200/70">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Reports</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{totalReports}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Items Reunited</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{itemsReunited}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Currently Missing</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{currentlyMissing}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Found &amp; Awaiting</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{foundItems}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Recently Reported Items Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Live Campus Board</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Recently Reported</h2>
            <p className="text-sm text-slate-500 mt-1">Real-time lost and found submissions across campus departments</p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            {(['all', 'lost', 'found'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setRecentFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                  recentFilter === filter
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter === 'all' ? 'All Recent' : `${filter} Items`}
              </button>
            ))}
          </div>
        </div>

        {/* Item Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecent.map((item) => {
            const matches = findMatches(item, items);
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

        {/* View All Button */}
        <div className="mt-10 text-center">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 font-bold text-sm text-slate-800 hover:bg-slate-50 hover:border-primary/40 transition shadow-sm"
          >
            <span>View All Campus Reports ({totalReports})</span>
            <ArrowRight size={16} className="text-slate-400" />
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">How Smart Campus Works</h2>
            <p className="text-sm text-slate-500 mt-2">
              Designed for speed and accuracy. No complex AI models or black-box predictions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/70 flex flex-col text-left relative group hover:bg-white hover:shadow-sm transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                <ClipboardList size={22} />
              </div>
              <span className="text-xs font-black text-primary/70 uppercase tracking-widest mb-1">Step 01</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Report Details</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit item name, category, location, date, description, and an optional compressed photo.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/70 flex flex-col text-left relative group hover:bg-white hover:shadow-sm transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                <Search size={22} />
              </div>
              <span className="text-xs font-black text-blue-600/70 uppercase tracking-widest mb-1">Step 02</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Search</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse or search normalized keywords across location, brand, category, and date.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/70 flex flex-col text-left relative group hover:bg-white hover:shadow-sm transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                <Zap size={22} />
              </div>
              <span className="text-xs font-black text-amber-600/70 uppercase tracking-widest mb-1">Step 03</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">DSA Smart Match</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our Priority Queue ranks potential matches using explainable point scores (category, brand, location, date).
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/70 flex flex-col text-left relative group hover:bg-white hover:shadow-sm transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                <HeartHandshake size={22} />
              </div>
              <span className="text-xs font-black text-emerald-600/70 uppercase tracking-widest mb-1">Step 04</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Safe Reunite</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with the reporter, claim your item, and mark the report resolved to update campus stats.
              </p>
            </div>

          </div>

          {/* DSA Architecture Highlight */}
          <div className="mt-12 bg-slate-50 rounded-2xl p-6 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Cpu size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Academic Data Structures Project</h4>
                <p className="text-xs text-slate-500">Built using Hash Maps (O(1) lookup) &amp; Max-Heap Priority Queues (O(log n) match ranking)</p>
              </div>
            </div>
            <Link
              to="/how-it-works"
              className="text-xs font-bold text-primary hover:text-primary-light flex items-center gap-1.5 whitespace-nowrap bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
            >
              <span>Explore Algorithm Details</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* Community CTA Section */}
      <section className="bg-primary text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Did you find an unattended item on campus?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Take 60 seconds to file a quick found report or submit it to the nearest department security desk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/report-found"
              className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition shadow-md"
            >
              Report a Found Item
            </Link>
            <Link
              to="/browse"
              className="bg-primary-light/60 text-white border border-white/30 font-bold px-6 py-3 rounded-xl hover:bg-primary-light transition"
            >
              Browse All Listings
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
