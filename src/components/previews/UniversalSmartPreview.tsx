import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { ApiItem, ApiResponseResult } from '../../types/api';
import { Play, Copy, Check, Search, Shield, Zap, RefreshCw, AlertCircle, Terminal, Layers } from 'lucide-react';

interface Props {
  api: ApiItem;
}

export const UniversalSmartPreview: React.FC<Props> = ({ api }) => {
  const [url, setUrl] = useState<string>(api.url);
  const [result, setResult] = useState<ApiResponseResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'json' | 'table'>('json');

  const runRequest = async (targetUrl: string = url) => {
    setLoading(true);
    setCopied(false);
    try {
      const res = await executeApiCall(targetUrl, api.method || 'GET');
      setResult(res);
    } catch (err: any) {
      setResult({
        status: 0,
        statusText: 'Failed',
        ok: false,
        latencyMs: 0,
        data: null,
        contentType: 'none',
        headers: {},
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUrl(api.url);
    runRequest(api.url);
  }, [api.id, api.url]);

  const copyPayload = () => {
    if (!result?.data) return;
    navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getFilteredJsonString = () => {
    if (!result?.data) return '';
    if (!searchFilter.trim()) return JSON.stringify(result.data, null, 2);

    try {
      // If array, filter items
      if (Array.isArray(result.data)) {
        const filtered = result.data.filter((item: any) =>
          JSON.stringify(item).toLowerCase().includes(searchFilter.toLowerCase())
        );
        return JSON.stringify(filtered, null, 2);
      }
      return JSON.stringify(result.data, null, 2);
    } catch {
      return JSON.stringify(result.data, null, 2);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">Live Endpoint Console</span>
          <span className="text-xs text-slate-400">· {api.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300">
            {api.method || 'GET'}
          </span>
          <span className="text-[11px] text-slate-400">{api.authType}</span>
        </div>
      </div>

      {/* URL bar */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Endpoint URL..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
        />
        <button
          onClick={() => runRequest(url)}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>Send</span>
        </button>
      </div>

      {/* Status Bar */}
      {result && (
        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                result.ok || result.status === 200
                  ? 'bg-teal-950 text-teal-400 border border-teal-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}
            >
              HTTP {result.status || 'ERR'} {result.statusText}
            </span>
            <span className="text-slate-400 font-mono">
              ⚡ {result.latencyMs} ms
            </span>
            {result.usedProxy && (
              <span className="text-amber-400 text-[11px]">
                🛡️ CORS Bypass Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('json')}
              className={`px-2 py-1 rounded text-[11px] transition-colors ${
                viewMode === 'json' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              JSON
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2 py-1 rounded text-[11px] transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Key-Value
            </button>
          </div>
        </div>
      )}

      {/* Response Data Body */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search keys or values in JSON..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <button
            onClick={copyPayload}
            disabled={!result?.data}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>

        {loading ? (
          <div className="h-64 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
            <span>Transmitting HTTP request...</span>
          </div>
        ) : result?.error ? (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Request Warning: {result.statusText}</span>
            </div>
            <p className="text-[11px] text-rose-300/80">{result.error}</p>
          </div>
        ) : viewMode === 'table' && result?.data && typeof result.data === 'object' ? (
          <div className="max-h-80 overflow-y-auto rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-1.5 px-2">Key Property</th>
                  <th className="py-1.5 px-2">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 font-mono text-[11px]">
                {Object.entries(result.data).slice(0, 25).map(([k, v]) => (
                  <tr key={k} className="hover:bg-slate-900/40">
                    <td className="py-2 px-2 text-teal-400 font-semibold">{k}</td>
                    <td className="py-2 px-2 text-slate-200 truncate max-w-xs">
                      {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <pre className="max-h-80 overflow-auto p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-teal-300 font-mono leading-relaxed select-text">
            {getFilteredJsonString()}
          </pre>
        )}
      </div>
    </div>
  );
};
