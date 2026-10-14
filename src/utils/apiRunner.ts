import { ApiItem, ApiResponseResult } from '../types/api';

/**
 * Executes a live API call with latency measurement and smart CORS fallback
 */
export async function executeApiCall(url: string, method: string = 'GET'): Promise<ApiResponseResult> {
  const startTime = performance.now();
  
  // Clean URL - replace http with https if possible for browser compatibility
  let targetUrl = url;
  const isHttpOnHttps = window.location.protocol === 'https:' && url.startsWith('http://');

  try {
    // If it's pure HTTP on HTTPS site, browsers will block mixed-content immediately, so use CORS proxy directly
    if (isHttpOnHttps) {
      return await fetchViaProxy(targetUrl, startTime);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(targetUrl, {
      method,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json, text/plain, */*'
      }
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - startTime);
    const contentType = response.headers.get('content-type') || '';
    
    // Extract headers object
    const headersObj: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      headersObj[key] = val;
    });

    if (contentType.includes('application/json')) {
      const data = await response.json();
      return {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        latencyMs,
        data,
        contentType,
        headers: headersObj,
        usedProxy: false
      };
    } else if (contentType.includes('image/')) {
      return {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        latencyMs,
        data: { message: `Image response (${contentType})`, url: targetUrl },
        contentType,
        headers: headersObj,
        usedProxy: false
      };
    } else {
      const rawText = await response.text();
      let parsedJson: any = null;
      try {
        parsedJson = JSON.parse(rawText);
      } catch {
        // Not JSON
      }
      return {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        latencyMs,
        data: parsedJson || rawText,
        rawText,
        contentType: contentType || 'text/plain',
        headers: headersObj,
        usedProxy: false
      };
    }
  } catch (err: any) {
    // Attempt fallback proxy on CORS or network error
    try {
      return await fetchViaProxy(targetUrl, startTime);
    } catch (proxyErr: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        status: 0,
        statusText: 'Network / CORS Error',
        ok: false,
        latencyMs,
        data: null,
        contentType: 'none',
        headers: {},
        error: err.name === 'AbortError' ? 'Request timed out after 8s' : err.message || 'CORS or Network Failure'
      };
    }
  }
}

async function fetchViaProxy(url: string, startTime: number): Promise<ApiResponseResult> {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const response = await fetch(proxyUrl, { signal: controller.signal });
  clearTimeout(timeoutId);

  const latencyMs = Math.round(performance.now() - startTime);
  const text = await response.text();

  let data: any = text;
  let isJson = false;
  try {
    data = JSON.parse(text);
    isJson = true;
  } catch {
    // Keep as text
  }

  return {
    status: response.status,
    statusText: response.statusText || 'OK (via proxy)',
    ok: response.ok,
    latencyMs,
    data,
    rawText: text,
    contentType: isJson ? 'application/json' : 'text/plain',
    headers: { 'x-proxy-provider': 'allorigins.win' },
    usedProxy: true
  };
}

/**
 * Generates drop-in React TypeScript code for any API
 */
export function generateReactCode(api: ApiItem): string {
  const compName = api.componentName || 'ApiWidget';
  
  return `import React, { useState, useEffect } from 'react';

/**
 * ${api.name} Component
 * ${api.englishDesc}
 * Hinglish Note: ${api.description}
 * Endpoint: ${api.url}
 */
export function ${compName}() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('${api.url}', {
        method: '${api.method || 'GET'}',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error(\`HTTP error! status: \${res.status}\`);
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base text-white">${api.name}</h3>
          <p className="text-xs text-slate-400">${api.category}</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Refresh'}
        </button>
      </div>

      <div className="mt-4">
        {loading && (
          <div className="py-8 text-center text-sm text-slate-400 animate-pulse">
            Loading data from ${api.name}...
          </div>
        )}

        {error && (
          <div className="p-3 text-xs rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300">
            Error: {error}
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400">Response Data:</div>
            <pre className="max-h-60 overflow-auto p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-teal-300 font-mono">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ${compName};
`;
}

/**
 * Generates vanilla JavaScript fetch snippet
 */
export function generateFetchCode(api: ApiItem): string {
  return `// ${api.name} - Vanilla JavaScript Example
// Usage: ${api.englishDesc}

async function get${api.componentName}() {
  const endpoint = '${api.url}';

  try {
    const response = await fetch(endpoint, {
      method: '${api.method || 'GET'}',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }

    const data = await response.json();
    console.log('Success:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Call the function
get${api.componentName}();
`;
}

/**
 * Generates cURL command snippet
 */
export function generateCurlCode(api: ApiItem): string {
  return `# Test in terminal:
curl -X ${api.method || 'GET'} "${api.url}" \\
  -H "Accept: application/json"`;
}

/**
 * Generates Python requests snippet
 */
export function generatePythonCode(api: ApiItem): string {
  return `# Python 3 - requests library
import requests

url = "${api.url}"
headers = {"Accept": "application/json"}

try:
    response = requests.${(api.method || 'GET').toLowerCase()}(url, headers=headers, timeout=10)
    response.raise_for_status()
    data = response.json()
    print("Response Data:", data)
except requests.exceptions.RequestException as e:
    print("Request failed:", e)
`;
}

/**
 * Direct file download in browser
 */
export function triggerFileDownload(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}
