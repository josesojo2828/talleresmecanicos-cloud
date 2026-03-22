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
                    {/* Price Card */}
                    <div className="bg-white/40 p-8 rounded-[2.5rem] border border-white shadow-xl flex flex-col items-center text-center gap-4">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <DollarSign size={28} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Precio de Venta</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">${data.price?.toLocaleString() || 0}</h3>
                        </div>
                    </div>

                    {/* Stock Card */}
                    <div className={cn(
                        "p-8 rounded-[2.5rem] border shadow-xl flex flex-col items-center text-center gap-4 transition-all",
                        isLowStock ? "bg-rose-50 border-rose-100" : "bg-slate-900 text-white border-slate-800"
                    )}>
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center",
                            isLowStock ? "bg-rose-500 text-white animate-pulse" : "bg-white/10 text-emerald-400"
                        )}>
                            <BarChart3 size={28} />
                        </div>
                        <div>
                            <p className={cn("text-[9px] font-black uppercase tracking-widest", isLowStock ? "text-rose-600" : "text-slate-400")}>Stock Actual</p>
                            <h3 className={cn("text-4xl font-black tracking-tighter", isLowStock ? "text-rose-700" : "text-white")}>{data.quantity}</h3>
                            {isLowStock && <p className="text-[8px] font-black uppercase text-rose-500 mt-2 flex items-center gap-1 justify-center"><AlertTriangle size={8} /> Stock Crítico</p>}
                        </div>
                    </div>

                    {/* Category Pin */}
                    {/* <div className="bg-white/40 p-6 rounded-[2rem] border border-white shadow-md space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                <Layers size={14} />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Categoría</p>
                                <p className="text-[10px] font-black uppercase text-slate-900">{data.category?.name || 'Varios'}</p>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Main Content: Info / History / Form */}
                <div className="lg:col-span-3 space-y-8">
                    {activeSection === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Detailed Info Card */}
                            <div className="bg-white/40 p-10 rounded-[3rem] border border-white shadow-xl space-y-8">
                                <header className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest">PIEZA ORIGINAL</div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Hash size={10} /> {data.sku || 'Sin SKU'}</span>
                                    </div>
                                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight drop-shadow-sm">{data.name}</h1>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] opacity-40">Descripción General</h4>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed bg-white/40 p-6 rounded-[2rem] border border-white/50 backdrop-blur-sm shadow-inner min-h-[150px]">
                                            {data.description || 'Sin descripción técnica registrada.'}
                                        </p>
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] opacity-40">Resumen Financiero</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white/60 rounded-2xl border border-white shadow-sm flex flex-col gap-1">
                                                <p className="text-[8px] font-black text-slate-400 uppercase">Valuación Stock</p>
                                                <p className="text-lg font-black text-slate-900">${((data.price || 0) * data.quantity).toLocaleString()}</p>
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
