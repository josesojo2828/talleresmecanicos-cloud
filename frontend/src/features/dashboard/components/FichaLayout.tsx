"use client";

import React from 'react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import { 
    Database, Calendar, Clock
} from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface FichaLayoutProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (id: string) => void;
    tabs: Tab[];
    hideHeader?: boolean;
    hideTabs?: boolean;
}

export const FichaLayout: React.FC<FichaLayoutProps> = ({
    title,
    subtitle,
    icon,
    createdAt,
    updatedAt,
    children,
    activeTab,
    setActiveTab,
    tabs,
    hideHeader = false,
    hideTabs = false
}) => {
    const t = useTranslations();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Header Area */}
            {!hideHeader && (
                <div className="bg-white/40 backdrop-blur-xl border border-white/40 p-6 rounded-[2rem] shadow-lg shadow-slate-200/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10 group-hover:scale-105 transition-transform duration-500">
                                {icon || <Database size={24} />}
                            </div>
                            <div>
                                <h1 className="text-xl font-extrabold text-slate-900 leading-tight uppercase tracking-tight">
                                    {title}
                                </h1>
                                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    {subtitle || "Detalles del Registro"}
                                </p>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="bg-white/60 border border-white p-3 rounded-2xl flex items-center gap-5 shadow-sm">
                            <div className="space-y-0.5">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 leading-none">
                                    <Calendar size={8} /> Creado
                                </p>
                                <p className="text-[10px] font-bold text-slate-700 tabular-nums">
                                    {createdAt ? new Date(createdAt).toLocaleDateString() : '--/--/--'}
                                </p>
                            </div>
                            <div className="w-px h-6 bg-slate-100" />
                            <div className="space-y-0.5">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 leading-none">
                                    <Clock size={8} /> Actualizado
                                </p>
                                <p className="text-[10px] font-bold text-slate-700 tabular-nums">
                                    {updatedAt ? new Date(updatedAt).toLocaleDateString() : '--/--/--'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Tabs Navigation */}
            {!hideTabs && tabs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/40 backdrop-blur-md rounded-2xl w-fit border border-slate-200/50 shadow-inner">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                                activeTab === tab.id
                                    ? "bg-white text-slate-900 shadow-md shadow-slate-200"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-white/30"
                            )}
                        >
                            {React.isValidElement(tab.icon) ? React.cloneElement(tab.icon as React.ReactElement<any>, { size: 14 }) : tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* 3. Content Area */}
            <div className={cn("bg-white/30 backdrop-blur-sm border border-white/20 rounded-[2rem] shadow-sm relative overflow-hidden", hideHeader ? "p-0" : "p-6")}>
                <div className="relative z-10 min-h-[300px]">
                    {children}
                </div>
            </div>
        </div>
    );
};
