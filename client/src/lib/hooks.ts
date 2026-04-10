import { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabase";
import type {
  DbChild,
  DbChildStatus,
  DbDiagnosis,
  DbQuizAttempt,
  DbDailyMission,
  DbLearningAnalysis,
  ChildProfile,
  LearningReport,
  CareerMatch,
  DailyMission,
  DashboardData,
  DiagnosisResultScore,
} from "./types";

const AVATAR_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663286960690/GGkmggfQAQGbo8c6w3FZQx/hero-avatar-EzgbsvWeZJE4h35GQQcxmB.webp";
const DEFAULT_SCHOOL_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663286960690/GGkmggfQAQGbo8c6w3FZQx/school-photo-1-XQn24e8KwhQE482TuuNu2S.webp";

// XP required per level (simple formula)
function maxXpForLevel(level: number): number {
  return 100 + level * 50;
}

/**
 * Main hook: fetch all dashboard data for the first child found.
 * Returns { data, loading, error }.
 */
export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        // 1) Fetch first child (for demo, take the first row)
        const { data: children, error: childErr } = await supabase
          .from("children")
          .select("*")
          .limit(1);

        if (childErr) throw new Error(`children: ${childErr.message}`);
        if (!children || children.length === 0) {
          if (!cancelled) {
            setData(null);
            setLoading(false);
          }
          return;
        }

        const child = children[0] as DbChild;
        const childId = child.id;

        // 2) Parallel fetches
        const [statusRes, diagRes, quizRes, missionRes, analysisRes] =
          await Promise.all([
            supabase
              .from("child_status")
              .select("*")
              .eq("child_id", childId)
              .limit(1),
            supabase
              .from("diagnoses")
              .select("*")
              .eq("child_id", childId)
              .order("id", { ascending: false })
              .limit(1),
            supabase
              .from("quiz_attempts")
              .select("*")
              .eq("child_id", childId),
            supabase
              .from("daily_missions")
              .select("*")
              .eq("child_id", childId)
              .eq("mission_date", todayString()),
            supabase
              .from("learning_analyses")
              .select("*")
              .eq("child_id", childId)
              .order("id", { ascending: false })
              .limit(1),
          ]);

        if (statusRes.error) throw new Error(`child_status: ${statusRes.error.message}`);
        if (diagRes.error) throw new Error(`diagnoses: ${diagRes.error.message}`);
        if (quizRes.error) throw new Error(`quiz_attempts: ${quizRes.error.message}`);
        if (missionRes.error) throw new Error(`daily_missions: ${missionRes.error.message}`);
        if (analysisRes.error) throw new Error(`learning_analyses: ${analysisRes.error.message}`);

        // --- Build ChildProfile ---
        const status = (statusRes.data?.[0] as DbChildStatus | undefined) ?? null;
        const level = status?.level ?? 1;
        const childProfile: ChildProfile = {
          id: child.id,
          name: child.name,
          grade: child.grade,
          avatarUrl: AVATAR_URL,
          level,
          xp: status?.xp ?? 0,
          maxXp: maxXpForLevel(level),
          altPoints: status?.alt_points ?? 0,
        };

        // --- Build LearningReport ---
        const quizAttempts = (quizRes.data ?? []) as DbQuizAttempt[];
        const totalAttempts = quizAttempts.length;
        const correctAttempts = quizAttempts.filter((q) => q.is_correct).length;
        const accuracyRate =
          totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
        const totalXpFromQuiz = quizAttempts.reduce((s, q) => s + (q.xp_earned || 0), 0);
        // Rough study time estimate: 2 min per quiz attempt
        const studyTimeMinutes = totalAttempts * 2;

        const analysis = (analysisRes.data?.[0] as DbLearningAnalysis | undefined) ?? null;
        const strengths = analysis?.strength
          ? analysis.strength.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
        const weaknesses = analysis?.weakness
          ? analysis.weakness.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
        const aiComment = analysis?.ai_comment ?? "";

        // Subject scores: derive from quiz attempts by quiz_id prefix or use default
        const subjectScores = buildSubjectScores(quizAttempts);

        const learningReport: LearningReport = {
          studyTimeMinutes,
          accuracyRate,
          strengths,
          weaknesses,
          subjectScores,
          aiComment,
        };

        // --- Build CareerMatches ---
        const diagnosis = (diagRes.data?.[0] as DbDiagnosis | undefined) ?? null;
        const careerMatches: CareerMatch[] = buildCareerMatches(diagnosis);

        // --- Build DailyMissions ---
        const dbMissions = (missionRes.data ?? []) as DbDailyMission[];
        const dailyMissions: DailyMission[] = dbMissions.map((m, i) => ({
          id: m.id ?? `m${i}`,
          title: m.title,
          completed: m.is_completed,
          xpReward: m.xp_reward ?? 0,
        }));

        if (!cancelled) {
          setData({
            child: childProfile,
            learningReport,
            careerMatches,
            dailyMissions,
          });
        }
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        if (!cancelled) setError(err.message ?? "データの取得に失敗しました");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}

// ===== Helpers =====

function todayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Build subject scores from quiz attempts.
 * If quiz_id contains a subject prefix like "math_", "science_", etc., group by that.
 * Otherwise return a default set of subjects with 0 scores.
 */
function buildSubjectScores(attempts: DbQuizAttempt[]) {
  const subjectMap: Record<string, { correct: number; total: number }> = {};
  const defaultSubjects = ["国語", "算数", "理科", "社会", "英語", "探究"];

  // Try to extract subject from quiz_id (e.g., "math_001" -> "算数")
  const prefixToSubject: Record<string, string> = {
    kokugo: "国語",
    math: "算数",
    science: "理科",
    social: "社会",
    english: "英語",
    tankyu: "探究",
  };

  for (const a of attempts) {
    const prefix = (a.quiz_id ?? "").split("_")[0]?.toLowerCase();
    const subject = prefixToSubject[prefix] ?? "その他";
    if (!subjectMap[subject]) subjectMap[subject] = { correct: 0, total: 0 };
    subjectMap[subject].total++;
    if (a.is_correct) subjectMap[subject].correct++;
  }

  // If we have real data, use it
  if (Object.keys(subjectMap).length > 0 && attempts.length > 0) {
    return Object.entries(subjectMap).map(([subject, { correct, total }]) => ({
      subject,
      score: total > 0 ? Math.round((correct / total) * 100) : 0,
    }));
  }

  // Otherwise return default subjects with 0
  return defaultSubjects.map((s) => ({ subject: s, score: 0 }));
}

/**
 * Build career matches from diagnosis result_scores JSONB.
 */
function buildCareerMatches(diagnosis: DbDiagnosis | null): CareerMatch[] {
  if (!diagnosis?.result_scores) return [];

  const scores = diagnosis.result_scores as DiagnosisResultScore[];
  return scores
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .slice(0, 3)
    .map((s, i) => ({
      rank: s.rank ?? i + 1,
      schoolName: s.school_name ?? "不明",
      category: s.category ?? "",
      saValue: s.sa_value ?? "",
      area: s.area ?? "",
      tags: s.tags ?? [],
      imageUrl: s.image_url ?? DEFAULT_SCHOOL_IMG,
    }));
}
