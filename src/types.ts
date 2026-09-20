export type EducationLevel = 'SD' | 'SMP' | 'SMA' | 'SMK' | 'KULIAH' | 'UMUM';

export interface AureliaUser {
  name: string;
  age: number | null;
  understandsPurpose: boolean | null;
  onboardingCompleted: boolean;
  educationLevel?: EducationLevel;
  registeredAt?: string;
  quizScore?: number;
  quizCompleted?: boolean;
}

export interface OnboardingProgress {
  step: 1 | 2 | 3;
  subStep:
    | 'step1_input'
    | 'step1_greet'
    | 'step2_input'
    | 'step2_confirm'
    | 'step3_ask'
    | 'step3_explain_tidak'
    | 'step3_ready_tidak'
    | 'step3_confirm_ya'
    | 'step3_ready_ya';
  name: string;
  age: number | null;
  understandsPurpose: boolean | null;
  completed: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningModule {
  id: string;
  title: string;
  subject: string;
  description: string;
  targetLevel: EducationLevel;
  chaptersCount: number;
  completedChapters: number;
  questions: QuizQuestion[];
}
