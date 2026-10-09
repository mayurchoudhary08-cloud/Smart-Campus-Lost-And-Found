import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Menu, 
  Settings, 
  X, 
  ShieldCheck, 
  PlusCircle, 
  LayoutDashboard, 
  FolderClock,
  Sparkles
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse', path: '/browse' },
    { name: 'Report Lost', path: '/report-lost' },
    { name: 'Report Found', path: '/report-found' },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">
          
          {/* Logo & College Identity */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 group-hover:bg-primary-dark transition-all duration-200">
                <div className="relative flex items-center justify-center">
                  <ShieldCheck size={22} className="text-white" />
                  <Search size={11} className="absolute -bottom-1 -right-1 text-amber-400 bg-primary rounded-full p-0.5" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                    Smart Campus
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                    Portal
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500 tracking-normal mt-0.5">
                  Lost &amp; Found System
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Action Icons & Direct Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                isActive('/dashboard') 
                  ? 'bg-slate-100 text-primary font-bold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/my-reports"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                isActive('/my-reports') 
                  ? 'bg-slate-100 text-primary font-bold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <FolderClock size={15} />
              <span>My Reports</span>
            </Link>

            <Link
              to="/settings"
              aria-label="Portal Settings"
              className={`p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition ${
                isActive('/settings') ? 'text-primary bg-primary/10' : ''
              }`}
            >
              <Settings size={18} />
            </Link>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

            <Link
              to="/report-lost"
              className="hidden md:inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-primary-dark transition shadow-sm hover:shadow"
            >
              <PlusCircle size={14} />
              <span>Report Item</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1.5 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${
                isActive(link.path)
                  ? 'bg-primary text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/my-reports"
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={() => setIsOpen(false)}
            >
              <FolderClock size={16} />
              <span>My Reports</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} />
              <span>Settings &amp; Demo Data</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
