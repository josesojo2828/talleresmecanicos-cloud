import { Search, CalendarCheck, ShieldCheck, Cog, Gauge, Box, Database, Users, Calendar, ClipboardList } from "lucide-react";
import Link from "next/link";

export const ValueProposition = () => {
    const offerings = [
        {
            title: "Inventario",
            icon: <Database className="w-5 h-5 text-slate-900" />,
            desc: "Control total de refacciones, stock y suministros con trazabilidad en tiempo real."
        },
        {
            title: "Directorio",
            icon: <Users className="w-5 h-5 text-slate-900" />,
            desc: "Red centralizada de talleres certificados y especialistas verificados en toda la región."
        },
        {
            title: "Citas",
            icon: <Calendar className="w-5 h-5 text-slate-900" />,
            desc: "Sistema de agendamiento inteligente para optimizar el flujo de vehículos en taller."
        },
        {
            title: "Trabajos",
            icon: <ClipboardList className="w-5 h-5 text-slate-900" />,
            desc: "Seguimiento detallado de órdenes de servicio con evidencia digital y estatus público."
        }
    ];

    return (
        <section className="relative px-6 py-32 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-8 pb-12 border-b border-slate-100">
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-950 uppercase tracking-tighter leading-none">
                            NUESTRA SOLUCIÓN <br /> 
                            <span className="text-slate-400">INTEGRAL.</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-slate-100 border border-slate-100">
                    {offerings.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-12 group relative overflow-hidden"
                        >
                            <div className="space-y-10 relative z-10">
                                <div className="w-12 h-12 bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                                    {item.icon}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-[11px] font-bold leading-relaxed uppercase tracking-tight">
                                        {item.desc}
                                    </p>
                                </div>

                                <Link href="/register" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-slate-950 transition-colors">
                                    CONOCER MÁS <ArrowRight size={12} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
import { ArrowRight } from "lucide-react";