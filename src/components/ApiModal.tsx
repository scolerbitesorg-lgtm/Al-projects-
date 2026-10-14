import React, { useState, useEffect } from 'react';
import { ApiItem } from '../types/api';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Play,
  Terminal,
  Code2,
  Download,
  Copy,
  Check,
  Bookmark,
  Share2,
  ExternalLink,
  Sparkles,
  Maximize2,
  Lock
} from 'lucide-react';
import {
  generateReactCode,
  generateFetchCode,
  generateCurlCode,
  generatePythonCode,
  triggerFileDownload
} from '../utils/apiRunner';

// Previews
import { TriviaQuizPreview } from './previews/TriviaQuizPreview';
import { IndiaPincodePreview } from './previews/IndiaPincodePreview';
import { DictionaryPreview } from './previews/DictionaryPreview';
import { WeatherForecastPreview } from './previews/WeatherForecastPreview';
import { CountryExplorerPreview } from './previews/CountryExplorerPreview';
import { PokeDexPreview } from './previews/PokeDexPreview';
import { FakeStorePreview } from './previews/FakeStorePreview';
import { CurrencyConverterPreview } from './previews/CurrencyConverterPreview';
import { QrGeneratorPreview } from './previews/QrGeneratorPreview';
import { ColorPalettePreview } from './previews/ColorPalettePreview';
import { OfficialJokePreview } from './previews/OfficialJokePreview';
import { RandomUserPreview } from './previews/RandomUserPreview';
import { RoboHashPreview } from './previews/RoboHashPreview';
import { IssTrackerPreview } from './previews/IssTrackerPreview';
import { HttpCatPreview } from './previews/HttpCatPreview';
import { NumbersTriviaPreview } from './previews/NumbersTriviaPreview';
import { FactsQuotePreview } from './previews/FactsQuotePreview';
import { UniversalSmartPreview } from './previews/UniversalSmartPreview';

interface Props {
  api: ApiItem | null;
  initialTab?: 'preview' | 'console' | 'code';
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onOpenStandalone: (api: ApiItem) => void;
  onOpenAuth: (apiName?: string) => void;
  onClose: () => void;
}

