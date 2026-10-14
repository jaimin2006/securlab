import React, { useState } from 'react';
import { ArrowRight, Play, RefreshCw, Send, CheckCircle, AlertCircle, Copy, Terminal, Shield } from 'lucide-react';

export const BurpWorkbenchSim: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'proxy' | 'repeater' | 'history'>('proxy');
  const [interceptOn, setInterceptOn] = useState(true);
  const [isPending, setIsPending] = useState(true);

  // Raw request state
  const [rawRequest, setRawRequest] = useState<string>(
`POST /api/v2/account/profile HTTP/1.1
Host: secure-portal.lab
User-Agent: Mozilla/5.0 (X11; Linux x86_64)
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDQyIiwicm9sZSI6InN0YWZmIn0
Content-Type: application/json
Content-Length: 68

{
  "userId": 1042,
  "role": "staff",
  "department": "Engineering"
}`
  );

  // Repeater state
  const [repeaterRequest, setRepeaterRequest] = useState<string>(rawRequest);
  const [repeaterResponse, setRepeaterResponse] = useState<string | null>(null);
  const [repeaterLoading, setRepeaterLoading] = useState(false);

  // History log
  const [history, setHistory] = useState([
    { id: 1, method: 'GET', url: '/api/v2/account/dashboard', status: 200, length: 1420 },
    { id: 2, method: 'POST', url: '/api/v2/auth/login', status: 200, length: 512 },
    { id: 3, method: 'GET', url: '/api/v2/settings', status: 200, length: 890 }
  ]);

  const handleForward = () => {
    setIsPending(false);
    // Parse simulated response based on tampering
    const isTamperedAdmin = rawRequest.includes('"role": "admin"') || rawRequest.includes('"role":"admin"');
    const isIdor = rawRequest.includes('"userId": 1001') || rawRequest.includes('"userId":1001');

    setTimeout(() => {
      setHistory(prev => [
        {
          id: prev.length + 1,
          method: 'POST',
          url: '/api/v2/account/profile',
          status: isTamperedAdmin ? 200 : 200,
          length: isTamperedAdmin ? 940 : 612
        },
        ...prev
      ]);
    }, 200);
  };

  const handleDrop = () => {
    setIsPending(false);
  };

  const handleSendToRepeater = () => {
    setRepeaterRequest(rawRequest);
    setActiveTab('repeater');
  };

  const handleExecuteRepeater = () => {
    setRepeaterLoading(true);
    setTimeout(() => {
      const isTamperedAdmin = repeaterRequest.includes('"role": "admin"') || repeaterRequest.includes('"role":"admin"');
      const isIdor = repeaterRequest.includes('"userId": 1001') || repeaterRequest.includes('"userId":1001');

      if (isTamperedAdmin) {
        setRepeaterResponse(
`HTTP/1.1 200 OK
Date: Wed, 14 Oct 2026 12:54:10 GMT
Server: NGINX/1.24.0 (Ubuntu)
Content-Type: application/json; charset=utf-8
Content-Length: 184
Connection: keep-alive
X-Content-Type-Options: nosniff

{
  "status": "success",
  "message": "User profile updated",
  "activeRole": "admin",
  "privileges": ["READ_ALL", "WRITE_ALL", "USER_MANAGEMENT", "SYSTEM_DEBUG"],
  "auditFlag": "ELEVATED_ROLE_ACQUIRED"
}`
        );
      } else if (isIdor) {
        setRepeaterResponse(
`HTTP/1.1 200 OK
Date: Wed, 14 Oct 2026 12:54:12 GMT
Server: NGINX/1.24.0 (Ubuntu)
Content-Type: application/json; charset=utf-8
Content-Length: 228
Connection: keep-alive

{
  "status": "success",
  "userId": 1001,
  "owner": "Chief Information Officer",
  "email": "cio@secure-portal.lab",
  "salary": "$240,000",
  "ssn": "XXX-XX-9412",
  "notes": "Confidential executive record"
}`
        );
      } else {
        setRepeaterResponse(
`HTTP/1.1 200 OK
Date: Wed, 14 Oct 2026 12:54:14 GMT
Server: NGINX/1.24.0 (Ubuntu)
Content-Type: application/json; charset=utf-8
Content-Length: 112
Connection: keep-alive

{
  "status": "success",
  "userId": 1042,
  "role": "staff",
  "department": "Engineering"
}`
        );
      }
      setRepeaterLoading(false);
    }, 400);
  };

  const resetIntercept = () => {
    setIsPending(true);
    setRawRequest(
`POST /api/v2/account/profile HTTP/1.1
Host: secure-portal.lab
User-Agent: Mozilla/5.0 (X11; Linux x86_64)
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDQyIiwicm9sZSI6InN0YWZmIn0
Content-Type: application/json
Content-Length: 68

{
  "userId": 1042,
  "role": "staff",
  "department": "Engineering"
}`
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Burp Suite Proxy & Repeater Interception Workbench
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Simulate capturing live client HTTP requests, tampering with authorization headers and body parameters, and analyzing server responses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Proxy Listener:</span>
          <span className="px-2.5 py-1 bg-slate-950 border border-slate-700 font-mono text-xs text-emerald-400 rounded">
            127.0.0.1:8080 (Active)
          </span>
        </div>
      </div>

      {/* Burp Suite Navigation Tabs */}
      <div className="flex items-center gap-1.5 mt-4 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('proxy')}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            activeTab === 'proxy' 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Proxy (Interception)
        </button>
        <button
          onClick={() => setActiveTab('repeater')}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            activeTab === 'repeater' 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Repeater (Manual Testing)
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            activeTab === 'history' 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          HTTP History ({history.length})
        </button>
      </div>

      {/* PROXY TAB */}
      {activeTab === 'proxy' && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInterceptOn(!interceptOn)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  interceptOn 
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                Intercept is {interceptOn ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={handleForward}
                disabled={!isPending || !interceptOn}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded transition-colors"
              >
                Forward
              </button>
              <button
                onClick={handleDrop}
                disabled={!isPending || !interceptOn}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded transition-colors"
              >
                Drop
              </button>
              <button
                onClick={handleSendToRepeater}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition-colors"
              >
                Action → Send to Repeater
              </button>
            </div>

            {!isPending && (
              <button
                onClick={resetIntercept}
                className="px-2.5 py-1 text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Simulate New Intercepted Request
              </button>
            )}
          </div>

          {isPending && interceptOn ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
                <span>[INTERCEPTED REQUEST] Edit parameters or headers directly:</span>
                <span className="text-slate-400">Try changing "role": "staff" to "admin" or "userId": 1042 to 1001</span>
              </div>
              <textarea
                value={rawRequest}
                onChange={(e) => setRawRequest(e.target.value)}
                rows={12}
                className="w-full bg-slate-950 border border-amber-500/50 rounded-lg p-3 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-8 text-center text-xs text-slate-400">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">No requests currently paused in proxy queue.</p>
              <p className="text-slate-400 mt-1">The request was forwarded to the server. Check the HTTP History or click "Simulate New Intercepted Request".</p>
            </div>
          )}
        </div>
      )}

      {/* REPEATER TAB */}
      {activeTab === 'repeater' && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Repeater Tab 1 (secure-portal.lab:443)</span>
            <button
              onClick={handleExecuteRepeater}
              disabled={repeaterLoading}
              className="px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {repeaterLoading ? 'Sending...' : 'Send Request'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Raw HTTP Request</span>
                <span className="text-[11px] text-cyan-400">Editable</span>
              </div>
              <textarea
                value={repeaterRequest}
                onChange={(e) => setRepeaterRequest(e.target.value)}
                rows={14}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Raw HTTP Response</span>
                <span className="text-[11px] text-emerald-400">{repeaterResponse ? '200 OK' : 'Awaiting send'}</span>
              </div>
              <div className="w-full min-h-[280px] bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-300 whitespace-pre overflow-x-auto">
                {repeaterLoading ? (
                  <div className="flex items-center gap-2 text-slate-400 py-10 justify-center">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    Transmitting through socket connection...
                  </div>
                ) : repeaterResponse ? (
                  repeaterResponse
                ) : (
                  <div className="text-slate-400 italic py-12 text-center">
                    Click "Send Request" to fire request through Burp Repeater.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">URL Path</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Bytes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 text-slate-400">{item.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-amber-300">{item.method}</td>
                  <td className="py-2.5 px-3 text-white">{item.url}</td>
                  <td className="py-2.5 px-3 text-emerald-400">{item.status}</td>
                  <td className="py-2.5 px-3 text-slate-400">{item.length} B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
