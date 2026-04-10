/**
 * Hero Section Component
 * Design: Greeting + avatar in ornate gold frame + level/XP bar
 * Matches reference image with RPG status panel feel
 */

import { motion } from "framer-motion";
import { Shield, Star, Coins } from "lucide-react";
import type { ChildProfile } from "@/lib/types";

interface HeroSectionProps {
  child: ChildProfile;
}

export default function HeroSection({ child }: HeroSectionProps) {
  const xpPercent = Math.round((child.xp / child.maxXp) * 100);
  const greeting = getGreeting();

  return (
    <div className="fantasy-card p-5 md:p-6 overflow-hidden">
      {/* Decorative corner ornaments */}
      <div className="absolute top-2 left-3 text-amber-600/20 text-lg" style={{ fontFamily: "'Cinzel', serif" }}>&#10022;</div>
      <div className="absolute top-2 right-3 text-amber-600/20 text-lg" style={{ fontFamily: "'Cinzel', serif" }}>&#10022;</div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8">
        {/* Text Content */}
        <motion.div
          className="flex-1 order-2 md:order-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm text-amber-800/60 mb-1.5 font-medium">{greeting}</p>
          <h1 className="text-xl md:text-2xl font-bold leading-tight mb-0"
            style={{ color: "#3B2F2F" }}>
            <span className="text-amber-700 font-extrabold">{child.name}くん</span>の学びの状況を
            <br className="hidden sm:block" />
            チェックしましょう
          </h1>
        </motion.div>

        {/* Avatar with ornate frame */}
        <motion.div
          className="order-1 md:order-2 flex-shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            {/* Outer gold frame */}
            <div className="absolute -inset-1.5 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #C9A96E, #8B7340, #C9A96E, #D4B87A, #C9A96E)",
                boxShadow: "0 4px 16px rgba(139, 115, 64, 0.3)"
              }}
            />
            {/* Inner frame */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #F5ECD7, #EDE0C8)",
                border: "2px solid rgba(201, 169, 110, 0.5)"
              }}>
              <img
                src={child.avatarUrl}
                alt={`${child.name}のアバター`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* AI coin badge */}
            <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #D4A853, #B8860B)",
                border: "2px solid #E8D5A8",
                boxShadow: "0 2px 8px rgba(184, 134, 11, 0.4)"
              }}>
              <span className="text-white text-[10px] font-bold" style={{ fontFamily: "'Cinzel', serif" }}>AI</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Level / XP / ALT Status Bar */}
      <motion.div
        className="mt-5 rounded-lg p-3 md:p-3.5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{
          background: "linear-gradient(135deg, rgba(59, 47, 47, 0.06), rgba(201, 169, 110, 0.1))",
          border: "1.5px solid rgba(201, 169, 110, 0.25)"
        }}
      >
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          {/* Level & Grade */}
          <div className="flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 text-amber-700" />
            <span className="font-bold text-[#3B2F2F] text-sm" style={{ fontFamily: "'Cinzel', serif" }}>
              Lv.{child.level}
            </span>
            <span className="text-amber-800 text-xs font-bold px-2 py-0.5 rounded"
              style={{
                background: "rgba(201, 169, 110, 0.15)",
                border: "1px solid rgba(201, 169, 110, 0.3)"
              }}>
              {child.grade}
            </span>
          </div>

          {/* XP Bar */}
          <div className="flex-1 min-w-[140px]">
            <div className="xp-bar">
              <motion.div
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* XP Numbers */}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-bold text-[#3B2F2F] text-sm" style={{ fontFamily: "'Cinzel', serif" }}>
              {child.xp}
            </span>
            <span className="text-amber-700/50 text-xs">/ {child.maxXp} XP</span>
          </div>

          {/* ALT Points */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(201, 169, 110, 0.12)",
              border: "1px solid rgba(201, 169, 110, 0.25)"
            }}>
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-bold text-amber-800 text-sm" style={{ fontFamily: "'Cinzel', serif" }}>
              {child.altPoints}
            </span>
            <span className="text-amber-700/50 text-xs">ALT</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "おはようございます！";
  if (hour < 18) return "こんにちは！";
  return "こんばんは！";
}
