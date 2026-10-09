import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Tag, 
  Palette, 
  MapPin, 
  Calendar, 
  Clock, 
  Building, 
  Hash, 
  Zap, 
  Package, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  Share2, 
  ShieldAlert,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { Item } from '../types';
import StatusBadge from '../components/StatusBadge';
import MatchCard from '../components/MatchCard';
import MatchBreakdown from '../components/MatchBreakdown';
import Modal from '../components/Modal';
import { findMatches } from '../algorithms/matching';
import { formatDate } from '../utils/dateUtils';
import { loadImage } from '../utils/storage';

interface ItemDetailsProps {
  items: Map<string, Item>;
  onUpdate: (item: Item) => void;
  showToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ items, onUpdate, showToast }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  const item = id ? items.get(id) : undefined;

  useEffect(() => {
    if (!item) return;
    if (item.photo && item.photo.startsWith('data:')) {
      setPhotoUrl(item.photo);
    } else {
      loadImage(item.id).then(url => {
        if (url) setPhotoUrl(url);
      }).catch(() => {});
    }
  }, [item]);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Package size={32} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Item Report Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The item ID may be invalid or was recently removed.</p>
        <Link to="/browse" className="btn-primary text-xs">
          Return to Browse
        </Link>
      </div>
    );
  }

  // Find matches using PriorityQueue
  const matches = findMatches(item, items);

  const handleResolve = () => {
    onUpdate({ ...item, status: 'resolved' });
    setIsResolveModalOpen(false);
    showToast('Report marked as safely resolved and reunited!', 'success');
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(item.id);
    showToast(`Report ID ${item.id} copied to clipboard!`, 'info');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Smart Campus Lost & Found: ${item.name}`,
        text: `${item.type.toUpperCase()}: ${item.name} at ${item.location}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary-dark font-bold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
          <span className="text-slate-300">/</span>
          <Link to="/" className="hover:text-slate-800">Home</Link>
          <span className="text-slate-300">/</span>
          <Link to="/browse" className="hover:text-slate-800">Browse</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold truncate max-w-[200px]">{item.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-xs font-bold shadow-2xs"
            title="Copy Report ID"
          >
            <Hash size={13} className="text-slate-400" />
            <span className="font-mono">{item.id}</span>
            <Copy size={12} className="text-slate-400" />
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-xs font-bold shadow-2xs"
            title="Share this report"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Resolved State Banner */}
      {item.status === 'resolved' && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-2xl flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Case Resolved:</span> This item has been marked as safely recovered and reunited with its owner.
          </div>
        </div>
      )}

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Photo Preview */}
          <div className="md:col-span-5 flex flex-col">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white shadow-xs flex items-center justify-center mb-3 border border-slate-200/80">
                    <Package size={44} className="text-slate-300" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    No image uploaded
                  </span>
                </div>
              )}

              {/* Status pill overlay */}
              <div className="absolute top-4 right-4">
                <StatusBadge status={item.status} type={item.type} />
              </div>
            </div>
          </div>
          
          {/* Right Column: Key Details */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                  {item.type === 'lost' ? 'Lost Item Report' : 'Found Item Report'}
                </span>
                {item.keptAt && (
                  <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-md">
                    Kept: {item.keptAt}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                {item.name}
              </h1>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Tag size={15} className="text-slate-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Category</span>
                    <span className="font-semibold text-slate-900">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-slate-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Location</span>
                    <span className="font-semibold text-slate-900">{item.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-slate-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Date {item.type === 'lost' ? 'Lost' : 'Found'}</span>
                    <span className="font-semibold text-slate-900">{formatDate(item.date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-slate-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Time</span>
                    <span className="font-semibold text-slate-900">{item.time || 'Not specified'}</span>
                  </div>
                </div>

                {item.brand && (
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-slate-400 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Brand</span>
                      <span className="font-semibold text-slate-900">{item.brand}</span>
                    </div>
                  </div>
                )}

                {item.color && (
                  <div className="flex items-center gap-2">
                    <Palette size={15} className="text-slate-400 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Color</span>
                      <span className="font-semibold text-slate-900">{item.color}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Detailed Description */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/80">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="btn-primary text-xs"
              >
                <UserCheck size={15} className="mr-1.5" />
                Contact Reporter
              </button>

              {item.status === 'active' && (
                <button 
                  onClick={() => setIsResolveModalOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition"
                >
                  <CheckCircle2 size={15} className="mr-1.5 text-emerald-600" />
                  Mark as Resolved
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Smart Matches Section */}
      <div className="border-t border-slate-200/80 pt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">DSA Matching Engine</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Potential Smart Matches ({matches.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ranked in priority order using our Max-Heap Priority Queue algorithm
            </p>
          </div>

          <Link
            to="/how-it-works"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>How scoring works</span>
            <span>&rarr;</span>
          </Link>
        </div>
        
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map(match => {
              const matchedItem = items.get(match.itemId);
              if (!matchedItem) return null;
              return (
                <MatchCard 
                  key={match.itemId} 
                  match={match} 
                  item={matchedItem}
                  onViewBreakdown={() => setSelectedMatch(match)} 
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-3xl p-10 text-center border border-slate-200/80 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center mx-auto mb-3 text-slate-400 border border-slate-200/60">
              <Zap size={22} className="text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">No Matching Reports Found Yet</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              When someone files a corresponding {item.type === 'lost' ? 'found' : 'lost'} report with matching details (location, brand, category, or date), it will automatically appear here ranked by confidence.
            </p>
          </div>
        )}
      </div>

      {/* Contact Reporter Modal */}
      <Modal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        title="Contact Information"
      >
        <p className="mb-4 text-xs text-slate-600 leading-relaxed">
          You can reach the student or staff member who submitted this report at:
        </p>
        
        <div className="bg-primary/5 text-primary p-4 rounded-xl text-center font-bold text-base mb-4 border border-primary/20 select-all font-mono">
          {item.contact}
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
          <ShieldAlert size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Campus Privacy Policy:</strong> In full university deployment, this portal routes messages through university Single Sign-On (SSO) and in-app chat to protect student personal phone numbers.
          </span>
        </div>
      </Modal>

      {/* Mark Resolved Confirmation Modal */}
      <Modal 
        isOpen={isResolveModalOpen} 
        onClose={() => setIsResolveModalOpen(false)} 
        title="Confirm Item Resolution"
      >
        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          Are you sure you want to mark this report as resolved? This indicates that the {item.type === 'lost' ? 'lost item has been retrieved' : 'found item has been returned to its verified owner'}.
        </p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={() => setIsResolveModalOpen(false)} 
            className="btn-secondary text-xs"
          >
            Cancel
          </button>
          <button 
            onClick={handleResolve} 
            className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-xs"
          >
            Yes, Mark Resolved
          </button>
        </div>
      </Modal>

      {/* Match Breakdown Modal */}
      <Modal 
        isOpen={Boolean(selectedMatch)} 
        onClose={() => setSelectedMatch(null)} 
        title="Match Scoring Breakdown"
      >
        {selectedMatch && (
          <MatchBreakdown 
            breakdown={selectedMatch.breakdown} 
            totalScore={selectedMatch.matchScore} 
          />
        )}
      </Modal>

    </div>
  );
};

export default ItemDetails;
