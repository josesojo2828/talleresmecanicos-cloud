"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Header } from "@/components/organisms/Header";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    const t = useTranslations("auth.layout");

    const benefits = [
        { icon: <ShieldCheck size={18} />, text: "Acceso seguro y verificado" },
        { icon: <Zap size={18} />, text: "Directorio" },
        { icon: <CheckCircle2 size={18} />, text: "Visibilidad" },
    ];

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-slate-50 overflow-hidden text-slate-900">
            <Header />

            {/* 1. Fondo Técnico y Orbes */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#64748b 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

            <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">

                {/* 3. Main Split Layout */}
                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

                    {/* Columna Izquierda: Mensaje de Marca (Solo Desktop) */}
                    <div className="hidden lg:flex flex-col justify-center p-8 space-y-10">
                        <div className="space-y-6">
                            <div className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {t("platform_access")}
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                                {t("community_rebirth_title")} <br />
                                <span className="text-emerald-600">{t("community_rebirth_span")}</span>
                            </h1>
                            <p className="text-slate-500 text-lg font-medium max-w-md leading-relaxed">
                                {t("community_rebirth_description")}
                            </p>
                        </div>

                        {/* Lista de Beneficios con Estilo Refinado */}
                        <div className="space-y-6">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-default">
                                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm text-emerald-600 border border-slate-100 group-hover:scale-110 group-hover:shadow-emerald-500/10 transition-all duration-300">
                                        {benefit.icon}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-slate-900 font-bold text-sm tracking-tight">{benefit.text}</p>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Verificado y Garantizado</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Proof Tarjeta Flotante */}
                        <div className="pt-8">
                            <div className="inline-flex items-center gap-4 p-4 bg-white/50 backdrop-blur-md rounded-[2rem] border border-white shadow-sm max-w-xs transition-transform hover:-rotate-1">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden ring-2 ring-emerald-50">
                                            <div className="w-full h-full bg-slate-400" />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-slate-900 font-black text-xs leading-none">+5,000</p>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">Latinos ya están aquí</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: El Formulario */}
                    <div className="flex justify-center w-full">
                        <div className="w-full max-w-md relative">
                            {/* Decoración detrás de la card */}
                            <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-2xl pointer-events-none" />

                            <div className="relative bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">

                                <div className="relative z-10">
                                    <div className="mb-10 text-center lg:text-left">
                                        <h2 className="text-3xl font-black text-slate-900 mb-2">{title}</h2>
                                        <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
                                    </div>

                                    <div className="space-y-6">
                                        {children}
                                    </div>
                                </div>

                                {/* Micro-detalle decorativo en la esquina */}
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};