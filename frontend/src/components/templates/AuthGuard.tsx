"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, token, _hasHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (_hasHydrated && (!isAuthenticated || !token)) {
            router.replace("/login");
        }
    }, [_hasHydrated, isAuthenticated, token, router]);

    // Show loader while hydrating or if not authenticated (redirecting)
    if (!_hasHydrated || !isAuthenticated || !token) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00f2fe]"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">
                        Verificando sesión // Auth Protocol...
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};