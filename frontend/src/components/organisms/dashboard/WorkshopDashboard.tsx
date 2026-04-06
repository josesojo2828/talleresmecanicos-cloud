"use client";

import { useTranslations } from "next-intl";
import { 
    Wrench, Calendar, ArrowRight, Plus, Package, 
    Users, TrendingUp, Clock, Store
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

// Atomic Components
import { StatCard } from "@/components/molecules/dashboard/StatCard";
import { DashboardChart } from "@/components/molecules/dashboard/DashboardChart";
import { WorkshopBanner } from "@/components/organisms/dashboard/WorkshopBanner";
import { RecentActivityList } from "@/components/organisms/dashboard/RecentActivityList";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { IUser } from "@/types/user/user";

interface WorkshopDashboardProps {
    user: IUser | null;
    workshopStats: any;
}

export const WorkshopDashboard = ({ user, workshopStats }: WorkshopDashboardProps) => {
    const t = useTranslations();
    const { stats, workshop, timeline, recent } = workshopStats || {};
    const lastAppDate = stats?.appointments?.last ? new Date(stats.appointments.last.dateTime).toLocaleDateString() : null;

    if (!user) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header de Gestión */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-emerald-500 decoration-8 underline-offset-4">
                        Bienvenido, {user.firstName}
                    </h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Consola de Gestión Administrativa • Taller Activo</p>
                </div>
                <Link href="/dashboard/work/new" className="group/btn relative overflow-hidden btn btn-primary border-none shadow-xl shadow-emerald-500/20 px-8 rounded-2xl font-black uppercase tracking-tighter italic h-12 transition-all active:scale-95">
                    <span className="relative z-10 flex items-center gap-2">
                        <Plus size={18} /> Nueva Orden
                    </span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Link>
            </header>

            {/* Fila de Estadísticas y Banner */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="col-span-1 md:col-span-3 gap-6 grid grid-cols-1 md:grid-cols-3">
                    <StatCard label="Trabajos Totales" value={stats?.works?.total || 0} icon={<Wrench size={48} strokeWidth={3} />} colorClass="text-emerald-500">
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(stats?.works?.breakdown || {}).map(([status, count]: [any, any]) => (
                                <StatusBadge key={status} status={status} />
                            ))}
                        </div>
                    </StatCard>

                    <StatCard label="Citas Activas" value={stats?.appointments?.total || 0} icon={<Calendar size={48} strokeWidth={3} />} colorClass="text-blue-500">
                        {lastAppDate && (
                            <p className="text-[10px] font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-lg inline-flex items-center gap-1 uppercase tracking-wider">
                                <Clock size={10} /> Siguiente: {lastAppDate}
                            </p>
                        )}
                    </StatCard>

                    <StatCard label="Inventario / Stock" value={stats?.inventory?.total || 0} icon={<Package size={48} strokeWidth={3} />} colorClass="text-purple-500">
                         <Link href="/dashboard/part" className="text-[9px] font-black text-purple-600 hover:underline uppercase tracking-widest">Gestionar Stock &gt;</Link>
                    </StatCard>

                    <div className="md:col-span-3">
                        <WorkshopBanner workshop={workshop} />
                    </div>
                </div>

                {/* Sección de Producción (Gráfico) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col min-h-[350px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full translate-x-10 -translate-y-10 blur-3xl group-hover:bg-emerald-500/10 transition-all duration-1000" />
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-slate-200 decoration-4 underline-offset-4">Producción</h3>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.25em] mt-2 italic">Flujo de trabajos de los últimos 30 días</p>
                            </div>
                            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black italic shadow-sm">
                                +{timeline.reduce((acc: number, curr: any) => acc + curr.count, 0)} Mes
                            </div>
                        </div>
                        <div className="flex-grow min-h-[200px]">
                            <DashboardChart data={timeline} />
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <Link href="/dashboard/work" className="flex items-center justify-between group/link">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/link:text-primary transition-colors">Historial Completo de Órdenes</span>
                                <ArrowRight size={14} className="text-slate-300 group-hover/link:text-primary transition-transform group-hover/link:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listados de Actividad Reciente */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
                <RecentActivityList 
                    title="Citas Recientes" 
                    icon={<Calendar size={12} />} 
                    colorClass="bg-blue-500"
                    items={recent?.appointments}
                    emptyMessage="No hay citas próximas"
                    emptyIcon={<Clock size={48} />}
                    viewAllLink="/dashboard/appointment"
                    viewAllText="Ver Todas las Citas >"
                    renderItem={(app) => (
                        <div key={app.id} className="p-5 hover:bg-slate-50/50 transition-colors flex items-center gap-4 group/item">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm transition-transform group-hover/item:scale-110">
                                <Users size={20} />
                            </div>
                            <div className="flex-grow">
                                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{app.client?.firstName} {app.client?.lastName}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(app.dateTime).toLocaleDateString()} • {new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <ArrowRight size={14} className="text-slate-200 group-hover/item:text-blue-500 group-hover/item:translate-x-1 transition-all" />
                        </div>
                    )}
                />

                <RecentActivityList 
                    title="Ofertas & Avisos" 
                    icon={<TrendingUp size={12} />} 
                    colorClass="bg-amber-500"
                    items={recent?.publications}
                    emptyMessage="Sin publicaciones activas"
                    emptyIcon={<Store size={48} />}
                    viewAllLink="/dashboard/publication"
                    viewAllText="Ver Todas las Ofertas >"
                    renderItem={(p) => (
                        <div key={p.id} className="p-5 hover:bg-slate-50/50 transition-colors flex items-center gap-4 group/item">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm transition-transform group-hover/item:scale-110">
                                 <Store size={20} />
                            </div>
                            <div className="flex-grow">
                                <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate max-w-[150px]">{p.title}</p>
                                <p className="text-[8px] font-bold text-amber-600 uppercase tracking-widest mt-0.5 italic underline decoration-2 underline-offset-2 decoration-amber-600/20">Acción Comercial {p.price ? `• $${p.price}` : ''}</p>
                            </div>
                            <ArrowRight size={14} className="text-slate-200 group-hover/item:text-amber-500 group-hover/item:translate-x-1 transition-all" />
                        </div>
                    )}
                />

                <RecentActivityList 
                    title="Órdenes Maestras" 
                    icon={<Wrench size={12} />} 
                    colorClass="bg-emerald-500"
                    items={recent?.works}
                    emptyMessage="No hay trabajos recientes"
                    emptyIcon={<Wrench size={48} />}
                    viewAllLink="/dashboard/work"
                    viewAllText="Ver Todas las Órdenes >"
                    renderItem={(w) => (
                        <div key={w.id} className="p-5 hover:bg-slate-50/50 transition-colors flex items-center gap-4 group/item">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm transition-transform group-hover/item:scale-110">
                                <Wrench size={20} />
                            </div>
                            <div className="flex-grow">
                                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Orden #{w.id.slice(-6)}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <StatusBadge status={w.status} />
                                </div>
                            </div>
                            <ArrowRight size={14} className="text-slate-200 group-hover/item:text-emerald-500 group-hover/item:translate-x-1 transition-all" />
                        </div>
                    )}
                />
            </div>
        </div>
    );
};
