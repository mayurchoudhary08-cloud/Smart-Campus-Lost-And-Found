import React, { useState } from 'react';
import { Database, Trash2, Info, RefreshCw, AlertTriangle, ShieldCheck, Code2 } from 'lucide-react';
import Modal from '../components/Modal';

interface SettingsProps {
  onLoadDemo: () => void;
  onClearAll: () => void;
  showToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

const Settings: React.FC<SettingsProps> = ({ onLoadDemo, onClearAll, showToast }) => {
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleClear = () => {
    onClearAll();
    setIsClearModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-left">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portal Configuration</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage local demo data, inspect application state, and prepare for academic demonstration
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Demo Data Management Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Database className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-slate-900">Preset Academic Demo Data</h2>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-md">
              Loads 30 realistic campus lost &amp; found items with intentional near-matches (such as the Black ASUS laptop in Central Library) to test the PriorityQueue matching engine.
            </p>
          </div>
          <button 
            type="button"
            onClick={onLoadDemo}
            className="btn-primary text-xs whitespace-nowrap flex items-center gap-1.5 flex-shrink-0"
          >
            <RefreshCw size={13} />
            <span>Load Demo Data</span>
          </button>
        </div>

        {/* Clear Data Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-red-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-bold text-slate-900">Reset Local Storage &amp; Images</h2>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-md">
              Clears all reports and cached images from both localStorage and IndexedDB so you can start from a completely clean slate.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setIsClearModalOpen(true)}
            className="btn-danger text-xs whitespace-nowrap flex items-center gap-1.5 flex-shrink-0"
          >
            <Trash2 size={13} />
            <span>Clear All Data</span>
          </button>
        </div>

        {/* Course & Architecture Details */}
        <div className="bg-slate-50 p-6 sm:p-7 rounded-3xl border border-slate-200/90">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-slate-900">Project &amp; Course Architecture</h2>
          </div>
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="font-semibold text-slate-700">Project Name:</span>
              <span className="font-mono text-slate-900">Smart Campus Lost &amp; Found</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="font-semibold text-slate-700">Subject:</span>
              <span>Data Structures &amp; Algorithms (DSA) Course Project</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="font-semibold text-slate-700">Primary Data Structures:</span>
              <span className="font-mono text-primary font-bold">Hash Map (Map&lt;K, V&gt;) + Max-Heap (PriorityQueue&lt;T&gt;)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="font-semibold text-slate-700">Storage Architecture:</span>
              <span>In-memory Map + localStorage (Metadata) + IndexedDB (Photos)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-semibold text-slate-700">Client Engine:</span>
              <span>Zero external cloud APIs • Runs 100% offline</span>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isClearModalOpen} 
        onClose={() => setIsClearModalOpen(false)} 
        title="Clear All Campus Reports?"
      >
        <div className="text-left space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p>
              This will remove all lost items, found items, and uploaded photos from browser storage.
            </p>
          </div>
          <p className="text-xs text-slate-600">
            You can always reload the 30 sample demo reports anytime using the "Load Demo Data" button.
          </p>
          <div className="flex justify-end gap-3 pt-3">
            <button 
              type="button"
              onClick={() => setIsClearModalOpen(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleClear}
              className="btn-danger text-xs"
            >
              Yes, Clear Everything
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Settings;
