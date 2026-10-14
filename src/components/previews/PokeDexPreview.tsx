import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { Sparkles, Search, Shield, Zap, Heart, Sword, Loader2, AlertCircle } from 'lucide-react';

export const PokeDexPreview: React.FC = () => {
  const [pokemonName, setPokemonName] = useState<string>('pikachu');
  const [loading, setLoading] = useState<boolean>(false);
  const [pokemon, setPokemon] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = ['pikachu', 'charizard', 'gengar', 'mewtwo', 'bulbasaur', 'lucario', 'eevee'];

  const searchPokemon = async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setPokemon(null);

    try {
      const res = await executeApiCall(`https://pokeapi.co/api/v2/pokemon/${name.trim().toLowerCase()}`);
      if (res.data && res.data.name) {
        setPokemon(res.data);
      } else {
        setError(`"${name}" naam ka Pokémon record nahi mila.`);
      }
    } catch (err: any) {
      setError('PokeAPI fetch error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchPokemon('pikachu');
  }, []);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fire': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'water': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'electric': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'grass': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'poison': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'psychic': return 'bg-pink-500/20 text-pink-400 border-pink-500/40';
      case 'ghost': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
      case 'dragon': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default: return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="font-semibold text-white">Live Pokédex Database</span>
        </div>
        <span className="text-xs text-slate-400">PokeAPI v2</span>
      </div>

      {/* Search Input */}
      <div className="mt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchPokemon(pokemonName);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={pokemonName}
              onChange={(e) => setPokemonName(e.target.value)}
              placeholder="Search Pokémon name or ID..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 lowercase font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Inspect'}
          </button>
        </form>

        <div className="flex items-center gap-1.5 flex-wrap mt-2.5 text-xs">
          <span className="text-slate-400 text-[11px]">Popular:</span>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setPokemonName(p);
                searchPokemon(p);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] capitalize transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-14 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
          <span>Fetching Pokémon stats and sprites...</span>
        </div>
      ) : pokemon ? (
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400">
                #{String(pokemon.id).padStart(3, '0')}
              </span>
              <h3 className="text-2xl font-bold text-white capitalize">{pokemon.name}</h3>
              <div className="flex gap-1.5 pt-1">
                {pokemon.types?.map((t: any) => (
                  <span
                    key={t.type.name}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border capitalize font-medium ${getTypeColor(
                      t.type.name
                    )}`}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-24 h-24 relative flex items-center justify-center">
              <img
                src={
                  pokemon.sprites?.other?.['official-artwork']?.front_default ||
                  pokemon.sprites?.front_default
                }
                alt={pokemon.name}
                className="w-24 h-24 object-contain filter drop-shadow-md"
              />
            </div>
          </div>

          {/* Physical Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Height:</span>
              <span className="font-mono text-white">{pokemon.height / 10} m</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Weight:</span>
              <span className="font-mono text-white">{pokemon.weight / 10} kg</span>
            </div>
          </div>

          {/* Combat Base Stats Gauges */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="text-xs font-semibold text-slate-300 pb-1 border-b border-slate-800 flex items-center justify-between">
              <span>Base Combat Stats</span>
              <span className="text-[11px] font-mono text-slate-400">
                EXP: {pokemon.base_experience}
              </span>
            </div>

            {pokemon.stats?.slice(0, 4).map((s: any) => {
              const maxStat = 180;
              const pct = Math.min(100, Math.round((s.base_stat / maxStat) * 100));
              return (
                <div key={s.stat.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="capitalize text-slate-400">{s.stat.name.replace('-', ' ')}</span>
                    <span className="font-mono font-bold text-white tabular-nums">{s.base_stat}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
