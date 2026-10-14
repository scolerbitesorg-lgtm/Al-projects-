import React, { useState } from 'react';
import { Eye, ExternalLink, Image as ImageIcon } from 'lucide-react';

const STATUS_CODES = [
  { code: 200, label: '200 OK' },
  { code: 201, label: '201 Created' },
  { code: 301, label: '301 Moved' },
  { code: 400, label: '400 Bad Request' },
  { code: 401, label: '401 Unauthorized' },
  { code: 403, label: '403 Forbidden' },
  { code: 404, label: '404 Not Found' },
  { code: 418, label: "418 I'm a Teapot" },
  { code: 500, label: '500 Server Error' },
  { code: 502, label: '502 Bad Gateway' },
  { code: 503, label: '503 Unavailable' }
];

export const HttpCatPreview: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<number>(404);
  const [provider, setProvider] = useState<'cat' | 'dog'>('cat');

  const getImageUrl = () => {
    if (provider === 'dog') {
      return `https://http.dog/${selectedCode}.jpg`;
    }
    return `https://http.cat/${selectedCode}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">HTTP Visual Status Codes</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setProvider('cat')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              provider === 'cat' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            HTTP Cat 🐱
          </button>
          <button
            onClick={() => setProvider('dog')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              provider === 'dog' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            HTTP Dog 🐶
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* Status Codes chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
          {STATUS_CODES.map((s) => (
            <button
              key={s.code}
              onClick={() => setSelectedCode(s.code)}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono whitespace-nowrap transition-colors ${
                selectedCode === s.code
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {s.code}
            </button>
          ))}
        </div>

        {/* Image preview box */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-64">
          <img
            key={`${provider}-${selectedCode}`}
            src={getImageUrl()}
            alt={`HTTP status ${selectedCode}`}
            className="max-h-72 w-auto object-contain rounded-lg shadow-md"
            loading="lazy"
            onError={(e: any) => {
              e.currentTarget.src = 'https://http.cat/404';
            }}
          />
          <div className="mt-3 text-center">
            <span className="text-xs font-mono text-slate-400">
              {STATUS_CODES.find(s => s.code === selectedCode)?.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
