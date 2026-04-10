/**
 * Daily Mission Card Component
 * Design: Fantasy card showing daily mission completion status
 * Matches reference image with checkmarks and XP rewards
 * Full-width card at the bottom of the dashboard
 */

import { motion } from "framer-motion";
import { Swords, CheckCircle2, Circle, Star, Trophy } from "lucide-react";
import type { DailyMission } from "@/lib/types";

interface DailyMissionCardProps {
  missions: DailyMission[];
}

export default function DailyMissionCard({ missions }: DailyMissionCardProps) {
  const completedCount = missions.filter((m) => m.completed).length;
  const totalCount = missions.length;
  const allCompleted = completedCount === totalCount;
  const totalXp = missions.reduce((sum, m) => sum + m.xpReward, 0);

  return (
    <motion.div
      className="fantasy-card gold-corner p-4 md:p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {/* Header */}
      <div className="section-header">
        <div className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "rgba(201, 169, 110, 0.2)" }}>
          <Swords className="w-3.5 h-3.5 text-amber-700" />
        </div>
        <span className="text-base font-bold" style={{ color: "#3B2F2F" }}>デイリーミッション</span>
        <div className="ml-auto flex items-center gap-2">
          {/* Progress indicator */}
          <div className="flex gap-1">
            {missions.map((m, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: m.completed
                    ? "linear-gradient(135deg, #5B8C3E, #4A7C3E)"
                    : "rgba(201, 169, 110, 0.25)"
                }}
              />
            ))}
          </div>
          <span className="text-[11px] text-amber-800/50 font-medium">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Mission Grid - 1 col mobile, 2 cols on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {/* Mission List */}
        <div className="space-y-2">
          {missions.map((mission, index) => (
            <motion.div
              key={mission.id}
              className="flex items-center gap-3 p-2.5 rounded-lg transition-all"
              style={{
                background: mission.completed
                  ? "rgba(91, 140, 62, 0.06)"
                  : "rgba(245, 236, 215, 0.3)",
                border: `1px solid ${
                  mission.completed
                    ? "rgba(91, 140, 62, 0.15)"
                    : "rgba(201, 169, 110, 0.15)"
                }`
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            >
              {/* Status Icon */}
              {mission.completed ? (
                <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" style={{ color: "#5B8C3E" }} />
              ) : (
                <Circle className="w-4.5 h-4.5 flex-shrink-0" style={{ color: "rgba(201, 169, 110, 0.4)" }} />
              )}

              {/* Mission Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-medium ${
                  mission.completed ? "text-green-800/60 line-through" : "text-[#3B2F2F]"
                }`}>
                  {mission.title}
                </p>
                {mission.progress && !mission.completed && (
                  <p className="text-[11px] text-amber-700/50 mt-0.5">{mission.progress}</p>
                )}
              </div>

              {/* XP Reward */}
              {mission.completed && mission.xpReward > 0 && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: "rgba(201, 169, 110, 0.1)",
                    border: "1px solid rgba(201, 169, 110, 0.2)"
                  }}>
                  <Star className="w-3 h-3 text-amber-600" />
                  <span className="text-[11px] font-bold text-amber-700">+{mission.xpReward} XP</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Right side - Summary & Bonus */}
        <div className="flex flex-col gap-2.5">
          {/* XP Summary */}
          <div className="rounded-lg p-3 flex-1 flex flex-col items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(201, 169, 110, 0.08), rgba(245, 236, 215, 0.4))",
              border: "1px solid rgba(201, 169, 110, 0.15)"
            }}>
            <Star className="w-6 h-6 text-amber-600 mb-1.5" />
            <p className="text-[11px] text-amber-800/50 font-medium mb-0.5">獲得XP</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Cinzel', serif", color: "#3B2F2F" }}>
              +{totalXp}
            </p>
            <p className="text-[11px] text-amber-700/50">XP</p>
          </div>

          {/* All Clear Bonus */}
          {allCompleted ? (
            <motion.div
              className="rounded-lg p-3 flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, rgba(184, 134, 11, 0.08), rgba(201, 169, 110, 0.12))",
                border: "1px solid rgba(184, 134, 11, 0.2)"
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1 }}
            >
              <Trophy className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-amber-800">ALLクリアボーナス +50</p>
                <p className="text-[10px] text-amber-700/50">ALT ポイント付与済み</p>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-lg p-3 flex items-center gap-3"
              style={{
                background: "rgba(245, 236, 215, 0.3)",
                border: "1px dashed rgba(201, 169, 110, 0.2)"
              }}>
              <Trophy className="w-5 h-5 text-amber-400/40 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-amber-800/40">ALLクリアボーナス</p>
                <p className="text-[10px] text-amber-700/30">全ミッション達成で +50 ALT</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Button */}
      <div className="mt-4 flex justify-end">
        <button
          className="fantasy-btn text-xs flex items-center gap-1"
          onClick={() =>
            import("sonner").then(({ toast }) =>
              toast("ミッション一覧は近日公開予定です")
            )
          }
        >
          ミッション一覧へ →
        </button>
      </div>
    </motion.div>
  );
}
