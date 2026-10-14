import React, { useState } from 'react';
import { KeyRound, ShieldAlert, ShieldCheck, Cpu, RefreshCw, Zap } from 'lucide-react';

export const CryptoSim: React.FC = () => {
  const [passwordInput, setPasswordInput] = useState('P@ssword2026!');
  const [workFactor, setWorkFactor] = useState(12);

  // Deterministic mock hash generators for educational display
  const simpleMd5 = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex}e4b89f210d7a641c8821045f${hex.slice(0, 4)}`;
  };

  const mockBcrypt = (str: string, cost: number) => {
    const salt = '$2b$' + String(cost).padStart(2, '0') + '$eImiTXuWVxfM37uY4JANjQ';
    const fakeHash = 'd7a' + Math.abs(str.split('').reduce((a, b) => a + b.charCodeAt(0), 0) * 8923).toString(16).padEnd(31, 'f82a1c9');
    return `${salt}${fakeHash.slice(0, 31)}`;
  };

  const md5Hash = simpleMd5(passwordInput);
  const bcryptHash = mockBcrypt(passwordInput, workFactor);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            Cryptographic Hashing & Password Security Sandbox
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Compare vulnerable fast digest functions (MD5) against adaptive, salted, memory-hard algorithms (Bcrypt / Argon2id).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Enter Candidate Password
            </label>
            <input
              type="text"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              placeholder="Enter plaintext password..."
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Bcrypt Work Factor (2^{workFactor} iterations)</span>
              <span className="font-mono text-cyan-400 font-semibold">{workFactor}</span>
            </div>
            <input
              type="range"
              min="8"
              max="14"
              value={workFactor}
              onChange={(e) => setWorkFactor(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Each increment doubles the time required to hash or verify, dramatically increasing offline brute-force cracking costs for adversaries.
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-1.5 text-slate-400">
            <span className="font-semibold text-slate-300 block">Why Salting Matters:</span>
            <p className="text-[11px] leading-relaxed">
              Without a unique cryptographic salt, identical passwords produce identical hashes. Attackers use precomputed lookup tables (Rainbow Tables) to reverse unsalted MD5 hashes in less than 1 second.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {/* Unsalted MD5 */}
          <div className="bg-slate-950 border border-rose-500/40 rounded-xl p-4 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Vulnerable: Unsalted MD5 Fast Digest
              </span>
              <span className="text-rose-400 font-bold text-[11px]">BROKEN / CRACKABLE</span>
            </div>
            <div className="text-slate-400 text-[11px]">Computed 128-bit Hex Digest:</div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded text-rose-300 break-all">
              {md5Hash}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400 font-sans">
              <div>Cracking Speed: <strong className="text-rose-400 font-mono">~160 Billion / sec</strong> (RTX 4090)</div>
              <div>Rainbow Table Lookup: <strong className="text-rose-400 font-mono">Instant (O(1))</strong></div>
            </div>
          </div>

          {/* Salted Bcrypt */}
          <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Secure: Adaptive Salted Bcrypt Hash
              </span>
              <span className="text-emerald-400 font-bold text-[11px]">RESISTANT TO GPU CLUSTERS</span>
            </div>
            <div className="text-slate-400 text-[11px]">Modular Crypt Format (Salt + Work Factor + Hash):</div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded text-emerald-300 break-all">
              {bcryptHash}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400 font-sans">
              <div>Cracking Speed: <strong className="text-emerald-400 font-mono">~1,200 / sec</strong> (at work factor {workFactor})</div>
              <div>Rainbow Table Feasibility: <strong className="text-emerald-400 font-mono">Zero (Unique Salt)</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
