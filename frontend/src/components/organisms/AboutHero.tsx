"use client";

import { Typography } from "@/components/atoms/Typography";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const AboutHero = () => {
    const t = useTranslations('about');

    return (
        <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
            {/* Cinematic Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/home/jsojo/.gemini/antigravity/brain/d3b82f86-2892-4404-b559-6e18d0dd637c/about_workshop_team_light_1773490115164.png"
                    alt="Trabajo en el Taller"
                    fill
                    className="object-cover object-center scale-105 animate-mesh opacity-90"
                    priority
                />
                {/* Modern Overlays for contrast */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Floating Label Container */}
                    <div className="reveal active inline-block px-7 py-2.5 mb-8 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm animate-float">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                            {t('pretitle')}
                        </span>
                    </div>

                    <div className="p-10 md:p-20 rounded-[4rem] bg-white/40 backdrop-blur-3xl border border-white/70 shadow-2xl reveal active transition-all">
                        <Typography variant="H1" className="mb-8 !text-5xl md:!text-7xl text-slate-900 !leading-[1] !tracking-tighter font-black">
                            {t('hero_title_part1')}<br />
                            <span className="text-primary italic inline-block mt-2">{t('hero_title_accent')}</span>
                        </Typography>

                        <div className="w-24 h-1.5 bg-primary/20 mx-auto mb-10 rounded-full" />

                        <Typography variant="P" className="max-w-2xl mx-auto text-slate-700 text-xl font-medium leading-relaxed italic border-x-2 border-primary/10 px-8">
                            &quot;{t('hero_subtitle')}&quot;
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Decorative Floating Elements (Inspiration-style cards) */}
            <div className="absolute top-1/4 -left-12 w-48 h-32 bg-white/30 backdrop-blur-xl border border-white/40 rounded-[2.5rem] -rotate-12 animate-shard hidden lg:block shadow-xl" />
            <div className="absolute bottom-1/4 -right-12 w-64 h-40 bg-primary/5 backdrop-blur-xl border border-white/40 rounded-[3.5rem] rotate-6 animate-shard animation-delay-1000 hidden lg:block shadow-xl" />
        </section>
    );
};
