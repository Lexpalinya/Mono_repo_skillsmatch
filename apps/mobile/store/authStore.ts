// stores/useAuthStore.ts
import { create } from "zustand";

type Role = "admin" | "jobber" | "company";

type User = {
  id: string;
  name: string;
  role: Role;
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: (user) => set({ user, isLoading: false, error: null }),
  logout: () => set({ user: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
