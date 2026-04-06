"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

interface StatusBadgeProps {
    status: string;
    variant?: 'default' | 'inverted' | 'table';
    showPulse?: boolean;
}

export const StatusBadge = ({ status, variant = 'default', showPulse = false }: StatusBadgeProps) => {
    const t = useTranslations();
    const statusKey = (status || "").toLowerCase();
    
    // Configuración exhaustiva de colores
    const config: Record<string, { bg: string, text: string, border: string, pulse?: string }> = {
        completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", pulse: "bg-emerald-500" },
        finished: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", pulse: "bg-emerald-500" },
        delivered: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", pulse: "bg-emerald-500" },
        success: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", pulse: "bg-emerald-500" },
        
        in_progress: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", pulse: "bg-blue-500" },
        running: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", pulse: "bg-blue-500" },
        
        open: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", pulse: "bg-amber-500" },
        pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", pulse: "bg-amber-500" },
        waiting: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", pulse: "bg-amber-500" },
        
        rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100", pulse: "bg-rose-500" },
        cancelled: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100", pulse: "bg-rose-500" },
        error: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100", pulse: "bg-rose-500" },
    };

    const current = config[statusKey] || { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-100" };

    if (variant === 'inverted') {
        const invertedBg = current.pulse ? current.pulse : "bg-slate-900";
        return (
            <div className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-white/10 text-white shadow-sm", invertedBg)}>
                {t(`status.${statusKey}`)}
            </div>
        );
    }

    if (variant === 'table') {
        return (
            <div className={cn("inline-flex items-center px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase border shadow-sm transition-all", current.bg, current.text, current.border)}>
                 <span className={cn("w-1.5 h-1.5 rounded-full mr-2 opacity-50 animate-pulse", current.pulse || "bg-current")} />
                 {t(`status.${statusKey}`)}
            </div>
        );
    }

    return (
        <div className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm inline-block", current.bg, current.text, current.border)}>
            {showPulse && <span className={cn("inline-block w-1 h-1 rounded-full mr-1 animate-pulse", current.pulse || "bg-current")} />}
            {t(`status.${statusKey}`)}
        </div>
    );
};
