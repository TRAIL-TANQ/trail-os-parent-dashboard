// ===== Supabase DB Row Types =====

export interface DbChild {
  id: string;
  parent_id: string;
  name: string;
  grade: string;
}

export interface DbChildStatus {
  child_id: string;
  level: number;
  xp: number;
  alt_points: number;
}

export interface DbDiagnosis {
  id?: string;
  child_id: string;
  hensachi_source: string;
  hensachi_value: string;
  result_scores: DiagnosisResultScore[] | null;
}

export interface DiagnosisResultScore {
  rank: number;
  school_name: string;
  category?: string;
  sa_value: string;
  area: string;
  tags: string[];
  image_url?: string;
}

export interface DbQuizAttempt {
  id?: string;
  child_id: string;
  quiz_id: string;
  selected: string;
  is_correct: boolean;
  xp_earned: number;
  answered_at: string;
}

export interface DbDailyMission {
  id?: string;
  child_id: string;
  mission_date: string;
  title: string;
  is_completed: boolean;
  xp_reward: number;
}

export interface DbLearningAnalysis {
  id?: string;
  child_id: string;
  weakness: string | null;
  strength: string | null;
  recommendation: string | null;
  ai_comment: string | null;
}

export interface DbParentReport {
  id?: string;
  child_id: string;
  report_text: string;
  report_type: string;
  created_at: string;
}

// ===== UI Display Types =====

export interface ChildProfile {
  id: string;
  name: string;
  grade: string;
  avatarUrl: string;
  level: number;
  xp: number;
  maxXp: number;
  altPoints: number;
}

export interface LearningReport {
  studyTimeMinutes: number;
  accuracyRate: number;
  strengths: string[];
  weaknesses: string[];
  subjectScores: SubjectScore[];
  aiComment: string;
}

export interface SubjectScore {
  subject: string;
  score: number;
}

export interface CareerMatch {
  rank: number;
  schoolName: string;
  category: string;
  saValue: string;
  area: string;
  tags: string[];
  imageUrl: string;
}

export interface DailyMission {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
  progress?: string;
}

export interface DashboardData {
  child: ChildProfile;
  learningReport: LearningReport;
  careerMatches: CareerMatch[];
  dailyMissions: DailyMission[];
}
