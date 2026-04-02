"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
    ChevronLeft, Wrench, Clock, CheckCircle2,
    AlertCircle, Package, User, Hash, Calendar,
    FileText, MapPin, ShieldCheck
} from "lucide-react";
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";

interface WorkDetail {
    id: string;
    publicId: string;
    title: string;
    description?: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED';
    clientName?: string;
    vehicleLicensePlate?: string;
    images: string[];
    createdAt: string;
    updatedAt?: string;
    workshop: {
        name: string;
        address: string;
        phone?: string;
        logoUrl?: string;
    };
    partsUsed: {
        quantity: number;
        part: {
            name: string;
            price?: number;
        }
    }[];
}

export default function WorkPublicPage() {
    const { id: slug, publicId } = useParams();
    const router = useRouter();
    const [work, setWork] = useState<WorkDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWork = async () => {
            try {
                const res = await apiClient.get(`/work/public/${slug}/${publicId}`);
                setWork(res.data?.body || res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || "No se pudo encontrar la orden de trabajo");
            } finally {
                setLoading(false);
            }
        };
        if (slug && publicId) fetchWork();
    }, [slug, publicId]);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'OPEN': return { label: 'RECIBIDO', color: 'bg-blue-500', icon: <Clock size={16} /> };
            case 'IN_PROGRESS': return { label: 'EN REPARACIÓN', color: 'bg-amber-500', icon: <Wrench size={16} /> };
            case 'COMPLETED': return { label: 'LISTO PARA ENTREGA', color: 'bg-emerald-500', icon: <CheckCircle2 size={16} /> };
            case 'DELIVERED': return { label: 'ENTREGADO', color: 'bg-slate-500', icon: <Package size={16} /> };
            default: return { label: 'DESCONOCIDO', color: 'bg-slate-300', icon: <AlertCircle size={16} /> };
        }
    };

    const getFullImagePath = (path?: string | null) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/explorar-red/${path}`;
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Buscando Registro...</p>
        </div>
    );

    if (error || !work) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-xl mb-6">
                <AlertCircle size={40} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase mb-2">Orden no encontrada</h2>
            <p className="text-sm text-slate-400 mb-8 max-w-xs">{error || "Verifica el ID público e intenta de nuevo."}</p>
            <button onClick={() => router.back()} className="btn btn-neutral btn-md rounded-2xl px-10 text-[10px] uppercase font-black tracking-widest">
                Volver
            </button>
        </div>
    );

    const statusObj = getStatusInfo(work.status);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Brand */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button onClick={() => router.back()} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Estado del Trabajo</p>
                        <div className="flex items-center gap-2 justify-end">
                            <span className={cn("inline-block w-2 h-2 rounded-full animate-pulse", statusObj.color.replace('bg-', 'bg-'))} />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{statusObj.label}</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
                {/* 1. Top Card: Public ID & Workshop */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest mb-2">
                                <Hash size={10} /> {work.publicId}
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{work.title}</h1>
                            <p className="text-sm text-slate-400 font-medium">{work.description}</p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                            {work.workshop.logoUrl && (
                                <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-sm">
                                    <Image unoptimized src={getFullImagePath(work.workshop.logoUrl) || ''} alt={work.workshop.name} fill className="object-cover" />
                                </div>
                            )}
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Servicio por</p>
                                <p className="text-xs font-black text-slate-900 uppercase leading-none">{work.workshop.name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Client & Vehicle Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/50 border border-white flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Propietario</p>
                            <p className="text-sm font-black text-slate-900 uppercase leading-none">{work.clientName || 'Cliente'}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/50 border border-white flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                            <Wrench size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Vehículo / Placa</p>
                            <p className="text-sm font-black text-slate-900 uppercase leading-none">{work.vehicleLicensePlate || 'Sin Placa'}</p>
                        </div>
                    </div>
                </div>

                {/* 3. Progress / Status Detail */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white">
                    <header className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Estado de la Orden</h2>
                            <div className="w-12 h-1 bg-slate-900 rounded-full" />
                        </div>
                        <Calendar size={20} className="text-slate-300" />
                    </header>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", work.status === 'OPEN' ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-slate-200')}>
                                    <Clock size={16} />
                                </div>
                                <div className="w-0.5 flex-1 bg-slate-100 my-1" />
                            </div>
                            <div className="pt-1">
                                <p className="text-[10px] font-black uppercase text-slate-900">Recibido</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date(work.createdAt).toLocaleDateString()}</p>
                                {work.status === 'OPEN' && <p className="text-xs text-blue-500 font-bold mt-1 italic">El taller ha recibido tu vehículo y está programando la revisión.</p>}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", work.status === 'IN_PROGRESS' ? 'bg-amber-500 shadow-lg shadow-amber-500/30' : (['COMPLETED', 'DELIVERED'].includes(work.status) ? 'bg-emerald-500' : 'bg-slate-200'))}>
                                    <Wrench size={16} />
                                </div>
                                <div className="w-0.5 flex-1 bg-slate-100 my-1" />
                            </div>
                            <div className="pt-1">
                                <p className="text-[10px] font-black uppercase text-slate-900">En Reparación</p>
                                {work.status === 'IN_PROGRESS' && <p className="text-xs text-amber-500 font-bold mt-1 italic">Estamos trabajando en tu vehículo según el presupuesto acordado.</p>}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", work.status === 'COMPLETED' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : (work.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-slate-200'))}>
                                    <CheckCircle2 size={16} />
                                </div>
                                <div className="w-0.5 flex-1 bg-slate-100 my-1" />
                            </div>
                            <div className="pt-1">
                                <p className="text-[10px] font-black uppercase text-slate-900">Trabajo Terminado</p>
                                {work.status === 'COMPLETED' && <p className="text-xs text-emerald-500 font-bold mt-1 italic">¡Buenas noticias! Tu vehículo está listo para ser retirado.</p>}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", work.status === 'DELIVERED' ? 'bg-slate-900 shadow-lg' : 'bg-slate-200')}>
                                    <Package size={16} />
                                </div>
                            </div>
                            <div className="pt-1">
                                <p className="text-[10px] font-black uppercase text-slate-900">Entregado</p>
                                {work.status === 'DELIVERED' && <p className="text-xs text-slate-400 font-bold mt-1 italic">El vehículo ha sido retirado del taller satisfactoriamente.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Parts Used (Inventory Link) */}
                {work.partsUsed && work.partsUsed.length > 0 && (
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white">
                        <header className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center"><Package size={20} /></div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Repuestos y Materiales</h2>
                        </header>
                        <div className="space-y-4">
                            {work.partsUsed.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">{item.quantity}x</div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{item.part.name}</p>
                                    </div>
                                    {item.part.price && (
                                        <p className="text-xs font-black text-slate-500 font-mono italic">${item.part.price.toLocaleString()}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Photos */}
                {work.images && work.images.length > 0 && (
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white">
                        <header className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center"><FileText size={20} /></div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Registro Fotográfico</h2>
                        </header>
                        <div className="grid grid-cols-2 gap-4">
                            {work.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden shadow-lg group">
                                    <Image unoptimized src={getFullImagePath(img) || ''} alt={"Registro " + idx} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Message */}
                <div className="text-center p-10">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                        <ShieldCheck className="text-emerald-500" size={32} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                        Sistema certificado por Red de Talleres Mecánicos.<br />
                        Toda la información es proveída directamente por el taller responsable.
                    </p>
                </div>
            </main>
        </div>
    );
}
