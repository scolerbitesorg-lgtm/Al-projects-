import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { HINDI_QUESTIONS_BANK, HindiQuestion } from '../../data/hindiQuestions';
import { RefreshCw, CheckCircle2, XCircle, Award, ArrowRight, Languages } from 'lucide-react';

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  options: string[];
  category: string;
  difficulty: string;
}

export const TriviaQuizPreview: React.FC = () => {
  const [language, setLanguage] = useState<'hi' | 'en'>('hi'); // Default Hindi for user preference!
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState<number>(0);

  const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const loadQuestions = async (lang: 'hi' | 'en' = language) => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);

    if (lang === 'hi') {
      // Load Hindi questions shuffled
      const shuffled = [...HINDI_QUESTIONS_BANK]
        .sort(() => Math.random() - 0.5)
        .map((q) => {
          const opts = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
          return {
            question: q.question,
            correct_answer: q.correct_answer,
            incorrect_answers: q.incorrect_answers,
            options: opts,
            category: q.category,
            difficulty: q.difficulty
          };
        });
      setQuestions(shuffled);
      setCurrentIndex(0);
      setLoading(false);
      return;
    }

    // English mode: fetch from OpenTDB
    try {
      const res = await executeApiCall('https://opentdb.com/api.php?amount=10&type=multiple');
      if (res.data && Array.isArray(res.data.results) && res.data.results.length > 0) {
        const formatted = res.data.results.map((q: any) => {
          const all = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
          return {
            question: decodeHtml(q.question),
            correct_answer: decodeHtml(q.correct_answer),
            incorrect_answers: q.incorrect_answers.map(decodeHtml),
            options: all.map(decodeHtml),
            category: decodeHtml(q.category),
            difficulty: q.difficulty
          };
        });
        setQuestions(formatted);
        setCurrentIndex(0);
      } else {
        // Fallback English
        setQuestions([
          {
            question: 'What is the capital of India?',
            correct_answer: 'New Delhi',
            incorrect_answers: ['Mumbai', 'Kolkata', 'Chennai'],
            options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
            category: 'Geography',
            difficulty: 'easy'
          },
          {
            question: 'Which planet is known as the Red Planet?',
            correct_answer: 'Mars',
            incorrect_answers: ['Venus', 'Jupiter', 'Saturn'],
            options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
            category: 'Science',
            difficulty: 'easy'
          },
          {
            question: 'What does HTTP stand for in web technology?',
            correct_answer: 'Hypertext Transfer Protocol',
            incorrect_answers: ['Hyperlink Text Post', 'High Transfer Text Protocol', 'Home Tool Transfer Process'],
            options: ['Hyperlink Text Post', 'Hypertext Transfer Protocol', 'High Transfer Text Protocol', 'Home Tool Transfer Process'],
            category: 'Technology',
            difficulty: 'medium'
          }
        ]);
        setCurrentIndex(0);
      }
    } catch {
      setError('Quiz questions fetch karne me issue aaya. Dobara try karein.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions(language);
  }, [language]);

  const handleSelect = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    const curr = questions[currentIndex];
    if (option === curr.correct_answer) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((c) => c + 1);
    } else {
      loadQuestions(language);
    }
  };

  const toggleLanguage = (newLang: 'hi' | 'en') => {
    if (newLang !== language) {
      setLanguage(newLang);
    }
  };

  const currentQ = questions[currentIndex];
  const isHi = language === 'hi';

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-sm gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="font-semibold text-white">
            {isHi ? 'लाइव सामान्य ज्ञान क्विज़' : 'Live Trivia Arena'}
          </span>
          <span className="text-xs text-slate-400">· {isHi ? 'हिंदी प्रश्न' : 'Open Trivia DB'}</span>
        </div>

        {/* Language Switcher & Controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => toggleLanguage('hi')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                isHi ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => toggleLanguage('en')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                !isHi ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <div className="text-xs text-slate-300 font-mono">
            {isHi ? 'अंक' : 'Score'}:{' '}
            <span className="font-bold text-teal-400 tabular-nums">{score}</span>
            {streak > 1 && <span className="ml-1 text-amber-400">🔥 {streak}x</span>}
          </div>

          <button
            onClick={() => loadQuestions(language)}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isHi ? 'नये प्रश्न लोड करें' : 'Reload questions'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-14 text-center">
          <RefreshCw className="w-8 h-8 mx-auto text-teal-400 animate-spin mb-3" />
          <p className="text-sm text-slate-300">
            {isHi ? 'हिंदी क्विज़ प्रश्न लोड हो रहे हैं...' : 'Fetching live quiz questions...'}
          </p>
        </div>
      ) : error && questions.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-rose-400 mb-3">{error}</p>
          <button
            onClick={() => loadQuestions(language)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400"
          >
            {isHi ? 'पुनः प्रयास करें' : 'Try Again'}
          </button>
        </div>
      ) : currentQ ? (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {isHi
                ? `प्रश्न ${currentIndex + 1} / ${questions.length}`
                : `Question ${currentIndex + 1} of ${questions.length}`}
            </span>
            <span className="capitalize">
              {currentQ.category} · {currentQ.difficulty}
            </span>
          </div>

          <h3 className="text-base font-semibold text-white leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correct_answer;
              let btnClass = 'border-slate-800 bg-slate-950/70 hover:bg-slate-800/80 text-slate-200';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnClass = 'border-teal-500 bg-teal-950/60 text-teal-200 ring-1 ring-teal-500 font-semibold';
                } else if (isSelected) {
                  btnClass = 'border-rose-500 bg-rose-950/60 text-rose-200 ring-1 ring-rose-500';
                } else {
                  btnClass = 'border-slate-800/50 bg-slate-950/40 text-slate-500';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-sm ${btnClass}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      ) : isSelected ? (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="pt-3 flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-slate-300">
                {selectedOption === currentQ.correct_answer ? (
                  <span className="text-teal-400 font-semibold">
                    {isHi ? '✓ सही जवाब! (+1 अंक)' : '✓ Correct Answer! (+1 Point)'}
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold">
                    {isHi
                      ? `✗ गलत उत्तर! सही जवाब था: ${currentQ.correct_answer}`
                      : `✗ Incorrect! Correct: ${currentQ.correct_answer}`}
                  </span>
                )}
              </div>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors ml-auto"
              >
                <span>{isHi ? 'अगला प्रश्न' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
