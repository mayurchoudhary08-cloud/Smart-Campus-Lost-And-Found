import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, Heart, Code2 } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-12 pb-8 border-t border-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 text-left">
          
          {/* Logo & Description */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-amber-400" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">Smart Campus</span>
              <span className="text-xs uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded font-bold text-blue-200">
                Lost &amp; Found
              </span>
            </div>
            
            <p className="text-blue-100/80 text-xs sm:text-sm max-w-sm leading-relaxed mt-1">
              "Lost something? Found something? Let your campus help you find it." A student utility portal powered by explainable Data Structures &amp; Algorithms.
            </p>

            <div className="flex items-center gap-2 text-xs text-blue-200/70 mt-2">
              <Code2 size={14} className="text-amber-400" />
              <span>Built with React, TypeScript, Vite &amp; Tailwind CSS</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="md:col-span-3 sm:col-span-6">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-200 mb-3.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-blue-100/90 font-medium">
              <li><Link to="/" className="hover:text-white transition">Campus Home</Link></li>
              <li><Link to="/browse" className="hover:text-white transition">Browse All Items</Link></li>
              <li><Link to="/report-lost" className="hover:text-white transition">Report Lost Item</Link></li>
              <li><Link to="/report-found" className="hover:text-white transition">Report Found Item</Link></li>
            </ul>
          </div>

          {/* Academic & Project Links */}
          <div className="md:col-span-4 sm:col-span-6">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-200 mb-3.5">
              Academic Resources
            </h4>
            <ul className="space-y-2 text-xs text-blue-100/90 font-medium">
              <li>
                <Link to="/how-it-works" className="hover:text-white transition flex items-center gap-1.5">
                  <span>How Algorithms Work (DSA)</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">Viva Guide</span>
                </Link>
              </li>
              <li><Link to="/dashboard" className="hover:text-white transition">Campus Metrics Dashboard</Link></li>
              <li><Link to="/my-reports" className="hover:text-white transition">My Reports Registry</Link></li>
              <li><Link to="/settings" className="hover:text-white transition">Settings &amp; Demo Data</Link></li>
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-blue-200/70 gap-3">
          <p>© 2026 Smart Campus Lost &amp; Found Portal. Academic Pair Programming Project.</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-mono text-white font-bold">O(1) Hash Maps</span>
            <span>&amp;</span>
            <span className="font-mono text-white font-bold">O(log n) Max-Heaps</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
