import React, { useState } from 'react';
import { 
  Database, 
  ArrowUpDown, 
  Search as SearchIcon, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  Code2, 
  Play, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { PriorityQueue } from '../algorithms/priorityQueue';

const DSAExplanation: React.FC = () => {
  // Interactive Heap state for live viva demonstration
  const [heapScores, setHeapScores] = useState<number[]>([92, 85, 74, 62, 45, 38]);
  const [extractedScore, setExtractedScore] = useState<number | null>(null);
  const [newScoreInput, setNewScoreInput] = useState<string>('88');
  const [heapLog, setHeapLog] = useState<string>('Heap initialized with 6 sample match scores.');

  // Interactive Hash Map state
  const [searchKey, setSearchKey] = useState<string>('DEMO-001');
  const [hashResult, setHashResult] = useState<any>({
    id: 'DEMO-001',
    name: 'Black ASUS Laptop',
    category: 'Electronics',
    location: 'Central Library',
    status: 'active'
  });

  const sampleMap = {
    'DEMO-001': { id: 'DEMO-001', name: 'Black ASUS Laptop', category: 'Electronics', location: 'Central Library', status: 'active' },
    'DEMO-002': { id: 'DEMO-002', name: 'Black ASUS Laptop', category: 'Electronics', location: 'Central Library', status: 'active' },
    'DEMO-003': { id: 'DEMO-003', name: 'Blue Backpack', category: 'Bags', location: 'Canteen', status: 'active' },
    'DEMO-004': { id: 'DEMO-004', name: 'Blue JanSport Backpack', category: 'Bags', location: 'Canteen', status: 'active' },
    'DEMO-005': { id: 'DEMO-005', name: 'Student ID Card', category: 'ID / Cards', location: 'Classroom Block A', status: 'active' },
  };

  const handleExtractMax = () => {
    if (heapScores.length === 0) {
      setHeapLog('Cannot extract: Heap is currently empty.');
      return;
    }
    const pq = new PriorityQueue<number>((a, b) => a - b);
    heapScores.forEach(s => pq.insert(s));
    const max = pq.extractMax();
    const remaining = pq.toSortedArray();
    setExtractedScore(max ?? null);
    setHeapScores(remaining);
    setHeapLog(`extractMax() returned ${max} in O(log n) time. Root replaced & bubble-down executed.`);
  };

  const handleInsertScore = () => {
    const val = parseInt(newScoreInput, 10);
    if (isNaN(val) || val < 0 || val > 100) return;
    const pq = new PriorityQueue<number>((a, b) => a - b);
    heapScores.forEach(s => pq.insert(s));
    pq.insert(val);
    const updated = pq.toSortedArray();
    setHeapScores(updated);
    setHeapLog(`insert(${val}) executed in O(log n) time. Appended to leaf and bubble-up restored Max-Heap property.`);
  };

  const handleResetHeap = () => {
    setHeapScores([92, 85, 74, 62, 45, 38]);
    setExtractedScore(null);
    setHeapLog('Heap reset to default sample values.');
  };

  const handleLookupKey = (key: string) => {
    setSearchKey(key);
    const res = (sampleMap as any)[key];
    setHashResult(res || null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
          <Cpu size={14} />
          <span>Computer Science Project • Academic Reference</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Data Structures &amp; Algorithms Architecture
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          Comprehensive explanation of how Hash Maps, Binary Max Heaps, and Keyword Search Algorithms power the Smart Campus platform with explainable complexity.
        </p>
      </div>

      {/* Summary Complexity Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 mb-12">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Code2 size={20} className="text-primary" />
          <span>DSA Complexity Summary Table</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Component</th>
                <th className="px-4 py-3">Data Structure / Algorithm</th>
                <th className="px-4 py-3">Operation</th>
                <th className="px-4 py-3">Time Complexity</th>
                <th className="px-4 py-3 rounded-r-xl">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-slate-900">Item Indexing</td>
                <td className="px-4 py-3 text-primary">Hash Map (Map&lt;string, Item&gt;)</td>
                <td className="px-4 py-3">Lookup by ID / Update</td>
                <td className="px-4 py-3 text-emerald-700 font-bold">O(1) average</td>
                <td className="px-4 py-3">O(n)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-slate-900">Match Ranking</td>
                <td className="px-4 py-3 text-amber-700 font-semibold">Priority Queue (Binary Max-Heap)</td>
                <td className="px-4 py-3">Insert match score</td>
                <td className="px-4 py-3 text-blue-700 font-bold">O(log n)</td>
                <td className="px-4 py-3">O(n)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-slate-900">Match Extraction</td>
                <td className="px-4 py-3 text-amber-700 font-semibold">Priority Queue (Binary Max-Heap)</td>
                <td className="px-4 py-3">Extract highest match</td>
                <td className="px-4 py-3 text-blue-700 font-bold">O(log n)</td>
                <td className="px-4 py-3">O(1) auxiliary</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-slate-900">Keyword Search</td>
                <td className="px-4 py-3">Multi-Token AND-Match Filter</td>
                <td className="px-4 py-3">Query scan across fields</td>
                <td className="px-4 py-3 text-slate-800 font-bold">O(n &times; m)</td>
                <td className="px-4 py-3">O(1) auxiliary</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-bold text-slate-900">Sorting Utilities</td>
                <td className="px-4 py-3">Comparison Timsort</td>
                <td className="px-4 py-3">Sort by date/name/match</td>
                <td className="px-4 py-3 text-slate-800 font-bold">O(n log n)</td>
                <td className="px-4 py-3">O(n)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 1: Hash Map */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
            <Database size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Data Structure 01</span>
            <h2 className="text-xl font-extrabold text-slate-900">Hash Map (Item Index &amp; Fast Storage)</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          Every lost and found item is indexed in an in-memory <code>Map&lt;string, Item&gt;</code> using its unique Report ID as the key. This guarantees <strong>O(1) average-case time complexity</strong> when viewing an item page, checking existence, updating status, or linking match pairs.
        </p>

        {/* Live Interactive Hash Map Lookup */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Play size={13} className="text-primary" />
              <span>Interactive O(1) Hash Map Lookup Simulator:</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Avg Time: O(1)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-slate-500">Try Sample Keys:</span>
            {['DEMO-001', 'DEMO-002', 'DEMO-003', 'DEMO-005'].map((k) => (
              <button
                key={k}
                onClick={() => handleLookupKey(k)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition border ${
                  searchKey === k 
                    ? 'bg-primary text-white border-primary shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          {hashResult ? (
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 flex flex-col sm:flex-row justify-between gap-2">
              <div>
                <span className="text-primary font-bold">map.get("{searchKey}")</span> &rarr; {hashResult.name} ({hashResult.category})
              </div>
              <div className="text-slate-400 text-[11px]">
                Location: {hashResult.location} • Status: {hashResult.status}
              </div>
            </div>
          ) : (
            <div className="bg-white p-3 rounded-xl border border-red-200 text-xs text-red-600 font-mono">
              Key not found in map.
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Priority Queue / Max-Heap */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ArrowUpDown size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Data Structure 02</span>
            <h2 className="text-xl font-extrabold text-slate-900">Binary Max-Heap (Priority Queue)</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          When ranking potential matches for an item, our system avoids trivial array sorts. Instead, match candidates are inserted into a custom <strong>Array-Based Max-Heap</strong>. The heap property guarantees that a parent node is always &ge; its child nodes. The highest scoring match is always at index <code>0</code> (root) and extracted in <strong>O(log n) time</strong> via bubble-down.
        </p>

        {/* Live Interactive Heap Simulator */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>Live Max-Heap Interactive Simulation:</span>
            </span>
            <button
              onClick={handleResetHeap}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Reset Sample Heap</span>
            </button>
          </div>

          {/* Heap Tree Visual Representation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 text-center mb-4">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">
              Current Heap Array: [{heapScores.join(', ')}]
            </div>

            {heapScores.length > 0 ? (
              <div className="flex flex-col items-center">
                {/* Level 0: Root */}
                <div className="w-12 h-12 rounded-2xl bg-primary text-white font-black text-base flex items-center justify-center shadow-md border-2 border-white">
                  {heapScores[0]}
                </div>
                <span className="text-[10px] font-bold text-primary mt-1">Root (Max: {heapScores[0]}%)</span>

                {/* Level 1: Children */}
                {heapScores.length > 1 && (
                  <>
                    <div className="w-32 h-4 border-t-2 border-slate-300 border-x-2 rounded-t-lg mt-2"></div>
                    <div className="flex gap-16 -mt-1">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-xl bg-secondary text-white font-bold text-sm flex items-center justify-center shadow-sm">
                          {heapScores[1]}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5">Left</span>
                      </div>
                      {heapScores.length > 2 && (
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-xl bg-secondary text-white font-bold text-sm flex items-center justify-center shadow-sm">
                            {heapScores[2]}
                          </div>
                          <span className="text-[9px] text-slate-400 mt-0.5">Right</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Level 2: Children */}
                {heapScores.length > 3 && (
                  <div className="flex gap-4 mt-3">
                    {heapScores.slice(3).map((score, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                        {score}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Heap is currently empty.</p>
            )}
          </div>

          {/* Heap Operations Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleExtractMax}
              disabled={heapScores.length === 0}
              className="btn-primary text-xs bg-amber-600 hover:bg-amber-700"
            >
              <span>extractMax() &rarr; {heapScores[0] !== undefined ? `${heapScores[0]}%` : 'None'}</span>
            </button>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={newScoreInput}
                onChange={(e) => setNewScoreInput(e.target.value)}
                className="w-16 px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-center"
              />
              <button
                onClick={handleInsertScore}
                className="btn-secondary text-xs"
              >
                <span>insert(score)</span>
              </button>
            </div>
          </div>

          {/* Operation Status Log */}
          <div className="mt-3 p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-600">
            <strong>Heap Log:</strong> {heapLog}
          </div>
        </div>
      </section>

      {/* Section 3: Matching Formula */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Zap size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Algorithm 03</span>
            <h2 className="text-xl font-extrabold text-slate-900">Explainable Match Scoring Weights</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          Unlike opaque neural networks or cloud AI APIs, our scoring formula is transparent, deterministic, and fully explainable in a viva examination.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              100-Point Scoring Breakdown
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Item Name Match (Word Overlap Similarity)</span>
                <span className="font-bold text-slate-900">+25 pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Category Match (Exact String Match)</span>
                <span className="font-bold text-slate-900">+20 pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Campus Location (Exact or Substring Match)</span>
                <span className="font-bold text-slate-900">+20 pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Brand / Manufacturer Match</span>
                <span className="font-bold text-slate-900">+15 pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Color Match</span>
                <span className="font-bold text-slate-900">+10 pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Date Proximity (&le;1 day: +10, &le;3d: +8, &le;7d: +5)</span>
                <span className="font-bold text-slate-900">+10 pts</span>
              </div>
              <div className="flex justify-between py-1 text-slate-500 italic">
                <span>Description Keyword Overlap (Bonus)</span>
                <span className="font-bold">+10 pts</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Classification Confidence Thresholds
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <div className="font-bold">Strong Match (80% – 100%)</div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">High confidence. Same item category, location, and matching names.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                  <div className="font-bold">Possible Match (60% – 79%)</div>
                  <p className="text-[11px] text-amber-700 mt-0.5">Moderate confidence. Requires owner verification of specific details.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
                  <div className="font-bold">Weak Match (40% – 59%)</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Low confidence. Partial overlap in category or broad location.</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500">
              Matches with score &lt; 40 are filtered out automatically to reduce noise.
            </div>
          </div>
        </div>
      </section>

      {/* Professor Viva Footnote */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
        <p className="text-xs font-bold text-primary mb-1">
          Designed for academic demonstration and viva examination.
        </p>
        <p className="text-[11px] text-slate-500">
          Source code is located in <code>src/algorithms/</code> (priorityQueue.ts, matching.ts, search.ts, sorting.ts).
        </p>
      </div>

    </div>
  );
};

export default DSAExplanation;
