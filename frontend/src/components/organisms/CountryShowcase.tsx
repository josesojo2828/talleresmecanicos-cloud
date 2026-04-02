"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Globe2, Map } from "lucide-react";
import apiClient from "@/utils/api/api.client";

interface Country {
    id: string;
    name: string;
    flag: string;
}

export const CountryShowcase = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get(`/country`, {
            params: { filters: JSON.stringify({ enabled: true }) }
        })
            .then(res => {
                const body = res.data?.body || res.data;
                setCountries(body?.data || body || []);
            })
            .catch(err => console.error("Error fetching countries", err))
            .finally(() => setLoading(false));
    }, []);

    if (!loading && countries.length === 0) return null;

    return (
        <section className="py-32 bg-white relative z-10 border-b border-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="space-y-6">
                        <h2 className="text-slate-950 text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase italic">
                            EXPANSIÓN <br /> <span className="text-emerald-600 not-italic">REGIONAL.</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 bg-slate-100 border border-slate-100">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="h-40 bg-white animate-pulse" />
                        ))
                    ) : (
                        countries.map((country) => (
                            <div
                                key={country.id}
                                className="group relative flex flex-col items-center justify-center p-12 bg-white hover:bg-emerald-600 transition-all duration-300 hover:-translate-y-1 cursor-crosshair overflow-hidden"
                            >
                                <div className="space-y-6 flex flex-col items-center relative z-10">
                                    <div className="flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
                                        {country.flag}
                                    </div>

                                    <div className="text-center space-y-1">
                                        <span className="block text-xs font-black uppercase tracking-widest text-slate-950 group-hover:text-white transition-colors italic">
                                            {country.name}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Industrial Detail */}
                                <div className="absolute bottom-2 right-2 text-[8px] font-black text-slate-100 group-hover:text-white/20 transition-colors uppercase">
                                    NODE_{country.id.slice(0, 4)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};