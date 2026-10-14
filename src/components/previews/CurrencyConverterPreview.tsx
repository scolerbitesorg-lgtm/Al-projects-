import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { ArrowRightLeft, TrendingUp, DollarSign, Loader2, RefreshCw } from 'lucide-react';

export const CurrencyConverterPreview: React.FC = () => {
  const [amount, setAmount] = useState<number>(100);
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [targetCurrency, setTargetCurrency] = useState<string>('INR');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [cryptoPrices, setCryptoPrices] = useState<{ btc?: number; eth?: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchRates = async () => {
    setLoading(true);
    try {
      // 1. Forex rates
      const forexRes = await executeApiCall('https://open.er-api.com/v6/latest/USD');
      if (forexRes.data?.rates) {
        setRates(forexRes.data.rates);
        setLastUpdated(forexRes.data.time_last_update_utc ? new Date(forexRes.data.time_last_update_utc).toLocaleTimeString() : 'Live');
      }

      // 2. Crypto prices from CoinGecko
      try {
        const cryptoRes = await executeApiCall('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,inr');
        if (cryptoRes.data) {
          setCryptoPrices({
            btc: cryptoRes.data.bitcoin?.usd || 94500,
            eth: cryptoRes.data.ethereum?.usd || 3200
          });
        }
      } catch {
        setCryptoPrices({ btc: 95000, eth: 3200 });
      }
    } catch {
      // Fallback default rates if offline
      setRates({ USD: 1, INR: 86.5, EUR: 0.92, GBP: 0.78, JPY: 152.4, CAD: 1.38 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const rate = rates[targetCurrency] || 86.5;
  const convertedValue = (amount * rate).toFixed(2);

  const popularPairs = [
    { target: 'INR', label: 'INR (₹)' },
    { target: 'EUR', label: 'EUR (€)' },
    { target: 'GBP', label: 'GBP (£)' },
    { target: 'JPY', label: 'JPY (¥)' },
    { target: 'CAD', label: 'CAD ($)' }
  ];

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">Live Forex & Crypto Rates</span>
        </div>
        <button
          onClick={fetchRates}
          disabled={loading}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Refresh rates"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-14 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
          <span>Fetching global exchange rates...</span>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Main Converter Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <label className="text-[11px] text-slate-400 block mb-1">Send Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-teal-500 tabular-nums"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="text-[11px] text-slate-400 block mb-1">Converted ({targetCurrency})</label>
                <div className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-teal-400 font-mono font-bold text-base tabular-nums flex items-center justify-between">
                  <span>{convertedValue}</span>
                  <span className="text-xs text-slate-400 font-normal">{targetCurrency}</span>
                </div>
              </div>
            </div>

            {/* Target currency chips */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              <span className="text-[11px] text-slate-400 shrink-0">Pair:</span>
              {popularPairs.map((p) => (
                <button
                  key={p.target}
                  onClick={() => setTargetCurrency(p.target)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-colors ${
                    targetCurrency === p.target
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-900">
              <span>Exchange Rate: 1 USD = {rate.toFixed(4)} {targetCurrency}</span>
              {lastUpdated && <span>Updated: {lastUpdated}</span>}
            </div>
          </div>

          {/* Crypto spot rates mini-bar */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-amber-400" />
                  <span>Bitcoin (BTC)</span>
                </span>
                <span className="font-mono font-semibold text-white mt-0.5 block tabular-nums">
                  ${(cryptoPrices.btc || 95000).toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                ≈ ₹{Math.round((cryptoPrices.btc || 95000) * (rates['INR'] || 86.5) / 100000)}L
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-indigo-400" />
                  <span>Ethereum (ETH)</span>
                </span>
                <span className="font-mono font-semibold text-white mt-0.5 block tabular-nums">
                  ${(cryptoPrices.eth || 3200).toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                ≈ ₹{Math.round((cryptoPrices.eth || 3200) * (rates['INR'] || 86.5) / 100000)}L
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
