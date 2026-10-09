import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { validateImage, compressImage } from '../utils/imageCompression';

interface PhotoUploadProps {
  photo: string;
  onChange: (dataUrl: string) => void;
  onRemove: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ photo, onChange, onRemove }) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file format or size');
      return;
    }

    setLoading(true);
    try {
      const dataUrl = await compressImage(file);
      onChange(dataUrl);
    } catch (err) {
      setError('Error compressing image in browser. Please try another image.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // If photo is already selected
  if (photo) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-sm max-w-sm mx-auto aspect-square bg-slate-100 flex items-center justify-center">
          <img src={photo} alt="Item preview" className="w-full h-full object-cover" />
          <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <CheckCircle2 size={12} />
            <span>Ready</span>
          </div>
        </div>

        {/* Action buttons (always visible for mobile and desktop accessibility) */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <RefreshCw size={13} />
            <span>Replace Photo</span>
          </button>
          
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-700 hover:bg-red-100 transition shadow-xs"
          >
            <Trash2 size={13} />
            <span>Remove</span>
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
          dragActive 
            ? 'border-primary bg-primary/5 scale-[1.01]' 
            : 'border-slate-300 hover:border-primary/50 bg-slate-50/70 hover:bg-white'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          onChange={handleChange}
        />
        
        {loading ? (
          <div className="flex flex-col items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
            <p className="text-xs font-semibold text-slate-600">Compressing &amp; resizing in browser...</p>
            <p className="text-[11px] text-slate-400 mt-1">Optimizing to max 800x800</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-slate-500 mb-3 group-hover:scale-105 transition-transform">
              <Camera size={22} className="text-primary" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              Upload Item Photo <span className="text-slate-400 font-normal text-xs">(Optional)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Drag &amp; drop an image here, or click to choose from your device
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
              <Upload size={13} />
              <span>Select JPG, PNG or WebP</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Client-side compressed up to 5 MB • Preserves local storage
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-medium">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
