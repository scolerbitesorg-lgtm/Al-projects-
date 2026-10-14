import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { CloudSun, Wind, Droplets, Sun, Sunset, Sunrise, Compass, Loader2 } from 'lucide-react';

interface City {
  name: string;
  lat: number;
  lng: number;
  country: string;
}

const CITIES: City[] = [
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090, country: 'India' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India' },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, country: 'India' },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
  { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA' }
];

export const WeatherForecastPreview: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [sunData, setSunData] = useState<any>(null);
  const [airData, setAirData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: City) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Open-Meteo Weather
      const weatherPromise = executeApiCall(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true&hourly=relative_humidity_2m`
      );

      // 2. Sunrise Sunset
      const sunPromise = executeApiCall(
        `https://api.sunrise-sunset.org/json?lat=${city.lat}&lng=${city.lng}&formatted=0`
      );

      // 3. Open-Meteo Air Quality
      const aqiPromise = executeApiCall(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lng}&current=pm10,pm2_5`
      );

      const [wRes, sRes, aRes] = await Promise.all([weatherPromise, sunPromise, aqiPromise]);

      if (wRes.data?.current_weather) {
        setWeatherData(wRes.data.current_weather);
      }
      if (sRes.data?.results) {
        setSunData(sRes.data.results);
      }
      if (aRes.data?.current) {
        setAirData(aRes.data.current);
      }
    } catch (err: any) {
      setError('Weather data load karne me issue aaya: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  const getWeatherCondition = (code: number) => {
    if (code === 0) return 'Clear Sky ☀️';
    if (code <= 3) return 'Partly Cloudy ⛅';
    if (code <= 48) return 'Foggy 🌫️';
    if (code <= 67) return 'Rainy 🌧️';
    if (code <= 77) return 'Snowy ❄️';
    if (code <= 99) return 'Thunderstorm ⛈️';
    return 'Cloudy ☁️';
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-amber-400" />
          <span className="font-semibold text-white">Live Meteorological Radar</span>
        </div>
        <span className="text-xs text-slate-400">Open-Meteo + Sunrise-Sunset</span>
      </div>

      {/* City Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
        {CITIES.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelectedCity(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCity.name === c.name
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-14 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
          <span>Fetching atmospheric telemetry for {selectedCity.name}...</span>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-xs text-rose-400">{error}</div>
      ) : weatherData ? (
        <div className="mt-2 space-y-4">
          {/* Main Hero Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">{selectedCity.country}</div>
              <h3 className="text-2xl font-bold text-white mt-0.5">{selectedCity.name}</h3>
              <p className="text-xs text-teal-400 mt-1 font-medium">
                {getWeatherCondition(weatherData.weathercode)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-extrabold text-white font-mono tabular-nums">
                {Math.round(weatherData.temperature)}°C
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {Math.round((weatherData.temperature * 9) / 5 + 32)}°F
              </div>
            </div>
          </div>

          {/* Environmental metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>Wind Speed</span>
              </div>
              <div className="text-base font-semibold text-white font-mono tabular-nums mt-1">
                {weatherData.windspeed} <span className="text-[11px] font-normal text-slate-400">km/h</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Wind Dir</span>
              </div>
              <div className="text-base font-semibold text-white font-mono tabular-nums mt-1">
                {weatherData.winddirection}°
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                <span>Sunrise</span>
              </div>
              <div className="text-base font-semibold text-white font-mono tabular-nums mt-1">
                {formatTime(sunData?.sunrise)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Sunset className="w-3.5 h-3.5 text-rose-400" />
                <span>Sunset</span>
              </div>
              <div className="text-base font-semibold text-white font-mono tabular-nums mt-1">
                {formatTime(sunData?.sunset)}
              </div>
            </div>
          </div>

          {/* Air Quality Bar */}
          {airData && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Particulate Matter</span>
              <div className="flex items-center gap-4 font-mono tabular-nums">
                <span>
                  PM2.5: <strong className="text-teal-400">{airData.pm2_5 ?? 'N/A'}</strong> µg/m³
                </span>
                <span>
                  PM10: <strong className="text-amber-400">{airData.pm10 ?? 'N/A'}</strong> µg/m³
                </span>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
