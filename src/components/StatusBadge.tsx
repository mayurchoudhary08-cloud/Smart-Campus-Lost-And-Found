import React from 'react';
import { CheckCircle2, AlertCircle, Check } from 'lucide-react';

interface StatusBadgeProps {
  type: 'lost' | 'found';
  status: 'active' | 'resolved';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, status }) => {
  if (status === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs">
        <Check size={12} className="text-slate-500" />
        <span>Resolved</span>
      </span>
    );
  }

  if (type === 'lost') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
        <span>Lost</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
      <span>Found</span>
    </span>
  );
};

export default StatusBadge;
