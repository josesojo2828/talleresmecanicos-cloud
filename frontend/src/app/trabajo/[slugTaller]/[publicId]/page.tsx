'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Wrench, Clock,
    Images, FileText, MapPin,
    ShieldCheck, AlertTriangle, Car,
    Check, PackageCheck
} from "lucide-react";
import axios from "axios";
import { cn } from "@/utils/cn";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";

// Simple unauthenticated client for public access
const publicApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
});

const STATUS_STEPS = [
    { id: 'OPEN', label: 'Recibido', description: 'Vehículo ingresado al taller', icon: FileText },
    { id: 'IN_PROGRESS', label: 'En Proceso', description: 'Técnicos trabajando', icon: Wrench },
    { id: 'COMPLETED', label: 'Finalizado', description: 'Pruebas de calidad listas', icon: PackageCheck },
    { id: 'DELIVERED', label: 'Entregado', description: 'Retirado por el cliente', icon: ShieldCheck },
];

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
                <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Sincronizando con el Taller...</p>
            </div>
        );
    }

    if (error || !work) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
                <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[3rem] flex items-center justify-center mb-8 shadow-2xl shadow-rose-500/10 transform -rotate-6">
                    <AlertTriangle size={40} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Orden no encontrada</h1>
                <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto leading-relaxed">Lo sentimos, no pudimos localizar esta orden de trabajo. Asegúrate de que el enlace sea correcto o contacta a tu mecánico.</p>
                <Link
                    href="/"
                    className="mt-12 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all"
                >
                    Ir al Inicio
                </Link>
            </div>
        );
    }

    // Determine current status index for the Stepper
    const currentStatusIndex = STATUS_STEPS.findIndex(step => step.id === work.status);

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-emerald-500 selection:text-white">
            <Header />

            {/* Context Header */}
            <div className="bg-slate-900 pt-32 pb-48 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                                    {work.publicId}
                                </span>
                                <span className="text-emerald-500/50 font-black tracking-tighter text-sm uppercase">Verification Portal v2.0</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-4">
                                {work.title}
                            </h1>
                            <p className="text-slate-400 font-medium text-lg leading-relaxed flex items-center gap-2">
                                <Car size={20} className="text-emerald-500" /> Seguimiento en tiempo real para tu vehículo
                            </p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-6">
                            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Estado de Seguridad</p>
                                <p className="text-sm font-black text-white uppercase tracking-tight">Orden Verificada</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 -mt-32 relative z-20 pb-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Tracking Content */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. Stepper / Tracking Status */}
                        <section className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 border border-white">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                                <Clock size={16} /> Progreso de la Reparación
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
                                {/* Desktop Connector Lines */}
                                <div className="hidden md:block absolute top-7 left-12 right-12 h-0.5 bg-slate-100 -z-10" />

                                {STATUS_STEPS.map((step, idx) => {
                                    const isCompleted = idx < currentStatusIndex;
                                    const isCurrent = idx === currentStatusIndex;
                                    const isLast = idx === STATUS_STEPS.length - 1;

                                    return (
                                        <div key={idx} className="flex flex-col items-center text-center group">
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10",
                                                isCompleted ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" :
                                                    isCurrent ? "bg-slate-900 text-white shadow-xl scale-110" :
                                                        "bg-slate-50 text-slate-300 border border-slate-100"
                                            )}>
                                                {isCompleted ? <Check size={24} /> : <step.icon size={24} />}
                                                {isCurrent && (
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white animate-ping" />
                                                )}
                                            </div>
                                            <div className="mt-6">
                                                <h4 className={cn(
                                                    "text-xs font-black uppercase tracking-widest mb-1 transition-colors",
                                                    isCurrent ? "text-slate-900" : isCompleted ? "text-emerald-600" : "text-slate-400"
                                                )}>
                                                    {step.label}
                                                </h4>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* 2. Evidence Feed (Photos) */}
                        <section className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
                            <header className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-3">
                                        <Images size={16} /> Galería de Evidencias
                                    </h2>
                                    <p className="text-sm font-black text-slate-900 uppercase">Respaldo visual del trabajo realizado</p>
                                </div>
                                <span className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 border border-slate-100 uppercase italic">
                                    {work.images?.length || 0} Capturas
                                </span>
                            </header>

                            {work.images && work.images.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {work.images.map((img: string, i: number) => (
                                        <div key={i} className="group relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-2 duration-500">
                                            <img
                                                src={img}
                                                alt={`Evidencia ${i + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                                <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-[8px] font-black text-white uppercase tracking-widest border border-white/20">
                                                    Imagen de Proceso #{i + 1}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                                    <Images size={48} className="mx-auto text-slate-200 mb-6" />
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Sin evidencias visuales todavía</h3>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase mt-2">El mecánico subirá fotos cuando comience la reparación.</p>
                                </div>
                            )}
                        </section>

                        {/* 3. Status History Log (Simple Mock if not in DB yet, but let's use the description) */}
                        <section className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-x-20 -translate-y-20" />
                            <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-3 italic">
                                <FileText size={16} /> Detalles del Reporte Técnico
                            </h2>
                            <div className="max-w-2xl">
                                <p className="text-slate-400 font-bold mb-6 italic text-sm">Registro capturado el {new Date(work.createdAt).toLocaleDateString()}</p>
                                <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-200">
                                    "{work.description || "El equipo técnico está realizando el diagnóstico inicial. Mantente atento a las actualizaciones y evidencias fotográficas."}"
                                </p>
                            </div>
                        </section>

                    </div>

                    {/* Right Column: Information Cards */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Workshop Verified Card */}
                        <div className="bg-white rounded-[3rem] p-8 border border-white shadow-lg shadow-slate-200/40">
                            <div className="flex items-center gap-4 mb-10">
                                {work.workshop?.logoUrl ? (
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-2">
                                        <img src={work.workshop.logoUrl} alt={work.workshop.name} className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                                        <Wrench size={32} />
                                    </div>
                                )}
                                <div>
                                    <p className="text-[9px] font-black text-emerald-600 uppercase italic">Taller Encargado</p>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{work.workshop?.name}</h3>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase italic mb-1">Ubicación</p>
                                        <p className="text-xs font-black text-slate-900 uppercase leading-snug">{work.workshop?.address}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{work.workshop?.city?.name}, {work.workshop?.country?.name}</p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50 flex flex-col gap-3">
                                    {work.workshop?.whatsapp && (
                                        <a href={`https://wa.me/${work.workshop.whatsapp}`} target="_blank" className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                                            WhatsApp de Atención
                                        </a>
                                    )}
                                    <a href={`tel:${work.workshop?.phone}`} className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
                                        Llamar ahora
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Card */}
                        <div className="bg-white rounded-[3rem] p-8 border border-white shadow-lg shadow-slate-200/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700" />
                            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-8 flex items-center gap-2 italic relative">
                                <Car size={14} /> Ficha del Vehículo
                            </h3>

                            <div className="space-y-6 relative">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase italic mb-1">Identificación del Auto</p>
                                    <p className="text-xl font-black text-slate-900 tracking-wider">
                                        {work.vehicleLicensePlate || "PLACA-NO-REG"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase italic mb-1">ID Público de Seguimiento</p>
                                    <div className="flex items-center gap-2">
                                        <code className="text-xs font-black text-slate-500 uppercase bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{work.publicId}</code>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confidence Card */}
                        <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
                                    <ShieldCheck size={28} />
                                </div>
                                <h4 className="text-lg font-black uppercase tracking-tight mb-4">Garantía Digital</h4>
                                <p className="text-slate-400 text-[11px] font-bold leading-relaxed mb-6 italic">
                                    Al retirar tu vehículo, este historial quedará disponible para futuras consultas, protegiendo el valor de reventa de tu auto.
                                </p>
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-none text-[9px] font-black p-6 rounded-2xl">
                                    DESCUBRIR MÁS SOBRE RINDE+
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
