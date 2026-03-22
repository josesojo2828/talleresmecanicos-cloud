"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronLeft, Star, MapPin, Phone, MessageCircle,
    Globe, Clock, Share2, Heart, Wrench, ShieldCheck,
    Navigation, ExternalLink, Mail, Award, LogIn,
    ChevronRight,
    CheckCircle,
    Instagram, Facebook, Twitter, Youtube
} from "lucide-react";
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";
import { Map } from "@/components/molecules/Map";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface Workshop {
    id: string;
    name: string;
    description: string;
    address: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    email?: string;
    latitude?: number;
    longitude?: number;
    logoUrl?: string;
    images: string[];
    rating?: number;
    openingHours?: string;
    socialMedia?: any; // JSON
    city?: { name: string };
    country?: { name: string; flag: string };
    categories?: { id: string; name: string }[];
    works?: any[];
}

export default function WorkshopClient() {
    const { id } = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [workshop, setWorkshop] = useState<Workshop | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);



    // Helper: Parse schedule if it's JSON
    const formatSchedule = (hours: any) => {
        if (!hours) return 'Lun a Vie 08:00 - 18:00';

        let parsed: Record<string, any> = {};
        if (typeof hours === 'string') {
            try {
                parsed = JSON.parse(hours);
            } catch (e) {
                return hours;
            }
        } else {
            parsed = hours;
        }

        const DAYS_ORDER = [
            { key: "monday", label: "Lunes", short: "Lun" },
            { key: "tuesday", label: "Martes", short: "Mar" },
            { key: "wednesday", label: "Miércoles", short: "Mié" },
            { key: "thursday", label: "Jueves", short: "Jue" },
            { key: "friday", label: "Viernes", short: "Vie" },
            { key: "saturday", label: "Sábado", short: "Sáb" },
            { key: "sunday", label: "Domingo", short: "Dom" }
        ];

        // Ensure we have a valid object and at least one day enabled
        const activeDays = DAYS_ORDER.filter(d => parsed && parsed[d.key]?.enabled);
        
        if (activeDays.length === 0) {
            // Check if it's the old string format or empty
            if (Object.keys(parsed).length === 0) return 'Horario no definido';
            return 'Cerrado temporalmente';
        }

        // Grouping logic: Only group if consecutive in the calendar AND with same hours
        const groups: {start: string, end: string, time: string}[] = [];
        let currentGroup: any = null;

        activeDays.forEach((day, index) => {
            const dayData = parsed[day.key];
            const timeStr = `${dayData.open} - ${dayData.close}`;
            
            // Re-find the absolute position in the week to detect gaps
            const currentWeekPos = DAYS_ORDER.findIndex(d => d.key === day.key);
            const prevDayInActive = index > 0 ? activeDays[index - 1] : null;
            const prevWeekPos = prevDayInActive ? DAYS_ORDER.findIndex(d => d.key === prevDayInActive.key) : -1;

            // Start a new group if:
            // 1. First day of active
            // 2. Time is different
            // 3. There is a gap in the week position (e.g., skips Tuesday)
            if (!currentGroup || currentGroup.time !== timeStr || currentWeekPos !== prevWeekPos + 1) {
                currentGroup = { start: day.short, end: day.short, time: timeStr };
                groups.push(currentGroup);
            } else {
                currentGroup.end = day.short;
            }
        });

        return groups.map(g => {
            if (g.start === g.end) return `${g.start}: ${g.time}`;
            return `${g.start} a ${g.end}: ${g.time}`;
        }).join('\n');
    };

    const getFullImagePath = (path?: string | null) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('/')) {
            return path;
        }
        return `/talleres-mecanicos/${path}`;
    };

    const localImages = workshop?.images || [];

    useEffect(() => {
        if (localImages.length > 0 && activeImage >= localImages.length) {
            setActiveImage(0);
        }
    }, [localImages.length, activeImage]);

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                const res = await apiClient.get(`/workshop/${id}`);
                // Extract entity from interceptor's 'body' property
                const data = res.data?.body || res.data;
                setWorkshop(data);
            } catch (err) {
                console.error("Error fetching workshop:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchWorkshop();
    }, [id]);

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
            <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Cargando Ficha Técnica...</p>
        </div>
    );

    if (!workshop) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-6">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-xl shadow-rose-500/10">
                <Wrench size={40} className="rotate-45" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase">Taller no encontrado</h2>
            <button onClick={() => router.push('/directorio')} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                Volver al Directorio
            </button>
        </div>
    );



    const renderSocialIcon = (platform: string, url: string) => {
        const p = platform.toLowerCase();
        const iconProps = { size: 22, className: "group-hover:scale-110 transition-transform" };

        let icon = <Globe {...iconProps} />;
        if (p.includes('whatsapp')) icon = <MessageCircle {...iconProps} />;
        if (p.includes('instagram')) icon = <Instagram {...iconProps} />;
        if (p.includes('facebook')) icon = <Facebook {...iconProps} />;
        if (p.includes('twitter') || p.includes('x.com')) icon = <Twitter {...iconProps} />;
        if (p.includes('youtube')) icon = <Youtube {...iconProps} />;

        return (
            <div className="flex items-center justify-center">
                {icon}
            </div>
        );
    };

    const localLogo = (workshop.logoUrl && typeof workshop.logoUrl === 'string' && !workshop.logoUrl.startsWith('http')) ? workshop.logoUrl : null;
    const safeActiveImage = activeImage >= localImages.length ? 0 : activeImage; return (
        <div className="min-h-screen bg-[#F8FAFC]" suppressHydrationWarning>
            {/* 1. TOP HEADER / ACTION BAR */}
            <div className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                            <ChevronLeft size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Volver</span>
                    </button>

                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-10">

                {/* 2. HERO SECTION: Title & Main Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Info & Logo */}
                    <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
                        <div className="bg-white rounded-[3rem] p-0 shadow-xl shadow-slate-200/50 border border-white sticky top-28 overflow-hidden">
                            {/* Logo Hero */}
                            <div className="h-48 bg-slate-900 relative">
                                {workshop.logoUrl ? (
                                    <Image
                                        unoptimized
                                        src={getFullImagePath(workshop.logoUrl) || ''}
                                        alt={workshop.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10 uppercase font-black text-2xl tracking-tighter">
                                        <Wrench size={48} className="mr-2" /> {workshop.name.slice(0, 2)}
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
                            </div>

                            <div className="px-8 pb-10 -mt-8 relative">
                                <div className="inline-flex px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-emerald-500/20">
                                    Oficial
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {workshop.categories?.map(cat => (
                                            <span key={cat.id} className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">
                                        {workshop.name}
                                    </h1>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed pt-4 border-t border-slate-100">
                                        {workshop.description || 'Este taller es parte de nuestra red certificada de especialistas mecánicos.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Gallery and Map */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Main Image Slider Area */}
                        <div className="bg-white rounded-[2.5rem] p-4 lg:p-6 shadow-xl shadow-slate-200/50 border border-white">
                            <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-100 group shadow-lg">
                                {localImages && localImages.length > 0 ? (
                                    <Image
                                        unoptimized
                                        src={getFullImagePath(localImages[safeActiveImage]) || ''}
                                        alt={workshop.name}
                                        fill
                                        className="object-cover transition-all duration-700"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                        <Wrench size={80} className="rotate-45" />
                                    </div>
                                )}
                                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Vista del Taller {safeActiveImage + 1}/{localImages.length || 0}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : localImages.length - 1)} className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button onClick={() => setActiveImage(prev => prev < localImages.length - 1 ? prev + 1 : 0)} className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {localImages.length > 1 && (
                                <div className="flex gap-3 mt-6 p-2 overflow-x-auto custom-scrollbar">
                                    {localImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={cn(
                                                "relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0",
                                                activeImage === idx ? "border-emerald-500 scale-95" : "border-slate-50 opacity-60"
                                            )}
                                        >
                                            <Image unoptimized src={getFullImagePath(img) || ''} alt="Thumb" fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2.5 Check Order Status Search */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40 border border-white/5">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32" />
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
                                <div className="lg:col-span-3 space-y-6">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter leading-none italic">
                                        ¿Quieres saber el<br/>
                                        <span className="text-emerald-400">avance de tu vehículo?</span>
                                    </h2>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
                                        Introduce el ID público que el taller te proporcionó al recibir tu vehículo para consultar el estado en tiempo real.
                                    </p>
                                </div>
                                <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-[2rem] p-6 border border-white/10 lg:sticky lg:top-4 w-full">
                                    <div className="flex flex-col gap-3">
                                        <input 
                                            type="text" 
                                            placeholder="EJ: ABCD1234"
                                            className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-black uppercase tracking-widest focus:bg-white focus:text-slate-900 focus:outline-none transition-all placeholder:text-white/20"
                                            id="public-work-id"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const idVal = (e.target as HTMLInputElement).value;
                                                    if (idVal) router.push(`/taller/${id}/t/${idVal.trim().toUpperCase()}`);
                                                }
                                            }}
                                        />
                                        <button 
                                            onClick={() => {
                                                const idVal = (document.getElementById('public-work-id') as HTMLInputElement).value;
                                                if (idVal) router.push(`/taller/${id}/t/${idVal.trim().toUpperCase()}`);
                                            }}
                                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            Consultar ahora
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Details & Map */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-10">
                                <header className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-900 uppercase">Ubicación y Horarios</h3>
                                    <div className="w-20 h-1.5 bg-rose-500 rounded-full" />
                                </header>

                                <div className="space-y-8">
                                    <div className="flex gap-5">
                                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0"><MapPin size={24} /></div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Dirección Exacta</p>
                                            <p className="text-sm font-bold text-slate-900 leading-tight">{workshop.address}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{workshop.city?.name}, {workshop.country?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0"><Clock size={24} /></div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Horario Laboral</p>
                                            <p className="text-sm font-bold text-slate-800 leading-relaxed whitespace-pre-line">
                                                {formatSchedule(workshop.openingHours)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {workshop.socialMedia && (
                                    <div className="pt-6 border-t border-slate-50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Síguenos en</p>
                                        <div className="flex gap-2">
                                            {Object.entries(workshop.socialMedia).map(([platform, url]) => (
                                                <a key={platform} href={String(url)} target="_blank" className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-white">
                                                    {renderSocialIcon(platform, String(url))}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="h-[400px] bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 relative">
                                <Map
                                    center={[workshop.latitude || 0, workshop.longitude || 0]}
                                    zoom={15}
                                    markers={[{
                                        lat: workshop.latitude || 0,
                                        lng: workshop.longitude || 0,
                                        title: workshop.name,
                                        address: workshop.address,
                                        logoUrl: getFullImagePath(workshop.logoUrl) || undefined
                                    }]}
                                />
                            </div>
                        </div>
                    </div>
                </div>


            </main>

            {/* --- WhatsApp --- */}
            {workshop.whatsapp && (
                <a href={`https://wa.me/${workshop.whatsapp}`} target="_blank" className="fixed bottom-10 right-10 w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all z-[100] group">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                    <MessageCircle size={32} />
                </a>
            )}
        </div>
    );
}
