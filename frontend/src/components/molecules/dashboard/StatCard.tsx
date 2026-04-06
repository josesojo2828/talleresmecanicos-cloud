"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: ReactNode;
    colorClass?: string;
    children?: ReactNode;
}

export const StatCard = ({ label, value, icon, colorClass = "text-emerald-500", children }: StatCardProps) => {
    return (
        <div className="bg-white p-5 rounded-md border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={cn("absolute top-0 right-0 p-6 text-slate-100 transition-colors group-hover:opacity-20", colorClass.replace('text-', 'text-opacity-5 text-'))}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
            <h2 className="text-5xl font-black text-slate-900 italic tracking-tighter tabular-nums mb-4">{value}</h2>
            {children}
        </div>
    );
};
