import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ALL_APIS } from '../data/apiData';
import { ApiItem } from '../types/api';
import {
  X,
  Bookmark,
  Database,
  Download,
  Trash2,
  ExternalLink,
  Play,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectApi?: (api: ApiItem) => void;
}

export const SavedWorkspaceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectApi
}) => {
  const {
    sessionId,
    bookmarkedIds,
    downloadedComponents,
    toggleBookmark,
    clearAllBookmarks,
    cloudSynced
  } = useAuth();

  if (!isOpen) return null;

  const savedApis = ALL_APIS.filter((api) => bookmarkedIds.includes(api.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#090e1a] border border-slate-700/70 shadow-2xl shadow-teal-950/40 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Glow Header Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-indigo-500 to-amber-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0d1424]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  My Cloud Workspace
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-950 border border-teal-800 text-teal-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  <span>{cloudSynced ? 'Firestore Synced' : 'Database Connected'}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Aapka personal saved content Firestore database me isolated store hota hai
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Info Strip */}
        <div className="px-5 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Device ID:</span>
            <code className="text-teal-400 font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {sessionId}
            </code>
          </div>
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-white">{bookmarkedIds.length}</strong> Saved APIs
            </span>
            <span>·</span>
            <span>
              <strong className="text-white">{downloadedComponents.length}</strong> Exports
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Section 1: Bookmarked APIs */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>Saved APIs ({savedApis.length})</span>
              </h4>
              {savedApis.length > 0 && (
                <button
                  onClick={clearAllBookmarks}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {savedApis.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">Abhi tak koi API save nahi ki gayi hai</p>
                <p className="text-[11px] text-slate-500">
                  Kisi bhi API card par Bookmark icon dabayein, wo turant aapke is database record me save ho jayegi.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedApis.map((api) => (
                  <div
                    key={api.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0">{api.categoryIcon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-white text-xs truncate">{api.name}</h5>
                          <span className="text-[10px] text-slate-400 font-mono">({api.category})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-sm">
                          {api.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {onSelectApi && (
                        <button
                          onClick={() => {
                            onSelectApi(api);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Preview</span>
                        </button>
                      )}
                      <button
                        onClick={() => toggleBookmark(api.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Downloaded Components History */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Downloaded Code Files ({downloadedComponents.length})</span>
            </h4>

            {downloadedComponents.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-500">
                Aapne abhi tak koi component code file download nahi ki hai. Preview modal me 'Download Code' dabane par yahan history save hoti hai.
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap gap-1.5">
                {downloadedComponents.map((comp: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-teal-500/30 text-teal-300 font-mono text-[11px] flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-teal-400" />
                    <span>{comp}.tsx</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cloud Database Explanation Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-950/30 to-indigo-950/30 border border-teal-900/50 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-teal-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero-Login Persistence</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Koi registration ya login ki zaroorat nahi hai. Har user ke bookmarks aur downloaded codes Firebase Firestore me unke unique device session me isolated save rehte hain.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0d1424] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Firestore DB: ai-studio-apiverse...
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
