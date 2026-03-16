"use client";

import React from "react";
import { Typography } from "@/components/atoms/Typography";
import { AlertCircle, ArrowRight, CheckCircle2, MapPin, Tag, Camera } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface OnboardingBannerProps {
    workshop: any;
}

export const OnboardingBanner = ({ workshop }: OnboardingBannerProps) => {
    if (!workshop) return null;

    const steps = [
        {
            id: 'address',
            label: 'Ubicación y Datos',
            icon: <MapPin size={16} />,
            completed: !!workshop.address && !!workshop.phone,
        },
        {
            id: 'categories',
            label: 'Categorías',
            icon: <Tag size={16} />,
            completed: workshop.categories?.length > 0,
        },
        {
            id: 'images',
            label: 'Logo y Fotos',
            icon: <Camera size={16} />,
            completed: !!workshop.logoUrl,
        }
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const isFullyCompleted = completedCount === steps.length;

    if (isFullyCompleted) return null;

    return (
        <div className="relative group overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem] shadow-2xl" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
            
            <div className="relative p-8 md:p-10 flex flex-col lg:flex-row items-center gap-8">
                {/* Left: Info */}
                <div className="flex-1 space-y-4 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <AlertCircle size={12} />
                        Perfil Incompleto
                    </div>
                    
                    <Typography variant="H2" className="text-white !text-2xl md:!text-3xl font-black tracking-tight">
                        Haz que tu taller sea <br />
                        <span className="text-emerald-400">visto por miles.</span>
                    </Typography>
                    
                    <Typography variant="P" className="text-slate-400 max-w-md text-sm font-medium">
                        Completa los pasos restantes para aparecer en el directorio y empezar a recibir solicitudes de clientes.
                    </Typography>
                </div>

                {/* Center: Steps Progress */}
                <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
                    {steps.map((step) => (
                        <div 
                            key={step.id} 
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300",
                                step.completed 
                                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                                    : "bg-white/5 border-white/10 text-slate-400 opacity-60"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center",
                                step.completed ? "bg-emerald-500 text-slate-900" : "bg-white/10"
                            )}>
                                {step.completed ? <CheckCircle2 size={14} /> : step.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                        </div>
                    ))}
                </div>

                {/* Right: Action */}
                <div className="lg:pl-8 lg:border-l lg:border-white/10">
                    <Link 
                        href="/dashboard/my-workshop"
                        className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-colors group/btn shadow-xl"
                    >
                        Configurar Taller
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
