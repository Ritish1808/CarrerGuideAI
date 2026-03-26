export interface UserProfile {
  name: string;
  email?: string;
  skills: string;
  interests: string;
  education: string;
  goal: string;
  experience?: string;
  testResults?: {
    skillLevel: string;
    interestType: string;
    answers: Record<string, string>;
  };
}

export interface CareerSuggestion {
  title: string;
  description: string;
  matchScore: number;
  why: string;
  jobRoles: {
    title: string;
    skills: string[];
    difficulty: "Easy" | "Medium" | "Hard";
  }[];
  courses: {
    title: string;
    provider: string;
    type: "Degree" | "Certification" | "Course";
    link?: string;
  }[];
  colleges: {
    name: string;
    location: string;
    reputation: string;
    link?: string;
  }[];
  abroadStudy: {
    country: string;
    topUniversities: string[];
    benefits: string;
    averageCost: string;
  }[];
  realJobLinks: {
    title: string;
    company: string;
    location: string;
    link: string;
  }[];
  roadmap: {
    step: number;
    title: string;
    description: string;
    duration: string;
  }[];
}

export interface InterviewSession {
  id: string;
  role: string;
  questions: string[];
  currentQuestionIndex: number;
  feedback: string[];
  status: "idle" | "active" | "completed";
}

export interface AIResponse {
  suggestions: CareerSuggestion[];
}

export interface CareerTip {
  category: "Interview" | "Resume" | "Skill" | "General";
  title: string;
  content: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}
