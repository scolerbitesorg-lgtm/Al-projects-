import React, { useState } from 'react';
import { ApiItem } from '../types/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Share2,
  Download,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { triggerFileDownload, generateReactCode } from '../utils/apiRunner';

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
  api: ApiItem;
  onBackToStudio: () => void;
  onOpenAuth: () => void;
}

export const StandalonePreviewView: React.FC<Props> = ({
  api,
  onBackToStudio,
  onOpenAuth
}) => {
  const { isAuthenticated, recordDownload } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodeDrawer, setShowCodeDrawer] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  const shareUrl = `${window.location.origin}${window.location.pathname}?api=${api.id}&standalone=true`;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadCode = () => {
    const filename = `${api.componentName}.tsx`;
    const code = generateReactCode(api);
    triggerFileDownload(filename, code);
    recordDownload(api.componentName);
  };

  const handleCopyCode = () => {
    const code = generateReactCode(api);
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const embedCodeSnippet = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" style="border-radius: 16px; border: 1px solid #1e293b;" allowfullscreen></iframe>`;

  const renderComponent = () => {
    switch (api.customPreviewType) {
      case 'quiz': return <TriviaQuizPreview />;
      case 'pincode': return <IndiaPincodePreview />;
      case 'dictionary': return <DictionaryPreview />;
      case 'weather': return <WeatherForecastPreview />;
      case 'country': return <CountryExplorerPreview />;
      case 'pokemon': return <PokeDexPreview />;
      case 'fakestore': return <FakeStorePreview />;
      case 'currency': return <CurrencyConverterPreview />;
      case 'qr': return <QrGeneratorPreview />;
      case 'color': return <ColorPalettePreview />;
      case 'joke': return <OfficialJokePreview />;
      case 'randomuser': return <RandomUserPreview />;
      case 'robohash': return <RoboHashPreview />;
      case 'iss': return <IssTrackerPreview />;
      case 'httpcat': return <HttpCatPreview />;
      case 'numbers': return <NumbersTriviaPreview />;
      case 'factquote': return <FactsQuotePreview api={api} />;
      default: return <UniversalSmartPreview api={api} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Floating Control Bar */}
      <header className="sticky top-0 z-40 bg-[#0d1424]/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Back button */}
          <button
            onClick={onBackToStudio}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Full Catalog</span>
            <span className="sm:hidden">Studio</span>
          </button>

          {/* Title & Metadata */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl p-1.5 rounded-lg bg-slate-900 shrink-0">
              {api.categoryIcon}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white truncate">{api.name}</h1>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">{api.description}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyShareLink}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                copiedLink
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
              }`}
              title="Copy direct shareable link for this standalone preview"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={() => setShowCodeDrawer(!showCodeDrawer)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 hidden md:flex items-center gap-1.5 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-teal-400" />
              <span>{showCodeDrawer ? 'Hide Code' : 'View Code'}</span>
            </button>

            <button
              onClick={handleDownloadCode}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 flex items-center gap-1.5 transition-colors"
              title="Download Component (.tsx)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">.tsx</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Preview Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center justify-center">
        {/* Share Notice Banner */}
        <div className="w-full max-w-xl mb-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 min-w-0">
            <Share2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="truncate">Direct link active: Anyone opening this URL views this preview directly.</span>
          </div>
          <button
            onClick={() => setShowEmbedCode(!showEmbedCode)}
            className="text-[11px] text-teal-400 hover:underline shrink-0 ml-2"
          >
            {showEmbedCode ? 'Hide Embed' : 'Get Embed Code'}
          </button>
        </div>

        {/* Embed code snippet box if opened */}
        {showEmbedCode && (
          <div className="w-full max-w-xl mb-4 p-3.5 rounded-xl bg-slate-950 border border-teal-500/40 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Embed in your website or portfolio:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(embedCodeSnippet);
                }}
                className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy iFrame</span>
              </button>
            </div>
            <pre className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-teal-300 overflow-x-auto">
              {embedCodeSnippet}
            </pre>
          </div>
        )}

        <div className="w-full flex justify-center">
          {renderComponent()}
        </div>

        {/* Code Drawer Overlay */}
        {showCodeDrawer && (
          <div className="w-full max-w-2xl mt-6 rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">{api.componentName}.tsx</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadCode}
                  className="px-3 py-1 text-xs rounded-lg bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download .tsx</span>
                </button>
              </div>
            </div>
            <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-slate-200 max-h-72 overflow-y-auto leading-relaxed select-text">
              <code>{generateReactCode(api)}</code>
            </pre>
          </div>
        )}
      </main>

      {/* Footer bar */}
      <footer className="border-t border-slate-800/80 bg-[#060a14] py-4 px-6 text-xs text-slate-500 text-center">
        <span>Powered by APIverse Studio · Single-link shareable on Vercel or any web host</span>
      </footer>
    </div>
  );
};
