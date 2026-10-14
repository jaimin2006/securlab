import React, { useState } from 'react';
import { TopicItem, LabLogEntry } from '../types/security';
import { SimulationHub } from './InteractiveSimulations/SimulationHub';
import { 
  BookOpen, 
  Code, 
  Terminal, 
  HelpCircle, 
  FileEdit, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  Save, 
  Check, 
  ExternalLink 
} from 'lucide-react';

interface TopicDetailProps {
  topic: TopicItem;
  allTopics: TopicItem[];
  onSelectTopic: (topic: TopicItem) => void;
  labLog?: LabLogEntry;
  onSaveLabLog: (log: LabLogEntry) => void;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({
  topic,
  allTopics,
  onSelectTopic,
  labLog,
  onSaveLabLog
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'code' | 'simulation' | 'notes' | 'quiz'>('theory');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Lab Notes form state
  const [targetEnv, setTargetEnv] = useState(labLog?.targetEnvironment || 'Educational Lab Subnet (192.168.10.0/24)');
  const [toolUsed, setToolUsed] = useState(labLog?.toolUsed || (topic.id === 'probing-network' ? 'Nmap 7.94' : topic.id === 'burpsuite-installation' ? 'Burp Suite Community v2024' : 'Burp Suite / Python 3'));
  const [methodology, setMethodology] = useState(labLog?.methodologyFollowed || 'PTES (Penetration Testing Execution Standard) / OWASP Testing Guide v4');
  const [failedAttempts, setFailedAttempts] = useState(labLog?.failedAttempts || 'Initial automated scan timed out due to perimeter firewall dropping standard TCP SYN probes.');
  const [successfulResolution, setSuccessfulResolution] = useState(labLog?.successfulResolution || 'Verified vulnerability root cause, crafted specific mitigation, and tested parameterized query / filter fix.');
  const [reflection, setReflection] = useState(labLog?.reflectionSummary || 'Learned how perimeter defenses interact with application logic and why defense-in-depth is essential.');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentIndex = allTopics.findIndex(t => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLabLog({
      id: labLog?.id || crypto.randomUUID(),
      topicId: topic.id,
      timestamp: new Date().toISOString(),
      targetEnvironment: targetEnv,
      toolUsed,
      methodologyFollowed: methodology,
      failedAttempts,
      successfulResolution,
      defensiveRecommendations: topic.remediationSteps.join('; '),
      reflectionSummary: reflection,
      status: 'Completed'
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAnswerSelect = (qIdx: number, optIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  // Associate relevant generated architecture images with topics
  const getTopicImage = () => {
    if (topic.id === 'web-application-firewall' || topic.id === 'probing-network') {
      return {
        src: '/src/assets/images/network_waf_architecture_1792007559097.jpg',
        alt: 'Network and Web Application Firewall Layer 7 Architecture Flow'
      };
    }
    if (topic.id === 'burpsuite-installation') {
      return {
        src: '/src/assets/images/burp_proxy_inspection_1792007559438.jpg',
        alt: 'HTTP Web Security Proxy Interception and Inspection Architecture'
      };
    }
    if (topic.id === 'owasp-top-10' || topic.id === 'bug-hunting-platforms') {
      return {
        src: '/src/assets/images/cyber_security_lab_hero_1792007558778.jpg',
        alt: 'Cybersecurity Operations Center and Threat Modeling Topology'
      };
    }
    return null;
  };

  const topicImage = getTopicImage();

  return (
    <div className="space-y-6">
      {/* Topic Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-400 font-semibold">
              Topic #{topic.number.toString().padStart(2, '0')}
            </span>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>{topic.category}</span>
              {topic.owaspMapping && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 font-medium">{topic.owaspMapping}</span>
                </>
              )}
              {topic.cweMapping && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400 font-mono">{topic.cweMapping}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Severity Impact:</span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
              topic.severity === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
              topic.severity === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
              topic.severity === 'Medium' ? 'bg-yellow-950 text-yellow-300 border border-yellow-500/40' :
              'bg-slate-800 text-slate-300'
            }`}>
              {topic.severity}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {topic.title}
          </h2>
          <p className="text-sm lg:text-base text-slate-400 mt-1.5 leading-relaxed">
            {topic.subtitle}
          </p>
          <p className="text-xs lg:text-sm text-slate-300 mt-3 leading-relaxed max-w-4xl">
            {topic.shortDescription}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'theory'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Theory & Architecture
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Vulnerable vs Secure Code
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'simulation'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Interactive Lab Workbench
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            Lab Report Notes {labLog?.status === 'Completed' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Self-Assessment Quiz ({topic.quiz.length})
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* 1. THEORY TAB */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          {topicImage && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
              <img
                src={topicImage.src}
                alt={topicImage.alt}
                referrerPolicy="no-referrer"
                className="w-full h-64 lg:h-80 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                  Technical Architecture Reference
                </span>
                <span className="text-sm font-semibold text-white">
                  {topicImage.alt}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Underlying Concept & Theory
              </h3>
              <div className="space-y-3 text-xs lg:text-sm text-slate-300 leading-relaxed">
                {topic.conceptTheory.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Vulnerability Mechanism & Attack Vectors
              </h3>
              <ul className="space-y-2.5 text-xs lg:text-sm text-slate-300">
                {topic.attackMechanism.map((mech, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{mech}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Real-World Case Study Scenario:
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  "{topic.realWorldScenario}"
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Defensive Remediation & Hardening Principles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs lg:text-sm text-slate-300">
              {topic.remediationSteps.map((step, i) => (
                <div key={i} className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. CODE ANALYSIS TAB */}
      {activeTab === 'code' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vulnerable Snippet */}
            <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Vulnerable Implementation ({topic.codeSnippet.language})
                </div>
                <span className="text-[11px] font-mono text-rose-400">DO NOT USE</span>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-rose-300 overflow-x-auto leading-relaxed border border-rose-950">
                {topic.codeSnippet.vulnerableCode}
              </pre>
            </div>

            {/* Secure Snippet */}
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Hardened Secure Implementation ({topic.codeSnippet.language})
                </div>
                <span className="text-[11px] font-mono text-emerald-400">RECOMMENDED FIX</span>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed border border-emerald-950">
                {topic.codeSnippet.secureCode}
              </pre>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Code Security Rationale & Mechanics:
            </h4>
            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
              {topic.codeSnippet.explanation}
            </p>
          </div>
        </div>
      )}

      {/* 3. INTERACTIVE SIMULATION TAB */}
      {activeTab === 'simulation' && (
        <SimulationHub topic={topic} />
      )}

      {/* 4. LAB NOTES & REFLECTION TAB */}
      {activeTab === 'notes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-cyan-400" />
              Penetration Testing Lab Notes & Learning Reflection
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Document your target environment, tools used, failed testing attempts, and successful resolutions for submission to your teacher.
            </p>
          </div>

          <form onSubmit={handleSaveNotes} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Target Environment / Host
                </label>
                <input
                  type="text"
                  value={targetEnv}
                  onChange={(e) => setTargetEnv(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Security Testing Tools Used
                </label>
                <input
                  type="text"
                  value={toolUsed}
                  onChange={(e) => setToolUsed(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Testing Methodology Followed
              </label>
              <input
                type="text"
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-rose-400 block mb-1">
                Failed Attempts & Diagnostic Obstacles (What didn't work and why?)
              </label>
              <textarea
                value={failedAttempts}
                onChange={(e) => setFailedAttempts(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                placeholder="Describe your initial hypotheses, failed syntax, blocked requests, or firewall timeouts..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
                Successful Resolution & Verified Proof (How was it solved?)
              </label>
              <textarea
                value={successfulResolution}
                onChange={(e) => setSuccessfulResolution(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                placeholder="Explain the precise methodology that confirmed the vulnerability and validated the fix..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400 block mb-1">
                Student Reflection & Key Takeaways (What did you learn?)
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                placeholder="Reflect on the broader defensive implications, secure SDLC practices, and architectural lessons..."
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                These notes will be compiled into your formatted Academic Project Report.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                {saveSuccess ? 'Saved to Project Report!' : 'Save Lab Observation Notes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. QUIZ TAB */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                Academic Knowledge Check
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verify your conceptual mastery of {topic.title} principles and defense mechanisms.
              </p>
            </div>
            <button
              onClick={() => setShowQuizResults(!showQuizResults)}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors"
            >
              {showQuizResults ? 'Hide Explanations' : 'Evaluate Answers & Show Explanations'}
            </button>
          </div>

          <div className="space-y-6">
            {topic.quiz.map((q, qIdx) => {
              const selected = selectedAnswers[qIdx];
              const isCorrect = selected === q.correctIndex;

              return (
                <div key={qIdx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-3">
                  <div className="text-sm font-semibold text-white">
                    <span className="text-cyan-400 mr-2">Q{qIdx + 1}.</span>
                    {q.question}
                  </div>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      const isOptionCorrect = optIdx === q.correctIndex;

                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                      if (isOptionSelected) {
                        btnStyle = 'bg-cyan-950/60 border-cyan-500 text-cyan-200';
                      }
                      if (showQuizResults) {
                        if (isOptionCorrect) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                        } else if (isOptionSelected && !isOptionCorrect) {
                          btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleAnswerSelect(qIdx, optIdx)}
                          className={`w-full text-left p-3 text-xs rounded-lg border transition-colors flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-current text-[11px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div className={`p-3 rounded-lg text-xs leading-relaxed mt-3 ${
                      isCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}>
                      <strong className="block text-white mb-1">
                        {isCorrect ? '✓ Correct Answer!' : `Rationale (Correct: Option ${String.fromCharCode(65 + q.correctIndex)}):`}
                      </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        {prevTopic ? (
          <button
            onClick={() => onSelectTopic(prevTopic)}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous: Topic #{prevTopic.number} ({prevTopic.title})
          </button>
        ) : <div></div>}

        {nextTopic ? (
          <button
            onClick={() => onSelectTopic(nextTopic)}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center gap-2 transition-colors ml-auto"
          >
            Next: Topic #{nextTopic.number} ({nextTopic.title})
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : <div></div>}
      </div>
    </div>
  );
};
