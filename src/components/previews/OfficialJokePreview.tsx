import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { Laugh, Sparkles, RefreshCw, Eye, ThumbsUp } from 'lucide-react';

export const OfficialJokePreview: React.FC = () => {
  const [joke, setJoke] = useState<{ setup: string; punchline: string; type: string } | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [reaction, setReaction] = useState<string | null>(null);

  const fetchJoke = async () => {
    setLoading(true);
    setRevealed(false);
    setReaction(null);
    try {
      const res = await executeApiCall('https://official-joke-api.appspot.com/random_joke');
      if (res.data?.setup) {
        setJoke(res.data);
      } else {
        // Chuck norris joke fallback
        const chuckRes = await executeApiCall('https://api.chucknorris.io/jokes/random');
        if (chuckRes.data?.value) {
          setJoke({
            setup: 'Chuck Norris Fact:',
            punchline: chuckRes.data.value,
            type: 'satire'
          });
          setRevealed(true);
        } else {
          setJoke({
            setup: 'Why do programmers prefer dark mode?',
            punchline: 'Because light attracts bugs!',
            type: 'programming'
          });
        }
      }
    } catch {
      setJoke({
        setup: 'Why do programmers prefer dark mode?',
        punchline: 'Because light attracts bugs!',
        type: 'programming'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Laugh className="w-5 h-5 text-amber-400" />
          <span className="font-semibold text-white">Punchline Joke Engine</span>
        </div>
        <button
          onClick={fetchJoke}
          disabled={loading}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="New Joke"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-14 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
          <span>Generating punchline joke...</span>
        </div>
      ) : joke ? (
        <div className="mt-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {joke.type} joke
            </span>

            <h3 className="text-base font-medium text-white leading-relaxed">
              "{joke.setup}"
            </h3>

            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="mt-3 w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-teal-500/10"
              >
                <Eye className="w-4 h-4" />
                <span>Reveal Punchline 👀</span>
              </button>
            ) : (
              <div className="pt-3 border-t border-slate-800/80 animate-in fade-in duration-300">
                <p className="text-sm font-bold text-teal-300 leading-relaxed">
                  👉 {joke.punchline}
                </p>

                {/* Reaction buttons */}
                <div className="flex items-center justify-between pt-3 text-xs text-slate-400">
                  <span>React:</span>
                  <div className="flex gap-2 text-base">
                    {['😂', '🤣', '💀', '👏', '🔥'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setReaction(emoji)}
                        className={`p-1.5 rounded-lg hover:bg-slate-800 transition-transform hover:scale-125 ${
                          reaction === emoji ? 'bg-slate-800 ring-1 ring-teal-400' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={fetchJoke}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next Joke</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
