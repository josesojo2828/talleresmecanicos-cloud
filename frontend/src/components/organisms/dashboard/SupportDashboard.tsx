"use client";

import { 
    Globe, 
    MapPin, 
    Wrench, 
    Layout, 
    TrendingUp, 
    Users, 
    Activity, 
    Clock, 
    ArrowRight, 
    FileText,
    Store,
    Building2
} from "lucide-react";
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SupportDashboardProps {
    adminStats: any;
    user: any;
}

export const SupportDashboard = ({ adminStats, user }: SupportDashboardProps) => {
    const stats = adminStats?.stats || {};
    const productionStats = adminStats?.productionStats || [];
    const recentWorkshops = adminStats?.recentWorkshops || [];
    const recentCities = adminStats?.recentCities || [];
    const recentWorks = adminStats?.recentWorks || [];

    const metricItems = [
        { 
            label: "Países Asignados", 
            value: stats.totalCountries || 0, 
            icon: <Globe size={20} />, 
            color: "text-blue-500", 
            bg: "bg-blue-50" 
        },
        { 
            label: "Ciudades Cobertura", 
            value: stats.totalCities || 0, 
            icon: <MapPin size={20} />, 
            color: "text-rose-500", 
            bg: "bg-rose-50" 
        },
        { 
            label: "Total Talleres", 
            value: stats.totalWorkshops || 0, 
            icon: <Store size={20} />, 
            color: "text-emerald-500", 
            bg: "bg-emerald-50" 
        },
        { 
            label: "Publicaciones", 
            value: stats.totalPublications || 0, 
            icon: <FileText size={20} />, 
            color: "text-amber-500", 
            bg: "bg-amber-50" 
        },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                        Hola, {user?.firstName || 'Soporte'}
                    </h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] italic opacity-80">
                        Consola de Gestión Regional • {user?.role}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest italic shadow-xl shadow-slate-200">
                    <Activity size={12} className="text-emerald-400 animate-pulse" />
                    Región Monitoreada
                </div>
            </header>

            {/* SECCIÓN SUPERIOR: STATS + GRAPH */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* GRID DE STATS (4) */}
                <div className="xl:col-span-5 grid grid-cols-2 gap-4">
                    {metricItems.map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3", item.bg, item.color)}>
                                {item.icon}
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-3xl font-black text-slate-900 tabular-nums italic">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* GRÁFICO DE PRODUCCIÓN */}
                <div className="xl:col-span-7 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Producción Regional</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flujo de trabajos últimos 30 días</p>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase italic border border-emerald-100">
                            + Activo
                        </div>
                    </div>

                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={productionStats}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                                    tickFormatter={(val) => format(new Date(val), 'dd MMM', { locale: es })}
                                />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#10b981" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorCount)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* SECCIÓN INFERIOR: TABLAS (3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* TABLA 1: TALLERES */}
                <DataCard 
                    title="Talleres Registrados" 
                    subtitle="Nuevas altas en la región" 
                    icon={<Store size={18} className="text-blue-500" />}
                    items={recentWorkshops}
                    renderItem={(ws: any) => (
                        <div key={ws.id} className="flex items-center gap-4 group/item">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-blue-50 group-hover/item:text-blue-500 transition-colors">
                                <Building2 size={16} />
                            </div>
                            <div className="flex-grow">
                                <p className="text-xs font-black text-slate-800 uppercase line-clamp-1">{ws.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{ws.user?.email}</p>
                            </div>
                            <ArrowRight size={12} className="text-slate-200 group-hover/item:text-blue-500 transition-all group-hover/item:translate-x-1" />
                        </div>
                    )}
                />

                {/* TABLA 2: CIUDADES */}
                <DataCard 
                    title="Ciudades Activas" 
                    subtitle="Cobertura territorial" 
                    icon={<MapPin size={18} className="text-rose-500" />}
                    items={recentCities}
                    renderItem={(city: any) => (
                        <div key={city.id} className="flex items-center gap-4 group/item">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-rose-50 group-hover/item:text-rose-500 transition-colors">
                                <Globe size={16} />
                            </div>
                            <div className="flex-grow">
                                <p className="text-xs font-black text-slate-800 uppercase">{city.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{city.country?.name}</p>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        </div>
                    )}
                />

                {/* TABLA 3: ÚLTIMAS ÓRDENES */}
                <DataCard 
                    title="Órdenes Recientes" 
                    subtitle="Últimos flujos de trabajo" 
                    icon={<Wrench size={18} className="text-amber-500" />}
                    items={recentWorks}
                    renderItem={(work: any) => (
                        <div key={work.id} className="flex items-center gap-4 group/item">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-amber-50 group-hover/item:text-amber-500 transition-colors">
                                <Clock size={16} />
                            </div>
                            <div className="flex-grow">
                                <p className="text-xs font-black text-slate-800 uppercase">Orden #{work.id.slice(-6)}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter line-clamp-1">{work.workshop?.name}</p>
                            </div>
                            <ArrowRight size={12} className="text-slate-200 group-hover/item:text-amber-500 transition-all group-hover/item:translate-x-1" />
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

interface DataCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    items: any[];
    renderItem: (item: any) => React.ReactNode;
}

const DataCard = ({ title, subtitle, icon, items, renderItem }: DataCardProps) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{title}</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
            </div>
        </div>
        
        <div className="space-y-4 flex-grow">
            {items.length > 0 ? (
                items.map(renderItem)
            ) : (
                <div className="flex flex-col items-center justify-center h-full py-10 opacity-30 italic">
                    <p className="text-[10px] font-black uppercase text-slate-400">Sin registros</p>
                </div>
            )}
        </div>

        {items.length > 0 && (
            <button className="mt-6 pt-4 border-t border-slate-50 w-full flex justify-between items-center group/btn">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/btn:text-slate-900 transition-colors italic">Ver Historial Completo</span>
                <ArrowRight size={14} className="text-slate-200 group-hover/btn:text-slate-900 group-hover/btn:translate-x-1 transition-all" />
            </button>
        )}
    </div>
);
