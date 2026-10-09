import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, Package, HelpCircle, ArrowRight } from 'lucide-react';
import { MatchResult, Item, getMatchStrength } from '../types';
import { formatDateShort } from '../utils/dateUtils';
import { loadImage } from '../utils/storage';

interface MatchCardProps {
  match: MatchResult;
  item: Item;
  onViewBreakdown: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, item, onViewBreakdown }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    if (item.photo) {
      if (item.photo.startsWith('data:')) {
        setImageSrc(item.photo);
      } else {
        loadImage(item.id).then(data => {
          if (isMounted && data) {
            setImageSrc(data);
          }
        }).catch(() => {});
      }
    } else {
      loadImage(item.id).then(data => {
        if (isMounted && data) {
          setImageSrc(data);
        }
      }).catch(() => {});
    }
    return () => { isMounted = false; };
  }, [item.id, item.photo]);

  const strength = getMatchStrength(match.matchScore);
  
  const strengthStyles: Record<string, { badge: string; border: string; scoreBg: string; text: string }> = {
    'strong': { 
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-300', 
      border: 'border-l-emerald-500', 
      scoreBg: 'bg-emerald-50/70', 
      text: 'text-emerald-700' 
    },
    'possible': { 
      badge: 'bg-amber-50 text-amber-800 border-amber-300', 
      border: 'border-l-amber-500', 
      scoreBg: 'bg-amber-50/70', 
      text: 'text-amber-700' 
    },
    'weak': { 
      badge: 'bg-slate-50 text-slate-700 border-slate-300', 
      border: 'border-l-slate-400', 
      scoreBg: 'bg-slate-50', 
      text: 'text-slate-600' 
    },
    'none': { 
      badge: 'bg-slate-50 text-slate-500 border-slate-200', 
      border: 'border-l-slate-300', 
      scoreBg: 'bg-slate-50', 
      text: 'text-slate-400' 
    },
  };
  
  const style = strengthStyles[strength] || strengthStyles.weak;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-l-4 ${style.border} border-y border-r border-slate-200/90 overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all duration-200`}>
      
      {/* Score Pill Left Box */}
      <div className={`p-4 flex flex-col justify-center items-center ${style.scoreBg} w-full sm:w-32 border-b sm:border-b-0 sm:border-r border-slate-100 flex-shrink-0`}>
        <div className={`text-3xl font-black ${style.text}`}>
          {Math.round(match.matchScore)}%
        </div>
        <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full border ${style.badge}`}>
          {strength} Match
        </div>
      </div>
      
      {/* Item summary & actions */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
              item.type === 'lost' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {item.type}
            </span>
            <h3 className="font-bold text-sm text-slate-900 truncate">{item.name}</h3>
          </div>
          
          <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-slate-500 mt-2">
            <div className="flex items-center gap-1">
              <Tag size={12} className="text-slate-400" />
              <span>{item.category}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-slate-400" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-slate-400" />
              <span>{formatDateShort(item.date)}</span>
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-100">
          <button 
            type="button"
            onClick={onViewBreakdown}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition"
          >
            <HelpCircle size={14} className="text-primary/70" />
            <span>Why this match?</span>
          </button>

          <Link 
            to={`/item/${item.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition"
          >
            <span>View Item</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

    </div>
  );
};

export default MatchCard;
