import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Copy, AlertCircle, ArrowRight, ShieldCheck, Tag, MapPin, Calendar, FileText, Phone } from 'lucide-react';
import { Item, CATEGORIES, LOCATIONS } from '../types';
import PhotoUpload from '../components/PhotoUpload';
import { generateId, saveImage } from '../utils/storage';

interface ReportLostProps {
  onSubmit: (item: Item) => void;
  showToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

const ReportLost: React.FC<ReportLostProps> = ({ onSubmit, showToast }) => {
  const [successId, setSuccessId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    color: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    description: '',
    contact: ''
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Item Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.description.trim()) newErrors.description = 'Please describe the item (e.g. stickers, marks)';
    if (!formData.contact.trim()) newErrors.contact = 'Contact Information is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please complete the required fields in the form.', 'error');
      return;
    }

    const id = generateId();
    
    // Save image to IndexedDB to keep localStorage lightweight
    if (photo) {
      await saveImage(id, photo);
    }

    const newItem: Item = {
      id,
      type: 'lost',
      name: formData.name.trim(),
      category: formData.category,
      brand: formData.brand.trim(),
      color: formData.color.trim(),
      location: formData.location,
      date: formData.date,
      time: formData.time,
      description: formData.description.trim(),
      photo: photo ? 'indexeddb' : '',
      contact: formData.contact.trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    onSubmit(newItem);
    showToast('Lost item reported successfully!', 'success');
    setSuccessId(id);
  };

  const handleReset = () => {
    setSuccessId(null);
    setFormData({
      name: '',
      category: '',
      brand: '',
      color: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      description: '',
      contact: ''
    });
    setPhoto(null);
    setErrors({});
  };

  const handleCopyId = () => {
    if (successId) {
      navigator.clipboard.writeText(successId);
      showToast('Report ID copied to clipboard!', 'info');
    }
  };

  if (successId) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200 text-center animate-scaleIn">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Lost Report Registered!
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            Your lost item report is live on the campus registry. The system is actively matching against newly turned-in items.
          </p>

          {/* Report ID Box */}
          <div className="bg-slate-50 p-4 rounded-2xl mb-8 border border-slate-200/80 inline-flex flex-col sm:flex-row items-center gap-3">
            <div className="text-xs text-slate-500 font-medium">Your Official Tracking ID:</div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-primary text-base bg-white px-3 py-1 rounded-lg border border-slate-200">
                {successId}
              </span>
              <button
                onClick={handleCopyId}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-primary transition"
                title="Copy ID"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to={`/item/${successId}`} 
              className="btn-primary text-xs"
            >
              View Report Details
            </Link>
            <Link 
              to="/browse" 
              className="btn-secondary text-xs"
            >
              Browse Campus Listings
            </Link>
            <button 
              onClick={handleReset} 
              className="btn-ghost text-xs"
            >
              Report Another Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      <div className="mb-8 text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
          Student Assistance Form
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Report a Lost Item</h1>
        <p className="text-sm text-slate-500 mt-1">
          Provide accurate details so security offices and fellow students can identify and return your belonging.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90 space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Item Name */}
          <div className="md:col-span-2">
            <label className="form-label flex items-center gap-1.5">
              <Tag size={14} className="text-primary" />
              <span>Item Name <span className="text-red-500">*</span></span>
            </label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="e.g. Black ASUS ROG Laptop, Blue JanSport Backpack, Silver Casio Watch" 
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="form-label">
              Category <span className="text-red-500">*</span>
            </label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              className="form-input"
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="form-error">{errors.category}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="form-label flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" />
              <span>Last Known Location <span className="text-red-500">*</span></span>
            </label>
            <select 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              className="form-input"
            >
              <option value="">Select Location</option>
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            {errors.location && <p className="form-error">{errors.location}</p>}
          </div>

          {/* Brand */}
          <div>
            <label className="form-label">
              Brand / Manufacturer <span className="text-slate-400 font-normal text-xs">(Optional)</span>
            </label>
            <input 
              type="text" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="e.g. ASUS, Apple, Dell, JanSport" 
            />
          </div>

          {/* Color */}
          <div>
            <label className="form-label">
              Color <span className="text-slate-400 font-normal text-xs">(Optional)</span>
            </label>
            <input 
              type="text" 
              name="color" 
              value={formData.color} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="e.g. Black, Navy Blue, Silver" 
            />
          </div>

          {/* Date Lost */}
          <div>
            <label className="form-label flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              <span>Date Lost <span className="text-red-500">*</span></span>
            </label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              className="form-input" 
            />
            {errors.date && <p className="form-error">{errors.date}</p>}
          </div>

          {/* Time Lost */}
          <div>
            <label className="form-label">
              Approximate Time <span className="text-slate-400 font-normal text-xs">(Optional)</span>
            </label>
            <input 
              type="time" 
              name="time" 
              value={formData.time} 
              onChange={handleChange} 
              className="form-input" 
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="form-label flex items-center gap-1.5">
              <FileText size={14} className="text-primary" />
              <span>Identifying Description <span className="text-red-500">*</span></span>
            </label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={3} 
              className="form-input" 
              placeholder="Describe distinguishing marks, stickers, dents, keychains, contents, or serial numbers..."
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          {/* Contact Information */}
          <div className="md:col-span-2">
            <label className="form-label flex items-center gap-1.5">
              <Phone size={14} className="text-primary" />
              <span>Your Contact Information <span className="text-red-500">*</span></span>
            </label>
            <input 
              type="text" 
              name="contact" 
              value={formData.contact} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="e.g. rahul.sharma@college.edu or 98765-43210" 
            />
            {errors.contact && <p className="form-error">{errors.contact}</p>}
            <p className="text-[11px] text-slate-400 mt-1">
              Contact info is displayed securely to students or security officers trying to return your item.
            </p>
          </div>

          {/* Photo Upload */}
          <div className="md:col-span-2">
            <PhotoUpload 
              photo={photo || ''} 
              onChange={setPhoto} 
              onRemove={() => setPhoto(null)} 
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link to="/browse" className="text-xs font-semibold text-slate-500 hover:text-slate-700">
            Cancel
          </Link>
          <button 
            type="submit" 
            className="btn-primary"
          >
            Submit Lost Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportLost;
