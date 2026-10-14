import React, { useState } from 'react';
import { Database, AlertTriangle, CheckCircle, Code, Shield } from 'lucide-react';

export const SqlInjectionSim: React.FC = () => {
  const [usernameInput, setUsernameInput] = useState("' OR 1=1 --");
  const [passwordInput, setPasswordInput] = useState("any_password");
  const [usePreparedStatement, setUsePreparedStatement] = useState(false);

  const presets = [
    { label: "Classic Auth Bypass", val: "' OR 1=1 --" },
    { label: "Admin Comment Truncate", val: "admin' --" },
    { label: "UNION Database Schema Dump", val: "' UNION SELECT 1, 'admin', 'FLAG{db_leaked_hash}' --" },
    { label: "Benign Valid Username", val: "john_doe" }
  ];

  // Evaluate query outcome
  const isBypass = !usePreparedStatement && (
    usernameInput.includes("' OR 1=1") || 
    usernameInput.includes("' or 1=1") || 
    usernameInput.includes("admin' --") ||
    usernameInput.includes("UNION SELECT")
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            SQL Injection vs Parameterized Prepared Statements Workbench
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Compare vulnerable dynamic string concatenation with database driver prepared statements and abstract syntax tree (AST) compilation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUsePreparedStatement(!usePreparedStatement)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              usePreparedStatement
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500 text-rose-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Database Driver: {usePreparedStatement ? 'PREPARED STATEMENT (SAFE)' : 'STRING CONCATENATION (VULNERABLE)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Preset Injection Payloads
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUsernameInput(p.val)}
                  className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${
                    usernameInput === p.val
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Username Input:
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Password Input:
            </label>
            <input
              type="text"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-1.5 text-slate-400">
            <span className="font-semibold text-slate-300 block">Abstract Syntax Tree (AST) Mechanics:</span>
            <p className="text-[11px] leading-relaxed">
              In dynamic concatenation, user quotes break out of the string literal boundary, changing the SQL grammer parse tree so that <code className="text-rose-400 font-mono">1=1</code> becomes a Boolean OR condition evaluated by the database parser.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
            <div className="text-slate-400 flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-semibold">Backend Database Engine Query Assembly</span>
              <span className="text-[11px] text-cyan-400">{usePreparedStatement ? 'Driver Bound Parameters' : 'Raw Interpolated String'}</span>
            </div>

            {usePreparedStatement ? (
              <div className="space-y-2">
                <div className="text-slate-400 text-[11px]">Compiled Query Template (Parsed Once):</div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-emerald-400">
                  SELECT id, username, role FROM users WHERE username = <strong className="text-amber-400">?</strong> AND password_hash = <strong className="text-amber-400">?</strong>
                </div>
                <div className="text-slate-400 text-[11px] pt-1">Parameters Transmitted Separately as Raw String Literals:</div>
                <div className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded text-cyan-300">
                  Param 1 = {JSON.stringify(usernameInput)}<br />
                  Param 2 = {JSON.stringify(passwordInput)}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-slate-400 text-[11px]">Raw Concatenated String Sent to SQL Parser:</div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded leading-relaxed break-all">
                  <span className="text-slate-400">SELECT id, username, role FROM users WHERE username = '</span>
                  <span className="text-rose-400 font-bold bg-rose-950/60 px-1 rounded">{usernameInput}</span>
                  <span className="text-slate-400">' AND password_hash = '</span>
                  <span className="text-slate-300">{passwordInput}</span>
                  <span className="text-slate-400">'</span>
                </div>
              </div>
            )}
          </div>

          {/* Database Query Result */}
          <div className={`p-4 rounded-xl border ${
            isBypass 
              ? 'bg-rose-950/30 border-rose-500/80' 
              : usePreparedStatement && usernameInput.includes("'")
                ? 'bg-emerald-950/30 border-emerald-500/80'
                : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                {isBypass ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                Execution Outcome
              </span>
              <span className={`text-xs font-mono font-bold ${isBypass ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isBypass ? 'AUTHENTICATION BYPASSED' : usePreparedStatement ? 'QUERY NEUTRALIZED' : 'LOGIN FAILED (SAFE)'}
              </span>
            </div>

            <div className="mt-3 text-xs leading-relaxed font-mono">
              {isBypass ? (
                <div className="space-y-2 text-rose-300">
                  <p className="font-sans font-semibold text-rose-200">
                    CRITICAL: SQL Injection Succeeded!
                  </p>
                  <p className="font-sans text-[11px] text-rose-300">
                    The condition <code className="bg-rose-900/60 px-1 py-0.5 rounded text-white">OR 1=1</code> evaluated to true for every row in the users table, and the double dash (<code className="bg-rose-900/60 px-1 py-0.5 rounded text-white">--</code>) commented out password checking.
                  </p>
                  <pre className="p-2 bg-slate-950 rounded text-emerald-300 text-[11px]">
{JSON.stringify([
  { id: 1, username: "admin", role: "superuser", token: "eyJhbGciOiJIUzI1Ni..." },
  { id: 2, username: "db_operator", role: "dba" }
], null, 2)}
                  </pre>
                </div>
              ) : usePreparedStatement ? (
                <div className="space-y-1.5 text-emerald-300">
                  <p className="font-sans font-semibold text-emerald-200">
                    Safe Execution via Parameterized Query
                  </p>
                  <p className="font-sans text-[11px] text-slate-300">
                    The database searched for a literal username matching exactly the text <code className="bg-slate-900 px-1 rounded text-cyan-300">{usernameInput}</code>. No syntax breakout occurred. Zero rows returned.
                  </p>
                </div>
              ) : (
                <div className="text-slate-400 font-sans text-xs">
                  User not found. Authentication rejected with 401 Unauthorized.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
