import { create } from "zustand";

export interface AuthUser {
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  login: (email: string) => void;
  logout: () => void;
}

const STORAGE_KEY = "cbb-crypto-auth";

const loadUser = (): AuthUser | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (typeof parsed?.email === "string" && parsed.email.length > 3) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window === "undefined" ? null : loadUser(),
  login: (email: string) => {
    const user = { email };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
    set({ user });
  },
  logout: () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    set({ user: null });
  }
}));

