/**
 * Career Monitor Card Component
 * Design: Fantasy card showing top 3 career/school matches from diagnoses.result_scores
 * Handles empty data gracefully
 */

import { motion } from "framer-motion";
import { Map, GraduationCap, Scroll } from "lucide-react";
import type { CareerMatch } from "@/lib/types";

interface CareerMonitorCardProps {
  matches: CareerMatch[];
}

const tagColorMap: Record<string, string> = {
  "英語教育": "tag-red",
  "探究学習": "tag-green",
  "グローバル": "tag-blue",
  "自然教育": "tag-red",
  "理系": "tag-gold",
  "自主性": "tag-red",
};

export default function CareerMonitorCard({ matches }: CareerMonitorCardProps) {
  return (
    <motion.div
      className="fantasy-card gold-corner p-4 md:p-5 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Header */}
      <div className="section-header">
        <div className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "rgba(201, 169, 110, 0.2)" }}>
          <Map className="w-3.5 h-3.5 text-amber-700" />
        </div>
        <span className="text-base font-bold" style={{ color: "#3B2F2F" }}>進路モニター</span>
      </div>

      {matches.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
          <Scroll className="w-8 h-8 text-amber-600/30" />
          <p className="text-sm font-medium" style={{ color: "#3B2F2F" }}>
            まだ診断データがありません
          </p>
          <p className="text-xs text-amber-800/40 text-center max-w-xs">
            診断テストを受けると、ここに進路相性TOP3が表示されます
          </p>
        </div>
      ) : (
        <>
          {/* Category Tabs */}
          <div className="flex gap-1.5 mb-4">
            {["1形", "明朗中", "進路探究大"].map((tab, i) => (
              <button
                key={tab}
                className={`text-[11px] px-3 py-1 rounded-full transition-all font-medium ${
                  i === 0
                    ? "text-amber-50 shadow-sm"
                    : "text-amber-800/50 hover:text-amber-800/70"
                }`}
                style={i === 0 ? {
                  background: "linear-gradient(135deg, #6B5234, #4A3728)",
                  border: "1px solid rgba(201, 169, 110, 0.3)"
                } : {
                  background: "rgba(201, 169, 110, 0.1)",
                  border: "1px solid rgba(201, 169, 110, 0.2)"
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* School Cards */}
          <div className="space-y-2.5 flex-1">
            {matches.map((match, index) => (
              <motion.div
                key={match.rank}
                className="flex gap-3 p-2 rounded-lg transition-all hover:shadow-sm"
                style={{
                  background: "rgba(245, 236, 215, 0.4)",
                  border: "1px solid rgba(201, 169, 110, 0.15)"
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{
                  borderColor: "rgba(201, 169, 110, 0.4)",
                  boxShadow: "0 2px 8px rgba(74, 55, 40, 0.1)"
                }}
              >
                {/* Rank Badge */}
                <div className="flex-shrink-0 pt-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      ...(match.rank === 1
                        ? { background: "linear-gradient(135deg, #D4A853, #B8860B)", color: "white", boxShadow: "0 2px 6px rgba(184, 134, 11, 0.3)" }
                        : match.rank === 2
                        ? { background: "linear-gradient(135deg, #A8A8A8, #808080)", color: "white" }
                        : { background: "linear-gradient(135deg, #A0784A, #7A5C34)", color: "#E8D5A8" })
                    }}
                  >
                    {match.rank}
                  </div>
                </div>

                {/* School Image */}
                <div className="flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded overflow-hidden"
                  style={{ border: "1px solid rgba(201, 169, 110, 0.25)" }}>
                  <img
                    src={match.imageUrl}
                    alt={match.schoolName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* School Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <GraduationCap className="w-3 h-3 text-amber-700 flex-shrink-0" />
                    <h4 className="font-bold text-[13px] truncate" style={{ color: "#3B2F2F" }}>
                      {match.schoolName}
                    </h4>
                  </div>
                  <p className="text-[11px] text-amber-800/50 mb-1.5 font-medium">
                    サ: {match.saValue} | {match.area}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {match.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`tag-badge ${tagColorMap[tag] || "tag-gold"}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Detail Button */}
      <div className="mt-4 flex justify-end">
        <button
          className="fantasy-btn text-xs flex items-center gap-1"
          onClick={() =>
            import("sonner").then(({ toast }) =>
              toast("診断結果の詳細は近日公開予定です")
            )
          }
        >
          診断結果を見る ◇
        </button>
      </div>
    </motion.div>
  );
}
