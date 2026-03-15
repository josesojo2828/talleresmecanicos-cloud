"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Globe2 } from "lucide-react";
import apiClient from "@/utils/api/api.client";

interface Country {
    id: string;
    name: string;
    flag: string;
}

export const CountryShowcase = () => {
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        apiClient.get(`/regions/country`, {
            params: { filters: JSON.stringify({ enabled: true }) }
        })
            .then(res => setCountries(res.data.data || []))
            .catch(err => console.error("Error fetching countries", err));
    }, []);

    if (countries.length === 0) return null;

    return (
        <section className="py-20 bg-slate-50 relative z-10 overflow-hidden">
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col items-center mb-12 space-y-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                        <Globe2 size={14} className="animate-spin-slow" />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em]">Expansión Regional</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center">
                        Presencia en <span className="text-emerald-600">Latinoamérica</span>
                    </h2>
                    <p className="text-slate-500 text-sm font-medium text-center max-w-lg">
                        Conectando los mejores talleres mecánicos a través de todo el continente.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {countries.map((country) => (
                        <div
                            key={country.id}
                            className="group relative flex flex-col items-center p-6 rounded-[2rem] bg-white/50 backdrop-blur-sm border border-white hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 cursor-pointer overflow-hidden"
                        >
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10">
                                {/* Flag Container: Redondeado total para look moderno */}
                                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 group-hover:scale-110 transition-transform duration-500">
                                    <Image
                                        src={country.flag || "/images/placeholder-flag.png"}
                                        alt={country.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>

                                <span className="block text-[13px] font-black text-slate-700 group-hover:text-emerald-700 transition-colors uppercase tracking-tight text-center">
                                    {country.name}
                                </span>

                                {/* Indicador visual pequeño */}
                                <div className="mt-2 flex justify-center">
                                    <div className="h-1 w-0 group-hover:w-8 bg-emerald-500 rounded-full transition-all duration-500" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </section>
    );
};