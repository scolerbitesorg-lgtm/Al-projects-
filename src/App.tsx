import React, { useState, useMemo, useEffect } from 'react';
import { ALL_APIS, API_CATEGORIES } from './data/apiData';
import { ApiItem } from './types/api';
import { Header } from './components/Header';
import { ApiCard } from './components/ApiCard';
import { ApiModal } from './components/ApiModal';
import { SavedWorkspaceModal } from './components/SavedWorkspaceModal';
import { StandalonePreviewView } from './components/StandalonePreviewView';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  Search,
  Sparkles,
  Download,
  Terminal,
  Play,
  Layers,
  Bookmark,
  Share2,
  Database,
  CheckCircle2,
  Code2,
  Globe
} from 'lucide-react';

function AppContent() {
  const { bookmarkedIds, toggleBookmark, sessionId, cloudSynced } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterMode, setFilterMode] = useState<'all' | 'interactive' | 'bookmarks'>('all');

  // Modal and Standalone states
  const [activeModalApi, setActiveModalApi] = useState<ApiItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'preview' | 'console' | 'code'>('preview');
  const [standaloneApi, setStandaloneApi] = useState<ApiItem | null>(null);

  // Saved Workspace Modal state
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // Deep Link URL detection on load and on popstate (Vercel & sharing support)
  useEffect(() => {
    const checkUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const apiId = params.get('api');
      const isStandalone = params.get('standalone') === 'true';

      if (apiId) {
        const matched = ALL_APIS.find((a) => a.id === apiId);
        if (matched) {
          if (isStandalone) {
            setStandaloneApi(matched);
            setActiveModalApi(null);
          } else {
            setActiveModalApi(matched);
            setActiveModalTab('preview');
          }
        }
      }
    };

    checkUrlParams();
    window.addEventListener('popstate', checkUrlParams);
    return () => window.removeEventListener('popstate', checkUrlParams);
  }, []);

  // Open standalone fullscreen preview and sync URL
  const handleOpenStandalone = (api: ApiItem) => {
    setStandaloneApi(api);
    setActiveModalApi(null);
    const newUrl = `${window.location.pathname}?api=${api.id}&standalone=true`;
    window.history.pushState({ api: api.id, standalone: true }, '', newUrl);
  };

  // Back from standalone to studio catalog and clean URL
  const handleBackToStudio = () => {
    setStandaloneApi(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  // Open Modal and update URL
  const handleOpenModal = (api: ApiItem, tab: 'preview' | 'console' | 'code' = 'preview') => {
    setActiveModalApi(api);
    setActiveModalTab(tab);
    const newUrl = `${window.location.pathname}?api=${api.id}`;
    window.history.pushState({ api: api.id }, '', newUrl);
  };

  const handleCloseModal = () => {
    setActiveModalApi(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  // Filtered APIs across 118 items and 13 categories
  const filteredApis = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return ALL_APIS.filter((api) => {
      if (selectedCategory !== 'All' && api.category !== selectedCategory) {
        return false;
      }

      if (filterMode === 'bookmarks' && !bookmarkedIds.includes(api.id)) {
        return false;
      }
      if (filterMode === 'interactive' && (!api.customPreviewType || api.customPreviewType === 'universal')) {
        return false;
      }

      if (!q) return true;

      const inName = api.name.toLowerCase().includes(q);
      const inDesc = api.description.toLowerCase().includes(q);
      const inEngDesc = api.englishDesc.toLowerCase().includes(q);
      const inCategory = api.category.toLowerCase().includes(q);
      const inTags = api.tags.some((t) => t.toLowerCase().includes(q));
      const inUrl = api.url.toLowerCase().includes(q);

      return inName || inDesc || inEngDesc || inCategory || inTags || inUrl;
    });
  }, [searchQuery, selectedCategory, filterMode, bookmarkedIds]);

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If in Standalone Mode, render the isolated fullscreen preview view directly!
  if (standaloneApi) {
    return (
      <div className="min-h-screen bg-[#080d1a]">
        <StandalonePreviewView
          api={standaloneApi}
          onBackToStudio={handleBackToStudio}
          onOpenAuth={() => setIsWorkspaceModalOpen(true)}
        />
        <SavedWorkspaceModal
          isOpen={isWorkspaceModalOpen}
          onClose={() => setIsWorkspaceModalOpen(false)}
          onSelectApi={(api) => handleOpenStandalone(api)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Bar Navigation */}
      <Header
        bookmarkCount={bookmarkedIds.length}
        totalApis={ALL_APIS.length}
        activeFilter={filterMode}
        onFilterBookmarked={() => {
          setFilterMode((m) => (m === 'bookmarks' ? 'all' : 'bookmarks'));
          setSelectedCategory('All');
        }}
        onScrollToSection={handleScrollToSection}
        onOpenAuth={() => setIsWorkspaceModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-8 pt-10 pb-10 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-800/80 text-teal-300 text-xs font-medium">
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span>Zero-Login Cloud Sync Active · Workspace #{sessionId.slice(-5)}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              118+ Free Public APIs with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300">
                Live Previews & Code Export
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Sabhi 118 APIs ko test karo, live working UI preview chalao aur direct single{' '}
              <span className="text-teal-300 font-semibold">.tsx React component</span> download karo. Kisi bhi preview ko bina redeploy kiye single link se share kar sakte ho!
            </p>

            {/* Zero-Pill KPI Strip */}
            <div className="pt-2 flex items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 flex-wrap">
              <span><strong>118</strong> Endpoints</span>
              <span aria-hidden="true">·</span>
              <span><strong>13</strong> Categories</span>
              <span aria-hidden="true">·</span>
              <span className="text-teal-400">100% Free / No Keys Required</span>
              <span aria-hidden="true">·</span>
              <span>1-Click .tsx Download</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">Instant Link Sharing</span>
            </div>

            {/* Spotlight Fast Launchers */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto text-left">
              {[
                { id: 'opentdb', icon: '🧠', title: 'Trivia Quiz Arena', sub: 'MCQ Challenge' },
                { id: 'postal-pincode', icon: '🇮🇳', title: 'Postal PIN Code', sub: 'All India Lookup' },
                { id: 'open-meteo', icon: '🌦️', title: 'Live Weather Radar', sub: 'Forecast & AQI' },
                { id: 'pokeapi', icon: '⚡', title: 'Pokédex Database', sub: 'Pokemon Stats' },
              ].map((spot) => {
                const targetApi = ALL_APIS.find((a) => a.id === spot.id);
                return (
                  <button
                    key={spot.id}
                    onClick={() => targetApi && handleOpenStandalone(targetApi)}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left flex items-center gap-2.5 group"
                  >
                    <span className="text-xl p-1.5 rounded-lg bg-slate-950 shrink-0">
                      {spot.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-teal-300 truncate">
                        {spot.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{spot.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalog" className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-6">
          {/* Search Bar & Mode Toggles */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 118 APIs by name, Hinglish use, category, or URL..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0d1424] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 transition-colors shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3.5 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Mode Selector */}
            <div className="flex items-center gap-1 p-1 bg-[#0d1424] rounded-xl border border-slate-800 shrink-0 overflow-x-auto">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  filterMode === 'all'
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All APIs ({ALL_APIS.length})
              </button>

              <button
                onClick={() => setFilterMode('interactive')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  filterMode === 'interactive'
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Interactive Widgets
              </button>

              <button
                onClick={() => setFilterMode('bookmarks')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  filterMode === 'bookmarks'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Saved in Cloud ({bookmarkedIds.length})
              </button>
            </div>
          </div>

          {/* 13 Category Tabs */}
          <div id="categories" className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              All Categories ({ALL_APIS.length})
            </button>

            {API_CATEGORIES.map((cat) => {
              const count = ALL_APIS.filter((a) => a.category === cat.name).length;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                    selectedCategory === cat.name
                      ? 'bg-teal-500 text-slate-950 font-semibold'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="font-mono text-[11px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Status summary */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white font-mono">{filteredApis.length}</strong> APIs
              {selectedCategory !== 'All' && <span> in {selectedCategory}</span>}
              {filterMode === 'bookmarks' && <span> (Bookmarked in Cloud)</span>}
              {filterMode === 'interactive' && <span> (Interactive UI)</span>}
            </span>

            {searchQuery && (
              <span className="text-teal-400 truncate max-w-xs">
                Matches for "{searchQuery}"
              </span>
            )}
          </div>

          {/* API Grid */}
          {filteredApis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApis.map((api) => (
                <ApiCard
                  key={api.id}
                  api={api}
                  isBookmarked={bookmarkedIds.includes(api.id)}
                  onToggleBookmark={toggleBookmark}
                  onOpenModal={handleOpenModal}
                  onOpenStandalone={handleOpenStandalone}
                  onOpenAuth={() => setIsWorkspaceModalOpen(true)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 p-8">
              <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Koi matching API nahi mili</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Search query ya category filters badal kar dobara koshish karein.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setFilterMode('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-semibold hover:bg-teal-400 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* Integration & Direct Sharing Guide Section */}
        <section id="integration-guide" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto border-t border-slate-800/80 mt-12">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Vercel Deployment & Standalone Link Sharing
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Aap is app ko Vercel ya kisi bhi hosting par deploy karein toh har ek API ka preview bina kisi registration ke single shareable URL se share ho sakta hai!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-semibold text-white text-sm">1-Click Share Link</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kisi bhi card par <strong>Share</strong> button dabate hi unique URL copy hota hai jaise <code>?api=opentdb&standalone=true</code>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-semibold text-white text-sm">Fullscreen Standalone View</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Jise link share karenge, wo seedha us specific API ke clean fullscreen preview canvas par land karega.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-semibold text-white text-sm">Download Single Code File</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Preview ke upar <strong>Download .tsx</strong> button se seedha single component file download karke apne project me use karein.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060a14] py-8 px-4 sm:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-300">APIverse Studio</span> · 118 Free Public APIs Catalog & Code Export Hub
          </div>
          <div className="text-[11px] text-slate-500">
            Open-source public endpoints · Zero-Login Firestore Cloud Storage · Standalone React client
          </div>
        </div>
      </footer>

      {/* Detail & Preview Modal */}
      {activeModalApi && (
        <ApiModal
          api={activeModalApi}
          initialTab={activeModalTab}
          isBookmarked={bookmarkedIds.includes(activeModalApi.id)}
          onToggleBookmark={toggleBookmark}
          onOpenStandalone={handleOpenStandalone}
          onOpenAuth={() => setIsWorkspaceModalOpen(true)}
          onClose={handleCloseModal}
        />
      )}

      {/* Saved Cloud Workspace Modal */}
      <SavedWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onSelectApi={(api) => handleOpenModal(api, 'preview')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
