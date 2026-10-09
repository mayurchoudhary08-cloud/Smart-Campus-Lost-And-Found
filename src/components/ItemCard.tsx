import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  Sparkles, 
  Laptop, 
  BookOpen, 
  CreditCard, 
  Wallet as WalletIcon, 
  Key, 
  Shirt, 
  Watch, 
  PenTool, 
  Backpack, 
  Package 
} from 'lucide-react';
import { Item } from '../types';
import { formatDateShort } from '../utils/dateUtils';
import { loadImage } from '../utils/storage';
import StatusBadge from './StatusBadge';

interface ItemCardProps {
  item: Item;
  matchCount?: number;
  topMatchScore?: number;
}

/**
 * Returns an appropriate icon based on category for clean placeholder display
 */
function getCategoryIcon(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes('elect') || cat.includes('laptop') || cat.includes('phone')) {
    return <Laptop className="text-slate-400 group-hover:text-primary transition-colors" size={40} />;
  }
  if (cat.includes('book')) {
    return <BookOpen className="text-slate-400 group-hover:text-primary transition-colors" size={40} />;
  }
  if (cat.includes('card') || cat.includes('id') || cat.includes('doc')) {
    return <CreditCard className="text-slate-400 group-hover:text-primary transition-colors" size={40} />;
  }
  if (cat.includes('wallet')) {
    return <WalletIcon className="text-slate-400 group-hover:text-primary transition-colors" size={40} />;
  }
  if (cat.includes('key')) {
    return <Key className="text-slate-400 group-hover:text-primary transition-colors" size={40} />;
  }
  if (cat.includes('cloth') || cat.includes('jacket') || cat.includes('hoodie')) {
    return <Shirt className="text-slate-400 group-hover:text-primary transition-colors" size={40} />;
  }
  if (cat.includes('access') || cat.includes('watch') || cat.includes('spectacle')) {
    return <Watch className="text-slate-400 group-hover:text-primary transition-colors" size={40} />;
  }
  if (cat.includes('stat') || cat.includes('calc') || cat.includes('note')) {
    return <PenTool className="text-slate-400 group-hover:text-primary transition-colors" size={40} />;
  }
  if (cat.includes('bag')) {
    return <Backpack className="text-slate-400 group-hover:text-primary transition-colors" size={40} />;
  }
  return <Package className="text-slate-400 group-hover:text-primary transition-colors" size={40} />;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, matchCount, topMatchScore }) => {
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
      // Also attempt IndexedDB in case photo was stored under item.id
      loadImage(item.id).then(data => {
        if (isMounted && data) {
          setImageSrc(data);
        }
      }).catch(() => {});
    }
    
    return () => {
      isMounted = false;
    };
  }, [item.id, item.photo]);

  return (
    <Link 
      to={`/item/${item.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full hover:-translate-y-1 block text-left"
    >
      {/* Photo Header */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100/80 flex items-center justify-center overflow-hidden border-b border-slate-100">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-2 border border-slate-200/60">
              {getCategoryIcon(item.category)}
            </div>
            <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
              {item.category}
            </span>
          </div>
        )}

        {/* Status Badge overlay */}
        <div className="absolute top-3 right-3 shadow-sm">
          <StatusBadge type={item.type} status={item.status} />
        </div>

        {/* Brand pill if present */}
        {item.brand && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg text-xs font-semibold text-slate-700 shadow-sm border border-slate-200/60">
            {item.brand}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-base text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2.5">
          {item.name}
        </h3>
        
        <div className="space-y-1.5 mb-4 flex-grow text-xs text-slate-600">
          <div className="flex items-center text-slate-600">
            <Tag size={14} className="mr-2 text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium">{item.category}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <MapPin size={14} className="mr-2 text-slate-400 flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <Calendar size={14} className="mr-2 text-slate-400 flex-shrink-0" />
            <span>{formatDateShort(item.date)}</span>
          </div>
        </div>

        {/* Match Alert Badge */}
        {matchCount !== undefined && matchCount > 0 && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-600 animate-pulse" />
              <span>{matchCount} Potential {matchCount === 1 ? 'Match' : 'Matches'}</span>
            </span>
            {topMatchScore ? (
              <span className="bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded-md text-[11px] font-bold">
                {Math.round(topMatchScore)}%
              </span>
            ) : null}
          </div>
        )}
        
        {/* Card Action Link */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-primary-light">
          <span>View Details</span>
          <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
