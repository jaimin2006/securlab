import React, { useState } from 'react';
import { TopicItem } from '../../types/security';
import { NetworkProbingSim } from './NetworkProbingSim';
import { WafSimulator } from './WafSimulator';
import { BurpWorkbenchSim } from './BurpWorkbenchSim';
import { IdorSimulator } from './IdorSimulator';
import { SqlInjectionSim } from './SqlInjectionSim';
import { SsrfSimulator } from './SsrfSimulator';
import { CsrfSimulator } from './CsrfSimulator';
import { FileUploadSim } from './FileUploadSim';
import { BugBountyTargetSim } from './BugBountyTargetSim';
import { CryptoSim } from './CryptoSim';
import { Shield, AlertTriangle, CheckCircle2, Lock, FileCode, Database, Terminal, RefreshCw } from 'lucide-react';

interface SimulationHubProps {
  topic: TopicItem;
}

export const SimulationHub: React.FC<SimulationHubProps> = ({ topic }) => {
  switch (topic.simulationType) {
    case 'network_probing':
      return <NetworkProbingSim />;
    case 'waf_rules':
      return <WafSimulator />;
    case 'burp_proxy':
      return <BurpWorkbenchSim />;
    case 'idor_access_control':
      return <IdorSimulator />;
    case 'crypto_failures':
      return <CryptoSim />;
    case 'injection_attacks':
      return <SqlInjectionSim />;
    case 'ssrf_attack':
      return <SsrfSimulator />;
    case 'csrf_attack':
      return <CsrfSimulator />;
    case 'file_upload':
      return <FileUploadSim />;
    case 'bug_hunting_scope':
      return <BugBountyTargetSim />;
    
    // Dedicated interactive sandboxes for the remaining topics
    case 'insecure_design':
      return <InsecureDesignSandbox />;
    case 'misconfiguration':
      return <MisconfigurationSandbox />;
    case 'outdated_components':
      return <OutdatedComponentsSandbox />;
    case 'auth_failures':
      return <AuthFailuresSandbox />;
    case 'data_integrity':
      return <DataIntegritySandbox />;
    case 'logging_monitoring':
      return <LoggingMonitoringSandbox />;
    case 'owasp_overview':
    default:
      return <OwaspOverviewSandbox />;
  }
};

/* --- Supplementary Topic Sandboxes --- */

