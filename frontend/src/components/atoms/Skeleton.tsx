"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div className={cn("animate-pulse bg-slate-200 rounded-lg", className)} />
    );
};

export const PostSkeleton = () => (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <div className="space-y-2">
                <Skeleton className="w-48 h-4 rounded-md" />
                <Skeleton className="w-32 h-3 mx-2 md:h-2" />
            </div>
        </div>
        <div className="space-y-2">
            <Skeleton className="w-full h-3 rounded-md" />
            <Skeleton className="w-full h-3 rounded-md" />
            <Skeleton className="w-2/3 h-3 rounded-md" />
        </div>
        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            <div className="flex gap-4">
                <Skeleton className="w-20 h-4 rounded-md" />
                <Skeleton className="w-20 h-4 rounded-md" />
            </div>
            <Skeleton className="w-24 h-4 rounded-md" />
        </div>
    </div>
);

export const WorkshopSkeleton = () => (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
        <Skeleton className="w-full h-48 rounded-[1.5rem]" />
        <div className="space-y-3">
            <Skeleton className="w-2/3 h-6 rounded-md" />
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-full h-4 rounded-md" />
        </div>
        <div className="pt-4 flex gap-2">
            <Skeleton className="flex-1 h-10 rounded-xl" />
            <Skeleton className="flex-1 h-10 rounded-xl" />
        </div>
    </div>
);
