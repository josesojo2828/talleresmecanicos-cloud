"use client";

import React from "react";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { ArrowRight, CheckCircle2, Star, Wrench } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const Hero = () => {
    const t = useTranslations("hero");

    return (
        // Fondo gris muy claro (bg-slate-50) para dar contraste suave
        <section className="relative pt-32 pb-24 px-4 flex flex-col items-center overflow-hidden bg-slate-50 min-h-[90vh]">

            {/* Patrón sutil de puntos en un gris apenas perceptible */}
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#64748b 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

            {/* Orbes decorativos en verde suave */}
            <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-emerald-200/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-[5%] w-[30%] h-[30%] bg-emerald-100/50 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 w-full">

                {/* Contenido Izquierdo */}
                <div className="flex-[1.2] text-center lg:text-left space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {t("badge")}
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
                            {t.rich("title", {
                                br: () => <br className="hidden md:block" />,
                                span: (chunks) => <span className="text-emerald-600">{chunks}</span>
                            })}
                        </h1>
                        <p className="text-slate-500 max-w-xl mx-auto lg:mx-0 text-lg leading-relaxed font-medium">
                            {t("description")}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link href="/registro" className="w-full sm:w-auto">
                            <Button className="w-full px-10 py-7 text-lg rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02]">
                                {t("cta_primary")} <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Lado Derecho: Composición Visual */}
                <div className="flex-1 relative w-full">
                    <div className="relative w-full aspect-square max-w-[520px] mx-auto">

                        {/* Contenedor de Imagen con bordes suaves y fondo gris claro */}
                        <div className="relative z-20 w-full h-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl shadow-slate-200">
                            <Image
                                src="/images/1.jpg"
                                alt="Workshop Management"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>


                    </div>
                </div>
            </div>
        </section>
    );
};