import { ObjectPage, ObjectSidebar } from '@/types/user/dashboard';
import { IUser } from '@/types/user/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    // Datos a la mano
    user: IUser | null;
    token: string | null;
    language: string;
    isAuthenticated: boolean;
    sidebar: ObjectSidebar[];
    pages: ObjectPage[];
    _hasHydrated: boolean; // <-- Nuevo: para saber si ya leyó el localStorage
    setHasHydrated: (state: boolean) => void;

    // Acciones
    login: (user: IUser, token: string, lang: string, sidebar: ObjectSidebar[], pages: ObjectPage[]) => void;
    logout: () => void;
    setLanguage: (lang: string) => void;
    updateUser: (user: Partial<IUser>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            language: 'es', // Valor por defecto
            isAuthenticated: false,

            sidebar: [],
            pages: [],

            login: (user, token, lang, sidebar, pages) => set({
                user,
                token,
                language: lang,
                isAuthenticated: true,
                sidebar,
                pages
            }),

            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false
            }),

            setLanguage: (language) => set({ language }),

            updateUser: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);