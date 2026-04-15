import { useState } from "react";
import { useLocation } from "wouter";
import { loginAdmin } from "@/lib/adminAuth";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (loginAdmin(password)) {
      navigate("/admin");
    } else {
      setError("パスワードが違います");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(170deg, #1a1410 0%, #0d0a08 100%)" }}>
      <div className="w-full max-w-sm rounded-xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(197,160,63,0.4)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5" style={{ color: "#c5a03f" }} />
          <h1 className="text-lg font-bold" style={{ color: "#c5a03f" }}>TRAIL-OS 管理者ログイン</h1>
        </div>
        <p className="text-xs mb-4" style={{ color: "rgba(245,236,215,0.6)" }}>
          パスワードを入力してください
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="パスワード"
          autoFocus
          className="w-full px-3 py-2.5 rounded-lg mb-3 outline-none"
          style={{ background: "rgba(0,0,0,0.35)", color: "#f5ecd7", border: "1px solid rgba(197,160,63,0.35)" }}
        />
        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
        <button
          onClick={submit}
          className="w-full py-2.5 rounded-lg font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #c5a03f, #8b7340)", color: "#1a1410" }}>
          ログイン
        </button>
      </div>
    </div>
  );
}
