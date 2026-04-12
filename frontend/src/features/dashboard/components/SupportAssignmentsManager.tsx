"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import apiClient from '@/utils/api/api.client';
import { Globe, MapPin, Plus, Trash2, Loader2, Search } from 'lucide-react';
import { useAlertStore } from '@/store/useAlertStore';

interface Assignment {
    id: string;
    country?: { id: string; name: string };
    city?: { id: string; name: string };
}

export const SupportAssignmentsManager = ({ userId }: { userId: string }) => {
    const t = useTranslations();
    const { addAlert } = useAlertStore();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    // Form state
    const [type, setType] = useState<'COUNTRY' | 'CITY'>('COUNTRY');
    const [targetId, setTargetId] = useState('');
    const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
    const [searching, setSearching] = useState(false);

    const loadAssignments = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/support/assignment', { 
                params: { filters: JSON.stringify({ userId }), take: 100 } 
            });
            setAssignments(res.data.body?.data || []);
        } catch (error) {
            console.error("Error loading assignments:", error);
        } finally {
            setLoading(false);
        }
    };

    const searchOptions = async (text: string) => {
        if (!text) return;
        try {
            setSearching(true);
            const endpoint = type === 'COUNTRY' ? '/country' : '/city';
            const res = await apiClient.get(endpoint, { 
                params: { 
                    search: text, 
                    take: 10,
                    filters: JSON.stringify({ enabled: true })
                } 
            });
            setOptions(res.data.body?.data || []);
        } catch (error) {
            console.error("Error searching options:", error);
        } finally {
            setSearching(false);
        }
    };

    const handleAdd = async () => {
        if (!targetId) return;
        try {
            setAdding(true);
            const payload = {
                userId,
                [type === 'COUNTRY' ? 'countryId' : 'cityId']: targetId
            };
            await apiClient.post('/support/assignment', payload);
            addAlert(t('success.create'), 'success');
            setTargetId('');
            loadAssignments();
        } catch (error) {
            console.error("Error adding assignment:", error);
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await apiClient.delete(`/support/assignment/${id}`);
            addAlert(t('success.delete'), 'success');
            loadAssignments();
        } catch (error) {
            console.error("Error deleting assignment:", error);
        }
    };

    useEffect(() => {
        loadAssignments();
    }, [userId]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* AGREGAR REGION */}
            <div className="bg-white/40 p-8 rounded-[2.5rem] border border-white shadow-xl space-y-6">
                <header className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                        <Plus size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Asignar Nuevo Territorio</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Expande la jurisdicción del soporte</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Tipo de Jurisdicción</label>
                        <select 
                            value={type} 
                            onChange={(e) => {
                                setType(e.target.value as any);
                                setTargetId('');
                                setOptions([]);
                            }}
                            className="w-full h-14 bg-white/60 border border-white rounded-[1.25rem] px-6 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                        >
                            <option value="COUNTRY">PAÍS COMPLETO</option>
                            <option value="CITY">CIUDAD ESPECÍFICA</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Buscar {type === 'COUNTRY' ? 'País' : 'Ciudad'}</label>
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder={type === 'COUNTRY' ? "Ej: México, Venezuela..." : "Ej: CDMX, Guadalajara..."}
                                onChange={(e) => searchOptions(e.target.value)}
                                className="w-full h-14 bg-white/60 border border-white rounded-[1.25rem] px-6 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all pl-12"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-spin" size={18} />}
                        </div>
                        {options.length > 0 && (
                            <div className="absolute z-10 w-full mt-2 bg-white/90 backdrop-blur-md border border-white rounded-2xl shadow-2xl p-2 space-y-1">
                                {options.map(opt => (
                                    <button 
                                        key={opt.id}
                                        onClick={() => {
                                            setTargetId(opt.id);
                                            setOptions([]);
                                        }}
                                        className={`w-full text-left p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${targetId === opt.id ? 'bg-emerald-500 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        {opt.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-end">
                        <button 
                            disabled={!targetId || adding}
                            onClick={handleAdd}
                            className="w-full h-14 bg-slate-900 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95 disabled:opacity-20 flex items-center justify-center gap-2"
                        >
                            {adding ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                            Confirmar Asignación
                        </button>
                    </div>
                </div>
            </div>

            {/* LISTADO DE ASIGNACIONES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>
                ) : assignments.map(as => (
                    <div key={as.id} className="bg-white/40 p-6 rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${as.country ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                                {as.country ? <Globe size={24} /> : <MapPin size={24} />}
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{as.country?.name || as.city?.name}</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
                                    {as.country ? 'Jurisdicción Nacional' : 'Jurisdicción Local'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDelete(as.id)}
                            className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {(!loading && assignments.length === 0) && (
                <div className="py-20 text-center space-y-4 opacity-20">
                    <Globe size={48} className="mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">Aún no hay territorios asignados</p>
                </div>
            )}
        </div>
    );
};
