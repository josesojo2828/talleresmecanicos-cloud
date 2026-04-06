"use client";

import { Wrench, Phone, Instagram, Facebook, MapPin, Edit3 } from "lucide-react";
import Link from "next/link";

interface WorkshopBannerProps {
    workshop: any;
}

export const WorkshopBanner = ({ workshop }: WorkshopBannerProps) => {
    return (
        <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group h-full flex flex-col lg:flex-row items-center gap-12">
            {/* Decoración de fondo estructural (Nebulosa Esmeralda) */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full translate-x-32 -translate-y-32 blur-[100px] group-hover:bg-emerald-500/10 transition-all duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-x-32 translate-y-32 blur-[80px] opacity-50" />

            {/* Contenido Principal */}
            <div className="flex-grow z-10 space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                        Impulsá <br className="hidden md:block" /> la eficiencia de <br />
                        <span className="text-emerald-600 italic underline decoration-emerald-600/20 decoration-8 underline-offset-4">
                            {workshop?.name || "Tu Taller"}
                        </span>
                    </h3>
                    <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] italic opacity-80">
                        Ingeniería en gestión de órdenes y stock.
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                    <Link href="/dashboard/my-workshop" className="group/btn relative overflow-hidden btn bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-12 font-black uppercase tracking-tighter italic h-14 border-none shadow-xl shadow-emerald-500/20 transition-all active:scale-95">
                        <span className="relative z-10 flex items-center gap-2">
                            <Edit3 size={18} /> Editar Perfil
                        </span>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    </Link>
                    
                    <div className="flex flex-wrap items-center gap-10 text-slate-400">
                        <div className="flex flex-col space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Contacto</span>
                            <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                {workshop?.phone || 'Sin número'}
                            </span>
                        </div>
                        {workshop?.address && (
                            <div className="hidden sm:flex flex-col space-y-1 border-l border-slate-100 pl-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Sede Central</span>
                                <span className="text-sm font-black text-slate-900 flex items-center gap-2 italic">
                                    <MapPin size={14} className="text-emerald-500" />
                                    {workshop.address}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* "Visual de Tarjeta" (Proporción Áurea & Elevación) */}
            <div className="relative z-10 shrink-0 mt-8 lg:mt-0">
                <div className="w-[300px] h-[190px] bg-white rounded-[2.5rem] p-8 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.15)] border border-emerald-50 relative overflow-hidden group/card hover:border-emerald-300 hover:shadow-[0_30px_70px_-10px_rgba(16,185,129,0.25)] transition-all duration-700">
                    
                    {/* Grid Pattern interna más sutil */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                        style={{ backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
                    
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        {/* Header de la Tarjeta */}
                        <div className="flex justify-between items-center">
                            <div className="w-12 h-12 bg-emerald-600 rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover/card:scale-110 transition-transform duration-500">
                                <Wrench size={22} />
                            </div>
                            <div className="text-right">
                               <span className="text-[8px] font-black text-emerald-500/50 uppercase tracking-[0.3em]">Status: Verificado</span>
                               <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight mt-0.5">{workshop?.slug}</p>
                            </div>
                        </div>

                        {/* Cuerpo de la Tarjeta (Info de contacto) */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover/card:bg-emerald-600 group-hover/card:text-white transition-all shadow-sm">
                                    <Phone size={16} />
                                </div>
                                <span className="text-xs font-black text-slate-800 tracking-widest">{workshop?.phone || '---'}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                <div className="flex gap-2">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all cursor-pointer shadow-sm">
                                        <Instagram size={16} />
                                    </div>
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all cursor-pointer shadow-sm">
                                        <Facebook size={16} />
                                    </div>
                                </div>
                                <div className="w-10 h-[2px] bg-emerald-100 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Sello de Autenticidad Fantasmal */}
                    <div className="absolute -bottom-4 -right-4 opacity-[0.03] rotate-[25deg] group-hover/card:rotate-[15deg] transition-transform duration-1000">
                         <Wrench size={100} />
                    </div>
                </div>
            </div>
        </div>
    );
};
