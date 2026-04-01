"use client";

import React, { useState, useMemo } from 'react';
import {
    Package, BarChart3, TrendingUp,
    Settings, Info, Tag, Hash,
    DollarSign, AlertTriangle, Layers,
    Plus, Minus, History, ShoppingCart
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils/cn';
import { FormGenerator } from '@/features/dashboard/components/FormGenerator';
import { PartForm } from '@/types/form/app.form';
import { toast } from 'sonner';

interface PartDetailProps {
    data: any;
    updateRecord: (data: any) => Promise<any>;
    refresh: () => void;
}

export function PartDetail({ data, updateRecord, refresh }: PartDetailProps) {
    const t = useTranslations();
    const [activeSection, setActiveSection] = useState<'overview' | 'inventory' | 'data'>('overview');

    const handleUpdate = async (values: any) => {
        try {
            await updateRecord(values);
            refresh();
        } catch (error) {
            console.error(error);
        }
    };

    const isLowStock = data.quantity <= 2;

    return (
        <div className="space-y-8 pb-20">
            {/* 0. Top Navigation Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 p-3 rounded-3xl border border-white/60 shadow-xl backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <Package size={20} />
                    </div>
                    <div>
                        <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Inventario de Repuestos</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">SKU: {data.sku || 'S/N'}</p>
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
                        onClick={() => setActiveSection('data')}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                            activeSection === 'data' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Ajustes
                    </button>
                </div>
            </div>

            {/* 1. Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Lateral Side: Summary Stats & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] -mr-12 -mt-12 group-hover:bg-emerald-500/20 transition-all duration-700" />
                        <div className="relative">
                            <div className="w-12 h-12 bg-white/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                <DollarSign size={24} />
                            </div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 leading-none">Precio Unitario</p>
                            <h3 className="text-4xl font-black text-emerald-400 tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">${data.price?.toLocaleString() || 0}</h3>
                        </div>
                    </div>

                    {/* Stock Card - DYNAMIC STATUS */}
                    <div className={cn(
                        "p-8 rounded-[2.5rem] border shadow-2xl transition-all relative overflow-hidden group",
                        isLowStock 
                            ? "bg-rose-50 border-rose-200" 
                            : "bg-white border-slate-100 shadow-slate-200/50"
                    )}>
                        {isLowStock && <div className="absolute inset-0 bg-rose-500/5 animate-pulse" />}
                        <div className="relative">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 scale-110",
                                isLowStock ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "bg-slate-100 text-slate-500"
                            )}>
                                <BarChart3 size={24} />
                            </div>
                            <p className={cn("text-[9px] font-black uppercase tracking-widest", isLowStock ? "text-rose-600" : "text-slate-400")}>Stock Actual</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className={cn("text-5xl font-black tracking-tighter", isLowStock ? "text-rose-900" : "text-slate-900")}>
                                    {data.quantity}
                                </h3>
                                <span className={cn("text-[10px] font-black uppercase", isLowStock ? "text-rose-500" : "text-slate-400")}>Unidades</span>
                            </div>
                            {isLowStock && (
                                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-rose-500 text-[8px] font-black uppercase text-white rounded-full w-fit shadow-lg shadow-rose-200">
                                    <AlertTriangle size={10} /> Alerta de Reposición
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total Value Sub-Card */}
                    <div className="bg-white/40 p-6 rounded-[2rem] border border-white shadow-lg backdrop-blur-sm group hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <TrendingUp size={18} />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Patrimonio en Articulo</p>
                                <p className="text-sm font-black text-slate-900">${((data.price || 0) * data.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Info / Adjustment / Form */}
                <div className="lg:col-span-3 space-y-8">
                    {activeSection === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Detailed Info Card */}
                            <div className="bg-white/40 p-10 rounded-[3rem] border border-white shadow-2xl relative overflow-hidden backdrop-blur-sm">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-slate-900/5 rounded-full blur-3xl" />
                                
                                <header className="space-y-6 border-b border-white/50 pb-8 mb-8 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-lg">CALIDAD CERTIFICADA</div>
                                        <div className="px-4 py-1.5 bg-white border border-slate-100 text-slate-400 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-1.5">
                                            <Hash size={10} className="text-primary" /> SKU: {data.sku || 'SIN ASIGNAR'}
                                        </div>
                                    </div>
                                    <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none drop-shadow-sm">
                                        {data.name}
                                    </h1>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] opacity-30 flex items-center gap-2">
                                            <Info size={14} /> Ficha Técnica / Descripción
                                        </h4>
                                        <div className="text-sm text-slate-600 font-medium leading-relaxed bg-white/60 p-8 rounded-[2.5rem] border border-white shadow-inner min-h-[180px] italic">
                                            {data.description || 'No se ha registrado una descripción técnica para este componente en el sistema de inventario.'}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] opacity-30 flex items-center gap-2">
                                            <Layers size={14} /> Especificaciones
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 bg-slate-50/50 rounded-2xl border border-white shadow-sm hover:bg-white transition-colors cursor-default">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Marca / Proveedor</p>
                                                <p className="text-xs font-black text-slate-900 uppercase">{data.brand || 'Original'}</p>
                                            </div>
                                            <div className="p-6 bg-slate-50/50 rounded-2xl border border-white shadow-sm hover:bg-white transition-colors cursor-default">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Categoría</p>
                                                <p className="text-xs font-black text-slate-900 uppercase">{data.category?.name || 'Insumo'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-8 bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50 group hover:bg-emerald-500 transition-all duration-500">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black text-emerald-600 group-hover:text-emerald-100 uppercase tracking-widest transition-colors">Estatus Contable</p>
                                                    <p className="text-lg font-black text-emerald-900 group-hover:text-white transition-colors">ACTIVO / DISPONIBLE</p>
                                                </div>
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-lg group-hover:rotate-12 transition-transform">
                                                    <ShoppingCart size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Ajustes del Repuesto</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Actualiza precios y stock base</p>
                                    </div>
                                </header>
                                <FormGenerator
                                    structure={PartForm}
                                    defaultValues={data}
                                    isUpdate={true}
                                    onSubmit={handleUpdate}
                                    onCancel={() => setActiveSection('overview')}
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