const InsecureDesignSandbox: React.FC = () => {
  const [cartQuantity, setCartQuantity] = useState(-2);
  const [itemPrice] = useState(150);
  const [enforceBoundaryRules, setEnforceBoundaryRules] = useState(false);

  const calculateTotal = () => {
    if (enforceBoundaryRules) {
      const validQty = Math.max(1, Math.min(50, cartQuantity));
      return validQty * itemPrice;
    }
    return cartQuantity * itemPrice;
  };

  const total = calculateTotal();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Insecure Design: Business Logic Invariant Flaw Sandbox
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Observe how lacking business logic boundary rules allows clients to submit negative quantities to artificially reduce cart totals.
          </p>
        </div>
        <button
          onClick={() => setEnforceBoundaryRules(!enforceBoundaryRules)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
            enforceBoundaryRules ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-rose-950/60 border-rose-500 text-rose-300'
          }`}
        >
          Domain Invariant Enforcement: {enforceBoundaryRules ? 'ENABLED' : 'DISABLED'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Item: Enterprise Cloud License ($150.00 / seat)
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Order Quantity:</span>
            <input
              type="number"
              value={cartQuantity}
              onChange={(e) => setCartQuantity(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs font-mono text-cyan-300 w-24"
            />
          </div>
          <div className="text-[11px] text-slate-400">
            Try inputting <code className="text-rose-400">-1</code> or <code className="text-rose-400">-5</code> to test cart underflow exploitation.
          </div>
        </div>

        <div className={`p-4 rounded-xl border font-mono text-xs ${
          total < 0 
            ? 'bg-rose-950/30 border-rose-500/80 text-rose-200' 
            : 'bg-slate-950 border-slate-800 text-slate-200'
        }`}>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Calculated Checkout Invoice:</div>
          <div className="text-lg font-bold">
            Total Due: <span className={total < 0 ? 'text-rose-400' : 'text-emerald-400'}>${total.toFixed(2)}</span>
          </div>
          <p className="font-sans text-xs mt-2 text-slate-400">
            {total < 0 ? (
              <strong className="text-rose-300">
                CRITICAL FLAW: The merchant now owes the customer ${Math.abs(total).toFixed(2)}! This design flaw cannot be fixed by a simple SQL injection sanitizer.
              </strong>
            ) : (
              'Business invariant validated: Quantity bounded to positive integer range [1..50].'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const MisconfigurationSandbox: React.FC = () => {
  const [showVerboseErrors, setShowVerboseErrors] = useState(true);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            Security Misconfiguration: Verbose Error Stack Trace Simulator
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Compare public error disclosure leaking internal database schemas and filesystem directories versus sanitized reference IDs.
          </p>
        </div>
        <button
          onClick={() => setShowVerboseErrors(!showVerboseErrors)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
            !showVerboseErrors ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-rose-950/60 border-rose-500 text-rose-300'
          }`}
        >
          Production Error Masking: {!showVerboseErrors ? 'ACTIVE' : 'DISABLED (LEAKING)'}
        </button>
      </div>

      <div className="mt-5">
        <div className={`p-4 rounded-xl border font-mono text-xs ${
          showVerboseErrors ? 'bg-rose-950/20 border-rose-500/60 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-slate-400 mb-2">
            <span>HTTP/1.1 500 Internal Server Error</span>
            <span className="text-[11px]">{showVerboseErrors ? 'VERBOSE DEBUG ACTIVE' : 'SANITIZED RESPONSE'}</span>
          </div>
          {showVerboseErrors ? (
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-rose-300">
{`UnhandledException: SequelizeDatabaseError: relation "auth_tokens" does not exist
  at Query.run (/var/www/internal-app/node_modules/sequelize/lib/dialects/postgres/query.js:50:25)
  at processTicksAndRejections (node:internal/process/task_queues:95:5)
  Database: PostgreSQL 15.2 (Ubuntu 22.04) on 10.0.4.12:5432
  Connection String: postgres://app_dba:P@ssw0rd2026!@10.0.4.12/finance_db
  Internal File: /var/www/internal-app/src/controllers/auth.controller.ts:114`}
            </pre>
          ) : (
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
{`{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred while processing your request.",
  "incidentId": "ERR-9482-10492"
}`}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

const OutdatedComponentsSandbox: React.FC = () => {
  const [packages, setPackages] = useState([
    { name: 'lodash', version: '4.17.4', status: 'Vulnerable (CVE-2019-10744)', severity: 'High', patched: '4.17.21' },
    { name: 'axios', version: '0.21.1', status: 'Vulnerable (CVE-2021-3749)', severity: 'High', patched: '1.7.4' },
    { name: 'jsonwebtoken', version: '8.5.1', status: 'Vulnerable (CVE-2022-23529)', severity: 'Critical', patched: '9.0.2' },
    { name: 'express', version: '4.17.1', status: 'Vulnerable (CVE-2024-29041)', severity: 'Medium', patched: '4.21.2' }
  ]);
  const [isAudited, setIsAudited] = useState(false);

  const applyPatches = () => {
    setPackages(packages.map(p => ({
      ...p,
      version: p.patched,
      status: 'Clean (Secure & Patched)',
      severity: 'Safe'
    })));
    setIsAudited(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Software Composition Analysis (SCA) & CVE Patching Simulator
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Simulate automated dependency scanning with npm audit / Snyk to detect known CVE vulnerabilities in third-party libraries.
          </p>
        </div>
        <button
          onClick={applyPatches}
          disabled={isAudited}
          className="px-3.5 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {isAudited ? 'All Dependencies Patched' : 'Run SCA Audit & Upgrade Versions'}
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Package</th>
              <th className="py-2.5 px-3">Current Version</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">Recommended Fix</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {packages.map((pkg, i) => (
              <tr key={i} className="hover:bg-slate-950/40">
                <td className="py-2.5 px-3 font-semibold text-white">{pkg.name}</td>
                <td className="py-2.5 px-3 text-cyan-300">{pkg.version}</td>
                <td className="py-2.5 px-3">
                  <span className={pkg.severity === 'Safe' ? 'text-emerald-400' : 'text-rose-400'}>
                    {pkg.status}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    pkg.severity === 'Critical' ? 'bg-rose-950 text-rose-300' :
                    pkg.severity === 'High' ? 'bg-amber-950 text-amber-300' :
                    pkg.severity === 'Medium' ? 'bg-yellow-950 text-yellow-300' :
                    'bg-emerald-950 text-emerald-300'
                  }`}>
                    {pkg.severity}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-400">Upgrade to &gt;={pkg.patched}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AuthFailuresSandbox: React.FC = () => {
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedOut, setLockedOut] = useState(false);

  const simulateFailedGuess = () => {
    if (failedAttempts + 1 >= 5) {
      setLockedOut(true);
    }
    setFailedAttempts(prev => prev + 1);
  };

  const resetLockout = () => {
    setFailedAttempts(0);
    setLockedOut(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-400" />
            Authentication & Brute Force Rate-Limiting Simulator
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Simulate credential stuffing attacks and progressive IP lockout protection.
          </p>
        </div>
        <button
          onClick={resetLockout}
          className="px-3 py-1 text-xs text-cyan-400 hover:text-cyan-300 border border-slate-700 rounded"
        >
          Reset Session Lockout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <div className="space-y-3">
          <div className="text-xs text-slate-400">Failed Login Attempts: <strong className="text-white font-mono">{failedAttempts}</strong> / 5</div>
          <button
            onClick={simulateFailedGuess}
            disabled={lockedOut}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            {lockedOut ? 'Account Temporarily Locked' : 'Simulate Automated Password Guess'}
          </button>
          <p className="text-[11px] text-slate-400">
            Without rate limiting, botnets can submit over 10,000 guesses per second against authentication endpoints.
          </p>
        </div>

        <div className={`p-4 rounded-xl border font-mono text-xs ${
          lockedOut ? 'bg-rose-950/30 border-rose-500/80 text-rose-200' : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Defense Status:</div>
          {lockedOut ? (
            <div className="space-y-2">
              <div className="text-rose-400 font-bold">429 TOO MANY REQUESTS</div>
              <p className="font-sans text-xs text-rose-300">
                Rate limiter triggered! IP has been placed in a 15-minute cooldown. Credential stuffing attack completely neutralized.
              </p>
            </div>
          ) : (
            <div className="text-slate-400 font-sans text-xs">
              Authentication gateway listening. Allowed attempts remaining: {Math.max(0, 5 - failedAttempts)}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DataIntegritySandbox: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <h4 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
        <FileCode className="w-5 h-5 text-amber-400" />
        Data Integrity: Safe JSON Schema vs Unsafe Deserialization
      </h4>
      <p className="text-xs text-slate-400 mb-4">
        Serialized object payloads (Java ObjectInputStream, Python pickle, PHP unserialize) allow attackers to invoke gadget chains that execute arbitrary code.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-3 bg-slate-950 border border-rose-500/40 rounded-lg space-y-2">
          <div className="text-rose-400 font-bold">Vulnerable: Python Pickle Unpickling</div>
          <div className="text-[11px] text-slate-300">pickle.loads(raw_user_bytes)</div>
          <p className="font-sans text-[11px] text-rose-300">
            Can trigger <code className="text-white">__reduce__()</code> method to spawn a reverse shell immediately upon deserialization!
          </p>
        </div>
        <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded-lg space-y-2">
          <div className="text-emerald-400 font-bold">Secure: Typed JSON + HMAC Signature</div>
          <div className="text-[11px] text-slate-300">json.loads(data) with HMAC-SHA256 verification</div>
          <p className="font-sans text-[11px] text-emerald-300">
            JSON parser only instantiates data primitives (strings, numbers, arrays). Cannot execute code or instantiate arbitrary classes.
          </p>
        </div>
      </div>
    </div>
  );
};

const LoggingMonitoringSandbox: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <h4 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
        <Terminal className="w-5 h-5 text-cyan-400" />
        Security Logging & Log Injection (CRLF) Prevention
      </h4>
      <p className="text-xs text-slate-400 mb-4">
        Unsanitized log inputs allow attackers to inject newline characters (\r\n) to forge fake log lines or confuse SIEM analytics.
      </p>
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono space-y-2">
        <div className="text-slate-400">Structured JSON Log Entry (SIEM Compliant):</div>
        <pre className="text-emerald-400 overflow-x-auto text-[11px]">
{JSON.stringify({
  timestamp: "2026-10-14T12:54:30.102Z",
  level: "WARN",
  event: "ACCESS_CONTROL_VIOLATION",
  client_ip: "192.168.1.104",
  user_id: 1042,
  requested_resource: "/api/documents/1001",
  result: "BLOCKED_403"
}, null, 2)}
        </pre>
      </div>
    </div>
  );
};

const OwaspOverviewSandbox: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <h4 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
        <Shield className="w-5 h-5 text-cyan-400" />
        OWASP Risk Calculation Methodology
      </h4>
      <p className="text-xs text-slate-400 mb-4">
        OWASP assesses risk using: <strong>Risk = Likelihood × Impact</strong>, incorporating exploitability, prevalence, detectability, and business consequence.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <div className="font-semibold text-rose-400">A01: Broken Access Control</div>
          <div className="text-[11px] text-slate-400 mt-1">94% of tested apps had access control flaws. #1 highest category.</div>
        </div>
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <div className="font-semibold text-amber-400">A02: Cryptographic Failures</div>
          <div className="text-[11px] text-slate-400 mt-1">Exposes sensitive data due to weak encryption or unsalted hashes.</div>
        </div>
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <div className="font-semibold text-cyan-400">A03: Injection</div>
          <div className="text-[11px] text-slate-400 mt-1">100% mitigated by parameterized prepared statements.</div>
        </div>
      </div>
    </div>
  );
};
