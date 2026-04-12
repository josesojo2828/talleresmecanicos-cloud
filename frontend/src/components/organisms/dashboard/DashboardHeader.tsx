"use client";

import { Menu } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";

interface DashboardHeaderProps {
    onOpenMobileSidebar: () => void;
}

export const DashboardHeader = ({ onOpenMobileSidebar }: DashboardHeaderProps) => {
    const { user } = useAuthStore();
    
    // Iniciales precisas
    const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "??";

    return (
        <header className="h-16 md:h-20 flex items-center justify-between px-6 md:px-10 flex-shrink-0 bg-white/60 backdrop-blur-xl border-b border-slate-200/60 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onOpenMobileSidebar}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 lg:hidden hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                >
                    <Menu size={20} />
                </button>
            </div>

            <div className="flex items-center gap-2 md:gap-5">
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-slate-900 leading-none">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {user?.role || "Usuario"} • {user?.workshop ? "Taller Activo" : "Online"}
                        </p>
                    </div>

                    <div className="relative group cursor-pointer">
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-slate-200 transition-transform group-hover:scale-105">
                            {initials}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                </div>
            </div>
        </header>
    );
};
