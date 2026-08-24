export type AnalysisType =
  | "ats"
  | "professional"
  | "technical"
  | "writing"
  | "keywords"
  | "complete";

export type Priority = "high" | "medium" | "low";

export interface Strength {
  title: string;
  detail: string;
}

export interface Improvement {
  priority: Priority;
  title: string;
  detail: string;
}

export interface Recommendation {
  id: string;
  category: string;
  priority: Priority;
  problem: string;
  why: string;
  current?: string;
  suggested: string;
}

export interface ScoreBreakdown {
  label: string;
  value: number;
}

export interface OptimizedSection {
  title: string;
  lines: string[];
}

export interface AnalysisResult {
  createdAt: number;
  hasJob: boolean;
  analyses: AnalysisType[];
  matchScore: number;
  atsScore: number;
  keywordsFound: string[];
  keywordsMissing: string[];
  requirementsMet: number;
  requirementsTotal: number;
  breakdown: ScoreBreakdown[];
  atsBreakdown: ScoreBreakdown[];
  strengths: Strength[];
  improvements: Improvement[];
  recommendations: Recommendation[];
  optimized: OptimizedSection[];
  insights: { title: string; detail: string }[];
}

export interface SessionState {
  resume: string;
  jobDescription: string;
  hasJob: boolean;
  analyses: AnalysisType[];
  result: AnalysisResult | null;
}
