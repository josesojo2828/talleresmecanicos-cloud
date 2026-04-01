"use client";

import React from 'react';
import { MessageSquare, Heart, Bookmark, Eye, TrendingUp, AlertCircle, Clock, Activity, Database, Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils/cn';

interface ForumPostDetailProps {
    data: any;
    updateRecord?: (formData: any) => Promise<any>;
    refresh?: () => void;
}

export const ForumPostDetail: React.FC<ForumPostDetailProps> = ({ data }) => {
    const t = useTranslations();

    const stats = [
        { label: 'Likes', value: data._count?.likes || 0, icon: <Heart size={16} className="text-rose-500" />, color: 'bg-rose-50' },
        { label: 'Comentarios', value: data._count?.comments || 0, icon: <MessageSquare size={16} className="text-blue-500" />, color: 'bg-blue-50' },
        { label: 'Visitas', value: 124, icon: <Eye size={16} className="text-emerald-500" />, color: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Header / Meta / Status */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-slate-200">
                        {data.user?.firstName?.charAt(0) || 'P'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{data.title}</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Publicado por {data.user?.firstName || 'Usuario'} {data.user?.lastName || ''} • {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '--/--/----'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={cn(
                        "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm",
                        data.enabled ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                    )}>
                        {data.enabled ? <Activity size={14} /> : <AlertCircle size={14} />}
                        {data.enabled ? 'Póster Moderado' : 'Pendiente / Bloqueado'}
                    </div>
                </div>
            </div>

            {/* Grid de Métricas Rápidas */}
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
                        <TrendingUp size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            {/* Content Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Cuerpo de la Publicación */}
                <div className="lg:col-span-2 bg-white/40 p-10 rounded-[3rem] border border-white shadow-xl space-y-8 relative overflow-hidden group">
                     {/* Fondo técnico sutil */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <header className="flex items-center justify-between border-b border-slate-100 pb-4 relative z-10">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Database size={18} className="text-emerald-500" /> Contenido Original
                        </h3>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                             <Clock size={16} />
                        </div>
                    </header>

                    <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium font-inter opacity-90 relative z-10 italic">
                        "{data.content}"
                    </div>

                    {data.images && data.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 pt-10 relative z-10">
                            {data.images.map((img: string, i: number) => (
                                <div key={i} className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group-hover/img shadow-md">
                                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="post-img" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sentiment & Categories */}
                <div className="space-y-6">

                    <div className="bg-white/60 p-8 rounded-[2.5rem] border border-white shadow-sm space-y-6">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Layers size={14} /> Categorías
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {data.categories?.map((cat: any) => (
                                <span key={cat.id} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                    {cat.name}
                                </span>
                            ))}
                            {(!data.categories || data.categories.length === 0) && (
                                <span className="text-[9px] font-black uppercase text-slate-300 italic">Sin categorías</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
