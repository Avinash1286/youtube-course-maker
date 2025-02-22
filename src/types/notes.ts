
export type QuizType = 'mcq' | 'trueFalse' | 'fillInBlank';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: QuizType;
  question: string;
  options?: QuizOption[];
  correctAnswer: string;
  userAnswer?: string;
}

export interface NotesSection {
  id: string;
  title: string;
  content: string;
  questions: QuizQuestion[];
}

export interface InteractiveNotes {
  introduction: string;
  sections: NotesSection[];
}
