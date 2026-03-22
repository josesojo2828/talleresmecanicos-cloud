"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/templates/AuthGuard";
import { Menu, Bell, Settings, Wrench, ChevronRight } from "lucide-react";
import { Sidebar } from "@/components/organisms/dashboard/Sidebar";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const pathname = usePathname();
    const t = useTranslations();

    // Cerrar el sidebar al cambiar de ruta en mobile
    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [pathname]);

    return (
        <AuthGuard>
            <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden relative" suppressHydrationWarning>

                {/* 1. Sistema de Fondo Técnico (Consistente con Auth y Hero) */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03]">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(#64748b 1px, transparent 1px)`,
                            backgroundSize: '32px 32px'
                        }}
                    />
                </div>

                {/* Luces sutiles de acento */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

                {/* Sidebar Component */}
                <Sidebar
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">

                    {/* 2. Header: Refinado y Profesional */}
                    <header className="h-16 md:h-20 flex items-center justify-between px-6 md:px-10 flex-shrink-0 bg-white/60 backdrop-blur-xl border-b border-slate-200/60">

                        <div className="flex items-center gap-4">
                            {/* Mobile Trigger mejorado */}
                            <button
                                onClick={() => setIsMobileSidebarOpen(true)}
                                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 lg:hidden hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                            >
                                <Menu size={20} />
                            </button>

                            {/* Breadcrumb / Title System */}
                            <div className="flex items-center gap-2">
                                {/* Breadcrumb icons removed as per user request */}
                            </div>
                        </div>

                        {/* 3. Actions & Profile */}
                        <div className="flex items-center gap-2 md:gap-5">

                            {/* Quick action buttons removed as per user request */}

                            {/* Perfil de Usuario con Estilo "ID Card" */}
                            <div className="flex items-center gap-3 pl-2">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-black text-slate-900 leading-none">Administrador</p>
                                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1 bg-emerald-50 px-1.5 py-0.5 rounded">
                                        Estatus Online
                                    </p>
                                </div>

                                <div className="relative group cursor-pointer">
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-slate-200 transition-transform group-hover:scale-105">
                                        AD
                                    </div>
                                    {/* Indicador de estado */}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* 4. Content Scroll View con Padding mejorado */}
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