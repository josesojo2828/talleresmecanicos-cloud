"use client";

import React from "react";
import { Typography } from "@/components/atoms/Typography";
import { useTranslations } from "next-intl";

export const StatsSection = () => {
    const t = useTranslations("landing.stats");
    const stats = [0, 1, 2, 3].map(i => ({
        label: t(`items.${i}.label`),
        value: ["250+", "1.2k", "15+", "47"][i],
        detail: t(`items.${i}.detail`)
    }));
    return (
        <section className="py-16 px-4 max-w-5xl mx-auto relative z-10 text-slate-900">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 text-center border-white/50 group">
                        <Typography variant="H2" className="text-3xl font-black text-primary mb-1 group-hover:scale-105 transition-transform">
                            {stat.value}
                        </Typography>
                        <Typography variant="H4" className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">
                            {stat.label}
                        </Typography>
                        <Typography variant="P" className="text-[8px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                            {stat.detail}
                        </Typography>
                    </div>
                ))}
            </div>
        </section>
    );
};
