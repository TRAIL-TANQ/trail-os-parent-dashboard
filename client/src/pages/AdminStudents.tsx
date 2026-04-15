import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useStudents, type Student } from "@/lib/adminHooks";
import { isAdminAuthed } from "@/lib/adminAuth";
import { ChevronLeft, ArrowUpDown } from "lucide-react";

type SortKey = "name" | "grade" | "level" | "altPoints" | "rating" | "decksUnlocked" | "questAccuracy" | "lastSeen";

export default function AdminStudents() {
  const [, navigate] = useLocation();
  const { students, loading, error } = useStudents();
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (!isAdminAuthed()) navigate("/admin/login");
  }, [navigate]);

  const sorted = useMemo(() => {
    const arr = [...students];
    arr.sort((a, b) => {
      const av = (a[sortKey] as string | number | null) ?? "";
      const bv = (b[sortKey] as string | number | null) ?? "";
      let cmp: number;
      if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv), "ja");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [students, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const fmtLast = (iso: string | null): string => {
    if (!iso) return "—";
    const diffMs = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diffMs / 3600000);
    if (hours < 1) return "1時間以内";
    if (hours < 24) return `${hours}時間前`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "昨日";
    if (days < 7) return `${days}日前`;
    return `${Math.floor(days / 7)}週間前`;
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(170deg, #1a1410 0%, #0d0a08 100%)" }}>
      <header className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1.5px solid rgba(197,160,63,0.3)" }}>
        <Link href="/admin">
          <a className="p-1.5 rounded-lg" style={{ color: "#c5a03f", textDecoration: "none" }}>
            <ChevronLeft className="w-4 h-4" />
          </a>
        </Link>
        <h1 className="text-base font-bold" style={{ color: "#c5a03f" }}>📋 生徒一覧（{students.length}名）</h1>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        {loading && <p className="text-center py-12 text-amber-200/50 text-sm">読み込み中...</p>}
        {error && <p className="text-center py-12 text-red-400 text-sm">エラー: {error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(197,160,63,0.3)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(197,160,63,0.1)" }}>
                  <ThCell label="名前"    k="name"           onClick={toggleSort} active={sortKey === "name"} />
                  <ThCell label="学年"    k="grade"          onClick={toggleSort} active={sortKey === "grade"} />
                  <ThCell label="Lv"      k="level"          onClick={toggleSort} active={sortKey === "level"} />
                  <ThCell label="ALT"     k="altPoints"      onClick={toggleSort} active={sortKey === "altPoints"} />
                  <ThCell label="レート"  k="rating"         onClick={toggleSort} active={sortKey === "rating"} />
                  <ThCell label="解放"    k="decksUnlocked"  onClick={toggleSort} active={sortKey === "decksUnlocked"} />
                  <ThCell label="正答率"  k="questAccuracy"  onClick={toggleSort} active={sortKey === "questAccuracy"} />
                  <ThCell label="最終"    k="lastSeen"       onClick={toggleSort} active={sortKey === "lastSeen"} />
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr key={s.childId}
                    className="hover:opacity-80 cursor-pointer"
                    onClick={() => navigate(`/admin/student/${encodeURIComponent(s.childId)}`)}
                    style={{ borderTop: "1px solid rgba(197,160,63,0.15)" }}>
                    <td className="px-3 py-2 font-bold" style={{ color: "#c5a03f" }}>{s.name}</td>
                    <td className="px-3 py-2" style={{ color: "rgba(245,236,215,0.85)" }}>{s.grade}</td>
                    <td className="px-3 py-2" style={{ color: "rgba(245,236,215,0.85)" }}>{s.level}</td>
                    <td className="px-3 py-2" style={{ color: "#ffd700" }}>{s.altPoints.toLocaleString()}</td>
                    <td className="px-3 py-2" style={{ color: "rgba(245,236,215,0.85)" }}>{s.rating.toLocaleString()}</td>
                    <td className="px-3 py-2" style={{ color: "rgba(245,236,215,0.85)" }}>{s.decksUnlocked}/{s.totalDecks}</td>
                    <td className="px-3 py-2"
                      style={{ color: s.questAccuracy >= 70 ? "#22c55e" : s.questAccuracy >= 50 ? "#c5a03f" : "#ef4444" }}>
                      {s.questAccuracy > 0 ? `${s.questAccuracy}%` : "—"}
                    </td>
                    <td className="px-3 py-2" style={{ color: "rgba(245,236,215,0.55)" }}>{fmtLast(s.lastSeen)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function ThCell({ label, k, onClick, active }: { label: string; k: SortKey; onClick: (k: SortKey) => void; active: boolean }) {
  return (
    <th className="px-3 py-2 text-left font-bold cursor-pointer select-none"
      style={{ color: active ? "#c5a03f" : "rgba(197,160,63,0.65)", fontSize: 11 }}
      onClick={() => onClick(k)}>
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className="w-3 h-3 opacity-50" />
      </span>
    </th>
  );
}

// Unused but kept as a type export for completeness
export type { Student };
