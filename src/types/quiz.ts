
export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: string;
}

export interface Answer {
  qId: number;
  selected: string;
}

export interface QuizSession {
  id: string;
  timestamp: string;
  score: number;
  totalQuestions: number;
  answers: Answer[];
  duration: number;
}

export interface QuizState {
  currentQuestion: number;
  answers: Answer[];
  isStarted: boolean;
  isCompleted: boolean;
  startTime: number;
  endTime?: number;
}
