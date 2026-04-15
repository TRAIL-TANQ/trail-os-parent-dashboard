/**
 * Admin dashboard data hooks
 * Reads from trail-quest-world tables:
 *   pin_codes, child_status, quest_progress, quiz_history
 */
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ===== Types =====

export interface Student {
  childId: string;
  name: string;
  birthYear: number | null;
  birthMonth: number | null;
  birthDay: number | null;
  grade: string;
  level: number;
  altPoints: number;
  rating: number;
  wins: number;
  losses: number;
  decksUnlocked: number;         // master clear count per deck (>= master => unlocked)
  totalDecks: number;
  questAccuracy: number;         // % from quiz_history
  lastSeen: string | null;       // ISO timestamp (approx: last quiz_history answered_at)
  createdAt: string | null;
}

export interface TopStats {
  totalStudents: number;
  dau: number;
  mau: number;
  todayBattles: number;
  avgDeckUnlockPct: number;      // 0-100
  difficultyClearRates: {
    beginner: number;
    challenger: number;
    master: number;
    legend: number;
  };
}

export interface StudentDetail extends Student {
  deckAccuracy: Record<string, number>;   // deckKey → accuracy %
  weakQuestions: Array<{
    question: string;
    correctAnswer: string;
    attempts: number;
    accuracy: number;
    deckKey: string;
    difficulty: number;
  }>;
  recentResults: boolean[];               // last 5 W/L
  ratingTrend: Array<{ date: string; rating: number }>;  // placeholder (no history table)
  radar: {
    battle: number;
    quiz: number;
    collection: number;
    streak: number;
  };
}

// ===== Helpers =====

function calcGrade(y: number | null, m: number | null, d: number | null): string {
  if (!y || !m || !d) return "—";
  const now = new Date();
  const nowMonth = now.getMonth() + 1;
  const academicYear = nowMonth >= 4 ? now.getFullYear() : now.getFullYear() - 1;
  const isEarly = m < 4 || (m === 4 && d === 1);
  let grade = academicYear - y - 6;
  if (isEarly) grade += 1;
  if (grade < 1) return "未就学";
  if (grade <= 6) return `小${grade}`;
  if (grade <= 9) return `中${grade - 6}`;
  return "中学生以上";
}

function isExcludedChildId(id: string): boolean {
  return (
    !id ||
    id.startsWith("user-") ||
    id.startsWith("guest-") ||
    id === "admin" ||
    id === "guest"
  );
}

// ===== Top stats =====

const DECK_KEYS_CANONICAL = [
  "napoleon",
  "amazon",
  "qinshi",
  "galileo",
  "jeanne",
  "murasaki",
  "mandela",
  "davinci",
];

export function useTopStats() {
  const [stats, setStats] = useState<TopStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        // total students (pin_codes)
        const { data: pins, error: pinErr } = await supabase
          .from("pin_codes")
          .select("child_id");
        if (pinErr) throw new Error(pinErr.message);
        const validIds = (pins ?? [])
          .map((p) => p.child_id as string)
          .filter((id) => !isExcludedChildId(id));
        const totalStudents = validIds.length;

        // quest_progress for deck unlock + difficulty clear rates
        const { data: qp } = await supabase
          .from("quest_progress")
          .select("child_id, category, difficulty, cleared");
        const progress = (qp ?? []).filter((r) => !isExcludedChildId(r.child_id as string));

        // Aggregate per student: how many decks have master cleared (=deck unlocked)
        const perStudentMasterClears: Record<string, Set<string>> = {};
        const diffCounts: Record<string, { cleared: number; total: number }> = {
          beginner: { cleared: 0, total: 0 },
          challenger: { cleared: 0, total: 0 },
          master: { cleared: 0, total: 0 },
          legend: { cleared: 0, total: 0 },
        };
        for (const r of progress) {
          const cid = r.child_id as string;
          const diff = (r.difficulty as string) ?? "";
          const deckKey = (r.category as string) ?? "";
          const cleared = !!r.cleared;
          if (diffCounts[diff]) {
            diffCounts[diff].total++;
            if (cleared) diffCounts[diff].cleared++;
          }
          if (diff === "master" && cleared) {
            if (!perStudentMasterClears[cid]) perStudentMasterClears[cid] = new Set();
            perStudentMasterClears[cid].add(deckKey);
          }
        }
        const totalDecks = DECK_KEYS_CANONICAL.length;
        const unlockRates = validIds.map(
          (id) => (perStudentMasterClears[id]?.size ?? 0) / totalDecks
        );
        const avgDeckUnlockPct =
          unlockRates.length > 0
            ? Math.round(
                (unlockRates.reduce((s, v) => s + v, 0) / unlockRates.length) * 100
              )
            : 0;

        // DAU / today battles / MAU from quiz_history (proxy for activity)
        const now = new Date();
        const dayStart = new Date(now);
        dayStart.setHours(0, 0, 0, 0);
        const monthAgo = new Date(now);
        monthAgo.setDate(monthAgo.getDate() - 30);

        const { data: qh24h } = await supabase
          .from("quiz_history")
          .select("child_id, answered_at")
          .gte("answered_at", dayStart.toISOString());
        const { data: qh30d } = await supabase
          .from("quiz_history")
          .select("child_id, answered_at")
          .gte("answered_at", monthAgo.toISOString());

        const dauSet = new Set<string>();
        let todayBattles = 0;
        for (const r of qh24h ?? []) {
          const cid = r.child_id as string;
          if (isExcludedChildId(cid)) continue;
          dauSet.add(cid);
          todayBattles++;
        }
        const mauSet = new Set<string>();
        for (const r of qh30d ?? []) {
          const cid = r.child_id as string;
          if (isExcludedChildId(cid)) continue;
          mauSet.add(cid);
        }

        if (cancelled) return;
        setStats({
          totalStudents,
          dau: dauSet.size,
          mau: mauSet.size,
          todayBattles,
          avgDeckUnlockPct,
          difficultyClearRates: {
            beginner: diffCounts.beginner.total > 0 ? Math.round((diffCounts.beginner.cleared / diffCounts.beginner.total) * 100) : 0,
            challenger: diffCounts.challenger.total > 0 ? Math.round((diffCounts.challenger.cleared / diffCounts.challenger.total) * 100) : 0,
            master: diffCounts.master.total > 0 ? Math.round((diffCounts.master.cleared / diffCounts.master.total) * 100) : 0,
            legend: diffCounts.legend.total > 0 ? Math.round((diffCounts.legend.cleared / diffCounts.legend.total) * 100) : 0,
          },
        });
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}

