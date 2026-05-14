import { create } from "zustand";

interface User {
    email: string;
    name: string;
}

interface UserStore {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useUserState = create<UserStore>((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
}));