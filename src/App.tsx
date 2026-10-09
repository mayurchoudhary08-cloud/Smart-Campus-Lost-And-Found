import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Browse from './pages/Browse';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import ItemDetails from './pages/ItemDetails';
import MyReports from './pages/MyReports';
import Dashboard from './pages/Dashboard';
import DSAExplanation from './pages/DSAExplanation';
import Settings from './pages/Settings';
import { Item } from './types';
import { loadItemsMap, saveItemsMap, addItem, isDemoLoaded, setDemoLoaded, clearAllItems } from './utils/storage';
import { getSampleData } from './data/sampleData';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const [items, setItems] = useState<Map<string, Item>>(new Map());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load items from storage on mount, seed demo data if first visit
  useEffect(() => {
    let map = loadItemsMap();
    if (map.size === 0 && !isDemoLoaded()) {
      const sample = getSampleData();
      map = new Map<string, Item>();
      for (const item of sample) {
        map.set(item.id, item);
      }
      saveItemsMap(map);
      setDemoLoaded();
    }
    setItems(map);
  }, []);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const handleAddItem = useCallback((item: Item) => {
    addItem(item);
    setItems(loadItemsMap());
  }, []);

  const handleUpdateItem = useCallback((item: Item) => {
    const map = loadItemsMap();
    map.set(item.id, item);
    saveItemsMap(map);
    setItems(new Map(map));
  }, []);

  const handleLoadDemoData = useCallback(() => {
    const sample = getSampleData();
    const map = new Map<string, Item>();
    for (const item of sample) {
      map.set(item.id, item);
    }
    saveItemsMap(map);
    setDemoLoaded();
    setItems(map);
    showToast('Demo data loaded successfully!', 'success');
  }, [showToast]);

  const handleClearAll = useCallback(() => {
    clearAllItems();
    setItems(new Map());
    showToast('All data cleared.', 'info');
  }, [showToast]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home items={items} />} />
            <Route path="/browse" element={<Browse items={items} />} />
            <Route
              path="/report-lost"
              element={
                <ReportLost
                  onSubmit={handleAddItem}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="/report-found"
              element={
                <ReportFound
                  onSubmit={handleAddItem}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="/item/:id"
              element={
                <ItemDetails
                  items={items}
                  onUpdate={handleUpdateItem}
                  showToast={showToast}
                />
              }
            />
            <Route path="/my-reports" element={<MyReports items={items} />} />
            <Route path="/dashboard" element={<Dashboard items={items} />} />
            <Route path="/how-it-works" element={<DSAExplanation />} />
            <Route
              path="/settings"
              element={
                <Settings
                  onLoadDemo={handleLoadDemoData}
                  onClearAll={handleClearAll}
                  showToast={showToast}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
        {/* Toast notifications */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.text}
              type={toast.type}
              onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            />
          ))}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
