import React from 'react';
import { Bookmark, Database, Cloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  bookmarkCount: number;
  totalApis: number;
  onFilterBookmarked: () => void;
  activeFilter: string;
  onScrollToSection: (id: string) => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<Props> = ({
  bookmarkCount,
  totalApis,
  onFilterBookmarked,
  activeFilter,
  onScrollToSection,
  onOpenAuth
}) => {
  const { sessionId, cloudSynced } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#080d1a]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element, one line) */}
        <a
          href="/"
          className="text-lg sm:text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="text-teal-400">APIverse</span>
          <span className="text-slate-400 font-light">Studio</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-950/80 border border-teal-800/80 text-teal-300 hidden sm:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>118 Free APIs</span>
          </span>
        </a>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onScrollToSection('catalog')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
          >
            All APIs ({totalApis})
          </button>
          <button
            onClick={() => onScrollToSection('categories')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Categories
          </button>
          <button
            onClick={() => onScrollToSection('interactive-showcase')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Interactive Demos
          </button>
          <button
            onClick={() => onScrollToSection('integration-guide')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Integration Guide
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Saved APIs quick filter button */}
          <button
            onClick={onFilterBookmarked}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
              activeFilter === 'bookmarks'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarkCount > 0 ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Saved</span>
            <span className="font-mono text-[11px] px-1.5 py-0.2 bg-slate-900/60 rounded text-teal-300 tabular-nums">
              {bookmarkCount}
            </span>
          </button>

          {/* Cloud Database Workspace Button */}
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap shrink-0 bg-slate-900 hover:bg-slate-800 text-white border border-teal-500/40 shadow-sm shadow-teal-950/50"
            title="Open Cloud Workspace"
          >
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline font-mono text-[11px] text-teal-300">
              #{sessionId.slice(-5)}
            </span>
            <span className="flex items-center gap-1">
              <span>Saved Storage</span>
              <span className={`w-1.5 h-1.5 rounded-full ${cloudSynced ? 'bg-teal-400 animate-pulse' : 'bg-slate-500'}`} />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
