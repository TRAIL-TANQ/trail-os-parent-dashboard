/**
 * TRAIL-OS Parent Dashboard - Home Page
 * Design Philosophy: RPG Fantasy Guild Board
 * Now connected to Supabase for real data
 */

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LearningReportCard from "@/components/LearningReportCard";
import CareerMonitorCard from "@/components/CareerMonitorCard";
import DailyMissionCard from "@/components/DailyMissionCard";
import MobileNav from "@/components/MobileNav";
import EmptyState from "@/components/EmptyState";
import { useDashboardData } from "@/lib/hooks";
import { Loader2, AlertTriangle } from "lucide-react";

const PARCHMENT_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663286960690/GGkmggfQAQGbo8c6w3FZQx/parchment-bg-KbVzrLTy6swooR8zMPwrxr.webp";

export default function Home() {
  const { data, loading, error } = useDashboardData();

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Parchment Background */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${PARCHMENT_BG})`,
          backgroundSize: "500px 500px",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(170deg, #EDE0C8 0%, #F5ECD7 30%, #EDE0C8 60%, #E8D5B8 100%)",
          opacity: 0.85,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 container py-4 md:py-6 space-y-4 md:space-y-5">
          {/* Loading State */}
          {loading && (
            <div className="fantasy-card p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-amber-700 animate-spin" />
              <p className="text-sm text-amber-800/60 font-medium">
                データを読み込んでいます...
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="fantasy-card p-8 flex flex-col items-center justify-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <p className="text-sm text-red-700 font-medium">
                データの取得中にエラーが発生しました
              </p>
              <p className="text-xs text-amber-800/50">{error}</p>
              <button
                className="fantasy-btn text-xs mt-2"
                onClick={() => window.location.reload()}
              >
                再読み込み
              </button>
            </div>
          )}

          {/* No Child Data State */}
          {!loading && !error && !data && (
            <EmptyState
              title="お子さまのデータがありません"
              description="まだお子さまが登録されていないか、データが見つかりません。管理者にお問い合わせください。"
            />
          )}

          {/* Dashboard Content */}
          {!loading && !error && data && (
            <>
              <HeroSection child={data.child} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                <LearningReportCard report={data.learningReport} />
                <CareerMonitorCard matches={data.careerMatches} />
              </div>

              <DailyMissionCard missions={data.dailyMissions} />
            </>
          )}
        </main>

        {/* Footer */}
        <footer
          className="relative z-10 py-4 mt-2"
          style={{ borderTop: "1px solid rgba(201, 169, 110, 0.2)" }}
        >
          <div className="container text-center">
            <p
              className="text-[11px] font-medium"
              style={{
                color: "rgba(139, 115, 64, 0.4)",
                fontFamily: "'Cinzel', serif",
              }}
            >
              TRAIL-OS &copy; 2025 — Parent Dashboard
            </p>
          </div>
        </footer>
      </div>

      <MobileNav />
    </div>
  );
}
