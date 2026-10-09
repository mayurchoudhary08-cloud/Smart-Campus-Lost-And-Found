import React from 'react';
import { MatchBreakdown as MatchBreakdownType } from '../types';
import { Check, X, Sparkles } from 'lucide-react';

interface MatchBreakdownProps {
  breakdown: MatchBreakdownType;
  totalScore: number;
}

const MatchBreakdown: React.FC<MatchBreakdownProps> = ({ breakdown, totalScore }) => {
  const categories = [
    { key: 'name', label: 'Item Name Similarity', max: 25, hint: 'Word overlap comparison' },
    { key: 'category', label: 'Category Match', max: 20, hint: 'Exact department category' },
    { key: 'location', label: 'Campus Location Match', max: 20, hint: 'Exact or containing location' },
    { key: 'brand', label: 'Brand / Manufacturer', max: 15, hint: 'Partial or exact brand token' },
    { key: 'color', label: 'Color Match', max: 10, hint: 'Normalized color match' },
    { key: 'date', label: 'Date Proximity', max: 10, hint: 'Close dates get higher score' },
    { key: 'description', label: 'Description Keywords (Bonus)', max: 10, hint: 'Extra keyword overlap' },
  ] as const;

  return (
    <div className="space-y-5 text-left">
      
      {/* Header score card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 mb-1">
          <Sparkles size={14} className="text-amber-500" />
          <span>Calculated Match Score</span>
        </div>
        <div className="text-4xl font-black text-slate-900">{Math.round(totalScore)}%</div>
        <p className="text-xs text-slate-500 mt-1">
          {totalScore >= 80 ? '🟢 Strong Match (High likelihood)' : totalScore >= 60 ? '🟡 Possible Match (Worth verifying)' : '🟠 Weak Match'}
        </p>

        {/* Total progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              totalScore >= 80 ? 'bg-emerald-500' : totalScore >= 60 ? 'bg-amber-500' : 'bg-slate-500'
            }`} 
            style={{ width: `${Math.min(100, Math.round(totalScore))}%` }}
          />
        </div>
      </div>

      {/* Point details */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Criteria Score Distribution
        </h4>

        {categories.map((cat) => {
          const score = breakdown[cat.key as keyof MatchBreakdownType] as number;
          const percentage = Math.min(100, (score / cat.max) * 100);
          const hasPoints = score > 0;
          
          return (
            <div key={cat.key} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  {hasPoints ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Check size={11} />
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center flex-shrink-0">
                      <X size={11} />
                    </span>
                  )}
                  <span>{cat.label}</span>
                </div>
                <span className={`font-mono font-bold ${hasPoints ? 'text-emerald-700' : 'text-slate-400'}`}>
                  +{Math.round(score)} / {cat.max}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${hasPoints ? 'bg-emerald-500' : 'bg-transparent'}`} 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-400 p-2.5 bg-white border border-slate-200 rounded-xl text-center">
        Formula: Name (25) + Category (20) + Location (20) + Brand (15) + Color (10) + Date (10) + Description (10 bonus)
      </div>

    </div>
  );
};

export default MatchBreakdown;
