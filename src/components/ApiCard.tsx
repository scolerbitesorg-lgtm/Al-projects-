import React, { useState } from 'react';
import { ApiItem } from '../types/api';
import { Play, Code2, Copy, Check, Bookmark, RefreshCw, Share2, Maximize2 } from 'lucide-react';
import { executeApiCall } from '../utils/apiRunner';

interface Props {
  api: ApiItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onOpenModal: (api: ApiItem, tab: 'preview' | 'console' | 'code') => void;
  onOpenStandalone: (api: ApiItem) => void;
  onOpenAuth: (apiName?: string) => void;
}

export const ApiCard: React.FC<Props> = ({
  api,
  isBookmarked,
  onToggleBookmark,
  onOpenModal,
  onOpenStandalone
}) => {
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [inlineTesting, setInlineTesting] = useState<boolean>(false);
  const [inlineResult, setInlineResult] = useState<{ status: number; latency: number; ok: boolean } | null>(null);

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(api.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1200);
  };

  const handleCopyShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?api=${api.id}&standalone=true`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 1500);
  };

  const handleFastTest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setInlineTesting(true);
    try {
      const res = await executeApiCall(api.url, api.method || 'GET');
      setInlineResult({
        status: res.status,
        latency: res.latencyMs,
        ok: res.ok || res.status === 200
      });
    } catch {
      setInlineResult({ status: 0, latency: 0, ok: false });
    } finally {
      setInlineTesting(false);
    }
  };

  return (
    <article className="group relative rounded-2xl bg-[#0f172a] border border-slate-800/90 p-5 hover:border-slate-700 hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header: Title, Category & Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
              {api.categoryIcon}
            </span>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-white text-base group-hover:text-teal-300 transition-colors">
                  {api.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{api.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-teal-400/90 font-mono text-[11px]">{api.authType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyShare}
              className="p-2 rounded-xl text-slate-500 hover:text-teal-300 hover:bg-slate-800/80 transition-colors"
              title={copiedShare ? 'Share link copied!' : 'Copy direct share link for this preview'}
            >
              {copiedShare ? <Check className="w-4 h-4 text-teal-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onToggleBookmark(api.id)}
              className={`p-2 rounded-xl transition-colors ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/80'
              }`}
              title={isBookmarked ? 'Saved in your Cloud Workspace' : 'Save to your Cloud Workspace'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hinglish Usage Description */}
        <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {api.description}
        </p>

        {/* Tags Metadata */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-[11px] text-slate-400">
          {api.tags.slice(0, 4).map((tag, idx) => (
            <React.Fragment key={tag}>
              {idx > 0 && <span aria-hidden="true" className="text-slate-600">·</span>}
              <span className="text-slate-400 hover:text-slate-200">#{tag}</span>
            </React.Fragment>
          ))}
        </div>

        {/* URL Box */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
          <span className="text-teal-400/90 truncate select-all">{api.url}</span>
          <button
            onClick={handleCopyUrl}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Copy URL"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Inline Ping Result Badge if tested */}
        {inlineResult && (
          <div className="mt-2 flex items-center gap-2 text-[11px] font-mono">
            <span
              className={`px-2 py-0.5 rounded ${
                inlineResult.ok
                  ? 'bg-teal-950 text-teal-400 border border-teal-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}
            >
              HTTP {inlineResult.status || 'ERR'}
            </span>
            <span className="text-slate-400">⚡ {inlineResult.latency}ms</span>
          </div>
        )}
      </div>

      {/* Action Buttons Row - Fully Unlocked */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onOpenModal(api, 'preview')}
          className="flex-1 py-2 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Live Preview</span>
        </button>

        <button
          onClick={() => onOpenStandalone(api)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          title="Open in Fullscreen Standalone View (Shareable)"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleFastTest}
          disabled={inlineTesting}
          className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
          title="Fast HTTP Ping Test"
        >
          <RefreshCw className={`w-3 h-3 ${inlineTesting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Test</span>
        </button>

        <button
          onClick={() => onOpenModal(api, 'code')}
          className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Download React Component (.tsx)"
        >
          <Code2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Code</span>
        </button>
      </div>
    </article>
  );
};
