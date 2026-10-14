import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const CsrfSimulator: React.FC = () => {
  const [sameSiteMode, setSameSiteMode] = useState<'None' | 'Lax' | 'Strict'>('None');
  const [useCsrfToken, setUseCsrfToken] = useState(false);
  const [transferStatus, setTransferStatus] = useState<string | null>(null);

  const simulateVictimVisit = () => {
    // When victim visits evil-phishing.site, evil site tries to submit forged POST
    if (sameSiteMode === 'Strict') {
      setTransferStatus('BLOCKED_SAMESITE_STRICT');
    } else if (sameSiteMode === 'Lax') {
      // Lax blocks cross-site POST form submissions
      setTransferStatus('BLOCKED_SAMESITE_LAX');
    } else if (useCsrfToken) {
      // SameSite=None, but server checks CSRF token
      setTransferStatus('BLOCKED_CSRF_TOKEN_MISMATCH');
    } else {
      // SameSite=None and No CSRF token -> VULNERABLE!
      setTransferStatus('EXPLOITED_FUNDS_STOLEN');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-amber-400" />
            Cross-Site Request Forgery (CSRF) & SameSite Cookie Simulator
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Simulate a victim logged into an online bank who visits an external phishing page that automatically fires a background cross-origin transfer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseCsrfToken(!useCsrfToken)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              useCsrfToken
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            Anti-CSRF Token: {useCsrfToken ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Victim's Bank Session Cookie: SameSite Flag
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSameSiteMode('None')}
                className={`p-2.5 text-xs rounded-lg border text-center font-mono ${
                  sameSiteMode === 'None'
                    ? 'bg-rose-950 border-rose-500 text-rose-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                SameSite=None
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">Sends in all cross-site requests</div>
              </button>

              <button
                type="button"
                onClick={() => setSameSiteMode('Lax')}
                className={`p-2.5 text-xs rounded-lg border text-center font-mono ${
                  sameSiteMode === 'Lax'
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                SameSite=Lax
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">Withheld on cross-site POSTs</div>
              </button>

              <button
                type="button"
                onClick={() => setSameSiteMode('Strict')}
                className={`p-2.5 text-xs rounded-lg border text-center font-mono ${
                  sameSiteMode === 'Strict'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                SameSite=Strict
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">Never sent cross-site</div>
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-2">
            <div className="font-semibold text-slate-300">Attacker's Exploitation Page (evil-phishing.org):</div>
            <pre className="text-[11px] font-mono text-amber-300 bg-slate-900 p-2.5 rounded overflow-x-auto">
{`<form action="https://bank.lab/api/transfer" method="POST">
  <input type="hidden" name="recipient" value="ATTACKER_WALLET_99" />
  <input type="hidden" name="amount" value="5000.00" />
</form>
<script>document.forms[0].submit();</script>`}
            </pre>
          </div>

          <button
            onClick={simulateVictimVisit}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            Simulate Victim Clicking Phishing Link
          </button>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <div className="text-slate-400 uppercase tracking-wider text-[11px] font-semibold mb-2">
              Cross-Origin Browser Request Flow:
            </div>
            <div className="p-3 bg-slate-900 rounded-lg space-y-2 text-slate-300">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Origin Header:</span>
                <span className="text-amber-400">https://evil-phishing.org (Cross-Site)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Target Action:</span>
                <span className="text-cyan-400">POST https://bank.lab/api/transfer</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Cookies Attached by Browser:</span>
                <span className={sameSiteMode === 'None' ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {sameSiteMode === 'None' ? 'session_id=AUTH_TOKEN (ATTACHED AUTOMATICALLY)' : 'NONE (BLOCKED BY SAMESITE)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Anti-CSRF Form Token:</span>
                <span className={useCsrfToken ? 'text-emerald-400' : 'text-slate-400'}>
                  {useCsrfToken ? 'Expected & Verified on Server' : 'Missing (Not Checked)'}
                </span>
              </div>
            </div>
          </div>

          {/* Outcome Display */}
          {transferStatus && (
            <div className={`p-4 rounded-xl border font-mono text-xs ${
              transferStatus === 'EXPLOITED_FUNDS_STOLEN'
                ? 'bg-rose-950/30 border-rose-500/80 text-rose-200'
                : 'bg-emerald-950/30 border-emerald-500/80 text-emerald-300'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                <span className="font-semibold uppercase tracking-wider text-xs">
                  {transferStatus === 'EXPLOITED_FUNDS_STOLEN' ? 'CRITICAL: CSRF EXPLOITED' : 'CSRF ATTACK MITIGATED'}
                </span>
                <span className="text-[11px] font-bold">
                  {transferStatus === 'EXPLOITED_FUNDS_STOLEN' ? 'HTTP 200 OK (UNAUTHORIZED ACTION)' : 'HTTP 403 FORBIDDEN'}
                </span>
              </div>

              {transferStatus === 'EXPLOITED_FUNDS_STOLEN' ? (
                <div className="space-y-2 text-rose-300 font-sans">
                  <p className="font-semibold text-rose-200 text-xs">
                    $5,000.00 Transferred to Attacker!
                  </p>
                  <p className="text-[11px] leading-relaxed text-rose-300">
                    Because the bank cookie used <code className="bg-rose-900/60 px-1 rounded text-white">SameSite=None</code> without an Anti-CSRF token, the victim's browser automatically sent their authenticated session cookie with the cross-origin request.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 text-emerald-300 font-sans">
                  <p className="font-semibold text-emerald-200 text-xs">
                    Unauthorized Action Successfully Blocked!
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    {transferStatus === 'BLOCKED_SAMESITE_STRICT' && 'SameSite=Strict prevented the browser from attaching cookies on requests originating from evil-phishing.org.'}
                    {transferStatus === 'BLOCKED_SAMESITE_LAX' && 'SameSite=Lax withheld cookies because this was a cross-site POST form submission.'}
                    {transferStatus === 'BLOCKED_CSRF_TOKEN_MISMATCH' && 'The bank server required a secret anti-CSRF token that evil-phishing.org could not read due to the Same-Origin Policy.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
