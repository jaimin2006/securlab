import React, { useState, useEffect } from 'react';
import { TOPICS_DATA } from './data/topicsData';
import { TopicItem, LabLogEntry, TopicCategory } from './types/security';
import { Header } from './components/Header';
import { TopicDetail } from './components/TopicDetail';
import { ReportGenerator } from './components/ReportGenerator';
import { OwaspMatrixView } from './components/OwaspMatrixView';
import { 
  Shield, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Terminal, 
  BookOpen, 
  FileCheck, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'curriculum' | 'matrix' | 'report'>('curriculum');
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Stored lab logs per topic
  const [labLogs, setLabLogs] = useState<Record<string, LabLogEntry>>(() => {
    try {
      const saved = localStorage.getItem('securlab_student_logs');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('securlab_student_logs', JSON.stringify(labLogs));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [labLogs]);

  const handleSaveLabLog = (log: LabLogEntry) => {
    setLabLogs(prev => ({ ...prev, [log.topicId]: log }));
  };

  // Filter topics
  const filteredTopics = TOPICS_DATA.filter(topic => {
    const matchesSearch = 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (topic.owaspMapping && topic.owaspMapping.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (topic.cweMapping && topic.cweMapping.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Recon & Network', 'Core Architecture & Proxy', 'OWASP Top 10', 'Advanced Web Vulnerabilities', 'Bug Bounty & Methodology'];

  const completedTopicsCount = Object.keys(labLogs).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          setSelectedTopic(null);
        }}
        completedTopicsCount={completedTopicsCount}
        totalTopicsCount={TOPICS_DATA.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* VIEW 1: CURRICULUM VIEW */}
        {activeView === 'curriculum' && (
          <>
            {selectedTopic ? (
              <div className="space-y-4">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-slate-400 no-print">
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="hover:text-white transition-colors"
                  >
                    Curriculum Overview
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">{selectedTopic.category}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-cyan-400 font-semibold truncate max-w-xs">{selectedTopic.title}</span>
                </nav>

                <TopicDetail
                  topic={selectedTopic}
                  allTopics={TOPICS_DATA}
                  onSelectTopic={(t) => setSelectedTopic(t)}
                  labLog={labLogs[selectedTopic.id]}
                  onSaveLabLog={handleSaveLabLog}
                />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Hero Showcase Banner */}
                <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900">
                  <div className="relative z-10 p-8 lg:p-12 max-w-3xl">
                    <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-3">
                      <Terminal className="w-4 h-4" />
                      Academic Master Project & Lab Portal
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                      Web Application Security & Penetration Testing Suite
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                      Interactive laboratory courseware addressing all 17 assigned syllabus topics: network probing, Layer 7 WAFs, Burp Suite MITM proxy workflows, OWASP Top 10 vulnerabilities, SSRF, CSRF, and bug bounty methodologies.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-6 pt-2">
                      <button
                        onClick={() => setSelectedTopic(TOPICS_DATA[0])}
                        className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm"
                      >
                        Start Topic 01: Probing Network
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setActiveView('report')}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs border border-slate-700 transition-colors flex items-center gap-2"
                      >
                        <FileCheck className="w-4 h-4 text-emerald-400" />
                        Preview Lab Report for Teacher
                      </button>
                    </div>
                  </div>

                  <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block opacity-30 pointer-events-none">
                    <img
                      src="/src/assets/images/cyber_security_lab_hero_1792007558778.jpg"
                      alt="Cybersecurity Lab Operations"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Category Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                          selectedCategory === cat
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative min-w-[260px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search topics, CWEs, CVEs..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* 17 Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTopics.map((topic) => {
                    const isCompleted = labLogs[topic.id]?.status === 'Completed';

                    return (
                      <div
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic)}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-0.5 group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              #{topic.number.toString().padStart(2, '0')}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {isCompleted && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Logged
                                </span>
                              )}
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                topic.severity === 'Critical' ? 'bg-rose-950/80 text-rose-300' :
                                topic.severity === 'High' ? 'bg-amber-950/80 text-amber-300' :
                                'bg-slate-800 text-slate-300'
                              }`}>
                                {topic.severity}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                              {topic.title}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                              {topic.subtitle}
                            </p>
                          </div>

                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {topic.shortDescription}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <span className="truncate max-w-[180px] font-mono text-[11px] text-slate-400">
                            {topic.owaspMapping || topic.category}
                          </span>
                          <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Open Lab <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* VIEW 2: OWASP MATRIX VIEW */}
        {activeView === 'matrix' && (
          <OwaspMatrixView
            topics={TOPICS_DATA}
            onSelectTopic={(t) => {
              setSelectedTopic(t);
              setActiveView('curriculum');
            }}
          />
        )}

        {/* VIEW 3: REPORT GENERATOR VIEW */}
        {activeView === 'report' && (
          <ReportGenerator
            topics={TOPICS_DATA}
            labLogs={labLogs}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 px-6 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">SecurLab Academic Suite</span>
            <span aria-hidden="true">·</span>
            <span>All 17 Syllabus Topics Implemented</span>
            <span aria-hidden="true">·</span>
            <span>Educational PenTesting & OWASP Framework</span>
          </div>
          <div>
            Built for Course Submissions & Practical Cybersecurity Auditing
          </div>
        </div>
      </footer>
    </div>
  );
}
