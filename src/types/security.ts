export type TopicCategory = 
  | 'Recon & Network' 
  | 'Core Architecture & Proxy' 
  | 'OWASP Top 10' 
  | 'Advanced Web Vulnerabilities' 
  | 'Bug Bounty & Methodology';

export interface CodeSnippet {
  language: string;
  vulnerableCode: string;
  secureCode: string;
  explanation: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicItem {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: TopicCategory;
  owaspMapping?: string;
  cweMapping?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  shortDescription: string;
  conceptTheory: string[];
  attackMechanism: string[];
  realWorldScenario: string;
  remediationSteps: string[];
  codeSnippet: CodeSnippet;
  quiz: QuizQuestion[];
  simulationType: 
    | 'network_probing' 
    | 'waf_rules' 
    | 'burp_proxy' 
    | 'idor_access_control' 
    | 'crypto_failures' 
    | 'injection_attacks' 
    | 'insecure_design' 
    | 'misconfiguration' 
    | 'outdated_components' 
    | 'auth_failures' 
    | 'data_integrity' 
    | 'logging_monitoring' 
    | 'ssrf_attack' 
    | 'csrf_attack' 
    | 'file_upload' 
    | 'bug_hunting_scope'
    | 'owasp_overview';
}

export interface LabLogEntry {
  id: string;
  topicId: string;
  timestamp: string;
  targetEnvironment: string;
  toolUsed: string;
  methodologyFollowed: string;
  failedAttempts: string;
  successfulResolution: string;
  defensiveRecommendations: string;
  reflectionSummary: string;
  status: 'Completed' | 'In Progress' | 'Planned';
}

export interface StudentReportMetadata {
  studentName: string;
  studentId: string;
  instructorName: string;
  courseTitle: string;
  submissionDate: string;
  institutionName: string;
  academicYear: string;
  executiveSummary: string;
  labScopeSummary: string;
}