// ===== Student list =====

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [pinRes, statusRes, qpRes, qhRes] = await Promise.all([
          supabase.from("pin_codes").select("child_id, child_name, birth_year, birth_month, birth_day, created_at"),
          supabase.from("child_status").select("child_id, level, alt_points, rating, wins, losses"),
          supabase.from("quest_progress").select("child_id, difficulty, cleared"),
          supabase.from("quiz_history").select("child_id, correct, answered_at"),
        ]);
        if (pinRes.error) throw new Error(`pin_codes: ${pinRes.error.message}`);
        const pins = (pinRes.data ?? []).filter((r) => !isExcludedChildId(r.child_id as string));

        const statusMap: Record<string, { level: number; alt_points: number; rating: number; wins: number; losses: number }> = {};
        for (const r of statusRes.data ?? []) {
          statusMap[r.child_id as string] = {
            level: (r.level as number) ?? 1,
            alt_points: (r.alt_points as number) ?? 0,
            rating: (r.rating as number) ?? 1000,
            wins: (r.wins as number) ?? 0,
            losses: (r.losses as number) ?? 0,
          };
        }

        const unlockMap: Record<string, number> = {};
        for (const r of qpRes.data ?? []) {
          const cid = r.child_id as string;
          if (isExcludedChildId(cid)) continue;
          if (r.difficulty === "master" && r.cleared) {
            unlockMap[cid] = (unlockMap[cid] ?? 0) + 1;
          }
        }

        const accMap: Record<string, { correct: number; total: number; last: string | null }> = {};
        for (const r of qhRes.data ?? []) {
          const cid = r.child_id as string;
          if (isExcludedChildId(cid)) continue;
          if (!accMap[cid]) accMap[cid] = { correct: 0, total: 0, last: null };
          accMap[cid].total++;
          if (r.correct) accMap[cid].correct++;
          const ans = r.answered_at as string;
          if (!accMap[cid].last || ans > accMap[cid].last!) accMap[cid].last = ans;
        }

        const list: Student[] = pins.map((p) => {
          const cid = p.child_id as string;
          const status = statusMap[cid];
          const acc = accMap[cid];
          return {
            childId: cid,
            name: (p.child_name as string) ?? "—",
            birthYear: (p.birth_year as number | null) ?? null,
            birthMonth: (p.birth_month as number | null) ?? null,
            birthDay: (p.birth_day as number | null) ?? null,
            grade: calcGrade(p.birth_year as number | null, p.birth_month as number | null, p.birth_day as number | null),
            level: status?.level ?? 1,
            altPoints: status?.alt_points ?? 0,
            rating: status?.rating ?? 1000,
            wins: status?.wins ?? 0,
            losses: status?.losses ?? 0,
            decksUnlocked: unlockMap[cid] ?? 0,
            totalDecks: DECK_KEYS_CANONICAL.length,
            questAccuracy: acc && acc.total > 0 ? Math.round((acc.correct / acc.total) * 100) : 0,
            lastSeen: acc?.last ?? null,
            createdAt: (p.created_at as string) ?? null,
          };
        });

        if (!cancelled) setStudents(list);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { students, loading, error };
}

