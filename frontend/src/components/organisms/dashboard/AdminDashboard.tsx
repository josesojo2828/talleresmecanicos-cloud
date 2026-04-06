"use client";

import { Map } from "@/components/molecules/Map";
import { ShieldCheck, Layout, Users, Wrench, Calendar, MapPin, Activity } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";

interface AdminDashboardProps {
    adminStats: any;
}

export const AdminDashboard = ({ adminStats }: AdminDashboardProps) => {
    const stats = adminStats?.stats || {};
    const mapMarkers = adminStats?.workshopLocations?.map((ws: any) => ({
        lat: ws.latitude,
        lng: ws.longitude,
        title: ws.name,
        address: ws.address,
        phone: ws.phone,
        logoUrl: ws.logoUrl
    })) || [];

    const statItems = [
        { label: "Talleres", value: stats.totalWorkshops || 0, icon: <Layout />, bg: "bg-slate-950 text-emerald-400" },
        { label: "Usuarios", value: stats.totalUsers || 0, icon: <Users />, bg: "bg-slate-950 text-blue-400" },
        { label: "Servicios", value: stats.totalWorks || 0, icon: <Wrench />, bg: "bg-slate-950 text-emerald-500" },
        { label: "Citas Gest.", value: stats.totalAppointments || 0, icon: <Calendar />, bg: "bg-slate-950 text-amber-400" },
        { label: "Países", value: stats.totalCountries || 0, icon: <MapPin />, bg: "bg-slate-950 text-purple-400" },
        { label: "Ciudades", value: stats.totalCities || 0, icon: <Activity className="animate-bounce" />, bg: "bg-slate-950 text-emerald-600" },
    ];

    return (
        <div className="space-y-10">
            <header className="border-b border-gray-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Consola de Administración</h1>
                    <p className="text-gray-500 mt-1 font-bold text-xs uppercase italic">Control total de la red</p>
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold border border-green-100 flex items-center gap-2 shadow-sm">
                    <ShieldCheck size={14} className="animate-pulse" /> Sistema Online
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {statItems.map((s, i) => (
                    <div key={i} className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200 transition-transform group-hover:rotate-6", s.bg)}>
                            {s.icon}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-4">{s.label}</p>
                        <div className="px-5 py-2 bg-slate-950 rounded-xl shadow-inner border border-white/5">
                            <p className="text-3xl font-black text-white tabular-nums tracking-tighter italic">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-red-500 rounded-full" />
                    Cobertura Geográfica
                </h2>
                <div className="bg-white p-4 border border-gray-100 rounded-[2.5rem] shadow-sm h-[400px]">
                    <Map
                        className="rounded-[1.8rem]"
                        center={[19.4326, -99.1332]}
                        zoom={5}
                        markers={mapMarkers}
                    />
                </div>
            </div>
        </div>
    );
};
