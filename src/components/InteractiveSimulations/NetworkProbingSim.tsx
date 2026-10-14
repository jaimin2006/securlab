import React, { useState } from 'react';
import { Terminal, Shield, Play, RefreshCw, CheckCircle2, AlertTriangle, Layers, Server } from 'lucide-react';

export const NetworkProbingSim: React.FC = () => {
  const [scanType, setScanType] = useState<'-sS' | '-sT' | '-sV' | '-sU'>('-sS');
  const [targetIp, setTargetIp] = useState('192.168.10.45');
  const [firewallActive, setFirewallActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanCompleted, setScanCompleted] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setScanCompleted(false);
    setScanLogs([`[+] Initiating Nmap 7.94 scan against ${targetIp}...`, `[+] Scan configuration: ${scanType} -T4 -p 21,22,80,443,3306,8080`]);

    setTimeout(() => {
      if (firewallActive) {
        setScanLogs(prev => [
          ...prev,
          `[!] Firewall packet inspection active at perimeter gateway...`,
          `[*] SYN packets sent to 6 ports. No ACK returned on filtered ports.`,
          `[*] Port 22/tcp: Filtered (Firewall dropped SYN packet)`,
          `[*] Port 80/tcp: Open (HTTP/1.1 200 OK)`,
          `[*] Port 443/tcp: Open (TLSv1.3 Handshake)`,
          `[*] Port 3306/tcp: Filtered (Firewall dropped connection)`,
          `[✓] Nmap done: 1 IP address (1 host up) scanned in 1.42 seconds.`
        ]);
      } else {
        setScanLogs(prev => [
          ...prev,
          `[*] Host is up (0.0012s latency).`,
          `[*] Scanning open ports via ${scanType === '-sS' ? 'TCP SYN (half-open)' : scanType === '-sT' ? 'TCP Full Connect' : scanType === '-sV' ? 'Service Version Probing' : 'UDP Probing'}...`,
          `[*] Discovered open port 22/tcp on ${targetIp} (OpenSSH 8.9p1 Ubuntu)`,
          `[*] Discovered open port 80/tcp on ${targetIp} (NGINX 1.24.0)`,
          `[*] Discovered open port 443/tcp on ${targetIp} (NGINX TLS)`,
          `[*] Discovered open port 3306/tcp on ${targetIp} (MySQL 8.0.35 - Unrestricted)`,
          `[*] Discovered open port 8080/tcp on ${targetIp} (Apache Tomcat 10.1)`,
          `[!] Warning: Port 3306 (MySQL) and Port 8080 (Tomcat Admin) exposed without perimeter filtering!`,
          `[✓] Scan completed: 5 ports open, 1 closed, 0 filtered.`
        ]);
      }
      setIsScanning(false);
      setScanCompleted(true);
    }, 900);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            Interactive Network Prober & Port Enumeration Simulator
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Simulate active TCP/UDP scanning, packet flag transitions, and perimeter firewall filtering states.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFirewallActive(!firewallActive)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              firewallActive 
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Firewall Rules: {firewallActive ? 'ENABLED (DROP)' : 'DISABLED (EXPOSED)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Scan Technique
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScanType('-sS')}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                  scanType === '-sS' 
                    ? 'bg-cyan-950/50 border-cyan-500 text-cyan-200' 
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-mono font-semibold">-sS (TCP SYN)</div>
                <div className="text-[11px] text-slate-400">Half-open stealth</div>
              </button>
              <button
                type="button"
                onClick={() => setScanType('-sT')}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                  scanType === '-sT' 
                    ? 'bg-cyan-950/50 border-cyan-500 text-cyan-200' 
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-mono font-semibold">-sT (TCP Connect)</div>
                <div className="text-[11px] text-slate-400">Full 3-way handshake</div>
              </button>
              <button
                type="button"
                onClick={() => setScanType('-sV')}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                  scanType === '-sV' 
                    ? 'bg-cyan-950/50 border-cyan-500 text-cyan-200' 
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-mono font-semibold">-sV (Version Detect)</div>
                <div className="text-[11px] text-slate-400">Service banner probe</div>
              </button>
              <button
                type="button"
                onClick={() => setScanType('-sU')}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                  scanType === '-sU' 
                    ? 'bg-cyan-950/50 border-cyan-500 text-cyan-200' 
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-mono font-semibold">-sU (UDP Scan)</div>
                <div className="text-[11px] text-slate-400">ICMP port unreachable</div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Target IP Address
            </label>
            <input
              type="text"
              value={targetIp}
              onChange={(e) => setTargetIp(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={startScan}
            disabled={isScanning}
            className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Scanning Target Network...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Execute Network Probe
              </>
            )}
          </button>

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
            <div className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Packet Flag Flow Explained:
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {scanType === '-sS' && 'Client sends TCP SYN. Target sends SYN-ACK. Client immediately sends RST to terminate connection. Port is marked OPEN without completing handshake.'}
              {scanType === '-sT' && 'Client sends SYN, receives SYN-ACK, returns ACK. Full connection established. Recorded in OS socket connection tables.'}
              {scanType === '-sV' && 'Connects to open port, sends protocol-specific probes, and parses application banner string.'}
              {scanType === '-sU' && 'Sends empty UDP packet. If no ICMP port unreachable returned, port is marked open|filtered.'}
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80 text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                Console Output (Terminal View)
              </span>
              <span className="text-[11px] text-slate-400">nmap {scanType} {targetIp}</span>
            </div>

            <div className="min-h-[170px] max-h-[220px] overflow-y-auto space-y-1.5 text-slate-300">
              {scanLogs.length === 0 ? (
                <div className="text-slate-400 italic py-8 text-center">
                  Press "Execute Network Probe" to begin active packet scanning simulation.
                </div>
              ) : (
                scanLogs.map((log, i) => (
                  <div key={i} className={`leading-relaxed ${log.includes('[!]') ? 'text-amber-300' : log.includes('[✓]') ? 'text-emerald-400 font-semibold' : ''}`}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {scanCompleted && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Discovered Port States Table</span>
                <span className="text-[11px] text-slate-400">Target: {targetIp}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Port</th>
                      <th className="py-2 px-3">Protocol</th>
                      <th className="py-2 px-3">State</th>
                      <th className="py-2 px-3">Service</th>
                      <th className="py-2 px-3">Version / Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-white">22</td>
                      <td className="py-2 px-3">TCP</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center gap-1 font-semibold ${firewallActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {firewallActive ? 'Filtered' : 'Open'}
                        </span>
                      </td>
                      <td className="py-2 px-3">ssh</td>
                      <td className="py-2 px-3 text-slate-400">OpenSSH 8.9p1 (Authorized admin port)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-white">80</td>
                      <td className="py-2 px-3">TCP</td>
                      <td className="py-2 px-3 text-emerald-400 font-semibold">Open</td>
                      <td className="py-2 px-3">http</td>
                      <td className="py-2 px-3 text-slate-400">NGINX 1.24.0 web server</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-white">443</td>
                      <td className="py-2 px-3">TCP</td>
                      <td className="py-2 px-3 text-emerald-400 font-semibold">Open</td>
                      <td className="py-2 px-3">https</td>
                      <td className="py-2 px-3 text-slate-400">TLS 1.3 encrypted web service</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-white">3306</td>
                      <td className="py-2 px-3">TCP</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center gap-1 font-semibold ${firewallActive ? 'text-amber-400' : 'text-rose-400'}`}>
                          {firewallActive ? 'Filtered' : 'Open (High Risk)'}
                        </span>
                      </td>
                      <td className="py-2 px-3">mysql</td>
                      <td className="py-2 px-3 text-slate-400">
                        {firewallActive ? 'Blocked by firewall' : 'CRITICAL: Database port exposed to public Internet!'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
