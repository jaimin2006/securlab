import React from 'react';
import { TopicItem } from '../types/security';
import { Shield, ArrowRight, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface OwaspMatrixViewProps {
  topics: TopicItem[];
  onSelectTopic: (topic: TopicItem) => void;
}

export const OwaspMatrixView: React.FC<OwaspMatrixViewProps> = ({ topics, onSelectTopic }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            OWASP Top 10 Security Architecture & Syllabus Correlation Matrix
          </h2>
        </div>
        <p className="text-xs lg:text-sm text-slate-400 max-w-3xl leading-relaxed">
          The Open Web Application Security Project (OWASP) Top 10 represents the globally recognized consensus on the most hazardous software security risks. This interactive matrix maps all 17 assigned syllabus topics to their respective OWASP categories, Common Weakness Enumeration (CWE) classifications, and architectural defenses.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold"># Topic</th>
                <th className="py-3 px-4 font-semibold">Title & Domain</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">OWASP / CWE Mapping</th>
                <th className="py-3 px-4 font-semibold">Risk Level</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {topics.map((t) => (
                <tr key={t.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-cyan-400 font-mono">
                    {t.number.toString().padStart(2, '0')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white font-sans">{t.title}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{t.subtitle}</div>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-400">
                    {t.category}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-amber-400 font-semibold">{t.owaspMapping || 'Standard Infrastructure'}</div>
                    <div className="text-[10px] text-slate-400">{t.cweMapping || 'Infrastructure Security'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                      t.severity === 'Critical' ? 'bg-rose-950 text-rose-300' :
                      t.severity === 'High' ? 'bg-amber-950 text-amber-300' :
                      t.severity === 'Medium' ? 'bg-yellow-950 text-yellow-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {t.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectTopic(t)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white rounded text-xs font-sans font-medium transition-colors inline-flex items-center gap-1"
                    >
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
