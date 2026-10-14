import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { Sparkles, Copy, Check, Volume2, RefreshCw, Loader2, Quote, Languages } from 'lucide-react';
import { ApiItem } from '../../types/api';

interface Props {
  api?: ApiItem;
}

const HINDI_WISDOM_QUOTES = [
  { text: "सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।", author: "डॉ. ए. पी. जे. अब्दुल कलाम" },
  { text: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।", author: "स्वामी विवेकानंद" },
  { text: "कर्म करो, फल की चिंता मत करो। आत्मा अमर है, निरंतर आगे बढ़ते रहो।", author: "श्रीमद्भगवद्गीता" },
  { text: "शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।", author: "नेल्सन मंडेला" },
  { text: "गलतियां इस बात का प्रमाण हैं कि आप प्रयास कर रहे हैं।", author: "अल्बर्ट आइंस्टीन" },
  { text: "मनुष्य अपने विचारों से निर्मित एक प्राणी है, वह जैसा सोचता है, वैसा ही बन जाता है।", author: "महात्मा गांधी" },
  { text: "जो व्यक्ति कभी गलती नहीं करता, उसने कभी कुछ नया करने की कोशिश नहीं की।", author: "अल्बर्ट आइंस्टीन" },
  { text: "धैर्य और निरंतर प्रयास ही किसी भी बड़ी सफलता की असली कुंजी है।", author: "चाणक्य नीति" }
];

export const FactsQuotePreview: React.FC<Props> = ({ api }) => {
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [content, setContent] = useState<{ text: string; author?: string; extra?: string }>({
    text: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);

  const fetchFactOrQuote = async (lang: 'hi' | 'en' = language) => {
    setLoading(true);
    setCopied(false);

    if (lang === 'hi') {
      const random = HINDI_WISDOM_QUOTES[Math.floor(Math.random() * HINDI_WISDOM_QUOTES.length)];
      setContent({ text: random.text, author: random.author });
      setLoading(false);
      return;
    }

    const targetUrl = api?.url || 'https://uselessfacts.jsph.pl/api/v2/facts/random';

    try {
      const res = await executeApiCall(targetUrl);
      if (res.data) {
        if (typeof res.data === 'string') {
          setContent({ text: res.data });
        } else if (res.data.text) {
          setContent({ text: res.data.text, author: res.data.source });
        } else if (res.data.quote) {
          setContent({ text: res.data.quote, author: res.data.author });
        } else if (res.data.fact) {
          setContent({ text: res.data.fact });
        } else if (res.data.facts && Array.isArray(res.data.facts)) {
          setContent({ text: res.data.facts[0] });
        } else if (res.data.slip?.advice) {
          setContent({ text: res.data.slip.advice, author: 'Life Wisdom' });
        } else if (res.data.activity) {
          setContent({ text: `Boredom Buster: ${res.data.activity}`, extra: `Category: ${res.data.type} · Participants: ${res.data.participants}` });
        } else if (res.data.answer) {
          setContent({ text: `Decision: ${res.data.answer.toUpperCase()}`, extra: res.data.image });
        } else if (res.data.insult) {
          setContent({ text: res.data.insult });
        } else if (res.data.value) {
          setContent({ text: res.data.value, author: 'Chuck Norris' });
        } else if (Array.isArray(res.data) && res.data[0]?.q) {
          setContent({ text: res.data[0].q, author: res.data[0].a });
        } else {
          setContent({ text: JSON.stringify(res.data, null, 2) });
        }
      }
    } catch {
      setContent({
        text: 'The only true wisdom is in knowing you know nothing.',
        author: 'Socrates'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactOrQuote(language);
  }, [api?.url, language]);

  const copyToClipboard = () => {
    const txt = content.author ? `"${content.text}" — ${content.author}` : content.text;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(content.text);
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
      }
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const isHi = language === 'hi';

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">
            {isHi ? 'दैनिक विचार व रोचक तथ्य' : api?.name || 'Live Fact & Wisdom Dispenser'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                isHi ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                !isHi ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => fetchFactOrQuote(language)}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isHi ? 'नया विचार लोड करें' : 'New fact'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {/* Card */}
        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 min-h-36 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-3 right-4 opacity-10">
            <Quote className="w-16 h-16 text-teal-400" />
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
              <span>{isHi ? 'विचार लोड हो रहा है...' : 'Fetching wisdom from the cloud...'}</span>
            </div>
          ) : (
            <div className="relative z-10 space-y-3">
              <p className="text-base text-slate-100 font-medium leading-relaxed italic">
                "{content.text}"
              </p>

              {content.author && (
                <div className="text-xs text-teal-400 font-semibold text-right">
                  — {content.author}
                </div>
              )}

              {content.extra && (
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  {content.extra.startsWith('http') ? (
                    <img src={content.extra} alt="Reaction GIF" className="max-h-40 rounded-lg mx-auto mt-2" />
                  ) : (
                    content.extra
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isHi ? 'कॉपी हो गया' : 'Copied') : (isHi ? 'कॉपी करें' : 'Copy')}</span>
            </button>

            {'speechSynthesis' in window && (
              <button
                onClick={speakText}
                className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                  speaking
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title={isHi ? 'आवाज में सुनें' : 'Listen speech'}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isHi ? 'सुनें' : 'Listen'}</span>
              </button>
            )}
          </div>

          <button
            onClick={() => fetchFactOrQuote(language)}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHi ? 'अगला विचार' : 'Generate Next'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
