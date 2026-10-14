import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { Globe, Search, Users, Landmark, Coins, Map, Loader2, AlertCircle } from 'lucide-react';

export const CountryExplorerPreview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('India');
  const [loading, setLoading] = useState<boolean>(false);
  const [country, setCountry] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = ['India', 'Japan', 'France', 'Brazil', 'Canada', 'Germany', 'Australia'];

  const searchCountry = async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setCountry(null);

    try {
      const res = await executeApiCall(`https://restcountries.com/v3.1/name/${encodeURIComponent(name.trim())}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCountry(res.data[0]);
      } else {
        setError(`"${name}" ke liye country details nahi mili.`);
      }
    } catch (err: any) {
      setError('Failed to fetch country data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchCountry('India');
  }, []);

  const getCurrencies = (currObj: any) => {
    if (!currObj) return 'N/A';
    return Object.values(currObj).map((c: any) => `${c.name} (${c.symbol || ''})`).join(', ');
  };

  const getLanguages = (langObj: any) => {
    if (!langObj) return 'N/A';
    return Object.values(langObj).join(', ');
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">REST Countries Atlas</span>
        </div>
        <span className="text-xs text-slate-400">RESTCountries v3.1</span>
      </div>

      {/* Search Input */}
      <div className="mt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchCountry(searchTerm);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search country name (e.g. India, Japan)..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Explore'}
          </button>
        </form>

        <div className="flex items-center gap-1.5 flex-wrap mt-2.5 text-xs">
          <span className="text-slate-400 text-[11px]">Quick:</span>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setSearchTerm(p);
                searchCountry(p);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Country Card */}
      {loading ? (
        <div className="py-14 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
          <span>Fetching sovereign data for {searchTerm}...</span>
        </div>
      ) : country ? (
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
            {country.flags?.svg && (
              <img
                src={country.flags.svg}
                alt={country.flags.alt || country.name?.common}
                className="w-16 h-11 object-cover rounded shadow-md border border-slate-800 shrink-0"
              />
            )}
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{country.name?.common}</span>
                <span className="text-xs font-normal text-slate-400">({country.cca2})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official: {country.name?.official}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Landmark className="w-3.5 h-3.5 text-teal-400" />
                <span>Capital</span>
              </div>
              <div className="text-sm font-semibold text-white mt-1">
                {country.capital?.join(', ') || 'N/A'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Population</span>
              </div>
              <div className="text-sm font-semibold text-white font-mono tabular-nums mt-1">
                {country.population ? Number(country.population).toLocaleString('en-IN') : 'N/A'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Coins className="w-3.5 h-3.5 text-teal-400" />
                <span>Currencies</span>
              </div>
              <div className="text-xs font-semibold text-white mt-1 truncate">
                {getCurrencies(country.currencies)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Map className="w-3.5 h-3.5 text-rose-400" />
                <span>Region & Subregion</span>
              </div>
              <div className="text-xs font-semibold text-white mt-1 truncate">
                {country.region} · {country.subregion || 'Global'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
            <span className="text-slate-400">Languages:</span>{' '}
            <span className="font-medium text-slate-200">{getLanguages(country.languages)}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
