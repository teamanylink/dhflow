// ADHD Type definitions
export type ADHDType = 
  | 'Inattentive' 
  | 'Hyperactive-Impulsive' 
  | 'Combined' 
  | 'Unspecified';

export const ADHD_TYPES: Record<ADHDType, {
  id: ADHDType;
  name: string;
  description: string;
  emoji: string;
}> = {
  'Inattentive': {
    id: 'Inattentive',
    name: 'Inattentive Type',
    description: 'Difficulty maintaining focus, easily distracted, struggles with organization and completing tasks.',
    emoji: '🧠'
  },
  'Hyperactive-Impulsive': {
    id: 'Hyperactive-Impulsive',
    name: 'Hyperactive-Impulsive Type',
    description: 'Fidgety, restless, interrupts others, difficulty waiting turn, makes hasty decisions.',
    emoji: '⚡'
  },
  'Combined': {
    id: 'Combined',
    name: 'Combined Type',
    description: 'Shows significant symptoms of both inattention and hyperactivity-impulsivity.',
    emoji: '🔄'
  },
  'Unspecified': {
    id: 'Unspecified',
    name: 'Unspecified Type',
    description: 'Shows some ADHD symptoms but doesn\'t meet full criteria for other types.',
    emoji: '❓'
  }
};

// Quiz-related types
export interface QuizQuestion {
  id: number;
  text: string;
  options: QuizOption[];
  type: 'inattentive' | 'hyperactive' | 'both';
}

export interface QuizOption {
  id: string;
  text: string;
  value: number;
}

export interface QuizAnswer {
  questionId: number;
  optionId: string;
  value: number;
  type: 'inattentive' | 'hyperactive' | 'both';
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  firstName: string;
  email: string;
  isComplete: boolean;
}

export interface QuizResults {
  adhdType: ADHDType;
  inattentiveScore: number;
  hyperactiveScore: number;
  combinedScore: number;
  focusScore: number;
  organizationScore: number;
  primaryChallenges: string[];
}

// User profile types
export interface ADHDProfile {
  adhdType: ADHDType;
  focusScore: number;
  organizationScore: number;
  primaryChallenges?: string[];
}

// Testimonial types
export interface Testimonial {
  id: string;
  name: string;
  adhdType: ADHDType;
  quote: string;
  rating: number;
  jobTitle?: string;
  imageUrl?: string;
}

// Product and pricing types
export interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  discountedPrice?: number;
  billingCycle: 'monthly' | 'yearly' | 'one-time';
  currency: string;
  recommended?: boolean;
}

// Package comparison types
export interface PackageComparison {
  feature: string;
  adhdFlow: boolean;
  genericPlans: boolean;
  traditionalCoaching: boolean;
  medication: boolean;
}

// FAQ types
export interface FAQ {
  question: string;
  answer: string;
}

// App routing types
export interface Route {
  path: string;
  name: string;
  requiresAuth?: boolean;
}

// Content generation types
export type ContentType = 'strategies' | 'routines' | 'environment' | 'tools' | 'communication';

export interface ContentTypeOption {
  id: ContentType;
  label: string;
  description: string;
  icon: string;
}