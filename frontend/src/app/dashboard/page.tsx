"use client";

import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { AdminDashboard } from "@/components/organisms/dashboard/AdminDashboard";
import { WorkshopDashboard } from "@/components/organisms/dashboard/WorkshopDashboard";
import { UserDashboard } from "@/components/organisms/dashboard/UserDashboard";

export default function Dashboard() {
    const { 
        user, 
        workshopStats, 
        clientStats,
        adminStats, 
        loading 
    } = useDashboardStats();

    // Estado de Carga Industrial
    if (loading) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <span className="loading loading-spinner loading-lg text-emerald-500"></span>
                    <div className="absolute inset-0 bg-emerald-500/5 blur-2xl animate-pulse" />
                </div>
                <div className="space-y-2">
                    <p className="text-slate-900 font-black text-xs uppercase tracking-[0.3em] italic">Consola de Gestión</p>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] italic opacity-50">Sincronizando flujos de trabajo...</p>
                </div>
            </div>
        );
    }

    // VISTA ADMINISTRADOR O SOPORTE REGIONAL
    if (user?.role === 'ADMIN' || user?.role === 'SUPPORT') {
        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                <AdminDashboard adminStats={adminStats} />
            </div>
        );
    }

    // VISTA TALLER (ADMINISTRATIVO ÉLITE)
    if (user?.role === 'TALLER') {
        return (
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
                <WorkshopDashboard user={user} workshopStats={workshopStats} />
            </div>
        );
    }

    // VISTA USUARIO COMÚN (GARAGE PERSONAL)
    return (
        <div className="w-full">
            <UserDashboard user={user} clientStats={clientStats} />
        </div>
    );
}
