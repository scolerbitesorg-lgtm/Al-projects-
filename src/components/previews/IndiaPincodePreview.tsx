import React, { useState, useEffect } from 'react';
import { executeApiCall } from '../../utils/apiRunner';
import { Search, MapPin, Building, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const IndiaPincodePreview: React.FC = () => {
  const [pincode, setPincode] = useState<string>('110001');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { code: '110001', label: 'New Delhi GPO' },
    { code: '400001', label: 'Mumbai GPO' },
    { code: '560001', label: 'Bengaluru GPO' },
    { code: '700001', label: 'Kolkata GPO' },
    { code: '600001', label: 'Chennai GPO' },
    { code: '302001', label: 'Jaipur GPO' }
  ];

  const searchPincode = async (codeToSearch: string) => {
    if (!codeToSearch || codeToSearch.length !== 6) {
      setError('Kripya valid 6-digit Pincode enter karein');
      return;
    }
    setLoading(true);
    setError(null);
    setData([]);
    setStatusMessage('');

    try {
      const res = await executeApiCall(`https://api.postalpincode.in/pincode/${codeToSearch}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        const result = res.data[0];
        if (result.Status === 'Success' && Array.isArray(result.PostOffice)) {
          setData(result.PostOffice);
          setStatusMessage(`${result.PostOffice.length} post offices found for ${codeToSearch}`);
        } else {
          setError(result.Message || 'Is pincode ke liye koi post office record nahi mila.');
        }
      } else {
        setError('Post Office records fetch nahi ho sake.');
      }
    } catch (err: any) {
      setError('Network request error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchPincode('110001');
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-teal-400" />
          <span className="font-semibold text-white">India Postal Pincode Directory</span>
        </div>
        <span className="text-xs text-slate-400">PostalPincode.in API</span>
      </div>

      {/* Search Input */}
      <div className="mt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchPincode(pincode);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit Pincode (e.g. 110001)"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 font-mono"
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

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 flex-wrap mt-2.5 text-xs">
          <span className="text-slate-400 text-[11px]">Presets:</span>
          {presets.map((p) => (
            <button
              key={p.code}
              type="button"
              onClick={() => {
                setPincode(p.code);
                searchPincode(p.code);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
            >
              {p.code} ({p.label.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Status or Error */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {statusMessage && !error && (
        <div className="mt-3 text-xs text-teal-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Post Office Results */}
      <div className="mt-4 max-h-72 overflow-y-auto space-y-2.5 pr-1">
        {loading ? (
          <div className="py-10 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
            <span>Fetching postal directory data for {pincode}...</span>
          </div>
        ) : data.length > 0 ? (
          data.map((po, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-white text-sm flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-teal-400" />
                    {po.Name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {po.BranchType} · {po.District}, {po.State}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    po.DeliveryStatus === 'Delivery'
                      ? 'bg-teal-950 text-teal-300 border border-teal-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {po.DeliveryStatus}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/70 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div>Circle: <span className="text-slate-200">{po.Circle}</span></div>
                <div>Division: <span className="text-slate-200">{po.Division}</span></div>
                <div>Region: <span className="text-slate-200">{po.Region}</span></div>
                <div>Country: <span className="text-slate-200">{po.Country}</span></div>
              </div>
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
};
