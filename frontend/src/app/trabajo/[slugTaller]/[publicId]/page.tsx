"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
    Wrench, CheckCircle2, Clock, Truck, 
    Images, FileText, MapPin, Phone, 
    Calendar, ShieldCheck, ExternalLink,
    AlertTriangle
} from "lucide-react";
import axios from "axios";
import { cn } from "@/utils/cn";

// Simple unauthenticated client for public access
const publicApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
});

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    OPEN: { label: "Recibido", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    IN_PROGRESS: { label: "En Proceso", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    COMPLETED: { label: "Listo para Entrega", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    DELIVERED: { label: "Entregado", icon: ShieldCheck, color: "text-slate-600", bg: "bg-slate-50" },
};

export default function PublicWorkPage() {
    const params = useParams();
    const slugTaller = params.slugTaller as string;
    const publicId = params.publicId as string;

    const [work, setWork] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWork = async () => {
            try {
                setLoading(true);
                const res = await publicApi.get(`/work/public/${slugTaller}/${publicId}`);
                setWork(res.data?.body || res.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (slugTaller && publicId) fetchWork();
    }, [slugTaller, publicId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verificando Orden de Trabajo...</p>
            </div>
        );
    }

    if (error || !work) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-rose-500/10">
                    <AlertTriangle size={32} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Orden no encontrada</h1>
                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">Verifica el enlace o contacta con el taller para obtener el ID correcto.</p>
                <a href="/" className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:tracking-[0.3em] transition-all">Regresar al inicio</a>
            </div>
        );
    }

    const currentStatus = STATUS_CONFIG[work.status] || STATUS_CONFIG.OPEN;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Navbar Sencillo */}
            <nav className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-12 mb-8 md:mb-12 sticky top-0 z-50 shadow-sm backdrop-blur-xl bg-white/80">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center rounded-xl text-white font-black shadow-lg shadow-emerald-500/20">
                        <Wrench size={20} />
                    </div>
                    <span className="font-black text-slate-900 uppercase tracking-tighter text-lg">{work.workshop?.name}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Portal Público Seguro
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Columna Izquierda: Detalles del Trabajo */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Tarjeta de Estatus Principal */}
                        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full translate-x-20 -translate-y-20 transition-transform duration-700 group-hover:scale-110" />
                            
                            <div className="relative">
                                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-50">
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-3 italic">Orden de Servicio</p>
                                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight uppercase tracking-tight">{work.title}</h1>
                                    </div>
                                    <div className={cn("px-8 py-4 rounded-3xl flex items-center gap-3 shadow-sm border border-transparent", currentStatus.bg)}>
                                        <currentStatus.icon size={24} className={currentStatus.color} />
                                        <span className={cn("font-black uppercase tracking-widest text-xs", currentStatus.color)}>
                                            {currentStatus.label}
                                        </span>
                                    </div>
                                </header>

                                <div className="space-y-10">
                                    {/* Descripción Técnica */}
                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                                            <FileText size={14} /> Reporte Técnico
                                        </h3>
                                        <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                            {work.description || "Iniciando diagnóstico..."}
                                        </p>
                                    </div>

                                    {/* Galería Visual */}
                                    {work.images && work.images.length > 0 && (
                                        <div>
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                                                <Images size={14} /> Evidencia Operativa ({work.images.length})
                                            </h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {work.images.map((img: string, i: number) => (
                                                    <div key={i} className="aspect-square rounded-3xl overflow-hidden bg-slate-100 group/img cursor-pointer relative shadow-sm hover:shadow-xl transition-all">
                                                        <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                                                        <div className="absolute inset-0 bg-slate-900/0 group-hover/img:bg-slate-900/20 transition-colors" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Línea de Tiempo / Footer */}
                        <div className="bg-slate-900 rounded-[40px] p-8 md:p-10 text-white shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-10 -translate-y-10" />
                            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2 italic">¿Alguna duda?</h4>
                                    <p className="text-white/60 text-xs font-medium leading-relaxed">Comunícate directamente con el taller asignado para más detalles técnicos sobre tu vehículo.</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {work.workshop?.whatsapp && (
                                        <a 
                                            href={`https://wa.me/${work.workshop.whatsapp}`}
                                            className="px-6 py-3 bg-white/10 hover:bg-emerald-500 hover:scale-105 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2"
                                        >
                                            WhatsApp Taller
                                        </a>
                                    )}
                                    {work.workshop?.phone && (
                                        <a 
                                            href={`tel:${work.workshop.phone}`}
                                            className="px-6 py-3 bg-white text-slate-900 hover:bg-emerald-50 transition-colors rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2"
                                        >
                                            <Phone size={12} /> Contactar
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Resumen Técnico */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Datos de Gestión */}
                        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm animate-in slide-in-from-right-4 duration-500">
                            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-8 flex items-center gap-2 italic">
                                <ShieldCheck size={14} /> Ficha Técnica
                            </h3>
                            
                            <div className="space-y-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase italic mb-1">Registro Inicial</p>
                                        <p className="text-xs font-black text-slate-900 uppercase">{new Date(work.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <ExternalLink size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase italic mb-1">Identificador Público</p>
                                        <p className="text-xs font-black text-slate-900 uppercase font-mono">{work.publicId}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 pt-8 border-t border-slate-50">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-emerald-600 uppercase italic mb-1">Ubicación del Taller</p>
                                        <p className="text-xs font-black text-slate-900 uppercase">{work.workshop?.address || "Dirección pendiente"}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{work.workshop?.city?.name}, {work.workshop?.country?.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Banner publicitario / confianza */}
                        <div className="bg-emerald-500 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-xl shadow-emerald-500/20">
                            <div className="absolute inset-0 bg-slate-900 opacity-0 group-hover:opacity-10 transition-opacity" />
                            <div className="relative">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                                    <ShieldCheck size={20} />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-tight mb-3">Taller Verificado</h4>
                                <p className="text-white/80 text-[11px] font-medium leading-relaxed">
                                    Este taller utiliza nuestro sistema SaaS para garantizar transparencia y puntualidad en sus trabajos técnicos.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
