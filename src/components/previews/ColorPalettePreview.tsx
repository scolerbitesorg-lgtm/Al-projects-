import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { Palette, Copy, Check, Loader2, Sparkles } from 'lucide-react';

export const ColorPalettePreview: React.FC = () => {
  const [hex, setHex] = useState<string>('0047AB');
  const [colorData, setColorData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<string | null>(null);

  const presets = ['0047AB', '10B981', '8B5CF6', 'F43F5E', 'F59E0B', '06B6D4', 'EC4899'];

  const fetchColor = async (hexCode: string) => {
    const cleanHex = hexCode.replace('#', '');
    if (cleanHex.length !== 6 && cleanHex.length !== 3) return;
    setLoading(true);
    try {
      const res = await executeApiCall(`https://www.thecolorapi.com/id?hex=${cleanHex}`);
      if (res.data) {
        setColorData(res.data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColor(hex);
  }, []);

  const copyText = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">The Color API Inspector</span>
        </div>
        <span className="text-xs text-slate-400">TheColorAPI.com</span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Color picker & Hex input */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-10 rounded-xl overflow-hidden border border-slate-700 shrink-0">
            <input
              type="color"
              value={`#${hex}`}
              onChange={(e) => {
                const h = e.target.value.replace('#', '').toUpperCase();
                setHex(h);
                fetchColor(h);
              }}
              className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0"
            />
          </div>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-mono">#</span>
            <input
              type="text"
              maxLength={6}
              value={hex}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
                setHex(val);
                if (val.length === 6) fetchColor(val);
              }}
              placeholder="0047AB"
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-teal-500 uppercase"
            />
          </div>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 text-[11px]">Presets:</span>
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => {
                setHex(p);
                fetchColor(p);
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `#${p}` }} />
              <span>#{p}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
            <span>Analyzing color spectrum and nomenclature...</span>
          </div>
        ) : colorData ? (
          <div className="space-y-3 mt-2">
            {/* Color Swatch Display */}
            <div
              className="h-24 w-full rounded-xl flex items-end p-4 border border-slate-800 shadow-inner transition-all duration-300"
              style={{ backgroundColor: colorData.hex?.value || `#${hex}` }}
            >
              <div className="p-2 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs flex items-center justify-between w-full">
                <span className="font-bold text-sm">{colorData.name?.value || 'Named Shade'}</span>
                <span className="font-mono text-slate-300 text-[11px]">
                  {colorData.hex?.value}
                </span>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div
                onClick={() => copyText(colorData.hex?.value, 'hex')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <div className="text-[10px] text-slate-400">HEX</div>
                <div className="font-mono font-semibold text-white mt-0.5 flex items-center justify-between">
                  <span>{colorData.hex?.value}</span>
                  {copied === 'hex' ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                </div>
              </div>

              <div
                onClick={() => copyText(colorData.rgb?.value, 'rgb')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <div className="text-[10px] text-slate-400">RGB</div>
                <div className="font-mono font-semibold text-white mt-0.5 truncate flex items-center justify-between">
                  <span>{colorData.rgb?.value?.replace('rgb(', '').replace(')', '')}</span>
                  {copied === 'rgb' ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                </div>
              </div>

              <div
                onClick={() => copyText(colorData.hsl?.value, 'hsl')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <div className="text-[10px] text-slate-400">HSL</div>
                <div className="font-mono font-semibold text-white mt-0.5 truncate flex items-center justify-between">
                  <span>{colorData.hsl?.value?.replace('hsl(', '').replace(')', '')}</span>
                  {copied === 'hsl' ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                </div>
              </div>
            </div>

            {/* Contrast check */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Optimal Contrast Text:</span>
              <span
                className="px-2.5 py-0.5 rounded font-mono font-bold"
                style={{
                  backgroundColor: colorData.hex?.value,
                  color: colorData.contrast?.value
                }}
              >
                {colorData.contrast?.value === '#000000' ? 'Black Text (#000)' : 'White Text (#FFF)'}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
