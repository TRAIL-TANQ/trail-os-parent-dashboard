import type { DashboardData } from "./types";

const AVATAR_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663286960690/GGkmggfQAQGbo8c6w3FZQx/hero-avatar-EzgbsvWeZJE4h35GQQcxmB.webp";
const SCHOOL_1 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663286960690/GGkmggfQAQGbo8c6w3FZQx/school-photo-1-XQn24e8KwhQE482TuuNu2S.webp";
const SCHOOL_2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663286960690/GGkmggfQAQGbo8c6w3FZQx/school-photo-2-Mfj3FpJMws6xqEH8TmFaZ4.webp";

export const mockDashboardData: DashboardData = {
  child: {
    id: "child-001",
    name: "サトル",
    grade: "小5",
    avatarUrl: AVATAR_URL,
    level: 5,
    xp: 520,
    maxXp: 650,
    altPoints: 1280,
  },
  learningReport: {
    studyTimeMinutes: 90,
    accuracyRate: 75,
    strengths: ["社会", "理科"],
    weaknesses: ["算数"],
    subjectScores: [
      { subject: "国語", score: 72 },
      { subject: "算数", score: 58 },
      { subject: "理科", score: 85 },
      { subject: "社会", score: 88 },
      { subject: "英語", score: 65 },
      { subject: "探究", score: 90 },
    ],
    aiComment:
      "サトルくんは好奇心旺盛で、探究型の学びに向いていますね。答えを導びき出す力を伸ばすために、ディスカッションや実験の機会をしてみるとさらに成長できそうです。",
  },
  careerMatches: [
    {
      rank: 1,
      schoolName: "明星中学",
      category: "1形",
      saValue: "55〜62",
      area: "四谷大塚",
      tags: ["英語教育", "探究学習", "グローバル"],
      imageUrl: SCHOOL_1,
    },
    {
      rank: 2,
      schoolName: "成蹊学園中等部",
      category: "3形",
      saValue: "58〜65",
      area: "駿台大塚",
      tags: ["自然教育", "探究学習", "理系"],
      imageUrl: SCHOOL_2,
    },
    {
      rank: 3,
      schoolName: "東京大附属中等教育学校",
      category: "1形",
      saValue: "52〜58",
      area: "万台大塚",
      tags: ["自主性", "探究学習", "グローバル"],
      imageUrl: SCHOOL_1,
    },
  ],
  dailyMissions: [
    {
      id: "m1",
      title: "歴史上の偉人を探究！",
      completed: true,
      xpReward: 80,
    },
    {
      id: "m2",
      title: "算数主要クイズに挑戦！",
      completed: false,
      xpReward: 0,
      progress: "探究クイズ 8 / 10",
    },
    {
      id: "m3",
      title: "探究Tubeでナポレオンを学ぶ",
      completed: true,
      xpReward: 70,
    },
  ],
};
