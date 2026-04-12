"use client";

import Link from "next/link";
import { IUser } from "@/types/user/user";
import { Wrench, Calendar, ChevronRight, Clock, MapPin, CheckCircle2, LayoutGrid, Settings } from "lucide-react";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UserDashboardProps {
    user: IUser | null;
    clientStats: any;
}

export const UserDashboard = ({ user, clientStats }: UserDashboardProps) => {
    const summary = clientStats?.summary || { totalWorks: 0, activeWorks: 0, upcomingAppointments: 0 };
    const recentWorks = clientStats?.recentWorks || [];
    const upcomingAppointments = clientStats?.upcomingAppointments || [];

    return (
        <div className="p-4 md:p-4 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">


            {/* KEY METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Trabajos Activos", val: summary.activeWorks, icon: Wrench, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Citas Pendientes", val: summary.upcomingAppointments, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Historial Total", val: summary.totalWorks, icon: CheckCircle2, color: "text-amber-500", bg: "bg-amber-50" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-md border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-lg transition-all duration-300">
                        <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500", stat.bg, stat.color)}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* CONTENT GRID: RECENT WORKS & APPOINTMENTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* RECENT REPAIRS */}
                <div className="bg-white border border-slate-100 rounded-md shadow-sm overflow-hidden flex flex-col h-full">
                    <header className="p-4 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-900 rounded-lg text-white">
                                <Wrench size={18} />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Trabajos Recientes</h3>
                        </div>
                        <Link href="/dashboard/work" className="text-[10px] font-black text-emerald-500 uppercase hover:underline">Ver Todos</Link>
                    </header>
                    <div className="p-4 flex-1">
                        {recentWorks.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-center p-10">
                                <Wrench className="text-slate-100 mb-4" size={48} />
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No hay trabajos registrados todavía.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentWorks.map((work: any) => (
                                    <div key={work.id} className="p-5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                        <header className="flex justify-between items-start mb-2">
                                            <h4 className="text-xs font-black text-slate-800 uppercase group-hover:text-emerald-600 transition-colors truncate pr-4">{work.title}</h4>
                                            <span className={cn(
                                                "text-[8px] font-black px-2 py-1 rounded-md uppercase",
                                                work.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                                            )}>{work.status}</span>
                                        </header>
                                        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1"><MapPin size={10} /> {work.workshop?.name}</span>
                                                <span className="flex items-center gap-1"><Clock size={10} /> {format(new Date(work.createdAt), 'dd MMM', { locale: es })}</span>
                                            </div>
                                            <Link href={`/dashboard/work/${work.id}`} className="text-emerald-500 hover:scale-110 transition-transform">
                                                <ChevronRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* UPCOMING APPOINTMENTS */}
                <div className="bg-white border border-slate-100 rounded-md shadow-sm overflow-hidden flex flex-col h-full">
                    <header className="p-4 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500 rounded-lg text-white">
                                <Calendar size={18} />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Próximas Citas</h3>
                        </div>
                        <Link href="/dashboard/appointment" className="text-[10px] font-black text-emerald-500 uppercase hover:underline">Gestionar</Link>
                    </header>
                    <div className="p-4 flex-1">
                        {upcomingAppointments.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-center p-10">
                                <Calendar className="text-slate-100 mb-4" size={48} />
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No tenés citas agendadas.</p>
                                <Link href="/explorar-red" className="mt-4 text-[10px] font-black text-emerald-500 uppercase border-b border-emerald-500">Agendar ahora</Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingAppointments.map((app: any) => (
                                    <div key={app.id} className="p-5 rounded-2xl bg-emerald-50/30 border border-emerald-50 flex items-center gap-5 hover:bg-emerald-50 transition-all group">
                                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center border border-emerald-100">
                                            <span className="text-[8px] font-black uppercase text-emerald-400">{format(new Date(app.dateTime), 'MMM', { locale: es })}</span>
                                            <span className="text-xl font-black text-slate-800 leading-none">{format(new Date(app.dateTime), 'dd')}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-black text-slate-800 uppercase truncate pr-4">{app.workshop?.name}</h4>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1 flex items-center gap-1">
                                                <Clock size={10} /> {format(new Date(app.dateTime), 'HH:mm')} hs
                                            </p>
                                        </div>
                                        <Link href={`/dashboard/appointment`} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                                            <Settings size={16} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
