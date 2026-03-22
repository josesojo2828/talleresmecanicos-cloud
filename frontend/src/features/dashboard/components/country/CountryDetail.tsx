"use client";

import React from 'react';
import { Globe, MapPin, Wrench, Users, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CountryDetailProps {
    data: any;
}

export const CountryDetail: React.FC<CountryDetailProps> = ({ data }) => {
    const t = useTranslations();

    const stats = [
        { label: 'Ciudades', value: data._count?.cities || 0, icon: <MapPin className="text-blue-500" />, color: 'bg-blue-50' },
        { label: 'Talleres', value: data._count?.workshops || 0, icon: <Wrench className="text-emerald-500" />, color: 'bg-emerald-50' },
        { label: 'Usuarios', value: data._count?.users || 0, icon: <Users className="text-amber-500" />, color: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
            {/* Hero Section del País */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-10 border border-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-7xl md:text-8xl shadow-2xl border-4 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        {data.flag || <Globe className="text-white/20" size={60} />}
                    </div>
                    
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">
                            {data.name}
                        </h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <span className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                data.enabled ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                            )}>
                                {data.enabled ? 'País Activo' : 'País Deshabilitado'}
                            </span>
                            <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                Región LATAM
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border border-white/50 shadow-sm", stat.color)}>
                                {stat.icon}
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                <TrendingUp size={12} /> +12%
                            </div>
                        </div>
                        <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{stat.label} registrados</div>
                    </div>
                ))}
            </div>

        </div>
    );
};

import { cn } from '@/utils/cn';
