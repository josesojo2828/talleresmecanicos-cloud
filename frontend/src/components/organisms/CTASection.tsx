import { Button } from "@/components/atoms/Button";
import { ChevronRight, Building2, CheckCircle, Package, ArrowRight, Database, Users, Calendar, ClipboardList } from "lucide-react";
import Link from "next/link";

export const CTASection = () => {
    return (
        <section className="px-6 py-32 bg-white relative z-10 border-b border-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 bg-slate-950 border border-slate-950">
                    
                    {/* Panel Izquierdo */}
                    <div className="bg-[#fcfaf7] p-16 md:p-24 space-y-12 flex flex-col justify-center">
                        <div className="space-y-6">
                            <h3 className="text-5xl md:text-7xl font-black text-slate-950 leading-none tracking-tighter uppercase italic">
                                ESCALA <br />
                                <span className="text-emerald-600 not-italic">TU TALLER.</span>
                            </h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                                Únete a la red líder de gestión mecánica y digitaliza tu operación hoy mismo.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'INVENTARIO', icon: <Database size={14}/> },
                                { title: 'DIRECTORIO', icon: <Users size={14}/> },
                                { title: 'CITAS', icon: <Calendar size={14}/> },
                                { title: 'TRABAJOS', icon: <ClipboardList size={14}/> }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-[10px] font-black tracking-widest text-slate-950 border border-slate-200 bg-white p-4">
                                    <span className="text-emerald-500">{item.icon}</span> {item.title}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Panel Derecho */}
                    <div className="bg-slate-950 p-16 md:p-24 flex flex-col items-center justify-center text-center space-y-10">
                        <div className="w-20 h-20 bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0">
                            <Building2 size={40} />
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-white text-4xl font-black uppercase tracking-tight leading-none italic">
                                REGISTRA TU <br /> <span className="text-emerald-500 not-italic">UNIDAD.</span>
                            </h4>
                            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                                Sin costo de entrada para <br /> nuevos partners certificados.
                            </p>
                        </div>


                    </div>

                </div>
            </div>
        </section>
    );
};