"use client";

import { Typography } from "@/components/atoms/Typography";
import { Search, CalendarCheck, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export const ValueProposition = () => {
    const t = useTranslations("landing.value_proposition");

    // Conceptos adaptados a Talleres Mecánicos
    const steps = [
        {
            num: '01',
            title: "Localiza el Taller", // t("steps.explore.title")
            icon: <Search className="w-6 h-6" />,
            color: "bg-emerald-100 text-emerald-600",
            desc: "Encuentra talleres certificados cerca de tu ubicación filtrando por especialidad y reputación." // t("steps.explore.desc")
        },
        {
            num: '02',
            title: "Agenda tu Cita", // t("steps.connect.title")
            icon: <CalendarCheck className="w-6 h-6" />,
            color: "bg-emerald-100 text-emerald-600",
            desc: "Reserva un espacio en tiempo real, recibe recordatorios y gestiona el historial de tu vehículo." // t("steps.connect.desc")
        },
        {
            num: '03',
            title: "Reparación Garantizada", // t("steps.participate.title")
            icon: <ShieldCheck className="w-6 h-6" />,
            color: "bg-emerald-100 text-emerald-600",
            desc: "Accede a repuestos de calidad y seguimiento detallado de cada reparación con garantía total." // t("steps.participate.desc")
        }
    ];

    return (
        <section className="relative px-6 py-24 bg-slate-50">
            {/* Decoración: Conectores sutiles entre pasos (solo desktop) */}
            <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-full max-w-4xl h-0.5 bg-emerald-100 hidden md:block" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Tu coche en manos <span className="text-emerald-600">expertas</span>
                    </h2>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto italic">
                        Un proceso transparente, digital y eficiente para el mantenimiento de tu vehículo.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className="relative group bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 hover:shadow-emerald-900/5 hover:-translate-y-2 transition-all duration-500"
                        >
                            {/* Número de fondo gigante */}
                            <span className="absolute top-6 right-8 text-7xl font-black text-slate-100 group-hover:text-emerald-50 transition-colors duration-500 select-none">
                                {step.num}
                            </span>

                            <div className="relative z-10">
                                {/* Icon Bubble Mejorado */}
                                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500`}>
                                    {step.icon}
                                </div>

                                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                                    {step.title}
                                </h3>

                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    {step.desc}
                                </p>

                                {/* Decoración inferior */}
                                <div className="mt-6 flex items-center gap-2">
                                    <div className="h-1 w-12 bg-emerald-500 rounded-full group-hover:w-20 transition-all duration-500" />
                                    <div className="h-1 w-1 bg-emerald-200 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};