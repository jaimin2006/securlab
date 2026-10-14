import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Cpu, ArrowRight, Check, X, FileText } from 'lucide-react';

export const WafSimulator: React.FC = () => {
  const [payload, setPayload] = useState("1' OR '1'='1' --");
  const [wafMode, setWafMode] = useState<'off' | 'basic_regex' | 'owasp_crs'>('owasp_crs');
  const [anomalyThreshold, setAnomalyThreshold] = useState(5);
  
  const presets = [
    { label: 'SQL Injection', text: "1' OR '1'='1' --", type: 'sqli' },
    { label: 'Cross-Site Scripting (XSS)', text: "<script>alert(document.cookie)</script>", type: 'xss' },
    { label: 'Path Traversal', text: "../../../../etc/passwd", type: 'lfi' },
    { label: 'Cloud Metadata SSRF', text: "http://169.254.169.254/latest/meta-data/", type: 'ssrf' },
    { label: 'Obfuscated SQLi Bypass', text: "1'/**/UNION/**/SELECT/**/1,password/**/FROM/**/users#", type: 'sqli' },
    { label: 'Legitimate Request', text: "search=cybersecurity+textbooks&page=1", type: 'clean' }
  ];

  // Evaluation logic
  const evaluate = () => {
    if (wafMode === 'off') {
      return {
        action: 'ALLOW',
        status: 200,
        score: 0,
        triggeredRules: [],
        details: 'WAF inspection is disabled. Request passed directly to backend application.'
      };
    }

    const lower = payload.toLowerCase();
    const decoded = decodeURIComponent(payload).toLowerCase();
    const rulesTriggered: { id: number; name: string; score: number; regex: string }[] = [];

    if (wafMode === 'basic_regex') {
      // Basic signature regex (easily bypassed)
      if (lower.includes("' or 1=1") || lower.includes("<script>")) {
        return {
          action: 'BLOCK',
          status: 403,
          score: 10,
          triggeredRules: [{ id: 1001, name: 'Basic String Match', score: 10, regex: "' or 1=1 | <script>" }],
          details: 'Blocked by rudimentary keyword signature filter.'
        };
      }
      return {
        action: 'ALLOW',
        status: 200,
        score: 0,
        triggeredRules: [],
        details: 'Passed basic signature filter (vulnerable to comment obfuscation & encoding bypasses!).'
      };
    }

    // OWASP CRS Model (Anomaly scoring + libinjection detection)
    if (decoded.includes("'") && (decoded.includes("or") || decoded.includes("union") || decoded.includes("--") || decoded.includes("#"))) {
      rulesTriggered.push({
        id: 942100,
        name: 'CRS-942100: SQL Injection Attack Detected via LibInjection',
        score: 5,
        regex: 'libinjection tokenized AST evaluation'
      });
    }
    if (decoded.includes("<script") || decoded.includes("alert(") || decoded.includes("onerror=")) {
      rulesTriggered.push({
        id: 941100,
        name: 'CRS-941100: XSS Filter - Script Tag or Event Handler Detected',
        score: 5,
        regex: '(?i)<script[^>]*>|onerror='
      });
    }
    if (decoded.includes("../") || decoded.includes("..\\") || decoded.includes("/etc/passwd")) {
      rulesTriggered.push({
        id: 930100,
        name: 'CRS-930100: Path Traversal Attack (/../ sequence)',
        score: 5,
        regex: '(?i)(?:\\.\\./|\\.\\.\\\\)'
      });
    }
    if (decoded.includes("169.254.169.254") || decoded.includes("localhost") || decoded.includes("127.0.0.1")) {
      rulesTriggered.push({
        id: 934100,
        name: 'CRS-934100: SSRF Cloud Metadata / Loopback Address Detection',
        score: 5,
        regex: '(?:169\\.254\\.169\\.254|127\\.0\\.0\\.1)'
      });
    }

    const totalScore = rulesTriggered.reduce((acc, r) => acc + r.score, 0);
    const blocked = totalScore >= anomalyThreshold;

    return {
      action: blocked ? 'BLOCK' : 'ALLOW',
      status: blocked ? 403 : 200,
      score: totalScore,
      triggeredRules: rulesTriggered,
      details: blocked 
        ? `Request blocked! Cumulative anomaly score (${totalScore}) reached blocking threshold (${anomalyThreshold}).`
        : totalScore > 0 
          ? `Request allowed with warnings. Anomaly score (${totalScore}) below blocking threshold (${anomalyThreshold}).`
          : 'Clean request. Zero malicious tokens identified across OWASP CRS rulesets.'
    };
  };

  const result = evaluate();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Layer 7 Web Application Firewall (WAF) Rule Engine Simulator
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Test how canonical normalization, libinjection heuristics, and OWASP Core Rule Set (CRS) anomaly scoring evaluate untrusted payloads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Mode:</span>
          <div className="inline-flex rounded-lg border border-slate-700 p-1 bg-slate-950">
            <button
              onClick={() => setWafMode('off')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${wafMode === 'off' ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Disabled
            </button>
            <button
              onClick={() => setWafMode('basic_regex')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${wafMode === 'basic_regex' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Basic Regex
            </button>
            <button
              onClick={() => setWafMode('owasp_crs')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${wafMode === 'owasp_crs' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              OWASP CRS (Scoring)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Select Preset Attack Vector or Custom Input
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPayload(preset.text)}
                  className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${
                    payload === preset.text 
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300' 
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              placeholder="Enter HTTP parameter payload to inspect..."
            />
          </div>

          {wafMode === 'owasp_crs' && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Anomaly Blocking Threshold</span>
                <span className="font-mono text-cyan-400 font-semibold">{anomalyThreshold} Points</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={anomalyThreshold}
                onChange={(e) => setAnomalyThreshold(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                In CRS, individual rule hits accumulate anomaly points (Critical = 5, Error = 4, Warning = 3). If total points ≥ threshold, the transaction is rejected with 403 Forbidden.
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className={`p-4 rounded-xl border ${result.action === 'BLOCK' ? 'bg-rose-950/20 border-rose-500/50' : 'bg-emerald-950/20 border-emerald-500/40'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                {result.action === 'BLOCK' ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                )}
                <span className={`text-sm font-bold tracking-wide ${result.action === 'BLOCK' ? 'text-rose-300' : 'text-emerald-300'}`}>
                  WAF DECISION: {result.action === 'BLOCK' ? 'HTTP 403 FORBIDDEN (BLOCKED)' : 'HTTP 200 OK (FORWARDED TO APP)'}
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400">
                Score: <strong className="text-white">{result.score}</strong> / {anomalyThreshold}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {result.details}
            </p>

            {result.triggeredRules.length > 0 && (
              <div className="mt-3.5 space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Triggered Rule Matches:
                </div>
                {result.triggeredRules.map((rule) => (
                  <div key={rule.id} className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg text-xs font-mono space-y-1">
                    <div className="text-rose-400 font-semibold flex items-center justify-between">
                      <span>[{rule.id}] {rule.name}</span>
                      <span className="text-slate-400">+{rule.score} pts</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Evaluator: <span className="text-slate-300">{rule.regex}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Defense-in-Depth Analysis
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Notice how the <strong>OWASP CRS</strong> catches obfuscated SQLi (such as comments <code className="text-cyan-300">/**/UNION/**/</code>) while a <strong>Basic Regex</strong> is easily bypassed. However, a WAF should never replace proper parameterized queries in the database driver.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
