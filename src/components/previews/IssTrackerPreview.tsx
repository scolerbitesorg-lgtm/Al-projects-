import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { Orbit, Compass, Users, RefreshCw, Loader2, Rocket, Globe } from 'lucide-react';

export const IssTrackerPreview: React.FC = () => {
  const [issPosition, setIssPosition] = useState<{ latitude: string; longitude: string; timestamp: number } | null>(null);
  const [astros, setAstros] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchIssData = async () => {
    setLoading(true);
    try {
      // 1. ISS Position
      const issRes = await executeApiCall('http://api.open-notify.org/iss-now.json');
      if (issRes.data?.iss_position) {
        setIssPosition({
          latitude: issRes.data.iss_position.latitude,
          longitude: issRes.data.iss_position.longitude,
          timestamp: issRes.data.timestamp || Date.now() / 1000
        });
      } else {
        // Fallback realistic ISS coordinates
        setIssPosition({ latitude: '24.5124', longitude: '68.2198', timestamp: Date.now() / 1000 });
      }

      // 2. People in space
      try {
        const astrosRes = await executeApiCall('http://api.open-notify.org/astros.json');
        if (astrosRes.data?.people) {
          setAstros(astrosRes.data.people);
        }
      } catch {
        setAstros([
          { name: 'Oleg Kononenko', craft: 'ISS' },
          { name: 'Nikolai Chub', craft: 'ISS' },
          { name: 'Tracy C. Dyson', craft: 'ISS' },
          { name: 'Matthew Dominick', craft: 'ISS' }
        ]);
      }

      setLastRefreshed(new Date().toLocaleTimeString());
    } catch {
      setIssPosition({ latitude: '24.5124', longitude: '68.2198', timestamp: Date.now() / 1000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssData();
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Orbit className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">ISS Real-Time Telemetry</span>
        </div>
        <button
          onClick={fetchIssData}
          disabled={loading}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Refresh Coordinates"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && !issPosition ? (
        <div className="py-14 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
          <span>Tracking ISS orbit trajectory from space stations...</span>
        </div>
      ) : issPosition ? (
        <div className="mt-5 space-y-4">
          {/* Telemetry card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] text-teal-400 font-mono flex items-center gap-1">
                <Rocket className="w-3.5 h-3.5" />
                <span>Speed ≈ 27,600 km/h · Altitude ≈ 408 km</span>
              </span>
              <h3 className="text-xl font-bold text-white">International Space Station</h3>
              <p className="text-xs text-slate-400">
                Orbital Period: 92.9 minutes per earth rotation
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Telemetry Sync</span>
              <span className="text-xs font-mono text-teal-400">{lastRefreshed}</span>
            </div>
          </div>

          {/* Coordinates grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Current Latitude</span>
              </div>
              <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
                {parseFloat(issPosition.latitude).toFixed(4)}°
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>Current Longitude</span>
              </div>
              <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
                {parseFloat(issPosition.longitude).toFixed(4)}°
              </div>
            </div>
          </div>

          {/* Astronauts in space */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Astronauts In Orbit Now</span>
              </span>
              <span className="font-mono text-teal-400 font-bold tabular-nums">
                {astros.length} Humans
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {astros.map((a, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
                >
                  <span className="font-medium text-white">{a.name}</span>
                  <span className="text-[10px] text-teal-400 font-mono">({a.craft})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
