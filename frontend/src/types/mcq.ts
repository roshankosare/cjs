export interface McqQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  category: string;
  difficulty: string;
  createdAt: string;
}

export interface McqQuestionWithAnswer extends McqQuestion {
  correctOption: string;
  correctExplanation: string;
  incorrectExplanationA?: string;
  incorrectExplanationB?: string;
  incorrectExplanationC?: string;
  incorrectExplanationD?: string;
}

export interface QuizSession {
  id: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  scorePercentage: number;
  startedAt: string;
  completedAt?: string;
  isCompleted: boolean;
}

export interface McqAttemptResult {
  isCorrect: boolean;
  correctOption: string;
  explanation: string;
  quizSession: QuizSession;
}

export interface QuizResult {
  session: QuizSession;
  attempts: McqAttemptDetail[];
}

export interface McqAttemptDetail {
  questionId: number;
  question: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  explanation: string;
}

export interface CreateMcqDto {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  correctExplanation?: string;
  incorrectExplanationA?: string;
  incorrectExplanationB?: string;
  incorrectExplanationC?: string;
  incorrectExplanationD?: string;
  category: string;
  difficulty: string;
}

export interface StartQuizDto {
  questionCount: number;
  category?: string;
  difficulty?: string;
}

export interface SubmitMcqAnswerDto {
  questionId: number;
  selectedOption: string;
  quizSessionId: number;
}