export const ApiModal: React.FC<Props> = ({
  api,
  initialTab = 'preview',
  isBookmarked,
  onToggleBookmark,
  onOpenStandalone,
  onOpenAuth,
  onClose
}) => {
  const { isAuthenticated, recordDownload } = useAuth();
  const [activeTab, setActiveTab] = useState<'preview' | 'console' | 'code'>(initialTab);
  const [codeLang, setCodeLang] = useState<'react' | 'fetch' | 'curl' | 'python'>('react');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, api?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!api) return null;

  const getCodeSnippet = () => {
    switch (codeLang) {
      case 'react':
        return generateReactCode(api);
      case 'fetch':
        return generateFetchCode(api);
      case 'curl':
        return generateCurlCode(api);
      case 'python':
        return generatePythonCode(api);
      default:
        return generateReactCode(api);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(api.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1500);
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?api=${api.id}&standalone=true`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleDownloadCode = () => {
    const ext = codeLang === 'react' ? 'tsx' : codeLang === 'fetch' ? 'js' : codeLang === 'python' ? 'py' : 'sh';
    const filename = `${api.componentName}.${ext}`;
    const content = getCodeSnippet();
    triggerFileDownload(filename, content);
    recordDownload(api.componentName);
  };

  const renderPreviewComponent = () => {
    switch (api.customPreviewType) {
      case 'quiz':
        return <TriviaQuizPreview />;
      case 'pincode':
        return <IndiaPincodePreview />;
      case 'dictionary':
        return <DictionaryPreview />;
      case 'weather':
        return <WeatherForecastPreview />;
      case 'country':
        return <CountryExplorerPreview />;
      case 'pokemon':
        return <PokeDexPreview />;
      case 'fakestore':
        return <FakeStorePreview />;
      case 'currency':
        return <CurrencyConverterPreview />;
      case 'qr':
        return <QrGeneratorPreview />;
      case 'color':
        return <ColorPalettePreview />;
      case 'joke':
        return <OfficialJokePreview />;
      case 'randomuser':
        return <RandomUserPreview />;
      case 'robohash':
        return <RoboHashPreview />;
      case 'iss':
        return <IssTrackerPreview />;
      case 'httpcat':
        return <HttpCatPreview />;
      case 'numbers':
        return <NumbersTriviaPreview />;
      case 'factquote':
        return <FactsQuotePreview api={api} />;
      default:
        return <UniversalSmartPreview api={api} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0d1424] border border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl p-2 rounded-xl bg-slate-800/80 shrink-0">
              {api.categoryIcon}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white truncate">{api.name}</h2>
                {api.isPremium && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-1.5 py-0.2 rounded shrink-0">
                    PRO
                  </span>
                )}
                <span className="text-[11px] font-mono text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded shrink-0">
                  {api.authType}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">{api.category} · {api.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            {/* Prominent Copy Link Button */}
            <button
              onClick={handleCopyShareLink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                copiedShare
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-emerald-500/20'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
              }`}
              title="Copy direct shareable preview URL to clipboard"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShare ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenStandalone(api);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Open in Fullscreen Standalone View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleBookmark(api.id)}
              className={`p-2 rounded-xl transition-colors ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Add to Bookmarks'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-950 border-b border-slate-800 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'preview'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Interactive Live Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('console')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'console'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Live Test Console</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'code'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code & Download (.tsx)</span>
            </button>
          </div>

          <button
            onClick={handleCopyEndpoint}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 transition-colors"
            title="Copy API endpoint URL"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'Copied' : 'Copy Endpoint'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-teal-400 shrink-0">{api.method || 'GET'}</span>
                  <span className="font-mono text-slate-400 truncate">{api.url}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <button
                    onClick={handleCopyShareLink}
                    className="flex items-center gap-1 text-teal-400 hover:text-teal-300 transition-colors font-medium"
                    title="Copy direct shareable preview URL"
                  >
                    {copiedShare ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                    <span>{copiedShare ? 'Link Copied!' : 'Copy Share Link'}</span>
                  </button>
                  <a
                    href={api.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <span>Raw Endpoint</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {renderPreviewComponent()}
            </div>
          )}

          {activeTab === 'console' && (
            <UniversalSmartPreview api={api} />
          )}

          {activeTab === 'code' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {/* Language Switcher & Download CTA */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
                <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setCodeLang('react')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      codeLang === 'react'
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    React (.tsx)
                  </button>
                  <button
                    onClick={() => setCodeLang('fetch')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      codeLang === 'fetch'
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Fetch (JS)
                  </button>
                  <button
                    onClick={() => setCodeLang('curl')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      codeLang === 'curl'
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setCodeLang('python')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      codeLang === 'python'
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Python
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={handleDownloadCode}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1.5 transition-colors shadow-lg shadow-teal-500/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File ({codeLang === 'react' ? '.tsx' : `.${codeLang === 'fetch' ? 'js' : codeLang === 'python' ? 'py' : 'sh'}`})</span>
                  </button>
                </div>
              </div>

              {/* Code Box */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 text-xs">
                  <span className="font-mono text-slate-400">
                    {codeLang === 'react' ? `${api.componentName}.tsx` : `${api.id}.${codeLang}`}
                  </span>
                  <span className="text-[11px] text-teal-400">100% Production Ready</span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[55vh] leading-relaxed select-text">
                  <code>{getCodeSnippet()}</code>
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-800/40 text-xs text-teal-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <p>
                  Yeh drop-in React component bina kisi external setup ke direct kaam karega. Download button se file leke apne project ke <code>src/components/</code> me rakh lo aur seedha <code>&lt;{api.componentName} /&gt;</code> import kar lo.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
