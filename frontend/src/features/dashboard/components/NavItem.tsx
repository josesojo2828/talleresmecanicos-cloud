import Link from "next/link";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { ObjectSidebar } from "@/types/user/dashboard";
import { useTranslations } from "next-intl";

// Componente recursivo para los submenús
interface NavItemProps {
    item: ObjectSidebar;
    isCollapsed: boolean;
    pathname: string;
    toggleMenu: (label: string) => void;
    isOpen: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ item, isCollapsed, pathname, toggleMenu, isOpen }) => {
    const t = useTranslations();

    if (item.childs && item.childs.length > 0) {
        return (
            <div className="space-y-1">
                <button
                    onClick={() => !isCollapsed && toggleMenu(item.label)}
                    className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group",
                        pathname.startsWith(`/dashboard/${item.slug}`)
                            ? "bg-slate-50 text-primary border border-primary/10 shadow-sm"
                            : "text-slate-400 hover:bg-slate-50 hover:text-slate-900 border border-transparent",
                        isCollapsed && "justify-center"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <DynamicIcon name={item.icon} className={cn("w-5 h-5 min-w-[20px] transition-transform", !isCollapsed && "group-hover:scale-110")} />
                        {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">{t(item.label === "user.title" ? "user.title.default" : item.label as any)}</span>}
                    </div>
                    {!isCollapsed && (
                        <div className="transition-transform duration-300">
                            {isOpen ? <ChevronDown size={12} className="opacity-50" /> : <ChevronRight size={12} className="opacity-50" />}
                        </div>
                    )}
                </button>

                {!isCollapsed && isOpen && (
                    <div className="ml-5 mt-1 space-y-1 pl-4 border-l border-slate-100">
                        {item.childs.map(child => (
                            <Link
                                key={child.slug}
                                href={child.path || `/dashboard/${child.slug}`}
                                className={cn(
                                    "block p-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300",
                                    pathname === (child.path || `/dashboard/${child.slug}`)
                                        ? "text-emerald-700 bg-emerald-500/5 font-black"
                                        : "text-slate-400 hover:text-slate-900 hover:translate-x-1"
                                )}
                            >
                                {t(child.label === "user.title" ? "user.title.default" : child.label as any)}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={item.path || `/dashboard/${item.slug}`}
            className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group border border-transparent",
                pathname === (item.path || `/dashboard/${item.slug}`)
                    ? "bg-emerald-700 text-white shadow-lg shadow-emerald-700/20"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
            )}
        >
            <DynamicIcon
                name={item.icon}
                className={cn("w-5 h-5 transition-transform", !isCollapsed && "group-hover:scale-110")}
            />
            {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">{t(item.label === "user.title" ? "user.title.default" : item.label as any)}</span>}
            {pathname === `/dashboard/${item.slug}` && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
            {isCollapsed && (
                <span className="absolute left-16 bg-slate-800 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-4 group-hover:translate-x-0 shadow-xl z-[100] whitespace-nowrap border border-white/10">
                    {t(item.label === "user.title" ? "user.title.default" : item.label as any)}
                </span>
            )}
        </Link>
    );
};