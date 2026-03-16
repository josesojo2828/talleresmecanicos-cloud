"use client";

import { useEffect, useState } from "react";
import { Typography } from "@/components/atoms/Typography";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { OnboardingBanner } from "@/features/dashboard/components/OnboardingBanner";
import apiClient from "@/utils/api/api.client";

export default function Dashboard() {
    const { user } = useAuthStore();
    const [workshop, setWorkshop] = useState<any>(null);

    useEffect(() => {
        if (user?.role === 'TALLER') {
            apiClient.get('/my-workshop')
                .then(res => {
                    const data = res.data?.body?.data?.[0] || res.data?.data?.[0] || res.data?.[0];
                    setWorkshop(data);
                })
                .catch(err => console.error("Error fetching workshop for onboarding:", err));
        }
    }, [user]);

    const stats = [
        { label: "Visitas", value: "0", delta: "0%", icon: "/icons/svg/sys-activity-pulse.svg", color: "bg-emerald-50 text-emerald-600" },
        { label: "Consultas", value: "0", delta: "0%", icon: "/icons/svg/user-generic.svg", color: "bg-primary/10 text-primary" },
        { label: "Servicios", value: "0", delta: "0%", icon: "/icons/svg/fin-cart-simple.svg", color: "bg-slate-50 text-slate-600" },
        { label: "Rating", value: "N/A", delta: "NEW", icon: "/icons/svg/fin-chart-up.svg", color: "bg-emerald-50 text-emerald-600" },
    ];

    return (
        <div className="space-y-6 md:space-y-10">
            {/* Onboarding Banner for Workshops */}
            {user?.role === 'TALLER' && workshop && (
                <OnboardingBanner workshop={workshop} />
            )}

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
                        <Typography variant="H1" className="text-slate-900 !text-3xl md:!text-5xl font-black tracking-tight leading-none uppercase">
                            Bienvenido de nuevo, <br />
                            <span className="text-primary italic font-black">{user?.firstName || 'Usuario'}</span>
                        </Typography>
                        <Typography variant="P" className="text-slate-500 leading-relaxed font-semibold text-xs md:text-sm">
                            Tu centro de mando para gestionar {user?.role === 'TALLER' ? 'tu taller y clientes' : 'tus vehículos y servicios'}.
                            El sistema está operando bajo protocolos de alta eficiencia.
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

