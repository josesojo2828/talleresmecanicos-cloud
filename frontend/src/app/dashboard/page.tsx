"use client";

import { Typography } from "@/components/atoms/Typography";
import Image from "next/image";

export default function Dashboard() {
    const stats = [
        { label: "Visitas", value: "2.4k", delta: "+12%", icon: "/icons/svg/sys-activity-pulse.svg", color: "bg-emerald-50 text-emerald-600" },
        { label: "Usuarios", value: "18", delta: "+5%", icon: "/icons/svg/user-generic.svg", color: "bg-primary/10 text-primary" },
        { label: "Ventas", value: "124", delta: "+8%", icon: "/icons/svg/fin-cart-simple.svg", color: "bg-slate-50 text-slate-600" },
        { label: "Status", value: "99.9%", delta: "OK", icon: "/icons/svg/fin-chart-up.svg", color: "bg-emerald-50 text-emerald-600" },
    ];

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Top Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card p-4 relative group overflow-hidden border-white/50 bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-3 relative z-10">
                            <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center shadow-xs transition-transform group-hover:scale-110`}>
                                <Image
                                    src={stat.icon}
                                    alt={stat.label}
                                    width={16}
                                    height={16}
                                    className="w-4 h-4"
                                    unoptimized
                                />
                            </div>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.delta}</span>
                        </div>
                        <div className="relative z-10">
                            <Typography variant="CAPTION" className="text-slate-400 block mb-1">
                                {stat.label}
                            </Typography>
                            <Typography variant="H3" className="text-slate-900 !text-xl font-black">
                                {stat.value}
                            </Typography>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Welcome Section */}
            <div className="relative group">
                <div className="glass-card p-8 md:p-12 relative overflow-hidden min-h-[300px] flex flex-col justify-center border-white/50 bg-white/60 shadow-md">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-[100px] animate-blob" />
                    <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />

                    <div className="relative z-10 space-y-4 max-w-2xl">
                        <Typography variant="CAPTION" className="text-primary tracking-[0.3em]">NEXO OS DASHBOARD</Typography>
                        <Typography variant="H1" className="text-slate-900 !text-3xl md:!text-5xl font-black tracking-tight leading-none">
                            Hola de nuevo, <br />
                            <span className="text-primary italic">Comandante.</span>
                        </Typography>
                        <Typography variant="P" className="text-slate-500 leading-relaxed font-semibold text-xs md:text-sm">
                            Tu sistema está operando al 100%. Hemos detectado un incremento del 12% en la actividad esta semana.
                        </Typography>
                    </div>

                    {/* Decorative Accent */}
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-20 pointer-events-none">
                        <div className="w-48 h-48 border border-slate-200 rounded-full flex items-center justify-center relative">
                            <div className="absolute inset-0 animate-spin-slow">
                                <div className="w-full h-full border-t border-primary/40 rounded-full" />
                            </div>
                            <Image
                                src="/icons/svg/jp/jp-torii.svg"
                                alt="Heritage"
                                width={60}
                                height={60}
                                className="opacity-50"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
