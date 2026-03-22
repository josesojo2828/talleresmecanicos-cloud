"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/utils/api/api.client";
import { Wrench, Users, TrendingUp, Calendar, ArrowRight, Plus, Package, Activity, ShieldCheck, Mail, Phone, MapPin, Layout } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Map } from "@/components/molecules/Map";

export default function Dashboard() {
    const { user } = useAuthStore();
    const [workshop, setWorkshop] = useState<any>(null);
    const [adminStats, setAdminStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        if (user.role === 'TALLER') {
            apiClient.get('/my-workshop')
                .then(res => {
                    const dataArray = res.data?.body?.data || res.data?.data || [];
                    const ws = Array.isArray(dataArray) ? dataArray[0] : dataArray;
                    setWorkshop(ws);
                })
                .catch(err => console.error("Dashboard Taller fetch error:", err))
                .finally(() => setLoading(false));
        } else if (user.role === 'ADMIN') {
            apiClient.get('/admin/dashboard/summary')
                .then(res => {
                    setAdminStats(res.data.body);
                })
                .catch(err => console.error("Dashboard Admin fetch error:", err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="p-20 text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-gray-500 font-medium">Cargando dashboard...</p>
            </div>
        );
    }

    // VISTA ADMINISTRADOR
    if (user?.role === 'ADMIN') {
        const stats = adminStats?.stats || {};
        const mapMarkers = adminStats?.workshopLocations?.map((ws: any) => ({
            lat: ws.latitude,
            lng: ws.longitude,
            title: ws.name,
            address: ws.address,
            phone: ws.phone,
            logoUrl: ws.logoUrl
        })) || [];

        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
                <header className="border-b border-gray-100 pb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Consola de Administración</h1>
                        <p className="text-gray-500 mt-1 font-medium">Resumen global de la red Talleres Mecanicos</p>
                    </div>
                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold border border-green-100 flex items-center gap-2">
                        <ShieldCheck size={14} /> Sistema Online
                    </div>
                </header>

                {/* Métricas Globales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    {[
                        { label: "Talleres", value: stats.totalWorkshops || 0, icon: <Layout />, bg: "bg-emerald-50 text-emerald-600" },
                        { label: "Usuarios", value: stats.totalUsers || 0, icon: <Users />, bg: "bg-emerald-100 text-emerald-700" },
                        { label: "Servicios", value: stats.totalWorks || 0, icon: <Wrench />, bg: "bg-emerald-50 text-emerald-500" },
                        { label: "Citas Gest.", value: stats.totalAppointments || 0, icon: <Calendar />, bg: "bg-emerald-50 text-emerald-400" },
                        { label: "Países", value: stats.totalCountries || 0, icon: <MapPin />, bg: "bg-emerald-50 text-emerald-600" },
                        { label: "Ciudades", value: stats.totalCities || 0, icon: <Activity />, bg: "bg-emerald-50 text-emerald-700" },
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", s.bg)}>
                                {s.icon}
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                            <p className="text-2xl font-black text-gray-900">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Mapa de Cobertura */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-red-500 rounded-full" />
                        Cobertura Geográfica
                    </h2>
                    <div className="bg-white p-4 border border-gray-100 rounded-[2.5rem] shadow-sm h-[400px]">
                        <Map
                            className="rounded-[1.8rem]"
                            center={[19.4326, -99.1332]} // CDMX default
                            zoom={5}
                            markers={mapMarkers}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Talleres Recientes */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                            Talleres Recientes
                        </h2>
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-50">
                            {adminStats?.recentWorkshops?.map((ws: any) => (
                                <div key={ws.id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500">
                                            {ws.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{ws.name}</p>
                                            <p className="text-[10px] text-gray-400">{ws.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(ws.createdAt).toLocaleDateString()}</p>
                                        <Link href={`/dashboard/workshop/${ws.id}`} className="text-[10px] font-black text-primary hover:underline">Ver Taller</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actividad / Trabajos Recientes */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            Últimos Trabajos
                        </h2>
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-50">
                            {adminStats?.recentWorks?.map((wk: any) => (
                                <div key={wk.id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{wk.title}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">Taller: <span className="font-bold">{wk.workshop?.name}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn(
                                            "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase",
                                            wk.status === 'FINISHED' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                        )}>
                                            {wk.status}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">{wk.publicId}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // VISTA USUARIO COMÚN
    if (user?.role !== 'TALLER') {
        return (
            <div className="p-8 max-w-4xl mx-auto space-y-8">
                <div className="bg-white p-10 border rounded-3xl shadow-sm text-center space-y-4">
                    <h1 className="text-3xl font-bold">Hola, {user?.firstName}</h1>
                    <p className="text-gray-500">Bienvenido de vuelta. Aquí podrás gestionar tus citas y ver el historial de tus vehículos.</p>
                    <div className="pt-6">
                        <Link href="/dashboard/appointments" className="btn btn-primary rounded-xl px-8">Ver Mis Citas</Link>
                    </div>
                </div>
            </div>
        );
    }

    // VISTA TALLER (PRINCIPAL)
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
            {/* Cabecera */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{workshop?.name || "Cargando..."}</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Resumen general de operaciones</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/work/new" className="btn btn-primary btn-md rounded-xl shadow-md gap-2">
                        <Plus size={20} /> Nueva Orden
                    </Link>
                    <Link href="/dashboard/part/new" className="btn btn-outline btn-md rounded-xl gap-2">
                        <Package size={20} /> Inventario
                    </Link>
                </div>
            </div>

            {/* Módulos de Estadística */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Trabajos", value: workshop?._count?.works || 0, icon: <Wrench />, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Citas", value: workshop?._count?.appointments || 0, icon: <Calendar />, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Clientes", value: "0", icon: <Users />, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Ingresos", value: "$0", icon: <TrendingUp />, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                                {stat.icon}
                            </div>
                            <Activity size={16} className="text-gray-200" />
                        </div>
                        <div className="mt-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabla de Trabajos Recientes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold text-gray-900">Órdenes Recientes</h2>
                        <Link href="/dashboard/work" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            Ver historial completo <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="text-[10px] font-bold uppercase text-gray-400 px-6 py-4">Información del Trabajo</th>
                                        <th className="text-[10px] font-bold uppercase text-gray-400 px-6">Estado</th>
                                        <th className="text-[10px] font-bold uppercase text-gray-400 px-6 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workshop?.works?.slice(0, 6).map((work: any) => (
                                        <tr key={work.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 text-sm">{work.title}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">ID: {work.publicId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6">
                                                <div className={cn(
                                                    "badge badge-sm font-bold uppercase text-[9px] py-3 px-3",
                                                    work.status === 'COMPLETED' || work.status === 'FINISHED' ? "bg-green-100 text-green-700 border-green-200" :
                                                        work.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-700 border-blue-200" :
                                                            work.status === 'DELIVERED' ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                                                "bg-amber-100 text-amber-700 border-amber-200"
                                                )}>
                                                    {work.status}
                                                </div>
                                            </td>
                                            <td className="px-6 text-right">
                                                <Link href={`/dashboard/work/${work.id}`} className="text-xs font-black text-primary hover:text-primary-focus p-2 rounded-lg transition-all">
                                                    Gestionar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!workshop?.works || workshop?.works.length === 0) && (
                                        <tr>
                                            <td colSpan={3} className="py-20 text-center text-gray-400 italic text-sm">
                                                No se encontraron órdenes de trabajo registradas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar de Datos Rápidos */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl space-y-6 border border-white/5">
                        <h3 className="font-bold text-lg text-white border-b border-white/10 pb-4">Contacto de Taller</h3>
                        <div className="space-y-5 text-sm">
                            <div className="flex items-center gap-3 text-white/80">
                                <Phone size={16} className="text-emerald-400" />
                                <span>{workshop?.phone || 'Sin teléfono'}</span>
                            </div>
                            <div className="flex items-start gap-3 text-white/80">
                                <MapPin size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{workshop?.address || 'Sin dirección registrada'}</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 text-center">
                                <Link href="/dashboard/my-workshop" className="text-xs font-bold text-emerald-100 hover:text-white transition-colors">
                                    Actualizar Perfil de Taller
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
