import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle2, AlertOctagon, ShieldCheck, ShieldAlert, HardDrive } from 'lucide-react';

export const FileUploadSim: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; magicBytes: string; isShell: boolean }>({
    name: 'cmd_shell.php',
    type: 'application/x-php',
    magicBytes: '3C 3F 70 68 70 (<?php)',
    isShell: true
  });

  const [validationTier, setValidationTier] = useState<'client_only' | 'server_blacklist' | 'strict_whitelist_uuid'>('server_blacklist');
  const [uploadResult, setUploadResult] = useState<{ status: 'RCE_SUCCESS' | 'BLOCKED' | 'UPLOAD_SAFE'; message: string; path?: string } | null>(null);

  const testFiles = [
    { name: 'cmd_shell.php', type: 'application/x-php', magicBytes: '3C 3F 70 68 70 (<?php)', isShell: true, label: 'Standard PHP Web Shell (.php)' },
    { name: 'avatar_double.php.png', type: 'image/png', magicBytes: '3C 3F 70 68 70 (<?php)', isShell: true, label: 'Double Extension (.php.png)' },
    { name: 'script.phtml', type: 'application/x-phtml', magicBytes: '3C 3F 70 68 70 (<?php)', isShell: true, label: 'Alternative Executable Extension (.phtml)' },
    { name: 'valid_photo.png', type: 'image/png', magicBytes: '89 50 4E 47 0D 0A 1A 0A (PNG)', isShell: false, label: 'Legitimate PNG Photo' }
  ];

  const handleUpload = () => {
    if (validationTier === 'client_only') {
      if (selectedFile.isShell) {
        setUploadResult({
          status: 'RCE_SUCCESS',
          message: 'CRITICAL: Web shell executed! Client-side JS was bypassed in proxy; server saved file into /var/www/html/uploads/ with executable permissions.',
          path: `/uploads/${selectedFile.name}`
        });
      } else {
        setUploadResult({
          status: 'UPLOAD_SAFE',
          message: 'File uploaded successfully to web root.',
          path: `/uploads/${selectedFile.name}`
        });
      }
    } else if (validationTier === 'server_blacklist') {
      // Blacklist only blocks exact .php
      if (selectedFile.name.endsWith('.php')) {
        setUploadResult({
          status: 'BLOCKED',
          message: 'Rejected by server extension blacklist: ".php" is not allowed.'
        });
      } else if (selectedFile.isShell) {
        // .phtml or .php.png slipped past blacklist!
        setUploadResult({
          status: 'RCE_SUCCESS',
          message: 'CRITICAL: Extension Blacklist Bypassed! File (.phtml or double extension) was saved and executed by the PHP handler.',
          path: `/uploads/${selectedFile.name}`
        });
      } else {
        setUploadResult({
          status: 'UPLOAD_SAFE',
          message: 'File uploaded safely.',
          path: `/uploads/${selectedFile.name}`
        });
      }
    } else {
      // Strict whitelist + magic bytes inspection + UUID outside web root
      if (selectedFile.magicBytes.includes('<?php')) {
        setUploadResult({
          status: 'BLOCKED',
          message: 'Blocked by server magic bytes inspection! File content detected as PHP code, not matching valid image binary signature.'
        });
      } else if (!selectedFile.name.endsWith('.png')) {
        setUploadResult({
          status: 'BLOCKED',
          message: 'Blocked: Extension not in strict whitelist [.png, .jpg, .webp].'
        });
      } else {
        setUploadResult({
          status: 'UPLOAD_SAFE',
          message: 'Securely saved to isolated private object storage bucket with randomized UUID filename.',
          path: `s3://private-bucket/c9d2f0a1-4e8b-4a7f-9b21.png`
        });
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-rose-400" />
            File Upload Security & Web Shell Execution Simulator
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Test how weak extension filters allow web shell uploads leading to Remote Code Execution (RCE) versus server-side magic byte inspection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Select Sample File to Upload
            </label>
            <div className="space-y-1.5 mb-3">
              {testFiles.map((file, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedFile(file);
                    setUploadResult(null);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors ${
                    selectedFile.name === file.name
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-200 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-white">{file.name}</span>
                    <span className={`text-[10px] ${file.isShell ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {file.isShell ? 'Web Shell' : 'Clean Asset'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{file.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Server-Side Defense Strategy
            </label>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded cursor-pointer">
                <input
                  type="radio"
                  name="tier"
                  checked={validationTier === 'client_only'}
                  onChange={() => {
                    setValidationTier('client_only');
                    setUploadResult(null);
                  }}
                  className="accent-cyan-500"
                />
                <div>
                  <div className="font-semibold text-slate-200">1. Client-Side JavaScript Only</div>
                  <div className="text-[10px] text-slate-400">Trivially bypassed via Burp Suite Proxy</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded cursor-pointer">
                <input
                  type="radio"
                  name="tier"
                  checked={validationTier === 'server_blacklist'}
                  onChange={() => {
                    setValidationTier('server_blacklist');
                    setUploadResult(null);
                  }}
                  className="accent-cyan-500"
                />
                <div>
                  <div className="font-semibold text-slate-200">2. Extension Blacklist (.php only)</div>
                  <div className="text-[10px] text-slate-400">Vulnerable to .phtml, .php5, or double extensions</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded cursor-pointer">
                <input
                  type="radio"
                  name="tier"
                  checked={validationTier === 'strict_whitelist_uuid'}
                  onChange={() => {
                    setValidationTier('strict_whitelist_uuid');
                    setUploadResult(null);
                  }}
                  className="accent-cyan-500"
                />
                <div>
                  <div className="font-semibold text-emerald-400">3. Defense-in-Depth (Magic Bytes + UUID + S3)</div>
                  <div className="text-[10px] text-slate-400">Inspects binary header; stores outside web root</div>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={handleUpload}
            className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Upload File to Server
          </button>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <div className="text-slate-400 uppercase tracking-wider text-[11px] font-semibold mb-2">
              File Properties & Header Inspection:
            </div>
            <div className="p-3 bg-slate-900 rounded-lg space-y-2 text-slate-300">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Supplied Filename:</span>
                <span className="text-white font-bold">{selectedFile.name}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Client Content-Type:</span>
                <span className="text-cyan-400">{selectedFile.type}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Binary Magic Bytes Header:</span>
                <span className={selectedFile.isShell ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {selectedFile.magicBytes}
                </span>
              </div>
            </div>
          </div>

          {uploadResult && (
            <div className={`p-4 rounded-xl border font-mono text-xs ${
              uploadResult.status === 'RCE_SUCCESS'
                ? 'bg-rose-950/30 border-rose-500/80 text-rose-200'
                : uploadResult.status === 'BLOCKED'
                  ? 'bg-amber-950/30 border-amber-500/80 text-amber-200'
                  : 'bg-emerald-950/30 border-emerald-500/80 text-emerald-300'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                <span className="font-semibold uppercase tracking-wider text-xs flex items-center gap-1.5">
                  {uploadResult.status === 'RCE_SUCCESS' ? (
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                  ) : uploadResult.status === 'BLOCKED' ? (
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  )}
                  {uploadResult.status === 'RCE_SUCCESS' ? 'REMOTE CODE EXECUTION (RCE)' : uploadResult.status === 'BLOCKED' ? 'UPLOAD REJECTED' : 'SAFE UPLOAD SUCCESS'}
                </span>
                <span className="text-[11px] font-bold">
                  {uploadResult.status === 'RCE_SUCCESS' ? 'HTTP 200 OK (WEBSHELL ACTIVE)' : uploadResult.status === 'BLOCKED' ? 'HTTP 400 BAD REQUEST' : 'HTTP 201 CREATED'}
                </span>
              </div>

              <p className="font-sans text-xs leading-relaxed mt-2">
                {uploadResult.message}
              </p>

              {uploadResult.path && (
                <div className="mt-3 p-2.5 bg-slate-900 rounded font-mono text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Server File Location:</span>
                  <span className={uploadResult.status === 'RCE_SUCCESS' ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
                    {uploadResult.path}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
