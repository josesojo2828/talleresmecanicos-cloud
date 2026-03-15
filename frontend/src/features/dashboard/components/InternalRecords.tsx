"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight, Database, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';

interface RecordItem {
    id: string;
    title: string;
    subtitle?: string;
    status?: boolean;
    slug: string; // The slug for detail link
}

interface InternalRecordsProps {
    title: string;
    records: RecordItem[];
    loading?: boolean;
    icon?: React.ReactNode;
}

export const InternalRecords: React.FC<InternalRecordsProps> = ({
    title,
    records,
    loading,
    icon
}) => {
    const t = useTranslations();

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-100 rounded-[2rem]" />
                ))}
            </div>
        );
    }

    if (!records.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                <Database size={40} className="text-slate-200 mb-4" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No se encontraron registros asociados</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <header className="flex items-center gap-2.5 mb-6">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    {icon ? React.cloneElement(icon as React.ReactElement, { size: 14 }) : <Database size={14} />}
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</h3>
                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-black tabular-nums">{records.length}</span>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {records.map((item) => (
                    <Link 
                        key={item.id} 
                        href={`/dashboard/${item.slug}/${item.id}`}
                        className="group bg-white p-4 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
                    >
                        {/* Status bar */}
                        {item.status !== undefined && (
                            <div className={cn(
                                "absolute top-0 right-0 w-12 h-0.5",
                                item.status ? "bg-emerald-500" : "bg-slate-200"
                            )} />
                        )}

                        <div className="flex justify-between items-start mb-3">
                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                <ChevronRight size={16} />
                            </div>
                            <ExternalLink size={12} className="text-slate-200 group-hover:text-emerald-300 transition-colors" />
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                                {item.title || "Sin título"}
                            </h4>
                            {item.subtitle && (
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">
                                    {item.subtitle}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
