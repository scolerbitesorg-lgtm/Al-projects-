import React, { useState } from 'react';
import { Bot, Download, RefreshCw, Sparkles } from 'lucide-react';

export const RoboHashPreview: React.FC = () => {
  const [seed, setSeed] = useState<string>('Aarav');
  const [style, setStyle] = useState<'robohash' | 'monsters' | 'bottts'>('robohash');

  const getAvatarUrl = () => {
    const s = encodeURIComponent(seed.trim() || 'default');
    if (style === 'bottts') {
      return `https://api.dicebear.com/7.x/bottts/svg?seed=${s}`;
    } else if (style === 'monsters') {
      return `https://robohash.org/${s}.png?set=set2`;
    }
    return `https://robohash.org/${s}.png?set=set1`;
  };

  const currentUrl = getAvatarUrl();

  const randomSeeds = ['Aarav', 'CyberKnight', 'Matrix', 'Nexus7', 'AlphaBot', 'Nova', 'Zeta'];

  const downloadAvatar = async () => {
    try {
      const res = await fetch(currentUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `avatar_${seed}_${style}.${style === 'bottts' ? 'svg' : 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(currentUrl, '_blank');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">Procedural Robot Avatar Engine</span>
        </div>
        <span className="text-xs text-slate-400">RoboHash + DiceBear</span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Input Seed */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">Enter Username / Seed String:</label>
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Type any name (e.g. Aarav, CyberKnight)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 font-mono"
          />
        </div>

        {/* Style switch */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Avatar Style:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setStyle('robohash')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                style === 'robohash' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Robots
            </button>
            <button
              onClick={() => setStyle('monsters')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                style === 'monsters' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Monsters
            </button>
            <button
              onClick={() => setStyle('bottts')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                style === 'bottts' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Vector SVG
            </button>
          </div>
        </div>

        {/* Quick Seed tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 text-[11px]">Presets:</span>
          {randomSeeds.map((rs) => (
            <button
              key={rs}
              onClick={() => setSeed(rs)}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
            >
              {rs}
            </button>
          ))}
        </div>

        {/* Display Box */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950 border border-slate-800">
          <div className="w-36 h-36 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 overflow-hidden shadow-inner">
            <img
              src={currentUrl}
              alt={`Avatar for ${seed}`}
              className="w-full h-full object-contain filter drop-shadow-md"
              loading="lazy"
            />
          </div>
          <span className="text-xs text-teal-400 font-mono mt-3">Seed: "{seed}"</span>
        </div>

        {/* Download action */}
        <button
          onClick={downloadAvatar}
          className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download Generated Avatar</span>
        </button>
      </div>
    </div>
  );
};
