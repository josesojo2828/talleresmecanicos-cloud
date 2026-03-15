"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
    ChevronLeft, Star, MapPin, Phone, MessageCircle, 
    Globe, Clock, Share2, Heart, Wrench, ShieldCheck,
    Navigation, ExternalLink, Mail, Award
} from "lucide-react";
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";

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
    city?: { name: string };
    country?: { name: string; flag: string };
    categories?: { id: string; name: string }[];
}

export default function WorkshopClient() {
    const { id } = useParams();
    const router = useRouter();
    const [workshop, setWorkshop] = useState<Workshop | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                const res = await apiClient.get(`/workshop/${id}`);
                setWorkshop(res.data?.body?.data || res.data?.data || res.data);
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

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Hero Section */}
            <div className="relative h-[45vh] lg:h-[55vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    <Image 
                        src={
                            (workshop.images[activeImage]?.startsWith('http') || workshop.images[activeImage]?.startsWith('/'))
                                ? workshop.images[activeImage]
                                : (workshop.images[activeImage] ? `/${workshop.images[activeImage]}` : 'https://images.unsplash.com/photo-1486006396193-471a2fc880d4?q=80&w=1200')
                        } 
                        alt={workshop.name} 
                        fill 
                        className="object-cover opacity-60 scale-105"
                    />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/20" />
                
                {/* Upper Nav */}
                <div className="absolute top-0 left-0 right-0 p-6 md:p-10 flex justify-between items-center z-10">
                    <button 
                        onClick={() => router.back()} 
                        className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-slate-900 transition-all border border-white/10"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-3">
                        <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-rose-500 transition-all border border-white/10">
                            <Heart size={20} />
                        </button>
                        <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-emerald-500 transition-all border border-white/10">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20 text-white">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {workshop.categories?.map(cat => (
                                    <span key={cat.id} className="px-3 py-1 bg-emerald-500/30 backdrop-blur-md text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none uppercase">
                                {workshop.name}
                            </h1>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        {[1,2,3,4,5].map(i => (
                                            <Star key={i} size={16} className={cn("fill-amber-400 text-amber-400", i > (workshop.rating || 4) && "fill-white/20 text-white/20")} />
                                        ))}
                                    </div>
                                    <span className="text-xl font-black">{workshop.rating || '4.8'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-widest text-xs">
                                    <MapPin size={16} /> {workshop.city?.name}, {workshop.country?.name}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 w-full md:w-auto">
                            {workshop.whatsapp && (
                                <a 
                                    href={`https://wa.me/${workshop.whatsapp}`}
                                    target="_blank"
                                    className="flex-1 md:flex-initial flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-500/20"
                                >
                                    <MessageCircle size={20} /> Contactar
                                </a>
                            )}
                            <button className="p-4 bg-white/20 backdrop-blur-md rounded-[2rem] text-white hover:bg-white hover:border-white transition-all border border-white/10">
                                <Navigation size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Details & Images */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Gallery */}
                        <section className="bg-white rounded-[3rem] p-4 shadow-xl border border-white">
                            <div className="grid grid-cols-4 gap-4 h-[500px]">
                                <div className="col-span-3 rounded-[2.5rem] overflow-hidden relative">
                                    <Image 
                                        src={
                                            (workshop.images[activeImage]?.startsWith('http') || workshop.images[activeImage]?.startsWith('/'))
                                                ? workshop.images[activeImage]
                                                : (workshop.images[activeImage] ? `/${workshop.images[activeImage]}` : 'https://images.unsplash.com/photo-1486006396193-471a2fc880d4?q=80&w=1200')
                                        } 
                                        alt="Main Gallery" 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                                    {workshop.images.length > 0 ? workshop.images.map((img, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={cn(
                                                "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all shrink-0",
                                                activeImage === idx ? "border-emerald-500 shadow-lg scale-95" : "border-transparent opacity-60 hover:opacity-100"
                                            )}
                                        >
                                            <Image 
                                                src={img.startsWith('http') || img.startsWith('/') ? img : `/${img}`} 
                                                alt="Gallery thumb" 
                                                fill 
                                                className="object-cover" 
                                            />
                                        </button>
                                    )) : (
                                        <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                                            <Wrench size={24} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Description */}
                        <section className="bg-white rounded-[3rem] p-10 md:p-14 shadow-sm border border-slate-100 space-y-8">
                            <header className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sobre el Taller</h2>
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                    <Award size={24} />
                                </div>
                            </header>
                            <p className="text-lg text-slate-500 leading-relaxed italic font-medium">
                                "{workshop.description}"
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-slate-50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Especialidad</p>
                                    <p className="font-bold text-slate-900">Mecánica General</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificación</p>
                                    <p className="font-bold text-slate-900 flex items-center gap-1">
                                        Oficial <ShieldCheck size={14} className="text-emerald-500" />
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atiende</p>
                                    <p className="font-bold text-slate-900">Particulares y Flotas</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Info Sidebar */}
                    <div className="space-y-8">
                        {/* Map Cardio */}
                        <section className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden group">
                           <div className="h-48 bg-slate-100 rounded-[2rem] overflow-hidden mb-6 relative">
                               {/* Mock Map Background */}
                               <div className="absolute inset-0 bg-[#eef2f5] flex items-center justify-center">
                                   <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center">
                                       <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                   </div>
                               </div>
                               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/10 backdrop-blur-[2px]">
                                   <button className="bg-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-2xl flex items-center gap-2">
                                       <Navigation size={14} /> Ver en Google Maps
                                   </button>
                               </div>
                           </div>
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                               <MapPin size={14} className="text-rose-500" /> Ubicación
                           </h3>
                           <p className="text-sm font-bold text-slate-800 leading-snug">
                               {workshop.address}
                           </p>
                           <p className="text-xs text-slate-400 mt-2">{workshop.city?.name}, {workshop.country?.name}</p>
                        </section>

                        {/* Contact Card */}
                        <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-16 translate-x-16" />
                            
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Phone size={14} className="text-emerald-400" /> Información de Contacto
                            </h3>
                            
                            <div className="space-y-6 relative z-10">
                                {workshop.phone && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400"><Phone size={18} /></div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Llámanos</p>
                                            <p className="text-sm font-black">{workshop.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {workshop.email && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400"><Mail size={18} /></div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Email</p>
                                            <p className="text-sm font-black">{workshop.email}</p>
                                        </div>
                                    </div>
                                )}
                                {workshop.website && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400"><Globe size={18} /></div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Web</p>
                                            <a href={workshop.website.startsWith('http') ? workshop.website : `https://${workshop.website}`} target="_blank" className="text-sm font-black hover:text-emerald-400 flex items-center gap-2 transition-colors">
                                                {workshop.website.replace(/^https?:\/\//, '')} <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {workshop.openingHours && (
                                    <div className="flex items-start gap-4 pt-4 border-t border-white/10 mt-6">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400"><Clock size={18} /></div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Horarios</p>
                                            <p className="text-xs font-medium text-slate-300 leading-relaxed whitespace-pre-line">
                                                {workshop.openingHours}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
