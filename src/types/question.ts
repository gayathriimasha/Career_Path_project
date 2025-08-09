export interface Question {
  id: number;
  text: string;
  type: 'radio' | 'text' | 'checkbox';
  options?: string[];
}

export interface Answer {
  questionId: number;
  value: string | string[];
}

export interface QuestionnaireState {
  currentIndex: number;
  answers: Answer[];
  direction: number;
}
