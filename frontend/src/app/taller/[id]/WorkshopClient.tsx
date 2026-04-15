"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
    ChevronLeft, Star, MapPin, Phone, MessageCircle,
    Globe, Clock, Share2, Heart, Wrench, ShieldCheck,
    Navigation, ExternalLink, Mail, Award, LogIn,
    ChevronRight,
    ArrowRight,
    CheckCircle,
    Instagram, Facebook, Twitter, Youtube,
    Activity,
    QrCode,
    Search,
    CarFront
} from "lucide-react";
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";
import { getFullImagePath } from "@/utils/image";
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
    const t = useTranslations();
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
        if (!hours) return 'Consulte disponibilidad';

        const formatTime = (time: string) => {
            if (!time) return '';
            // If it already has am/pm, return it
            if (time.toLowerCase().includes('a.m.') || time.toLowerCase().includes('p.m.')) return time;
            if (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm')) return time;

            // Simple 24h to 12h conversion
            const [hours, minutes] = time.split(':');
            let h = parseInt(hours);
            const m = minutes || '00';
            const suffix = h >= 12 ? 'p.m.' : 'a.m.';
            h = h % 12 || 12;
            return `${h}:${m} ${suffix}`;
        };

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

        const activeDays = DAYS_ORDER.filter(d => parsed && parsed[d.key]?.enabled);
        if (activeDays.length === 0) {
            if (Object.keys(parsed).length === 0) return 'Horario no definido';
            return 'Cerrado temporalmente';
        }

        const groups: {start: string, end: string, time: string}[] = [];
        let currentGroup: any = null;

        activeDays.forEach((day, index) => {
            const dayData = parsed[day.key];
            const timeStr = `${formatTime(dayData.open)} – ${formatTime(dayData.close)}`;
            const currentWeekPos = DAYS_ORDER.findIndex(d => d.key === day.key);
            const prevDayInActive = index > 0 ? activeDays[index - 1] : null;
            const prevWeekPos = prevDayInActive ? DAYS_ORDER.findIndex(d => d.key === prevDayInActive.key) : -1;

            if (!currentGroup || currentGroup.time !== timeStr || currentWeekPos !== prevWeekPos + 1) {
                currentGroup = { start: day.short, end: day.short, time: timeStr };
                groups.push(currentGroup);
            } else {
                currentGroup.end = day.short;
            }
        });

        return groups.map(g => {
            if (g.start === g.end) return `${g.start}: ${g.time}`;
            return `${g.start} – ${g.end}: ${g.time}`;
        }).join('\n');
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
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4 overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div className="w-20 h-20 border-4 border-slate-900/5 border-t-emerald-500 rounded-3xl animate-spin shadow-2xl" />
            <div className="text-center space-y-2 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Initial_Protocol: Running</p>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t('ficha.loading')}</h2>
            </div>
        </div>
    );

    if (!workshop) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-8 overflow-hidden relative">
             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
            <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[30px] flex items-center justify-center shadow-2xl shadow-rose-500/10 border border-white relative z-10">
                <Wrench size={48} className="rotate-45" />
            </div>
            <div className="text-center space-y-4 relative z-10 px-8">
                <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter leading-none">{t('error.not_found')}</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest max-w-sm mx-auto">No pudimos localizar la terminal técnica solicitada en nuestra red de talleres.</p>
            </div>
            <button onClick={() => router.push('/directorio')} className="px-10 py-4 bg-slate-950 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10 border border-white/10 group">
                {t('action.back')}
            </button>
        </div>
    );

    const renderSocialIcon = (platform: string, url: string) => {
        const p = platform.toLowerCase();
        const iconProps = { size: 20, className: "group-hover:scale-110 transition-transform" };
        let icon = <Globe {...iconProps} />;
        if (p.includes('whatsapp')) icon = <MessageCircle {...iconProps} />;
        if (p.includes('instagram')) icon = <Instagram {...iconProps} />;
        if (p.includes('facebook')) icon = <Facebook {...iconProps} />;
        if (p.includes('twitter') || p.includes('x.com')) icon = <Twitter {...iconProps} />;
        if (p.includes('youtube')) icon = <Youtube {...iconProps} />;
        return <div className="flex items-center justify-center">{icon}</div>;
    };

    const safeActiveImage = activeImage >= localImages.length ? 0 : activeImage;

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-emerald-500 selection:text-white" suppressHydrationWarning>
            {/* ATMOSPHERIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none z-0"></div>

            {/* ACTION BAR */}
            <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-3xl border-b border-slate-100/50 px-6 py-5">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <button onClick={() => router.back()} className="flex items-center gap-4 group">
                        <div className="w-11 h-11 rounded-[14px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 transition-all duration-500 shadow-sm">
                            <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">{t('action.back')}</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t('nav.directory')}</span>
                        </div>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col items-end mr-4">
                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic">{t('auth.layout.social_proof')}</span>
                            <div className="flex gap-1 mt-1 font-bold text-emerald-500 text-[8px]">
                                {[1,2,3,4,5].map(i => <Star key={i} size={8} fill="currentColor" />)}
                            </div>
                        </div>
                        <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all">
                            <Share2 size={14} /> {t('action.view_details')}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-6 lg:px-20 py-12 lg:py-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* LEFT COLUMN: BRANDING & SPEC */}
                    <aside className="lg:col-span-5 space-y-10">
                        {/* THE LOGO POD */}
                        <section className="bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.15)] border border-white p-2 group transition-all hover:translate-y-[-8px]">
                            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden bg-slate-900">
                                {workshop.logoUrl ? (
                                    <Image
                                        unoptimized
                                        src={getFullImagePath(workshop.logoUrl) || ''}
                                        alt={workshop.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/5 space-y-4">
                                        <QrCode size={120} />
                                        <p className="text-xl font-black uppercase tracking-[0.5em]">TALLER_POD_01</p>
                                    </div>
                                )}
                                {/* STATUS OVERLAY */}
                                <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
                                    <div className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2">
                                        <ShieldCheck size={12} /> {t('hero.trust.verified')}
                                    </div>
                                    <div className="px-3 py-1 bg-black/40 backdrop-blur-md text-white/70 rounded-full text-[8px] font-bold uppercase tracking-widest border border-white/10">
                                        CERTIFIED_NET v2.4
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                <div className="absolute bottom-10 left-10 text-white">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Identifier_Module // info</p>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">{workshop.name.split(' ')[0]}</h2>
                                </div>
                            </div>

                            <div className="p-10 space-y-10">
                                <div className="space-y-6">
                                    <div className="flex flex-wrap gap-2">
                                        {workshop.categories?.map(cat => (
                                            <span key={cat.id} className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all cursor-default">
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-black text-slate-950 uppercase tracking-tighter leading-[0.85] italic">
                                        {workshop.name}
                                    </h1>
                                    <p className="text-base text-slate-400 font-bold leading-relaxed border-l-4 border-emerald-500 pl-6 py-2">
                                        {workshop.description || 'ESTE TALLER ES PARTE DE NUESTRA RED CERTIFICADA DE ESPECIALISTAS MECÁNICOS.'}
                                    </p>
                                </div>

                                {/* CONTACT ACTIONS */}
                                <div className="grid grid-cols-2 gap-4">
                                    {workshop.whatsapp && (
                                        <a href={`https://wa.me/${workshop.whatsapp}`} target="_blank" className="bg-emerald-50 text-emerald-600 rounded-[24px] p-6 text-center group hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100">
                                            <MessageCircle size={32} className="mx-auto mb-3" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">WhatsApp</p>
                                        </a>
                                    )}
                                    {workshop.phone && (
                                         <a href={`tel:${workshop.phone}`} className="bg-blue-50 text-blue-600 rounded-[24px] p-6 text-center group hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100">
                                            <Phone size={32} className="mx-auto mb-3" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">{t('headers.phone')}</p>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* STATS POD */}
                        <section className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-[60px] -mr-20 -mt-20"></div>
                           <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-end border-b border-white/10 pb-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">GlobalPerformance_v2</p>
                                        <h3 className="text-xl font-black uppercase tracking-tighter leading-none italic">Estadísticas_Técnicas</h3>
                                    </div>
                                    <Activity className="text-emerald-500 animate-pulse" size={24} />
                                </div>
                                <div className="grid grid-cols-2 gap-10">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('ficha.stats.appearances')}</p>
                                        <p className="text-3xl font-black italic tracking-tighter">1,240+</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Success_Rate</p>
                                        <p className="text-3xl font-black italic tracking-tighter text-emerald-500">99.2%</p>
                                    </div>
                                </div>
                           </div>
                        </section>
                    </aside>

                    {/* RIGHT COLUMN: GALLERY & PORTALS */}
                    <div className="lg:col-span-7 space-y-12">
                        {/* MAIN GALLERY */}
                        <section className="bg-white rounded-[48px] p-2 shadow-[0_30px_80px_-15px_rgba(15,23,42,0.1)] border border-slate-50 relative overflow-hidden group">
                            <div className="relative aspect-[16/9] rounded-[42px] overflow-hidden bg-slate-950">
                                {localImages && localImages.length > 0 ? (
                                    <Image
                                        unoptimized
                                        src={getFullImagePath(localImages[safeActiveImage]) || ''}
                                        alt={workshop.name}
                                        fill
                                        className="object-cover transition-all duration-[1500ms] ease-out group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/5">
                                        <CarFront size={160} strokeWidth={1} />
                                    </div>
                                )}
                                

                                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center bg-white/10 backdrop-blur-3xl rounded-[24px] p-6 border border-white/20">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest italic">{t('action.view').toUpperCase()}_GALLERY</span>
                                        <span className="text-base font-black text-white uppercase italic tracking-tighter">{safeActiveImage + 1} / {localImages.length || 0}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : localImages.length - 1)} className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all border border-white/10">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={() => setActiveImage(prev => prev < localImages.length - 1 ? prev + 1 : 0)} className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all border border-white/10">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {localImages.length > 1 && (
                                <div className="p-8 flex gap-4 overflow-x-auto custom-scrollbar no-scrollbar scroll-smooth">
                                    {localImages.map((img, idx) => (
                                        <button key={idx} onClick={() => setActiveImage(idx)} className={cn(
                                            "relative w-32 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-500 shrink-0",
                                            activeImage === idx ? "border-emerald-500 scale-90 translate-y-[-4px]" : "border-transparent opacity-40 hover:opacity-100"
                                        )}>
                                            <Image unoptimized src={getFullImagePath(img) || ''} alt="Thumb" fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* INFO & LOCATION GRID */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* CARD: SCHEDULE & ADDRESS */}
                            <div className="bg-white rounded-[48px] p-12 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-12">
                                <div className="space-y-10">
                                    <div className="flex gap-6 group">
                                        <div className="w-16 h-16 bg-slate-950 text-white rounded-[24px] flex items-center justify-center shrink-0 shadow-2xl group-hover:bg-emerald-500 transition-colors duration-500"><MapPin size={28} /></div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HQ_TERMINAL_LOCATION</p>
                                            <p className="text-xl font-black text-slate-900 leading-tight italic">{workshop.address}</p>
                                            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">{workshop.city?.name} // {workshop.country?.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 group">
                                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-[24px] flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500"><Clock size={28} /></div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('workshop.openingHours')}</p>
                                            <p className="text-base font-bold text-slate-600 leading-relaxed whitespace-pre-line tabular-nums">
                                                {formatSchedule(workshop.openingHours)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {workshop.socialMedia && (
                                    <div className="pt-10 border-t border-slate-50 flex flex-wrap gap-4">
                                        {Object.entries(workshop.socialMedia).map(([platform, url]) => {
                                            if (!url) return null;
                                            return (
                                                <a key={platform} href={String(url)} target="_blank" className="w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center hover:bg-slate-950 hover:text-white transition-all shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] border border-slate-100 group">
                                                    {renderSocialIcon(platform, String(url))}
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* MAP INTEGRATION */}
                            <div className="h-[500px] lg:h-[100%] min-h-[400px] bg-slate-50 rounded-[48px] overflow-hidden border border-slate-200 shadow-2xl relative group">
                                <div className="absolute top-8 left-8 z-20 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                                    <Navigation size={14} className="text-slate-400" />
                                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{t('nav.map')} // GPS: ACTIVE</span>
                                </div>
                                <Map
                                    center={[workshop.latitude || 19.4326, workshop.longitude || -99.1332]}
                                    zoom={workshop.latitude ? 15 : 5}
                                    markers={[{
                                        lat: workshop.latitude || 19.4326,
                                        lng: workshop.longitude || -99.1332,
                                        title: workshop.name,
                                        address: workshop.address,
                                        logoUrl: getFullImagePath(workshop.logoUrl) || undefined
                                    }]}
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* FLOATING CONTACT MODAL TRIGGER */}
            {workshop.whatsapp && (
                <div className="fixed bottom-12 right-12 z-[100] group">
                    <div className="absolute -top-12 right-0 bg-slate-950 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-2xl whitespace-nowrap">
                        CONEXIÓN_DIRECTA_ESTABLECIDA
                    </div>
                    <a href={`https://wa.me/${workshop.whatsapp}`} target="_blank" className="w-20 h-20 bg-emerald-500 text-white rounded-[28px] flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(16,185,129,0.5)] hover:scale-110 hover:-rotate-12 active:scale-95 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 translate-y-20 group-hover:translate-y-0 transition-transform duration-500"></div>
                        <MessageCircle size={32} className="relative z-10" />
                    </a>
                </div>
            )}
            
            {/* FOOTER DETAIL */}
            <footer className="max-w-[1600px] mx-auto px-6 py-20 border-t border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-4 grayscale opacity-40">
                         <Image src="/logo.svg" width={40} height={40} alt="Logo" className="filter invert" />
                         <span className="text-xl font-black uppercase tracking-tighter italic">Nexo_Gremio</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                        © 2026 TalleresMecanicos // Clinical Industrial Aesthetic System
                    </p>
                </div>
            </footer>
        </div>
    );
}
