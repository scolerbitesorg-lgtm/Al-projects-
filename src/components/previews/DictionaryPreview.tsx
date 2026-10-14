import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { BookOpen, Search, Volume2, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export const DictionaryPreview: React.FC = () => {
  const [word, setWord] = useState<string>('courage');
  const [loading, setLoading] = useState<boolean>(false);
  const [definitionData, setDefinitionData] = useState<any>(null);
  const [rhymes, setRhymes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sampleWords = ['courage', 'serendipity', 'galaxy', 'wisdom', 'freedom', 'innovate'];

  const searchWord = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setDefinitionData(null);
    setRhymes([]);

    try {
      // 1. Fetch word definition from Dictionary API
      const dictRes = await executeApiCall(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(query.trim())}`);
      if (Array.isArray(dictRes.data) && dictRes.data.length > 0) {
        setDefinitionData(dictRes.data[0]);
      } else {
        setError(`"${query}" ka meaning nahi mila.`);
      }

      // 2. Fetch rhyming words from Datamuse
      try {
        const rhymeRes = await executeApiCall(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(query.trim())}&max=8`);
        if (Array.isArray(rhymeRes.data)) {
          setRhymes(rhymeRes.data.map((item: any) => item.word));
        }
      } catch {
        // Rhyme failure is optional
      }
    } catch (err: any) {
      setError(err.message || 'Dictionary lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchWord('courage');
  }, []);

  const playAudio = (audioUrl: string) => {
    if (!audioUrl) return;
    const sound = new Audio(audioUrl);
    sound.play().catch(e => console.log('Audio playback prevented', e));
  };

  const audioObj = definitionData?.phonetics?.find((p: any) => p.audio && p.audio.length > 0);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">Live English Lexicon & Rhyme</span>
        </div>
        <span className="text-xs text-slate-400">DictionaryAPI.dev + Datamuse</span>
      </div>

      {/* Search Input */}
      <div className="mt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchWord(word);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Search English word..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </form>

        <div className="flex items-center gap-1.5 flex-wrap mt-2.5 text-xs">
          <span className="text-slate-400 text-[11px]">Try:</span>
          {sampleWords.map((sw) => (
            <button
              key={sw}
              type="button"
              onClick={() => {
                setWord(sw);
                searchWord(sw);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
            >
              {sw}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
          <span>Looking up definition and phonetics...</span>
        </div>
      ) : definitionData ? (
        <div className="mt-5 space-y-4 max-h-80 overflow-y-auto pr-1">
          {/* Word & Phonetic */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
            <div>
              <h3 className="text-2xl font-bold text-white capitalize">{definitionData.word}</h3>
              {definitionData.phonetic && (
                <p className="text-sm text-teal-400 font-mono mt-0.5">{definitionData.phonetic}</p>
              )}
            </div>
            {audioObj && (
              <button
                onClick={() => playAudio(audioObj.audio)}
                className="p-2.5 rounded-full bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 transition-colors"
                title="Play pronunciation audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Meanings */}
          <div className="space-y-3">
            {definitionData.meanings?.slice(0, 2).map((meaning: any, mIdx: number) => (
              <div key={mIdx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                <span className="italic font-semibold text-teal-300 capitalize text-[13px]">
                  {meaning.partOfSpeech}
                </span>
                <ul className="space-y-2 pl-4 list-disc text-slate-300">
                  {meaning.definitions?.slice(0, 2).map((def: any, dIdx: number) => (
                    <li key={dIdx} className="leading-relaxed">
                      <span>{def.definition}</span>
                      {def.example && (
                        <p className="text-slate-400 italic text-[11px] mt-0.5">
                          "{def.example}"
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Rhyming words */}
          {rhymes.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Rhyming words (via Datamuse):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {rhymes.map((r, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-mono"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
