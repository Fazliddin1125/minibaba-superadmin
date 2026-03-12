import { create } from "zustand";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  setLoading: (loading: boolean) => void;
  setUser: (user: { email: string; name: string } | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  isAuthenticated: false,
  user: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
  
}));