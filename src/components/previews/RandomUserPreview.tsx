import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { User, Mail, MapPin, Phone, Calendar, RefreshCw, Copy, Check } from 'lucide-react';

export const RandomUserPreview: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchRandomUser = async () => {
    setLoading(true);
    try {
      const res = await executeApiCall('https://randomuser.me/api/');
      if (Array.isArray(res.data?.results) && res.data.results.length > 0) {
        setUser(res.data.results[0]);
      } else {
        // Fallback demo user
        setUser({
          name: { title: 'Mr', first: 'Aarav', last: 'Sharma' },
          email: 'aarav.sharma@example.com',
          location: { city: 'New Delhi', country: 'India' },
          phone: '+91 98765 43210',
          dob: { age: 28 },
          picture: { large: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
          login: { username: 'aarav_dev' }
        });
      }
    } catch {
      // Fallback
      setUser({
        name: { title: 'Mr', first: 'Aarav', last: 'Sharma' },
        email: 'aarav.sharma@example.com',
        location: { city: 'New Delhi', country: 'India' },
        phone: '+91 98765 43210',
        dob: { age: 28 },
        login: { username: 'aarav_dev' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomUser();
  }, []);

  const copyEmail = () => {
    if (!user?.email) return;
    navigator.clipboard.writeText(user.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">Random Persona Generator</span>
        </div>
        <button
          onClick={fetchRandomUser}
          disabled={loading}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Generate Another User"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-14 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
          <span>Generating realistic dummy identity...</span>
        </div>
      ) : user ? (
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4">
            {user.picture?.large ? (
              <img
                src={user.picture.large}
                alt={user.name?.first}
                className="w-16 h-16 rounded-full border-2 border-teal-500/40 object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-teal-500/10 border-2 border-teal-500/40 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-teal-400" />
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{user.name?.title}. {user.name?.first} {user.name?.last}</span>
              </h3>
              <p className="text-xs text-teal-400 font-mono mt-0.5">
                @{user.login?.username} · {user.dob?.age} yrs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div
              onClick={copyEmail}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
            >
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>Email Address</span>
              </div>
              <div className="font-mono text-white mt-1 truncate flex items-center justify-between">
                <span>{user.email}</span>
                {copied ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Phone Contact</span>
              </div>
              <div className="font-mono text-white mt-1">
                {user.phone || 'N/A'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 sm:col-span-2">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Geographic Location</span>
              </div>
              <div className="text-white mt-1">
                {user.location?.city}, {user.location?.state ? `${user.location.state}, ` : ''}{user.location?.country}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={fetchRandomUser}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Identity</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
