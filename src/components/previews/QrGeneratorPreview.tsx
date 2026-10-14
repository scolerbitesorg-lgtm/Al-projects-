import React, { useState } from 'react';
import { QrCode, Download, Copy, Check, ExternalLink } from 'lucide-react';

export const QrGeneratorPreview: React.FC = () => {
  const [text, setText] = useState<string>('https://google.com');
  const [size, setSize] = useState<number>(200);
  const [copied, setCopied] = useState<boolean>(false);

  const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(text)}&size=${size}&margin=2`;

  const downloadQr = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(qrUrl, '_blank');
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">QuickChart QR Code Generator</span>
        </div>
        <span className="text-xs text-slate-400">Real-Time Vector QR</span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Payload Input */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">Enter URL, Text, UPI ID ya Phone Number:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com or any text"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 font-mono"
          />
        </div>

        {/* Size Presets */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Image Size:</span>
          <div className="flex gap-1.5">
            {[150, 200, 300].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-2.5 py-1 rounded-md font-mono transition-colors ${
                  size === s
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>

        {/* Live QR Output */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950 border border-slate-800">
          <div className="p-3 bg-white rounded-xl shadow-lg border border-slate-200">
            <img
              src={qrUrl}
              alt="Generated QR Code"
              width={size}
              height={size}
              className="object-contain"
              loading="lazy"
            />
          </div>
          <p className="text-xs text-slate-400 mt-3 truncate max-w-xs font-mono">
            {text}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={downloadQr}
            className="flex-1 py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download QR (.png)</span>
          </button>

          <button
            onClick={copyUrl}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
            title="Copy Direct Image URL"
          >
            {copied ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">Copy Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};
