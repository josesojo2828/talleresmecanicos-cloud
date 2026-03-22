"use client";

import React from 'react';
import { MapPin, Wrench, Navigation, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils/cn';

interface CityDetailProps {
    data: any;
}

export const CityDetail: React.FC<CityDetailProps> = ({ data }) => {
    const t = useTranslations();

    const stats = [
        { label: 'Talleres', value: data._count?.workshops || 0, icon: <Wrench size={16} className="text-emerald-500" />, color: 'bg-emerald-50' },
        { label: 'Puntos Interés', value: 4, icon: <MapPin size={16} className="text-blue-500" />, color: 'bg-blue-50' },
        { label: 'Socio Local', value: data.country?.name || 'N/A', icon: <Navigation size={16} className="text-amber-500" />, color: 'bg-amber-50' },
        { label: 'Uptime Red', value: '99.9%', icon: <TrendingUp size={16} className="text-emerald-500" />, color: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Main Header */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-10 border border-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-7xl md:text-8xl shadow-2xl border-4 border-white overflow-hidden">
                         <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                            <MapPin size={60} />
                         </div>
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
                                {data.enabled ? 'Ciudad Activa' : 'Ciudad Deshabilitada'}
                            </span>
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 italic">
                                {data.country?.name || 'Región Desconocida'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white/60 p-6 rounded-[2rem] border border-white shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
                        <div className="flex items-center gap-4">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border border-white/50", stat.color)}>
                                {stat.icon}
                            </div>
                            <div>
                                <div className="text-xl font-black text-slate-900">{stat.value}</div>
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Geographic Context */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
                 
                 <div className="space-y-6 relative z-10 flex flex-col items-center text-center">
                    <Navigation className="text-emerald-500" size={48} />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Resumen Estratégico</h3>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-medium italic opacity-80">
                        {data.name} concentra el {((data._count?.workshops || 0) / 10 * 100).toFixed(1)}% de la actividad regional. Es un núcleo clave para la red de Talleres Mecánicos, facilitando la logística y el soporte técnico a gran escala.
                    </p>
                 </div>
            </div>
        </div>
    );
};
