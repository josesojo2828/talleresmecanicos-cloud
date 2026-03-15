"use client";

import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Briefcase, ChevronRight, Car, Building2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const CTASection = () => {
    const t = useTranslations("landing.cta");

    return (
        <section className="px-6 py-24 bg-slate-50 relative z-10 overflow-hidden">
            {/* Decoración de fondo técnica */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#10b981 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Opción A: Para DUEÑOS DE TALLERES */}
                    <div className="relative group overflow-hidden bg-white p-10 rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/40 hover:-translate-y-3 transition-all duration-700">
                        {/* Blob decorativo animado */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-colors duration-700" />
                        
                        <div className="relative z-10 space-y-8">
                            <div className="w-16 h-16 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-500">
                                <Building2 size={32} />
                            </div>

                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    Potencia tu Negocio
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 leading-none tracking-tight">
                                    Digitaliza <br />
                                    <span className="text-emerald-600">tu Taller Mecánico</span>
                                </h3>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm">
                                    Únete a la plataforma líder y gestiona tus citas, clientes y reputación en un solo lugar.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Agenda Digital', 'Pagos Online', 'Perfil Premium', 'Nuevos Clientes'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-emerald-200 transition-all">
                                        <CheckCircle size={14} className="text-emerald-500" /> {item}
                                    </div>
                                ))}
                            </div>

                            <Link href="/register?role=workshop" className="block pt-4">
                                <Button className="w-full md:w-auto bg-slate-900 hover:bg-emerald-600 text-white px-12 py-8 rounded-[2rem] text-base font-black shadow-2xl shadow-slate-900/20 transition-all hover:scale-105">
                                    Empezar Gratis Ahora <ChevronRight className="ml-2 w-6 h-6" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Opción B: Para CLIENTES / DUEÑOS DE VEHÍCULOS */}
                    <div className="relative group overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 p-10 rounded-[4rem] shadow-2xl shadow-emerald-600/30 hover:-translate-y-3 transition-all duration-700">
                        {/* Blobs decorativos */}
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-700" />
                        <div className="absolute top-1/2 -right-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl" />

                        <div className="relative z-10 space-y-8">
                            <div className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center text-emerald-600 shadow-2xl group-hover:-rotate-12 transition-transform duration-500">
                                <Car size={32} />
                            </div>

                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20">
                                    Reparaciones Inteligentes
                                </div>
                                <h3 className="text-4xl font-black text-white leading-none tracking-tight">
                                    Encuentra <br />
                                    <span className="text-emerald-200">Mecánicos de Confianza</span>
                                </h3>
                                <p className="text-emerald-50/90 text-lg font-medium leading-relaxed max-w-sm">
                                    Compara presupuestos y reserva citas en los talleres mejor valorados de tu ciudad.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Reserva en Segundos', 'Precios Claros', 'Citas Inmediatas', 'Chat Directo'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
                                        <CheckCircle size={14} className="text-emerald-300" /> {item}
                                    </div>
                                ))}
                            </div>

                            <Link href="/directorio" className="block pt-4">
                                <Button className="w-full md:w-auto bg-white hover:bg-emerald-50 text-emerald-700 px-12 py-8 rounded-[2rem] text-base font-black shadow-2xl shadow-white/20 transition-all hover:scale-105">
                                    Buscar Taller en mi Zona <ChevronRight className="ml-2 w-6 h-6" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};