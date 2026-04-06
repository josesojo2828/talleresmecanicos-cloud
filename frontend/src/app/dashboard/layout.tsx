"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/templates/AuthGuard";
import { Sidebar } from "@/components/organisms/dashboard/Sidebar";
import { DashboardHeader } from "@/components/organisms/dashboard/DashboardHeader";
import { TechnicalBackground } from "@/components/atoms/TechnicalBackground";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Sincronización precisa: Cerrar el sidebar al cambiar de ruta
    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [pathname]);

    return (
        <AuthGuard>
            <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden relative" suppressHydrationWarning>
                <TechnicalBackground />
                <Sidebar isMobileOpen={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                    <DashboardHeader onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />
                    <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                        <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}