import React, { useState } from 'react';
import { Globe, Server, Cloud, ShieldAlert, ShieldCheck, ArrowRight, Key } from 'lucide-react';

export const SsrfSimulator: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState('http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2-Admin-Role');
  const [enableSsrfProtection, setEnableSsrfProtection] = useState(false);

  const presets = [
    { label: 'AWS EC2 Metadata (169.254.169.254)', url: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2-Admin-Role' },
    { label: 'Internal Redis Cache (127.0.0.1:6379)', url: 'http://127.0.0.1:6379/INFO' },
    { label: 'Private Microservice (10.0.1.20)', url: 'http://10.0.1.20:8000/api/internal/keys' },
    { label: 'Legitimate Public Asset (HTTPS CDN)', url: 'https://cdn.example.org/assets/avatar.png' }
  ];

  const isInternal = 
    targetUrl.includes('169.254.169.254') || 
    targetUrl.includes('127.0.0.1') || 
    targetUrl.includes('localhost') || 
    targetUrl.includes('10.0.1.20');

  const isBlocked = enableSsrfProtection && isInternal;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-rose-400" />
            Server-Side Request Forgery (SSRF) & Cloud Metadata Pivot Simulator
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Simulate how internal resource fetching without egress filtering allows attackers to query cloud link-local metadata (169.254.169.254) and steal IAM role credentials.
          </p>
        </div>

        <button
          onClick={() => setEnableSsrfProtection(!enableSsrfProtection)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
            enableSsrfProtection
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500 text-rose-300'
          }`}
        >
          {enableSsrfProtection ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
          SSRF Guard (RFC1918 + IMDSv2): {enableSsrfProtection ? 'ACTIVE (SECURE)' : 'OFF (VULNERABLE)'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Select Preset SSRF Target or Enter Custom URL
            </label>
            <div className="flex flex-col gap-1.5 mb-2.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTargetUrl(preset.url)}
                  className={`text-left text-xs p-2 rounded border transition-colors ${
                    targetUrl === preset.url
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-200 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-white">{preset.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{preset.url}</div>
                </button>
              ))}
            </div>

            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              POST /api/v1/import-url (Body Parameter):
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-1.5 text-slate-400">
            <span className="font-semibold text-slate-300 block">Why SSRF Bypasses Firewalls:</span>
            <p className="text-[11px] leading-relaxed">
              External perimeter firewalls inspect incoming packets. When an attacker sends <code className="text-cyan-300">targetUrl</code> to the application, the web server initiates an <em>outbound</em> connection from inside the trusted VPC network, bypassing external firewalls.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {/* Architecture hop visual */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <div className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-3">
              Network Request Hop Path:
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg w-full">
                <Globe className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <div className="font-semibold text-white">Attacker Browser</div>
                <div className="text-[10px] text-slate-400">Untrusted Client</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 sm:rotate-0" />
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg w-full">
                <Server className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="font-semibold text-white">Target Web Server</div>
                <div className="text-[10px] text-slate-400">DMZ (Pivoting Hop)</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 sm:rotate-0" />
              <div className={`p-2.5 border rounded-lg w-full ${isBlocked ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-rose-950/30 border-rose-500/50'}`}>
                <Cloud className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                <div className="font-semibold text-white">Internal Service / IMDS</div>
                <div className="text-[10px] text-slate-400">169.254.169.254</div>
              </div>
            </div>
          </div>

          {/* Response Payload */}
          <div className={`p-4 rounded-xl border font-mono text-xs ${
            isBlocked
              ? 'bg-emerald-950/30 border-emerald-500/80'
              : isInternal
                ? 'bg-rose-950/30 border-rose-500/80 text-rose-200'
                : 'bg-slate-950 border-slate-800 text-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
              <span className="font-semibold uppercase tracking-wider text-xs">
                {isBlocked ? 'Blocked by SSRF Guard Middleware' : 'Server Fetch Response'}
              </span>
              <span className={`text-[11px] font-bold ${isBlocked ? 'text-emerald-400' : isInternal ? 'text-rose-400' : 'text-cyan-400'}`}>
                {isBlocked ? 'HTTP 403 FORBIDDEN' : 'HTTP 200 OK'}
              </span>
            </div>

            {isBlocked ? (
              <div className="space-y-2 text-emerald-300">
                <p className="font-sans font-semibold text-emerald-200">
                  SSRF Attempt Successfully Neutralized!
                </p>
                <p className="font-sans text-[11px] text-slate-300">
                  The DNS resolver resolved target to a reserved link-local/RFC1918 subnet. The outgoing request was terminated before reaching the socket layer.
                </p>
                <pre className="p-2.5 bg-slate-900 rounded text-slate-400 text-[11px]">
{`{
  "error": "Forbidden Egress Destination",
  "reason": "Destination IP falls within link-local cloud metadata range (169.254.0.0/16)",
  "remediation": "Enforce IMDSv2 token header (X-aws-ec2-metadata-token) and IP allowlist"
}`}
                </pre>
              </div>
            ) : isInternal ? (
              <div className="space-y-2 text-rose-300">
                <div className="flex items-center gap-1.5 text-rose-300 font-sans font-bold text-xs">
                  <Key className="w-4 h-4 text-amber-400" />
                  CRITICAL: Temporary AWS Cloud IAM Credentials Exfiltrated!
                </div>
                <pre className="p-3 bg-slate-950 rounded text-amber-300 text-[11px] overflow-x-auto leading-relaxed">
{JSON.stringify({
  Code: "Success",
  Type: "AWS-HMAC",
  AccessKeyId: "ASIAQWERTYEXAMPLEKEY",
  SecretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  Token: "FQoGZXIvYXdzEAAA...temporary_session_token",
  Expiration: "2026-10-14T18:30:00Z",
  RoleArn: "arn:aws:iam::123456789012:role/ProductionCloudAdmin"
}, null, 2)}
                </pre>
                <p className="font-sans text-[11px] text-rose-300">
                  Attacker can now use the AWS CLI with these credentials to exfiltrate S3 buckets, snapshot databases, or deploy unauthorized cloud infrastructure.
                </p>
              </div>
            ) : (
              <div className="text-slate-300 font-sans text-xs">
                Asset successfully downloaded from public CDN: <code className="text-cyan-300">200 OK (image/png, 48 KB)</code>.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
