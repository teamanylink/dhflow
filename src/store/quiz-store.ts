import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizState, QuizAnswer, QuizResults, ADHDType } from '../types';

interface QuizStore extends QuizState {
  results: QuizResults | null;
  setCurrentQuestionIndex: (index: number) => void;
  addAnswer: (answer: QuizAnswer) => void;
  setFirstName: (name: string) => void;
  setEmail: (email: string) => void;
  markAsComplete: () => void;
  setResults: (results: QuizResults) => void;
  reset: () => void;
}

const initialState: QuizState = {
  currentQuestionIndex: 0,
  answers: [],
  firstName: '',
  email: '',
  isComplete: false,
};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      ...initialState,
      results: null,
      
      setCurrentQuestionIndex: (index) =>
        set((state) => ({ currentQuestionIndex: index })),
      
      addAnswer: (answer) =>
        set((state) => {
          // Filter out any existing answer for this question
          const filteredAnswers = state.answers.filter(
            (a) => a.questionId !== answer.questionId
          );
          
          return {
            answers: [...filteredAnswers, answer],
          };
        }),
      
      setFirstName: (name) => set(() => ({ firstName: name })),
      
      setEmail: (email) => set(() => ({ email })),
      
      markAsComplete: () => set(() => ({ isComplete: true })),
      
      setResults: (results) => set(() => ({ results })),
      
      reset: () =>
        set(() => ({
          ...initialState,
          results: null,
        })),
    }),
    {
      name: 'adhd-quiz-storage',
    }
  )
);

// Helper functions for quiz state
export const calculateResults = (answers: QuizAnswer[]): QuizResults => {
  // Calculate scores based on answers
  let inattentiveScore = 0;
  let hyperactiveScore = 0;
  let combinedScore = 0;
  
  answers.forEach((answer) => {
    if (answer.type === 'inattentive') {
      inattentiveScore += answer.value;
    } else if (answer.type === 'hyperactive') {
      hyperactiveScore += answer.value;
    } else if (answer.type === 'both') {
      combinedScore += answer.value;
    }
  });
  
  // Normalize scores to be on a scale of 0-10
  const normalizeScore = (score: number, max: number): number => {
    return Math.round((score / max) * 10);
  };
  
  // Assume maximum possible scores for each type
  const maxInattentiveScore = 40; // Adjust based on your quiz design
  const maxHyperactiveScore = 40; // Adjust based on your quiz design
  const maxCombinedScore = 20; // Adjust based on your quiz design
  
  const normalizedInattentiveScore = normalizeScore(inattentiveScore, maxInattentiveScore);
  const normalizedHyperactiveScore = normalizeScore(hyperactiveScore, maxHyperactiveScore);
  const normalizedCombinedScore = normalizeScore(combinedScore, maxCombinedScore);
  
  // Determine ADHD type based on scores
  let adhdType: ADHDType = 'Unspecified';
  
  if (normalizedInattentiveScore >= 6 && normalizedHyperactiveScore >= 6) {
    adhdType = 'Combined';
  } else if (normalizedInattentiveScore >= 6) {
    adhdType = 'Inattentive';
  } else if (normalizedHyperactiveScore >= 6) {
    adhdType = 'Hyperactive-Impulsive';
  }
  
  // Calculate focus and organization scores
  const focusScore = Math.max(2, 10 - Math.floor(normalizedInattentiveScore * 0.8));
  const organizationScore = Math.max(2, 10 - Math.floor((normalizedInattentiveScore + normalizedHyperactiveScore) / 2 * 0.6));
  
  // Determine primary challenges based on answer patterns
  const primaryChallenges: string[] = [];
  
  // Example logic for determining challenges (customize based on your quiz design)
  if (normalizedInattentiveScore >= 7) {
    primaryChallenges.push('Staying focused on tasks');
    primaryChallenges.push('Completing projects');
  }
  
  if (normalizedInattentiveScore >= 5) {
    primaryChallenges.push('Time management');
    primaryChallenges.push('Organization');
  }
  
  if (normalizedHyperactiveScore >= 7) {
    primaryChallenges.push('Restlessness');
    primaryChallenges.push('Impulsive decision making');
  }
  
  if (normalizedHyperactiveScore >= 5) {
    primaryChallenges.push('Excessive talking');
    primaryChallenges.push('Interrupting others');
  }
  
  if (normalizedCombinedScore >= 7) {
    primaryChallenges.push('Emotional regulation');
    primaryChallenges.push('Task switching');
  }
  
  // Take only top 3 challenges if there are more
  const topChallenges = primaryChallenges.slice(0, 3);
  
  return {
    adhdType,
    inattentiveScore: normalizedInattentiveScore,
    hyperactiveScore: normalizedHyperactiveScore,
    combinedScore: normalizedCombinedScore,
    focusScore,
    organizationScore,
    primaryChallenges: topChallenges,
  };
};