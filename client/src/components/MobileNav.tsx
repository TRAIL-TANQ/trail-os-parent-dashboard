/**
 * Mobile Navigation Drawer
 * Design: Slide-in drawer for mobile navigation
 */

import { useState } from "react";
import { Menu, X, Compass, BookOpen, Tv, Map, Users } from "lucide-react";

const navItems = [
  { label: "ダッシュボード", icon: Compass, active: true },
  { label: "探究クエスト", icon: BookOpen, active: false },
  { label: "探究Tube", icon: Tv, active: false },
  { label: "診断結果", icon: Map, active: false },
  { label: "保護者設定", icon: Users, active: false },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50 shadow-lg flex items-center justify-center border-2 border-amber-500/50"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-gradient-to-b from-[#4A3728] to-[#3B2F2F] rounded-t-2xl p-4 pb-20 shadow-2xl border-t-2 border-amber-600/40">
          <div className="w-10 h-1 bg-amber-600/40 rounded-full mx-auto mb-4" />
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  item.active
                    ? "bg-amber-900/40 text-amber-100"
                    : "text-amber-200/70 hover:bg-amber-900/20 hover:text-amber-100"
                }`}
                onClick={() => {
                  setOpen(false);
                  if (!item.active) {
                    import("sonner").then(({ toast }) =>
                      toast("この機能は近日公開予定です")
                    );
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
