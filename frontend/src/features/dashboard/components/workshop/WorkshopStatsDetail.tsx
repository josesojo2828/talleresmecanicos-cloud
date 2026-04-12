"use client";

import React, { useEffect, useState } from 'react';
import { StatCard } from "@/components/molecules/dashboard/StatCard";
import { DashboardChart } from "@/components/molecules/dashboard/DashboardChart";
import { Wrench, Calendar, Store, Loader2, TrendingUp } from "lucide-react";
import apiClient from '@/utils/api/api.client';

interface Props {
    workshopId: string;
}

export const WorkshopStatsDetail = ({ workshopId }: Props) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiClient.get(`/admin/dashboard/workshop/${workshopId}`);
                setStats(res.data.body || res.data);
            } catch (error) {
                console.error("Error fetching workshop stats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (workshopId) fetchStats();
    }, [workshopId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Cargando métricas del taller...</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
            {/* Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    label="Trabajos Totales" 
                    value={stats.stats?.totalWorks || 0} 
                    icon={<Wrench size={40} />} 
                    colorClass="text-emerald-500" 
                />
                <StatCard 
                    label="Citas Registradas" 
                    value={stats.stats?.totalAppointments || 0} 
                    icon={<Calendar size={40} />} 
                    colorClass="text-blue-500" 
                />
                <StatCard 
                    label="Publicaciones" 
                    value={stats.stats?.totalPublications || 0} 
                    icon={<Store size={40} />} 
                    colorClass="text-amber-500" 
                />
            </div>

            {/* Chart Section */}
            <div className="bg-white/40 p-10 rounded-[3rem] border border-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full translate-x-10 -translate-y-10 blur-3xl" />
                <div className="relative z-10">
                    <header className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-emerald-200 decoration-8 underline-offset-4 flex items-center gap-3">
                                <TrendingUp className="text-emerald-500" size={24} /> Rendimiento Operativo
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.25em] mt-3">Flujo de trabajos de los últimos 30 días</p>
                        </div>
                    </header>
                    <div className="h-[300px] w-full">
                        <DashboardChart data={stats.productionStats || []} />
                    </div>
                </div>
            </div>
        </div>
    );
};
