"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    PanelLeftClose,
    PanelLeftOpen,
    LogOut,
    X
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { NavItem } from "@/features/dashboard/components/NavItem";

interface SidebarProps {
    isMobileOpen: boolean;
    onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const t = useTranslations();

    const pathname = usePathname();
    const { sidebar, user } = useAuthStore();
    const { handleLogout } = useLogin();

    const toggleMenu = (label: string) => {
        setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
    };

    return (
        <>
            {/* Overlay oscuro para móvil */}
            {isMobileOpen && (
                <div
                    className="drawer-overlay fixed inset-0 z-40 lg:hidden"
                    onClick={onCloseMobile}
                />
            )}
            <aside
                className={cn(
                    "fixed h-screen top-0 left-0 bg-white border-r border-slate-100 flex flex-col z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    "lg:static lg:translate-x-0",
                    isMobileOpen ? "translate-x-0 w-[85%] sm:w-80 lg:w-82" : "-translate-x-full w-64 shadow-xl",
                    !isMobileOpen && (isCollapsed ? "lg:w-20" : "lg:w-64")
                )}
            >
                {/* Visual Glass Accent Line */}
                <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-slate-100 to-transparent" />

                <div className="p-4 flex items-center justify-between border-b border-slate-50 h-16 md:h-20">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 pl-2">
                            <div className="w-8 h-8 rounded-lg bg-[#006341] flex items-center justify-center shadow-md shadow-emerald-900/20">
                                <span className="text-white font-black text-sm">T</span>
                            </div>
                            <span className="font-extrabold text-lg text-slate-900 tracking-tighter">Talleres<span className="text-[#006341] italic">Mecanicos</span></span>
                        </div>
                    )}

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-700 hover:bg-white hover:border-emerald-700/20 transition-all mx-auto hidden lg:flex"
                    >
                        {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                    </button>

                    <button
                        onClick={onCloseMobile}
                        className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 lg:hidden"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1.5 scrollbar-hide">
                    {sidebar?.map((item) => (
                        <NavItem
                            key={item.slug}
                            item={item}
                            isCollapsed={isCollapsed}
                            pathname={pathname}
                            toggleMenu={toggleMenu}
                            isOpen={openMenus[item.label]}
                        />
                    ))}
                </nav>

                {/* Footer User Card */}
                <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                    <Link 
                        href="/dashboard/profile"
                        className={cn("group relative flex items-center gap-3 p-2 rounded-2xl border border-transparent transition-all", !isCollapsed && "hover:bg-white hover:border-slate-100 hover:shadow-sm")}
                    >
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-500/10 flex items-center justify-center font-black text-emerald-700 text-xs shadow-inner uppercase">
                                {user?.firstName?.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center ring-2 ring-emerald-500/10">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 truncate uppercase tracking-widest">{user?.email}</p>
                            </div>
                        )}
                    </Link>

                    <button
                        onClick={handleLogout}
                        className={cn(
                            "group mt-4 flex items-center gap-3 w-full p-3 rounded-2xl bg-red-50/5 border border-red-500/10 text-red-500 transition-all hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20",
                            isCollapsed && "justify-center"
                        )}
                    >
                        <LogOut size={18} className="transition-transform group-hover:-translate-x-0.5" />
                        {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-widest">{t('success.logout')}</span>}
                    </button>
                </div>
            </aside>

        </>
    );
};