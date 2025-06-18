// stores/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
type Role = "admin" | "jobber" | "company";

export type User = {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  profile: string | null;
  background: string | null;
  role: Role;
  isActive: boolean;
  visible: boolean;
  block: boolean;
  loginVersion: number;
  createdAt: string;
  updatedAt: string;
};

type AuthStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
