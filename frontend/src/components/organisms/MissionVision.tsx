"use client";

import { useEffect } from "react";
import { Typography } from "@/components/atoms/Typography";
import { useTranslations } from "next-intl";
import { useLocalTranslation, TranslatableField } from "@/features/dashboard/hooks/useLocalTranslation";
import { GlassCard } from "@/components/molecules/GlassCard";
import { Target, Eye, Shapes } from "lucide-react";

interface MissionVisionProps {
    mision: TranslatableField;
    vision: TranslatableField;
}

export const MissionVision = ({ mision, vision }: MissionVisionProps) => {
    const t = useTranslations('about');
    const { tField } = useLocalTranslation();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        }, { threshold: 0.1 });

        const revealElements = document.querySelectorAll(".reveal");
        revealElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [mision, vision]);

    return (
        <section className="py-24 relative overflow-hidden bg-white">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary/5 skew-y-2 -z-10" />

            <div className="container mx-auto px-6">
                <div className="relative">
                    {/* Link Icon in the center */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-xl animate-float">
                            <Shapes className="w-6 h-6 text-primary" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 md:gap-20 relative z-10">
                        {/* Mission Card */}
                        <div className="reveal">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-primary/10 rounded-[3rem] blur opacity-10 group-hover:opacity-40 transition duration-1000" />
                                <GlassCard className="relative p-10 h-full rounded-[3rem] border-slate-100 overflow-hidden text-center md:text-right shadow-sm hover:shadow-xl bg-white/50">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Target className="w-20 h-20 text-primary" />
                                    </div>
                                    <div className="inline-flex w-16 h-16 bg-primary rounded-2xl items-center justify-center mb-8 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform group-hover:rotate-3">
                                        <Target className="w-8 h-8 text-white" />
                                    </div>
                                    <Typography variant="H3" className="mb-4 text-slate-900 uppercase tracking-tighter !text-3xl font-black">
                                        {t('mission')}
                                    </Typography>
                                    <Typography variant="P" className="text-slate-600 text-lg leading-relaxed font-bold">
                                        &quot;{tField(mision)}&quot;
                                    </Typography>
                                </GlassCard>
                            </div>
                        </div>

                        {/* Vision Card */}
                        <div className="reveal animation-delay-400">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-primary/10 rounded-[3rem] blur opacity-10 group-hover:opacity-40 transition duration-1000" />
                                <GlassCard className="relative p-10 h-full rounded-[3rem] border-slate-100 overflow-hidden text-center md:text-left shadow-sm hover:shadow-xl bg-white/50">
                                    <div className="absolute top-0 left-0 p-4 opacity-5">
                                        <Eye className="w-20 h-20 text-primary" />
                                    </div>
                                    <div className="inline-flex w-16 h-16 bg-primary/90 rounded-2xl items-center justify-center mb-8 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform group-hover:-rotate-3">
                                        <Eye className="w-8 h-8 text-white" />
                                    </div>
                                    <Typography variant="H3" className="mb-4 text-slate-900 uppercase tracking-tighter !text-3xl font-black">
                                        {t('vision')}
                                    </Typography>
                                    <Typography variant="P" className="text-slate-600 text-lg leading-relaxed font-bold">
                                        &quot;{tField(vision)}&quot;
                                    </Typography>
                                </GlassCard>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
