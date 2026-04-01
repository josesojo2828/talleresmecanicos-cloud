"use client";

import React, { useState } from 'react';
import { 
    MessageSquare, Eye, Heart, Globe, 
    Image as ImageIcon, Settings, Info,
    Tag, Star, Share2, Layers
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils/cn';
import { GalleryManager } from '@/features/dashboard/components/GalleryManager';
import { FormGenerator } from '@/features/dashboard/components/FormGenerator';
import { PublicationForm } from '@/types/form/app.form';
import { toast } from 'sonner';

interface PublicationDetailProps {
    data: any;
    updateRecord: (data: any) => Promise<any>;
    refresh: () => void;
}

export function PublicationDetail({ data, updateRecord, refresh }: PublicationDetailProps) {
    const t = useTranslations();
    const [activeSection, setActiveSection] = useState<'overview' | 'gallery' | 'data'>('overview');

    const handleUpdate = async (values: any) => {
        try {
            await updateRecord(values);
            refresh();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* 0. Top Navigation Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 p-3 rounded-3xl border border-white/60 shadow-xl backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Centro de Publicación</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {data.id?.substring(0, 8)}</p>
                    </div>
                </div>

                <div className="flex p-1 bg-slate-200/50 rounded-2xl border border-slate-200/50">
                    <button 
                        onClick={() => setActiveSection('overview')}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                            activeSection === 'overview' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Resumen
                    </button>
                    <button 
                        onClick={() => setActiveSection('gallery')}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                            activeSection === 'gallery' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Multimedia
                    </button>
                    <button 
                        onClick={() => setActiveSection('data')}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                            activeSection === 'data' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Configuración
                    </button>
                </div>
            </div>

            {/* 1. Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Main Info / Current Section */}
                <div className="lg:col-span-2 space-y-8">
                    {activeSection === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                            {/* Publication Content Card */}
                            <div className="bg-white/40 p-10 rounded-[3rem] border border-white shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12">
                                    <MessageSquare size={160} />
                                </div>
                                
                                <div className="relative space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                                    data.enabled 
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                                        : "bg-rose-50 text-rose-600 border-rose-100"
                                                )}>
                                                    {data.enabled ? 'Publicado' : 'Borrador'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {new Date(data.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight drop-shadow-sm">
                                                {data.title}
                                            </h1>
                                        </div>
                                    </div>

                                    <div className="prose prose-slate max-w-none">
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed bg-white/20 p-6 rounded-[2rem] border border-white/50 backdrop-blur-sm whitespace-pre-wrap">
                                            {data.content || 'Sin contenido detallado en esta publicación.'}
                                        </p>
                                    </div>

                                    {/* Categorías */}
                                    <div className="flex flex-wrap gap-2 pt-4">
                                        {data.categories?.map((cat: any) => (
                                            <div key={cat.id} className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
                                                <Tag size={10} /> {cat.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'gallery' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="bg-white/40 p-8 rounded-[3rem] border border-white shadow-xl">
                                <header className="mb-8 px-4">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <ImageIcon size={18} className="text-indigo-500" /> Galería de la Publicación
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Imágenes promocionales</p>
                                </header>
                                <GalleryManager 
                                    images={data.images}
                                    onUpdate={handleUpdate}
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === 'data' && (
                        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-10 rounded-[3rem] border border-white shadow-xl">
                                <header className="mb-10 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900">
                                        <Settings size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Editor de Contenido</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ajusta los detalles de tu publicación</p>
                                    </div>
                                </header>
                                <FormGenerator 
                                    structure={PublicationForm}
                                    defaultValues={data}
                                    isUpdate={true}
                                    onSubmit={handleUpdate}
                                    onCancel={() => setActiveSection('overview')}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Sidebar Info */}
                <div className="space-y-6">
                    {/* Workshop Info */}
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[60px] group-hover:bg-indigo-500/30 transition-all" />
                        <div className="relative space-y-6">
                            <header className="space-y-1">
                                <p className="text-[8px] font-black text-indigo-300 uppercase tracking-[0.2em]">Taller Propietario</p>
                                <h4 className="text-lg font-black uppercase tracking-tight leading-tight">{data.workshop?.name}</h4>
                            </header>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                                    <Star size={14} className="text-amber-400" />
                                    <p className="text-[10px] font-bold uppercase tracking-tight">Taller Verificado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
