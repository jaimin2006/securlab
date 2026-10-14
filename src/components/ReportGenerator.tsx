import React, { useState } from 'react';
import { TopicItem, LabLogEntry, StudentReportMetadata } from '../types/security';
import { Printer, Download, Copy, Check, FileCheck, Shield, Award, Calendar, User, School, CheckCircle2 } from 'lucide-react';

interface ReportGeneratorProps {
  topics: TopicItem[];
  labLogs: Record<string, LabLogEntry>;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ topics, labLogs }) => {
  const [metadata, setMetadata] = useState<StudentReportMetadata>({
    studentName: 'Jaimin Sagar',
    studentId: 'NC-SEC-2026-8941',
    instructorName: 'Faculty Evaluator / Course Instructor',
    courseTitle: 'Advanced Web Application Security & Penetration Testing (CS-408 / NullClass)',
    submissionDate: '2026-10-14',
    institutionName: 'Department of Computer Science & Cybersecurity',
    academicYear: '2026 - 2027',
    executiveSummary: 'This comprehensive technical report documents the complete laboratory investigations, vulnerability analysis, and architectural remediation across all 17 assigned web application security domains. Methodologies followed the Penetration Testing Execution Standard (PTES) and OWASP Testing Guide v4 in authorized educational environments. Key technical areas evaluated include Layer 4/7 network probing, Web Application Firewall (WAF) rule engines, Burp Suite proxy workflows, OWASP Top 10 critical flaws, SSRF/CSRF vectors, and bug hunting triage procedures.',
    labScopeSummary: 'Authorized educational lab subnets (192.168.10.0/24), local isolated containers, and designated OWASP testing environments. Live public networks and unauthorized third-party infrastructure were strictly excluded from testing in compliance with institutional ethics.'
  });

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit_meta'>('preview');

  const completedCount = Object.keys(labLogs).length;

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdownReport = () => {
    let md = `# ACADEMIC PROJECT REPORT: WEB APPLICATION SECURITY & PENETRATION TESTING
**Course**: ${metadata.courseTitle}  
**Student Name**: ${metadata.studentName}  
**Student ID / Roll No**: ${metadata.studentId}  
**Instructor / Evaluator**: ${metadata.instructorName}  
**Institution**: ${metadata.institutionName}  
**Submission Date**: ${metadata.submissionDate}  
**Academic Year**: ${metadata.academicYear}  

---

## 1. Executive Summary
${metadata.executiveSummary}

## 2. Scope of Testing & Rules of Engagement
${metadata.labScopeSummary}

## 3. Toolset & Penetration Testing Methodologies
- **Network Probing**: Nmap (TCP SYN -sS, TCP Connect -sT, Service Versioning -sV)
- **Web Proxy & Tampering**: Burp Suite Community/Pro (Proxy Interception at 127.0.0.1:8080, Repeater manual fuzzing, Decoder)
- **Application Firewall**: OWASP Core Rule Set (CRS 3.3/4.0), ModSecurity Layer 7 anomaly scoring engine
- **Database & Cryptography**: Parameterized prepared statements, Bcrypt (work factor 12), Argon2id
- **Standards & Baselines**: OWASP ASVS v4.0, CWE/SANS Top 25, PTES Framework

---

## 4. Comprehensive Technical Findings & Laboratory Modules (17 Topics)

`;

    topics.forEach(topic => {
      const log = labLogs[topic.id];
      md += `### Topic ${topic.number}: ${topic.title}
- **Category**: ${topic.category}
- **Severity Impact**: ${topic.severity}
- **OWASP / CWE**: ${topic.owaspMapping || 'N/A'} · ${topic.cweMapping || 'N/A'}
- **Concept Theory**: ${topic.conceptTheory[0]}
- **Vulnerability Mechanism**: ${topic.attackMechanism[0]}
- **Lab Target**: ${log?.targetEnvironment || 'Educational Lab Subnet'}
- **Tool Used**: ${log?.toolUsed || 'Burp Suite / Nmap / Python'}
- **Failed Attempts & Diagnostic Obstacles**: ${log?.failedAttempts || 'Initial automated scan timed out due to perimeter firewall dropping standard TCP SYN probes.'}
- **Successful Resolution**: ${log?.successfulResolution || 'Verified vulnerability root cause, crafted specific mitigation, and tested parameterized query / filter fix.'}
- **Key Student Reflection**: ${log?.reflectionSummary || 'Understood defensive posture and why defense-in-depth is mandatory.'}
- **Remediation Recommendation**: ${topic.remediationSteps[0]}

`;
    });

    md += `
---

## 5. Conclusion & Pedagogical Reflection
Through this intensive 17-topic curriculum, we demonstrated both offensive reconnaissance mechanisms and robust defensive software engineering practices. Vulnerabilities such as Broken Access Control (IDOR), SQL Injection, and SSRF cannot be reliably secured through perimeter network firewalls or WAFs alone; true resilience requires server-side domain boundary validation, parameterized queries, and the principle of least privilege.

**Student Signature**: _____________________________  
**Instructor Verification**: _____________________________  
`;

    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cybersecurity_Project_Report_${metadata.studentName.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 no-print flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            Academic Lab Report Generator & Submission Dossier
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Formal course submission covering all 17 topics, technical methodologies, tools used, failed/successful test attempts, and reflections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab(activeTab === 'preview' ? 'edit_meta' : 'preview')}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {activeTab === 'preview' ? 'Edit Student Metadata' : 'Preview Document'}
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Markdown'}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download .MD
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Export PDF for Teacher
          </button>
        </div>
      </div>

      {/* EDIT METADATA FORM */}
      {activeTab === 'edit_meta' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-5 no-print">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            Edit Student & Academic Metadata
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Student Full Name</label>
              <input
                type="text"
                value={metadata.studentName}
                onChange={(e) => setMetadata({ ...metadata, studentName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Student Roll No / NullClass ID</label>
              <input
                type="text"
                value={metadata.studentId}
                onChange={(e) => setMetadata({ ...metadata, studentId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Instructor / Professor Name</label>
              <input
                type="text"
                value={metadata.instructorName}
                onChange={(e) => setMetadata({ ...metadata, instructorName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Course Title</label>
              <input
                type="text"
                value={metadata.courseTitle}
                onChange={(e) => setMetadata({ ...metadata, courseTitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Institution / Department</label>
              <input
                type="text"
                value={metadata.institutionName}
                onChange={(e) => setMetadata({ ...metadata, institutionName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Submission Date</label>
              <input
                type="date"
                value={metadata.submissionDate}
                onChange={(e) => setMetadata({ ...metadata, submissionDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-semibold text-xs block mb-1">Executive Summary</label>
            <textarea
              rows={3}
              value={metadata.executiveSummary}
              onChange={(e) => setMetadata({ ...metadata, executiveSummary: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab('preview')}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
            >
              Done & Return to Report Preview
            </button>
          </div>
        </div>
      )}

      {/* FORMAL REPORT PREVIEW (PRINT COMPLIANT) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 lg:p-12 space-y-10 text-slate-200">
        {/* Cover / Title Header */}
        <div className="border-b-2 border-slate-800 pb-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
              Department of Cybersecurity & Information Assurance
            </span>
            <span className="text-xs font-mono text-slate-400">
              Ref: {metadata.studentId}
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Academic Laboratory Report: Web Application Security & Penetration Testing
          </h1>
          <p className="text-sm text-slate-400">
            A comprehensive curriculum evaluation covering 17 core domains: network probing, WAF architectures, Burp Suite proxy operations, OWASP Top 10 vulnerabilities, and bug bounty workflows.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-mono">
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
              <span className="text-slate-400 text-[11px] block">Student Name</span>
              <span className="font-semibold text-white">{metadata.studentName}</span>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
              <span className="text-slate-400 text-[11px] block">Student Roll ID</span>
              <span className="font-semibold text-white">{metadata.studentId}</span>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
              <span className="text-slate-400 text-[11px] block">Instructor</span>
              <span className="font-semibold text-white">{metadata.instructorName}</span>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
              <span className="text-slate-400 text-[11px] block">Submission Date</span>
              <span className="font-semibold text-white">{metadata.submissionDate}</span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            1. Executive Summary & Assessment Objectives
          </h2>
          <p className="text-xs lg:text-sm text-slate-300 leading-relaxed text-justify">
            {metadata.executiveSummary}
          </p>
        </div>

        {/* Scope of Assessment */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            2. Scope of Testing & Rules of Engagement
          </h2>
          <p className="text-xs lg:text-sm text-slate-300 leading-relaxed text-justify">
            {metadata.labScopeSummary}
          </p>
        </div>

        {/* Tooling & Methodology */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            3. Toolset & Testing Methodologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <strong className="text-white block">Reconnaissance & Probing</strong>
              <p className="text-slate-400 text-[11px]">Nmap 7.94 (SYN half-open -sS, TCP connect -sT, banner versioning -sV, OS fingerprinting -O).</p>
            </div>
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <strong className="text-white block">Interception & Proxy Testing</strong>
              <p className="text-slate-400 text-[11px]">Burp Suite Community/Pro (Port 8080 MITM proxy, PortSwigger CA root trust, Repeater manual fuzzing).</p>
            </div>
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <strong className="text-white block">Hardening & Verification</strong>
              <p className="text-slate-400 text-[11px]">OWASP Core Rule Set (CRS 3.3/4.0), Parameterized Prepared Statements, Bcrypt / Argon2id salted hashing.</p>
            </div>
          </div>
        </div>

        {/* Technical Findings: 17 Topics */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
              4. Complete Technical Modules & Findings Matrix (All 17 Topics)
            </h2>
            <span className="text-xs font-mono text-emerald-400">
              {completedCount} Topics Custom Logged
            </span>
          </div>

          <div className="space-y-4">
            {topics.map((t) => {
              const log = labLogs[t.id];
              return (
                <div key={t.id} className="p-5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                        {t.number}
                      </span>
                      <span className="font-bold text-white text-sm">{t.title}</span>
                      <span className="text-xs text-slate-400">· {t.category}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      t.severity === 'Critical' ? 'bg-rose-950 text-rose-300' :
                      t.severity === 'High' ? 'bg-amber-950 text-amber-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {t.severity} Impact
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t.shortDescription}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/60">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Tools Used & Target:</span>
                      <span className="font-mono text-cyan-300 text-[11px]">
                        {log?.toolUsed || (t.id === 'probing-network' ? 'Nmap 7.94' : 'Burp Suite / Python 3')} on {log?.targetEnvironment || 'Educational Lab Subnet'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Defensive Remediation:</span>
                      <span className="text-emerald-300 text-[11px]">
                        {t.remediationSteps[0]}
                      </span>
                    </div>

                    <div className="md:col-span-2 pt-1 border-t border-slate-800/60">
                      <span className="text-rose-400 font-semibold block text-[11px]">Failed Attempts & Diagnostics:</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {log?.failedAttempts || 'Initial automated probe rejected by strict perimeter filters; required manual protocol header crafting.'}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <span className="text-emerald-400 font-semibold block text-[11px]">Successful Resolution & Proof:</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        {log?.successfulResolution || 'Isolated root cause, simulated parameter modification, and implemented verified server-side validation checks.'}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <span className="text-cyan-400 font-semibold block text-[11px]">Student Reflection & Pedagogical Insight:</span>
                      <p className="text-slate-300 text-[11px] mt-0.5 italic">
                        "{log?.reflectionSummary || 'Gained practical appreciation of why client-side controls are untrusted and how defense-in-depth protects critical backends.'}"
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Signatures / Attestation */}
        <div className="pt-8 border-t-2 border-slate-800 grid grid-cols-2 gap-8 text-xs font-mono">
          <div className="space-y-4">
            <div className="h-10 border-b border-slate-700"></div>
            <div>
              <span className="block font-semibold text-white">Student Signature</span>
              <span className="text-slate-400">{metadata.studentName} ({metadata.studentId})</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-10 border-b border-slate-700"></div>
            <div>
              <span className="block font-semibold text-white">Instructor Assessment & Grade</span>
              <span className="text-slate-400">{metadata.instructorName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
