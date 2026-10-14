import React, { useState } from 'react';
import { UserCheck, UserX, Shield, Lock, Unlock, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const IdorSimulator: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<'alice' | 'bob'>('alice');
  const [requestedId, setRequestedId] = useState('1042');
  const [enforceOwnershipCheck, setEnforceOwnershipCheck] = useState(false);

  // Database records
  const records: Record<string, { ownerId: string; ownerName: string; title: string; ssn: string; balance: string; notes: string }> = {
    '1042': {
      ownerId: 'alice',
      ownerName: 'Alice Vance (Staff Engineer)',
      title: 'Confidential Performance & Salary Review',
      ssn: 'XXX-XX-4819',
      balance: '$98,500.00',
      notes: 'Eligible for senior promotion Q3.'
    },
    '1043': {
      ownerId: 'bob',
      ownerName: 'Bob Sterling (Sales Lead)',
      title: 'Commercial Commission Breakdown',
      ssn: 'XXX-XX-1192',
      balance: '$135,200.00',
      notes: 'Territory bonuses approved.'
    },
    '1001': {
      ownerId: 'executive',
      ownerName: 'Dr. Gregory House (Chief Medical Officer)',
      title: 'Executive Healthcare Retainer & Private Diagnosis',
      ssn: 'XXX-XX-0001',
      balance: '$420,000.00',
      notes: 'High-net-worth confidential client profile.'
    }
  };

  const record = records[requestedId];

  // Authorization check
  const isAuthorized = record ? (record.ownerId === currentUser || (currentUser as string) === 'admin') : false;
  const allowAccess = !enforceOwnershipCheck || isAuthorized;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-400" />
            Insecure Direct Object Reference (IDOR) & RBAC Sandbox
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Observe how relying on client-supplied resource IDs without session ownership verification leaks sensitive records across tenants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEnforceOwnershipCheck(!enforceOwnershipCheck)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              enforceOwnershipCheck
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500 text-rose-300'
            }`}
          >
            {enforceOwnershipCheck ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            Server Ownership Verification: {enforceOwnershipCheck ? 'ENFORCED (SECURE)' : 'DISABLED (VULNERABLE)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* User Context & Request Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Current Authenticated Session Context
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentUser('alice');
                  setRequestedId('1042');
                }}
                className={`p-3 text-xs rounded-lg border text-left transition-colors ${
                  currentUser === 'alice'
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Alice Vance
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Session User ID: 1042</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Role: Staff</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentUser('bob');
                  setRequestedId('1043');
                }}
                className={`p-3 text-xs rounded-lg border text-left transition-colors ${
                  currentUser === 'bob'
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Bob Sterling
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Session User ID: 1043</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Role: Sales</div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              API Resource Parameter (?doc_id=...)
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setRequestedId('1042')}
                className={`px-3 py-1.5 text-xs font-mono rounded border ${
                  requestedId === '1042' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                1042 (Alice)
              </button>
              <button
                onClick={() => setRequestedId('1043')}
                className={`px-3 py-1.5 text-xs font-mono rounded border ${
                  requestedId === '1043' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                1043 (Bob)
              </button>
              <button
                onClick={() => setRequestedId('1001')}
                className={`px-3 py-1.5 text-xs font-mono rounded border ${
                  requestedId === '1001' ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                1001 (VIP Exec)
              </button>
            </div>

            <div className="mt-2 text-xs font-mono bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-300">
              GET /api/v1/records?doc_id=<span className="text-amber-400 font-bold">{requestedId}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-1 text-slate-400">
            <span className="font-semibold text-slate-300 block">How IDOR Occurs:</span>
            <p className="text-[11px] leading-relaxed">
              When a developer queries the database using strictly <code className="text-cyan-300">WHERE id = :param</code> rather than tying it to the authenticated session context <code className="text-emerald-300">WHERE id = :param AND owner_id = :session_user</code>.
            </p>
          </div>
        </div>

        {/* Server Response Display */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Server Response (JSON)</span>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
              allowAccess ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
            }`}>
              {allowAccess ? 'HTTP 200 OK' : 'HTTP 403 Forbidden'}
            </span>
          </div>

          {allowAccess ? (
            <div className={`p-4 rounded-xl border font-mono text-xs space-y-2.5 ${
              !isAuthorized 
                ? 'bg-rose-950/30 border-rose-500/80 text-rose-200' 
                : 'bg-slate-950 border-slate-800 text-slate-200'
            }`}>
              {!isAuthorized && (
                <div className="p-2.5 bg-rose-900/40 border border-rose-600/60 rounded text-rose-300 flex items-start gap-2 mb-2 font-sans">
                  <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-xs font-semibold">CRITICAL IDOR EXPLOITATION DETECTED!</strong>
                    <span className="text-[11px] leading-tight block text-rose-200">
                      Logged in user <strong>{currentUser.toUpperCase()}</strong> has accessed private records belonging to <strong>{record?.ownerName}</strong> because server ownership validation was disabled!
                    </span>
                  </div>
                </div>
              )}

              <pre className="text-xs overflow-x-auto text-emerald-300 leading-relaxed">
{JSON.stringify({
  status: "success",
  recordId: requestedId,
  confidentialData: record
}, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs space-y-3 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-emerald-400 font-bold text-sm">
                ACCESS BLOCKED: HTTP 403 FORBIDDEN
              </div>
              <p className="text-xs font-sans text-slate-400 max-w-md mx-auto">
                The server validated that session token (<code className="text-cyan-300">{currentUser}</code>) does not own record <code className="text-cyan-300">#{requestedId}</code>. Request safely rejected.
              </p>
              <pre className="text-left bg-slate-900 p-3 rounded text-[11px] text-slate-400">
{`{
  "error": "Forbidden",
  "message": "User ${currentUser} is not authorized to view document #${requestedId}",
  "auditCode": "UNAUTHORIZED_TENANT_ACCESS_ATTEMPT"
}`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
