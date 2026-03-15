"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/molecules/GlassCard";
import { Typography } from "@/components/atoms/Typography";

interface ResourceCardProps {
    title: string;
    description: string;
    icon: string;
    href: string;
    category?: string;
    color?: string;
}

export const ResourceCard = ({
    title,
    description,
    icon,
    href,
    category,
    color = "#22c55e"
}: ResourceCardProps) => {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block group">
            <GlassCard className="h-full p-8 flex flex-col border-slate-100 hover:border-primary/30 transition-all duration-500 bg-white shadow-sm hover:shadow-2xl group-hover:-translate-y-2 rounded-[2.5rem]">
                <div className="flex justify-between items-start mb-8">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        {/* Soft Glow Background */}
                        <div
                            className="absolute inset-0 rounded-[1.5rem] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                            style={{ backgroundColor: color }}
                        />
                        <div className="relative w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 transition-colors">
                            <Image
                                src={icon}
                                alt={title}
                                width={32}
                                height={32}
                                className="object-contain opacity-80 group-hover:opacity-100 transition-all"
                                unoptimized
                            />
                        </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-sm">
                        <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                </div>

                <div className="flex-1">
                    {category && (
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                            {category}
                        </span>
                    )}
                    <Typography variant="H4" className="text-slate-900 group-hover:text-primary transition-colors mb-4 font-black tracking-tight !text-2xl">
                        {title}
                    </Typography>
                    <Typography variant="P" className="text-slate-600 text-sm leading-relaxed font-bold">
                        {description}
                    </Typography>
                </div>

                {/* Technical Accent Line */}
                <div
                    className="h-1 w-0 group-hover:w-full transition-all duration-700 mt-8 rounded-full opacity-50"
                    style={{ backgroundColor: color }}
                />
            </GlassCard>
        </a>
    );
};
