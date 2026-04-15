/**
 * Admin authentication (password-based, local)
 * .env.local: VITE_ADMIN_PASSWORD=kk2026
 */

const LS_KEY = "trail_os_admin_auth";

export function isAdminAuthed(): boolean {
  try {
    return localStorage.getItem(LS_KEY) === "ok";
  } catch {
    return false;
  }
}

export function loginAdmin(password: string): boolean {
  const expected = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? "kk2026";
  if (password === expected) {
    try { localStorage.setItem(LS_KEY, "ok"); } catch { /* ignore */ }
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
}
