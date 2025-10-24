
export interface ContentLog {
  id: string;
  type: string;
  duration: number; // in minutes
  date: string; // YYYY-MM-DD
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface AnalysisResult {
  overallScore: number;
  analysis: string;
  suggestions: string[];
}

export interface DefinitionResult {
  definition: string;
  examples: string[];
}
