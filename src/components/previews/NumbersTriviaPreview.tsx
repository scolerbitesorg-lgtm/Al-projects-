import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { Binary, RefreshCw, Sparkles, Loader2 } from 'lucide-react';

export const NumbersTriviaPreview: React.FC = () => {
  const [numInput, setNumInput] = useState<string>('42');
  const [factType, setFactType] = useState<'trivia' | 'math'>('trivia');
  const [fact, setFact] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchFact = async (numberVal?: string, type?: 'trivia' | 'math') => {
    const activeType = type || factType;
    const target = numberVal !== undefined ? numberVal : numInput;
    setLoading(true);
    try {
      const url = target
        ? `http://numbersapi.com/${encodeURIComponent(target)}/${activeType}`
        : `http://numbersapi.com/random/${activeType}`;

      const res = await executeApiCall(url);
      if (res.data) {
        setFact(typeof res.data === 'string' ? res.data : JSON.stringify(res.data));
      } else {
        setFact(`42 is the answer to the ultimate question of life, the universe, and everything.`);
      }
    } catch {
      setFact(`42 is the answer to life, the universe, and everything.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact('42', 'trivia');
  }, []);

  const getRandomNumber = () => {
    const r = Math.floor(Math.random() * 500) + 1;
    setNumInput(String(r));
    fetchFact(String(r));
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Binary className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">Numbers & Math Trivia</span>
        </div>
        <span className="text-xs text-slate-400">NumbersAPI.com</span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Type toggle */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Fact Dimension:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                setFactType('trivia');
                fetchFact(numInput, 'trivia');
              }}
              className={`px-3 py-1 rounded-md transition-colors ${
                factType === 'trivia' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              General Trivia
            </button>
            <button
              onClick={() => {
                setFactType('math');
                fetchFact(numInput, 'math');
              }}
              className={`px-3 py-1 rounded-md transition-colors ${
                factType === 'math' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Math Properties
            </button>
          </div>
        </div>

        {/* Number Input + Random */}
        <div className="flex gap-2">
          <input
            type="number"
            value={numInput}
            onChange={(e) => setNumInput(e.target.value)}
            placeholder="Type any number..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={() => fetchFact(numInput)}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold transition-colors"
          >
            Calculate
          </button>
          <button
            onClick={getRandomNumber}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Random Number"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Random</span>
          </button>
        </div>

        {/* Fact Card Display */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 min-h-32 flex flex-col justify-center">
          {loading ? (
            <div className="text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
              <span>Querying numeric facts database...</span>
            </div>
          ) : (
            <p className="text-base text-slate-100 font-medium leading-relaxed">
              "{fact}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
