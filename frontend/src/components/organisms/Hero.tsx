"use client";

import { ArrowRight, CheckCircle2, Shield, Settings, Database, Server } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import apiClient from "@/utils/api/api.client";

export const Hero = () => {
    const t = useTranslations("hero");
    const [stats, setStats] = useState({ workshops: 0, publications: 0, countries: 0 });

    useEffect(() => {
        apiClient.get('/public/stats')
            .then(res => {
                const data = res.data?.body || res.data;
                setStats(data || { workshops: 0, publications: 0, countries: 0 });
            })
            .catch(err => console.error("Error fetching stats", err));
    }, []);

    return (
        <section className="relative pt-40 pb-32 px-6 flex flex-col items-center overflow-hidden bg-transparent min-h-[95vh] border-b border-slate-200/60">
            {/* Absolute Architectural Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#059669 1.5px, transparent 1.5px)`, backgroundSize: '48px 48px' }} />

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-20 w-full">
                
                {/* Left Side: Content & Typography */}
                <div className="flex-[1.1] space-y-16">
                    <div className="space-y-10">
                        <div className="space-y-8">
                            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter text-slate-950 uppercase italic">
                                EL ESTÁNDAR<br />
                                <span className="text-emerald-600 not-italic">DEL TALLER</span><br />
                                MODERNO.
                            </h1>
                            <p className="text-slate-500 max-w-xl text-lg leading-relaxed font-bold uppercase tracking-tight">
                                {t("description") || "Gestionamos la complejidad mecánica con precisión. Conectamos dueños de vehículos con los mejores talleres mecánicos en un solo lugar."}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Link href="/registro" className="w-full sm:w-auto">
                            <button className="w-full group px-12 py-6 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[.25em] hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center gap-4">
                                {t("cta_primary") || "SOY DUEÑO DE TALLER"}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>

                    {/* Updated Stats with Real Data */}
                    <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200/50">
                        {[
                            { label: "TALLERES", val: stats.workshops },
                            { label: "PUBLICACIONES", val: stats.publications > 0 ? `+${stats.publications}` : "0" },
                            { label: "PAÍSES", val: stats.countries }
                        ].map(stat => (
                            <div key={stat.label}>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Visual Metaphor */}
                <div className="flex-1 relative hidden lg:block">
                    <div className="relative h-full aspect-[4/5] bg-white border-[1px] border-slate-200 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden">
                        <Image
                            src="/images/1.jpg"
                            alt="Workshop Interface"
                            fill
                            className="object-cover transition-all duration-1000"
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};