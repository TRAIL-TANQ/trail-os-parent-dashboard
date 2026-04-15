import { Link, useLocation } from "wouter";
import { useTopStats } from "@/lib/adminHooks";
import { isAdminAuthed, logoutAdmin } from "@/lib/adminAuth";
import { useEffect } from "react";
import { Users, Sword, TrendingUp, LogOut, BookOpen, Activity } from "lucide-react";

export default function AdminHome() {
  const [, navigate] = useLocation();
  const { stats, loading, error } = useTopStats();

  useEffect(() => {
    if (!isAdminAuthed()) navigate("/admin/login");
  }, [navigate]);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(170deg, #1a1410 0%, #0d0a08 100%)" }}>
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1.5px solid rgba(197,160,63,0.3)" }}>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: "#c5a03f" }} />
          <h1 className="text-base font-bold" style={{ color: "#c5a03f" }}>TRAIL QUEST 経営OS</h1>
        </div>
        <button
          onClick={() => { logoutAdmin(); navigate("/admin/login"); }}
          className="p-2 rounded-lg text-xs flex items-center gap-1"
          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(245,236,215,0.7)", border: "1px solid rgba(197,160,63,0.25)" }}>
          <LogOut className="w-3.5 h-3.5" /> ログアウト
        </button>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        {loading && <p className="text-center py-12 text-amber-200/50 text-sm">読み込み中...</p>}
        {error && <p className="text-center py-12 text-red-400 text-sm">エラー: {error}</p>}
        {stats && (
          <>
            {/* Top metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <StatCard icon={<Users />}  label="総生徒数" value={stats.totalStudents} color="#c5a03f" />
              <StatCard icon={<Activity />} label="DAU（24h）" value={stats.dau} color="#22c55e" />
              <StatCard icon={<Activity />} label="MAU（30d）" value={stats.mau} color="#3b82f6" />
              <StatCard icon={<Sword />} label="本日バトル" value={stats.todayBattles} color="#ef4444" />
            </div>

            {/* Deck unlock rate */}
            <Card title="デッキ解放率（全生徒平均）" icon={<BookOpen />}>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.35)" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${stats.avgDeckUnlockPct}%`,
                      background: "linear-gradient(90deg, #c5a03f, #ffd700)",
                      boxShadow: "0 0 10px rgba(197,160,63,0.5)",
                    }} />
                </div>
                <span className="text-base font-bold" style={{ color: "#c5a03f" }}>{stats.avgDeckUnlockPct}%</span>
              </div>
            </Card>

            {/* Difficulty clear rates */}
            <Card title="難易度別クリア率" icon={<TrendingUp />}>
              <div className="grid grid-cols-4 gap-3 text-center">
                <DiffStat label="⭐ ビギナー"     value={stats.difficultyClearRates.beginner}   color="#22c55e" />
                <DiffStat label="⭐⭐ チャレンジャー" value={stats.difficultyClearRates.challenger} color="#3b82f6" />
                <DiffStat label="⭐⭐⭐ マスター"    value={stats.difficultyClearRates.master}     color="#a855f7" />
                <DiffStat label="👑 レジェンド"     value={stats.difficultyClearRates.legend}     color="#ffd700" />
              </div>
            </Card>

            {/* Students link */}
            <Link href="/admin/students">
              <a className="block mt-4 rounded-xl p-4 flex items-center justify-between cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(197,160,63,0.15), rgba(139,115,64,0.1))",
                  border: "1.5px solid rgba(197,160,63,0.5)",
                  textDecoration: "none",
                }}>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: "#c5a03f" }} />
                  <span className="text-sm font-bold" style={{ color: "#f5ecd7" }}>📋 生徒一覧</span>
                </div>
                <span style={{ color: "#c5a03f" }}>→</span>
              </a>
            </Link>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: `1.5px solid ${color}40` }}>
      <div className="flex items-center gap-1.5 mb-1" style={{ color }}>
        <span className="w-3.5 h-3.5 inline-flex">{icon}</span>
        <span className="text-[10px] font-bold">{label}</span>
      </div>
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 mb-3"
      style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(197,160,63,0.3)" }}>
      <div className="flex items-center gap-1.5 mb-3" style={{ color: "#c5a03f" }}>
        <span className="w-4 h-4 inline-flex">{icon}</span>
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DiffStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <p className="text-[10px] mb-1" style={{ color: "rgba(245,236,215,0.6)" }}>{label}</p>
      <p className="text-xl font-black" style={{ color }}>{value}%</p>
    </div>
  );
}
