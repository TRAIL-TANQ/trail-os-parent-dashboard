import { useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useStudentDetail } from "@/lib/adminHooks";
import { isAdminAuthed } from "@/lib/adminAuth";
import { ChevronLeft } from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const DIFF_LABEL: Record<number, string> = { 1: "⭐", 2: "⭐⭐", 3: "⭐⭐⭐", 4: "👑" };

export default function AdminStudentDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/admin/student/:childId");
  const childId = params?.childId ? decodeURIComponent(params.childId) : null;
  const { detail, loading, error } = useStudentDetail(childId);

  useEffect(() => {
    if (!isAdminAuthed()) navigate("/admin/login");
  }, [navigate]);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(170deg, #1a1410 0%, #0d0a08 100%)" }}>
      <header className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1.5px solid rgba(197,160,63,0.3)" }}>
        <Link href="/admin/students">
          <a className="p-1.5 rounded-lg" style={{ color: "#c5a03f", textDecoration: "none" }}>
            <ChevronLeft className="w-4 h-4" />
          </a>
        </Link>
        <h1 className="text-base font-bold" style={{ color: "#c5a03f" }}>
          {detail ? `👤 ${detail.name}（${detail.grade}）` : "生徒詳細"}
        </h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        {loading && <p className="text-center py-12 text-amber-200/50 text-sm">読み込み中...</p>}
        {error && <p className="text-center py-12 text-red-400 text-sm">エラー: {error}</p>}
        {detail && (
          <div className="space-y-4">
            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="レベル" value={`Lv ${detail.level}`} color="#c5a03f" />
              <Stat label="ALT" value={detail.altPoints.toLocaleString()} color="#ffd700" />
              <Stat label="レート" value={detail.rating.toLocaleString()} color="#3b82f6" />
              <Stat label="勝率"
                value={`${detail.wins + detail.losses > 0 ? Math.round((detail.wins / (detail.wins + detail.losses)) * 100) : 0}%`}
                sub={`${detail.wins}勝${detail.losses}敗`}
                color="#22c55e" />
            </div>

            {/* Radar */}
            <Card title="能力レーダーチャート">
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={[
                  { axis: "バトル力", value: detail.radar.battle },
                  { axis: "クイズ力", value: detail.radar.quiz },
                  { axis: "コレクション", value: detail.radar.collection },
                  { axis: "継続力", value: detail.radar.streak },
                ]}>
                  <PolarGrid stroke="rgba(197,160,63,0.3)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: "#c5a03f", fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "rgba(245,236,215,0.4)", fontSize: 9 }} />
                  <Radar name={detail.name} dataKey="value" stroke="#c5a03f" fill="#c5a03f" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Deck accuracy */}
            <Card title="デッキ別クイズ正答率">
              {Object.keys(detail.deckAccuracy).length === 0 ? (
                <p className="text-xs text-amber-200/40">まだ回答履歴がありません</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(detail.deckAccuracy)
                    .sort(([, a], [, b]) => b - a)
                    .map(([deck, acc]) => (
                      <div key={deck} className="flex items-center gap-2">
                        <span className="text-xs w-20 truncate" style={{ color: "rgba(245,236,215,0.85)" }}>{deck}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.35)" }}>
                          <div className="h-full" style={{
                            width: `${acc}%`,
                            background: acc >= 70 ? "#22c55e" : acc >= 50 ? "#c5a03f" : "#ef4444",
                          }} />
                        </div>
                        <span className="text-xs w-10 text-right font-bold" style={{ color: "#c5a03f" }}>{acc}%</span>
                      </div>
                    ))}
                </div>
              )}
            </Card>

            {/* Weak questions */}
            <Card title="🧠 苦手問題トップ5">
              {detail.weakQuestions.length === 0 ? (
                <p className="text-xs text-amber-200/40">2回以上回答した問題がまだありません</p>
              ) : (
                <div className="space-y-2">
                  {detail.weakQuestions.map((w, i) => (
                    <div key={i} className="rounded-lg p-2.5"
                      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs flex-1" style={{ color: "rgba(245,236,215,0.85)" }}>
                          <span style={{ color: "#c5a03f" }}>{i + 1}.</span> {w.question}
                        </p>
                        <span className="text-xs font-bold shrink-0" style={{ color: "#ef4444" }}>
                          {w.accuracy}%
                        </span>
                      </div>
                      <p className="text-[10px] mt-1" style={{ color: "rgba(245,236,215,0.5)" }}>
                        正解: <span style={{ color: "#22c55e" }}>{w.correctAnswer}</span>
                        {" / "}
                        {w.attempts}回挑戦 / {w.deckKey} {DIFF_LABEL[w.difficulty] ?? ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Battle summary */}
            <Card title="⚔️ バトル成績">
              <div className="space-y-1 text-xs" style={{ color: "rgba(245,236,215,0.85)" }}>
                <p>勝敗: <span style={{ color: "#22c55e" }}>{detail.wins}勝</span> / <span style={{ color: "#ef4444" }}>{detail.losses}敗</span></p>
                <p>勝率: {detail.wins + detail.losses > 0 ? Math.round((detail.wins / (detail.wins + detail.losses)) * 100) : 0}%</p>
                <p>現在レート: <span style={{ color: "#c5a03f" }}>{detail.rating.toLocaleString()}</span></p>
                <p className="text-[10px]" style={{ color: "rgba(245,236,215,0.45)" }}>
                  ※ レート推移グラフ・直近5戦の結果は battle_history テーブル未実装のため表示不可。クイズ履歴をベースに集計しています。
                </p>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: `1.5px solid ${color}40` }}>
      <p className="text-[10px] font-bold mb-0.5" style={{ color }}>{label}</p>
      <p className="text-lg font-black" style={{ color }}>{value}</p>
      {sub && <p className="text-[10px]" style={{ color: "rgba(245,236,215,0.55)" }}>{sub}</p>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4"
      style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(197,160,63,0.3)" }}>
      <h3 className="text-sm font-bold mb-3" style={{ color: "#c5a03f" }}>{title}</h3>
      {children}
    </div>
  );
}
