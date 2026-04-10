// TRAIL-OS 保護者ダッシュボード データ型定義

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
