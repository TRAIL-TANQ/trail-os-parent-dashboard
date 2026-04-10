/**
 * TRAIL-OS Parent Dashboard - Home Page
 * Design Philosophy: RPG Fantasy Guild Board
 * - Parchment texture background with subtle overlay
 * - Wood header bar with gold accents
 * - Gold ornament card borders
 * - 2-column card grid layout (Learning Report + Career Monitor)
 * - Full-width Daily Mission section
 */

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LearningReportCard from "@/components/LearningReportCard";
import CareerMonitorCard from "@/components/CareerMonitorCard";
import DailyMissionCard from "@/components/DailyMissionCard";
import MobileNav from "@/components/MobileNav";
import { mockDashboardData } from "@/lib/mockData";

const PARCHMENT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663286960690/GGkmggfQAQGbo8c6w3FZQx/parchment-bg-KbVzrLTy6swooR8zMPwrxr.webp";

export default function Home() {
  const data = mockDashboardData;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Parchment Background - subtle texture */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${PARCHMENT_BG})`,
          backgroundSize: "500px 500px",
          backgroundRepeat: "repeat",
        }}
      />
      {/* Warm gradient overlay */}
      <div className="fixed inset-0 z-0"
        style={{
          background: "linear-gradient(170deg, #EDE0C8 0%, #F5ECD7 30%, #EDE0C8 60%, #E8D5B8 100%)",
          opacity: 0.85
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 container py-4 md:py-6 space-y-4 md:space-y-5">
          {/* Hero Section */}
          <HeroSection child={data.child} />

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            {/* Left: Learning Report */}
            <LearningReportCard report={data.learningReport} />

            {/* Right: Career Monitor */}
            <CareerMonitorCard matches={data.careerMatches} />
          </div>

          {/* Daily Missions - Full Width */}
          <DailyMissionCard missions={data.dailyMissions} />
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-4 mt-2"
          style={{ borderTop: "1px solid rgba(201, 169, 110, 0.2)" }}>
          <div className="container text-center">
            <p className="text-[11px] font-medium" style={{ color: "rgba(139, 115, 64, 0.4)", fontFamily: "'Cinzel', serif" }}>
              TRAIL-OS &copy; 2025 — Parent Dashboard
            </p>
          </div>
        </footer>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
