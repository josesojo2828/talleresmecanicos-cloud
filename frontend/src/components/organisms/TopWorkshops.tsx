"use client";

import { useEffect, useState } from "react";
import { Star, MapPin, ChevronRight, CheckCircle2, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import apiClient from "@/utils/api/api.client";

interface Workshop {
    id: string;
    name: string;
    description: string;
    city: { name: string };
    country: { name: string; flag: string };
    logo?: string;
}

export const TopWorkshops = () => {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);

    useEffect(() => {
        apiClient.get(`/workshop`, {
            params: { take: 15, filters: JSON.stringify({ enabled: true }) }
        })
            .then(res => {
                const all = res.data.data || [];
                // Pick 3 random
                const shuffled = [...all].sort(() => 0.5 - Math.random());
                setWorkshops(shuffled.slice(0, 3));
            })
            .catch(err => console.error("Error fetching workshops", err));
    }, []);

    if (workshops.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50 relative z-10">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header de la sección */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                            <Award size={14} />
                            Selección Premium
                        </div>
                        <h2 className="text-slate-900 text-4xl md:text-5xl font-black tracking-tight leading-none">
                            Los Talleres <span className="text-emerald-600">Más Destacados</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                            Talleres verificados por nuestra comunidad con estándares de alta calidad, herramientas modernas y profesionalismo técnico.
                        </p>
                    </div>

                    <Link href="/directorio" className="group">
                        <Button className="rounded-2xl border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 hover:text-emerald-700 font-bold px-8 py-6 transition-all shadow-sm">
                            Explorar Directorio <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Grid de Talleres */}
                <div className="grid md:grid-cols-3 gap-10">
                    {workshops.map((workshop) => (
                        <div
                            key={workshop.id}
                            className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 p-5 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.1)] hover:-translate-y-2"
                        >
                            {/* Imagen del Taller */}
                            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 shadow-inner bg-slate-100">
                                <Image
                                    src={workshop.logo || "/images/placeholder-workshop.png"}
                                    alt={workshop.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    unoptimized
                                />
                                {/* Overlay de Rating */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 border border-white">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="text-sm font-black text-slate-800">4.9</span>
                                </div>
                                {/* Badge de Verificado */}
                                <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-lg scale-90 origin-left">
                                    <CheckCircle2 size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Verificado</span>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="flex-1 px-2 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-4 relative rounded-sm overflow-hidden shadow-sm">
                                        <Image
                                            src={workshop.country?.flag || "/images/placeholder-flag.png"}
                                            alt=""
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-widest">
                                        {workshop.city?.name}, {workshop.country?.name}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">
                                    {workshop.name}
                                </h3>

                                <p className="text-slate-500 text-sm line-clamp-2 font-medium leading-relaxed">
                                    {workshop.description}
                                </p>
                            </div>

                            {/* Footer del Card */}
                            <div className="mt-8 pt-5 border-t border-slate-50 flex items-center justify-between px-2">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Ubicación exacta</span>
                                </div>
                                <Link
                                    href={`/taller/${workshop.id}`}
                                    className="inline-flex items-center text-[11px] font-black uppercase text-emerald-600 tracking-widest hover:gap-2 transition-all"
                                >
                                    Ver Perfil <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};