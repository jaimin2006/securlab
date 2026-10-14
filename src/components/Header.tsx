import React from 'react';
import { Shield, FileText } from 'lucide-react';

interface HeaderProps {
  activeView: 'curriculum' | 'matrix' | 'report';
  setActiveView: (view: 'curriculum' | 'matrix' | 'report') => void;
  completedTopicsCount: number;
  totalTopicsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  completedTopicsCount,
  totalTopicsCount
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveView('curriculum')}
          className="text-left group flex items-center gap-2 whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            SecurLab Academy
          </span>
        </button>

        {/* Zone 2: 4-5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-400">
          <button
            onClick={() => setActiveView('curriculum')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'curriculum' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Curriculum (17 Topics)
          </button>
          <button
            onClick={() => setActiveView('matrix')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'matrix' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            OWASP Top 10 Matrix
          </button>
          <button
            onClick={() => setActiveView('report')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'report' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Academic Lab Report
          </button>
          <div className="text-slate-400 text-xs tabular-nums">
            Progress: <span className="text-emerald-400 font-semibold">{completedTopicsCount}</span>/{totalTopicsCount}
          </div>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('report')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            Generate Teacher Report
          </button>
        </div>
      </div>
    </header>
  );
};
