"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/atoms/Typography";
import { Shield, Zap, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

export const BentoGrid = () => {
    const t = useTranslations("landing.bento");
    return (
        <section className="py-16 px-4 max-w-5xl mx-auto relative z-10 text-slate-900">
            <div className="text-center mb-10 space-y-2">
                <Typography variant="H2" className="text-slate-900 drop-shadow-sm !text-3xl">
                    {t("title")}
                </Typography>
                <Typography variant="P" className="text-slate-500 max-w-xl mx-auto font-medium text-sm">
                    {t("subtitle")}
                </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-auto md:h-[550px]">
                {/* ── LARGE EDITORIAL FEATURE ────────────────────── */}
                <div className="md:col-span-8 relative overflow-hidden group glass-card border-white/50 rounded-2xl p-0 shadow-lg">
                    {/* Background Photography - Mobile Performance Showcase */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/home/jsojo/.gemini/antigravity/brain/d3b82f86-2892-4404-b559-6e18d0dd637c/workshop_app_dashboard_light_1773489607232.png"
                            alt="Workshop Analytics"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-[3s]"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col p-8">
                        {/* Top Technical Badge */}
                        <div className="inline-flex items-center self-start px-3 py-1.5 rounded-full glass-effect border border-white/40 mb-auto">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2 animate-pulse" />
                            <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">{t("network.badge")}</span>
                        </div>

                        <div className="max-w-md mt-auto">
                            <Typography variant="H2" className="text-slate-900 mb-3 !text-2xl leading-tight font-black tracking-tight drop-shadow-sm">
                                {t.rich("network.title", {
                                    br: () => <br />,
                                    span: (chunks) => <span className="text-primary">{chunks}</span>
                                })}
                            </Typography>
                            <Typography variant="P" className="text-slate-600 text-sm leading-relaxed font-medium mb-2 transition-transform">
                                {t("network.description")}
                            </Typography>
                        </div>
                    </div>
                </div>

                {/* ── SIDE FEATURES COLUMN ───────────────────────── */}
                <div className="md:col-span-4 flex flex-col gap-5">
                    {/* Small Feature: Verification */}
                    <div className="flex-1 glass-card border-white/50 rounded-2xl p-6 group hover:border-emerald-500/30 transition-all flex flex-col justify-center">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Shield className="w-6 h-6" />
                        </div>
                        <Typography variant="H3" className="text-xl mb-2 text-slate-900 font-black tracking-tight">{t("verified.title")}</Typography>
                        <Typography variant="P" className="text-xs text-slate-500 font-medium leading-relaxed">
                            {t("verified.description")}
                        </Typography>
                    </div>

                    {/* Horizontal Mini Cards Grid */}
                    <div className="grid grid-cols-2 gap-4 h-36">
                        <div className="glass-card border-white/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center group">
                            <Zap className="w-6 h-6 text-yellow-500 mb-2 group-hover:scale-125 transition-transform" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t("performance.label")}</span>
                            <span className="text-xs font-bold text-slate-800">{t("performance.value")}</span>
                        </div>
                        <div className="glass-card border-white/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center group">
                            <Smartphone className="w-6 h-6 text-pink-500 mb-2 group-hover:scale-125 transition-transform" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t("interface.label")}</span>
                            <span className="text-xs font-bold text-slate-800">{t("interface.value")}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
