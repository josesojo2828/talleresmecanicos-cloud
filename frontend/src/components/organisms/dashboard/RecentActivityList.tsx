"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface RecentActivityListProps {
    title: string;
    icon: ReactNode;
    colorClass: string;
    items: any[];
    emptyMessage: string;
    emptyIcon: ReactNode;
    viewAllLink: string;
    viewAllText: string;
    renderItem: (item: any) => ReactNode;
}

export const RecentActivityList = ({
    title,
    icon,
    colorClass,
    items,
    emptyMessage,
    emptyIcon,
    viewAllLink,
    viewAllText,
    renderItem
}: RecentActivityListProps) => {
    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <div className={cn("w-1 h-3 rounded-full", colorClass)} /> {title}
            </h4>
            <div className="bg-white rounded-md border border-slate-50 shadow-sm divide-y divide-slate-50 overflow-hidden">
                {items?.length > 0 ? (
                    items.map(renderItem)
                ) : (
                    <div className="p-10 text-center text-slate-300 italic text-[10px] uppercase font-bold tracking-widest space-y-2">
                        <div className="opacity-20 flex justify-center">{emptyIcon}</div>
                        {emptyMessage}
                    </div>
                )}
            </div>
            {items?.length > 0 && (
                <Link href={viewAllLink} className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors flex justify-center uppercase tracking-widest">
                    {viewAllText}
                </Link>
            )}
        </div>
    );
};
