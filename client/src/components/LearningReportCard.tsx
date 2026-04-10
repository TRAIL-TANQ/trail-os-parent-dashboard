/**
 * Learning Report Card Component
 * Design: Fantasy card with study time, accuracy, radar chart, strengths/weaknesses, AI comment
 * Handles empty data gracefully
 */

import { motion } from "framer-motion";
import { BookOpen, Clock, Target, Brain, TrendingUp, TrendingDown, Scroll } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { LearningReport } from "@/lib/types";

interface LearningReportCardProps {
  report: LearningReport;
}

export default function LearningReportCard({ report }: LearningReportCardProps) {
  const radarData = report.subjectScores.map((s) => ({
    subject: s.subject,
    score: s.score,
    fullMark: 100,
  }));

  const hasQuizData = report.studyTimeMinutes > 0 || report.accuracyRate > 0;
  const hasAnalysis = report.strengths.length > 0 || report.weaknesses.length > 0 || report.aiComment;

  return (
    <motion.div
      className="fantasy-card gold-corner p-4 md:p-5 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Header */}
      <div className="section-header">
        <div className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "rgba(201, 169, 110, 0.2)" }}>
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
        </div>
        <span className="text-base font-bold" style={{ color: "#3B2F2F" }}>学習レポート</span>
      </div>

      {!hasQuizData && !hasAnalysis ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
          <Scroll className="w-8 h-8 text-amber-600/30" />
          <p className="text-sm font-medium" style={{ color: "#3B2F2F" }}>
            まだ学習データがありません
          </p>
          <p className="text-xs text-amber-800/40 text-center max-w-xs">
            クイズに挑戦すると、ここに学習レポートが表示されます
          </p>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="flex gap-6 mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-800/50 mb-1 font-medium">
                <Clock className="w-3 h-3" />
                今回の学習時間
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-bold" style={{ fontFamily: "'Cinzel', serif", color: "#3B2F2F" }}>
                  {report.studyTimeMinutes}
                </span>
                <span className="text-sm text-amber-800/50 font-medium">分</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-800/50 mb-1 font-medium">
                <Target className="w-3 h-3" />
                正答率
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-bold" style={{ fontFamily: "'Cinzel', serif", color: "#3B2F2F" }}>
                  {report.accuracyRate}
                </span>
                <span className="text-sm text-amber-800/50 font-medium">%</span>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          {radarData.some((d) => d.score > 0) && (
            <div className="flex-1 min-h-[180px] max-h-[220px] mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="68%">
                  <PolarGrid stroke="rgba(201, 169, 110, 0.25)" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#5A4A3A", fontSize: 11, fontWeight: 500 }} />
                  <Radar
                    name="スコア"
                    dataKey="score"
                    stroke="#B8860B"
                    fill="rgba(184, 134, 11, 0.2)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#B8860B", stroke: "#E8D5A8", strokeWidth: 1 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          {(report.strengths.length > 0 || report.weaknesses.length > 0) && (
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-1 text-[11px] font-bold mb-1.5" style={{ color: "#4A7C3E" }}>
                  <TrendingUp className="w-3 h-3" />
                  得意分野
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {report.strengths.length > 0 ? (
                    report.strengths.map((s) => (
                      <span key={s} className="tag-badge tag-green">{s}</span>
                    ))
                  ) : (
                    <span className="text-[11px] text-amber-800/30">—</span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 text-[11px] font-bold mb-1.5" style={{ color: "#8B3A3A" }}>
                  <TrendingDown className="w-3 h-3" />
                  苦手分野
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {report.weaknesses.length > 0 ? (
                    report.weaknesses.map((w) => (
                      <span key={w} className="tag-badge tag-red">{w}</span>
                    ))
                  ) : (
                    <span className="text-[11px] text-amber-800/30">—</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI Comment */}
          {report.aiComment && (
            <div className="rounded-lg p-3 mb-3"
              style={{
                background: "linear-gradient(135deg, rgba(201, 169, 110, 0.08), rgba(245, 236, 215, 0.5))",
                border: "1px solid rgba(201, 169, 110, 0.2)"
              }}>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 mb-2">
                <Brain className="w-3.5 h-3.5" />
                AIコメント
              </div>
              <p className="text-xs leading-[1.8] font-normal" style={{ color: "rgba(59, 47, 47, 0.75)" }}>
                {report.aiComment}
              </p>
            </div>
          )}
        </>
      )}

      {/* Detail Button */}
      <div className="mt-auto flex justify-end">
        <button
          className="fantasy-btn text-xs flex items-center gap-1"
          onClick={() =>
            import("sonner").then(({ toast }) =>
              toast("詳細レポートは近日公開予定です")
            )
          }
        >
          詳しく見る →
        </button>
      </div>
    </motion.div>
  );
}