// ===== Student detail =====

export function useStudentDetail(childId: string | null) {
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!childId) { setDetail(null); setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [pinRes, statusRes, qpRes, qhRes] = await Promise.all([
          supabase.from("pin_codes").select("*").eq("child_id", childId).maybeSingle(),
          supabase.from("child_status").select("*").eq("child_id", childId).maybeSingle(),
          supabase.from("quest_progress").select("*").eq("child_id", childId),
          supabase.from("quiz_history").select("*").eq("child_id", childId).order("answered_at", { ascending: false }).limit(500),
        ]);

        const p = pinRes.data as any;
        if (!p) throw new Error("生徒が見つかりません");
        const status = statusRes.data as any;
        const qhList = (qhRes.data ?? []) as any[];

        // deck-wise accuracy
        const deckMap: Record<string, { correct: number; total: number }> = {};
        for (const r of qhList) {
          const key = r.deck_key as string;
          if (!deckMap[key]) deckMap[key] = { correct: 0, total: 0 };
          deckMap[key].total++;
          if (r.correct) deckMap[key].correct++;
        }
        const deckAccuracy: Record<string, number> = {};
        for (const [k, v] of Object.entries(deckMap)) {
          deckAccuracy[k] = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0;
        }

        // weak questions: group by question_text, rank by lowest accuracy (min 2 attempts)
        const byQuestion: Record<string, { correct: number; total: number; correctAnswer: string; deckKey: string; difficulty: number }> = {};
        for (const r of qhList) {
          const q = r.question_text as string;
          if (!byQuestion[q]) {
            byQuestion[q] = {
              correct: 0, total: 0,
              correctAnswer: (r.correct_answer as string) ?? "",
              deckKey: r.deck_key as string,
              difficulty: (r.difficulty as number) ?? 1,
            };
          }
          byQuestion[q].total++;
          if (r.correct) byQuestion[q].correct++;
        }
        const weakQuestions = Object.entries(byQuestion)
          .map(([q, v]) => ({
            question: q,
            correctAnswer: v.correctAnswer,
            attempts: v.total,
            accuracy: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
            deckKey: v.deckKey,
            difficulty: v.difficulty,
          }))
          .filter((w) => w.attempts >= 2)
          .sort((a, b) => a.accuracy - b.accuracy)
          .slice(0, 5);

        // quest unlocked count
        let decksUnlocked = 0;
        for (const r of qpRes.data ?? []) {
          if (r.difficulty === "master" && r.cleared) decksUnlocked++;
        }

        // recent 5 battles: proxy — no history table. Use wins/losses simple estimate.
        // Without a battle_history table we can't reconstruct sequence; leave empty for now.
        const recentResults: boolean[] = [];

        // radar: quick heuristic values (0-100 each)
        const totalBattles = (status?.wins ?? 0) + (status?.losses ?? 0);
        const questAccuracy = qhList.length > 0 ? Math.round((qhList.filter((r) => r.correct).length / qhList.length) * 100) : 0;
        const battleScore = totalBattles > 0 ? Math.round(((status?.wins ?? 0) / totalBattles) * 100) : 0;
        const collectionScore = Math.min(100, decksUnlocked * (100 / DECK_KEYS_CANONICAL.length));
        // streak = days active in last 7 (approximate from quiz_history unique dates)
        const recent7 = qhList.filter((r) => {
          const d = new Date(r.answered_at);
          return d.getTime() > Date.now() - 7 * 24 * 3600 * 1000;
        });
        const activeDays = new Set(recent7.map((r) => (r.answered_at as string).slice(0, 10))).size;
        const streakScore = Math.min(100, Math.round((activeDays / 7) * 100));

        if (cancelled) return;
        setDetail({
          childId,
          name: p.child_name,
          birthYear: p.birth_year,
          birthMonth: p.birth_month,
          birthDay: p.birth_day,
          grade: calcGrade(p.birth_year, p.birth_month, p.birth_day),
          level: status?.level ?? 1,
          altPoints: status?.alt_points ?? 0,
          rating: status?.rating ?? 1000,
          wins: status?.wins ?? 0,
          losses: status?.losses ?? 0,
          decksUnlocked,
          totalDecks: DECK_KEYS_CANONICAL.length,
          questAccuracy,
          lastSeen: qhList[0]?.answered_at ?? null,
          createdAt: p.created_at ?? null,
          deckAccuracy,
          weakQuestions,
          recentResults,
          ratingTrend: [], // no history table yet
          radar: {
            battle: battleScore,
            quiz: questAccuracy,
            collection: collectionScore,
            streak: streakScore,
          },
        });
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [childId]);

  return { detail, loading, error };
}
