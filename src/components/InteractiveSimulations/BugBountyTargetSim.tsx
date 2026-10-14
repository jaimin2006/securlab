import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, AlertTriangle, FileText, Award, Copy, Check } from 'lucide-react';

export const BugBountyTargetSim: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState('api.acmefinance.com');
  const [selectedVulnType, setSelectedVulnType] = useState('idor');
  const [copied, setCopied] = useState(false);

  const assets = [
    { domain: 'api.acmefinance.com', inScope: true, tier: 'Tier 1 (Core Banking API)', bountyEligible: true },
    { domain: 'portal.acmefinance.com', inScope: true, tier: 'Tier 1 (Customer Web Portal)', bountyEligible: true },
    { domain: 'Acme Mobile App (iOS/Android)', inScope: true, tier: 'Tier 2 (Mobile Clients)', bountyEligible: true },
    { domain: 'payment-partner.thirdparty.com', inScope: false, tier: 'OUT OF SCOPE (Third-Party Provider)', bountyEligible: false },
    { domain: 'blog.acmefinance.com (WordPress)', inScope: false, tier: 'OUT OF SCOPE (Informational Blog)', bountyEligible: false }
  ];

  const vulnTypes = [
    { id: 'idor', label: 'IDOR (Broken Object Level Authorization)', severity: 'High', cvss: '7.5', allowed: true },
    { id: 'ssrf', label: 'SSRF in PDF Export Invoice Generator', severity: 'Critical', cvss: '9.1', allowed: true },
    { id: 'sqli', label: 'SQL Injection in Account Statements Filter', severity: 'Critical', cvss: '9.8', allowed: true },
    { id: 'ddos', label: 'Volumetric Layer 7 DDoS Stress Testing', severity: 'N/A', cvss: '0.0', allowed: false, note: 'Strictly Prohibited by Rules of Engagement!' },
    { id: 'spf', label: 'Missing SPF/DMARC Record (No PoC)', severity: 'Low', cvss: '2.0', allowed: false, note: 'Out of Scope per Program Exclusions' }
  ];

  const currentAsset = assets.find(a => a.domain === selectedAsset) || assets[0];
  const currentVuln = vulnTypes.find(v => v.id === selectedVulnType) || vulnTypes[0];

  const isValidSubmission = currentAsset.inScope && currentVuln.allowed;

  const sampleReportMarkdown = 
`# [BUG REPORT] ${currentVuln.label} on ${currentAsset.domain}

**Program**: Acme FinTech Vulnerability Disclosure Program (HackerOne)  
**Target Asset**: \`${currentAsset.domain}\`  
**Reported By**: Ethical Security Auditor  
**Date**: 2026-10-14  

---

### 1. Vulnerability Summary
During an authorized security assessment of \`${currentAsset.domain}\`, a **${currentVuln.label}** was identified. The vulnerability allows an authenticated attacker to bypass access controls and interact with unauthorized tenant records.

### 2. Severity & CVSS v3.1 Metrics
- **Severity Rating**: ${currentVuln.severity}
- **CVSS Score**: ${currentVuln.cvss}
- **Vector**: CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N

### 3. Step-by-Step Proof of Concept (PoC)
1. Authenticate to \`${currentAsset.domain}\` using standard test credentials.
2. Intercept the HTTP request using Burp Suite Proxy.
3. Observe target parameters and modify resource identifier.
4. Forward modified request and verify server returns HTTP 200 OK with foreign data.

### 4. Business & Technical Impact
Unauthorized exposure of confidential tenant data violates data privacy regulations (GDPR/PCI-DSS) and confidentiality boundaries.

### 5. Suggested Remediation
Enforce server-side session ownership validation before retrieving records from the persistence tier.`;

  const copyReport = () => {
    navigator.clipboard.writeText(sampleReportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Bug Bounty Scope Analyzer & Professional Report Generator
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Learn how ethical bug hunters read Program Policies on platforms like HackerOne and Bugcrowd, differentiate In-Scope vs Out-of-Scope assets, and draft triage-ready reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Target Asset Selection
            </label>
            <div className="space-y-1.5">
              {assets.map((asset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAsset(asset.domain)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors ${
                    selectedAsset === asset.domain
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-white font-medium">{asset.domain}</span>
                    <span className={`text-[10px] font-semibold ${asset.inScope ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {asset.inScope ? 'IN SCOPE' : 'OUT OF SCOPE'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{asset.tier}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Discovered Vulnerability Type
            </label>
            <div className="space-y-1.5">
              {vulnTypes.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVulnType(v.id)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors ${
                    selectedVulnType === v.id
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{v.label}</span>
                    <span className={`text-[10px] font-mono ${v.allowed ? 'text-amber-400' : 'text-rose-400'}`}>
                      CVSS {v.cvss}
                    </span>
                  </div>
                  {v.note && (
                    <div className="text-[10px] text-rose-400 mt-0.5 font-medium">{v.note}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className={`p-4 rounded-xl border ${
            isValidSubmission 
              ? 'bg-emerald-950/20 border-emerald-500/50' 
              : 'bg-rose-950/20 border-rose-500/50'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                {isValidSubmission ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                Scope & Policy Evaluation Result
              </span>
              <span className={`text-xs font-bold font-mono ${isValidSubmission ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isValidSubmission ? 'ELIGIBLE FOR BOUNTY & TRIAGE' : 'INVALID / POLICY VIOLATION'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {isValidSubmission ? (
                <>Asset <strong className="text-white">{currentAsset.domain}</strong> is strictly authorized in the program scope, and <strong className="text-white">{currentVuln.label}</strong> is an accepted vulnerability class with verified security impact.</>
              ) : !currentAsset.inScope ? (
                <>Testing <strong className="text-rose-300">{currentAsset.domain}</strong> violates the program Rules of Engagement! Third-party services or out-of-scope assets must never be probed without explicit written authorization.</>
              ) : (
                <>Testing technique <strong className="text-rose-300">{currentVuln.label}</strong> is explicitly banned under the program disclosure policy (e.g., DoS/DDoS or low-impact missing headers).</>
              )}
            </p>
          </div>

          {/* Formatted Report Draft */}
          {isValidSubmission && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Generated Triage Report Template (HackerOne / Bugcrowd Format)
                </span>
                <button
                  onClick={copyReport}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded flex items-center gap-1 text-[11px] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Markdown'}
                </button>
              </div>

              <pre className="text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-[220px] text-[11px] leading-relaxed bg-slate-900 p-3 rounded">
                {sampleReportMarkdown}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
