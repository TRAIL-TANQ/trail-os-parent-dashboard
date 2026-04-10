/**
 * TRAIL-OS Header Component
 * Design: Dark wood texture header bar with gold accents, ornate carved wood feel
 * Matches the reference image with warm brown wood and gold text
 */

import { Compass, BookOpen, Tv, Map, Users, Bell } from "lucide-react";

const WOOD_HEADER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663286960690/GGkmggfQAQGbo8c6w3FZQx/wood-header-ZLyLoeH6Pe46EGSqt6bYqz.webp";

const navItems = [
  { label: "ダッシュボード", icon: Compass, active: true },
  { label: "探究クエスト", icon: BookOpen, active: false },
  { label: "探究Tube", icon: Tv, active: false },
  { label: "診断結果", icon: Map, active: false },
  { label: "保護者設定", icon: Users, active: false },
];

export default function Header() {
  return (
    <header className="relative w-full" style={{ minHeight: 52 }}>
      {/* Wood texture background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${WOOD_HEADER})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      />
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to bottom, rgba(30,20,10,0.15), rgba(30,20,10,0.3))"
      }} />

      <div className="relative z-10 container flex items-center justify-between" style={{ height: 52 }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-300">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
            </svg>
            <span className="text-base font-bold tracking-widest drop-shadow-md"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#E8D5A8",
                textShadow: "0 1px 3px rgba(0,0,0,0.5)"
              }}>
              TRAIL-OS
            </span>
          </div>
        </div>

        {/* Navigation - hidden on mobile */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all ${
                item.active
                  ? "text-amber-200 font-semibold"
                  : "text-amber-300/50 hover:text-amber-200/80"
              }`}
              style={{
                textShadow: item.active ? "0 0 8px rgba(232,213,168,0.3)" : "none"
              }}
              onClick={() => {
                if (!item.active) {
                  import("sonner").then(({ toast }) =>
                    toast("この機能は近日公開予定です")
                  );
                }
              }}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="relative text-amber-300/60 hover:text-amber-200 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
          </button>
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(201,169,110,0.3), rgba(201,169,110,0.15))",
              border: "1.5px solid rgba(232,213,168,0.3)"
            }}>
            <span className="text-amber-200/80 text-[10px] font-bold">保</span>
          </div>
        </div>
      </div>

      {/* Bottom gold accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px]"
        style={{
          background: "linear-gradient(to right, transparent, rgba(201,169,110,0.5) 20%, rgba(201,169,110,0.7) 50%, rgba(201,169,110,0.5) 80%, transparent)"
        }}
      />
    </header>
  );
}
