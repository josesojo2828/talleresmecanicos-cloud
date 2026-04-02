import { Wrench, Zap, Paintbrush, ChevronRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
    {
        id: "cat-01",
        name: "Mecánica General",
        description: "Diagnóstico y reparación integral de motores, sistemas de transmisión y componentes críticos.",
        image: "/images/1.jpg",
        icon: <Wrench className="w-6 h-6" />
    },
    {
        id: "cat-02",
        name: "Electrónica Avanzada",
        description: "Escaneo computarizado, reparación de módulos ECU y sistemas eléctricos de última generación.",
        image: "/images/2.jpg",
        icon: <Zap className="w-6 h-6" />
    },
    {
        id: "cat-03",
        name: "Estética y Carrocería",
        description: "Servicios de hojalatería, pintura automotriz y restauración estética con acabados premium.",
        image: "/images/3.jpg",
        icon: <Paintbrush className="w-6 h-6" />
    }
];

export const TopWorkshops = () => {
    return (
        <section className="py-32 bg-[#fcfaf7] relative z-10 border-b border-slate-200/50">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-xl space-y-6">
                        <h2 className="text-slate-950 text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase italic">
                            ESPECIALIDADES <br /> <span className="text-emerald-600 not-italic">DE SERVICIO.</span>
                        </h2>
                    </div>

                    <Link href="/directorio" className="group">
                        <button className="px-10 py-5 border border-slate-900 bg-transparent text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all flex items-center gap-4">
                            EXPLORAR TODAS <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-1">
                    {CATEGORIES.map((cat) => (
                        <div
                            key={cat.id}
                            className="group flex flex-col bg-white border border-slate-200 p-8 transition-all hover:border-emerald-500 shadow-sm"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden mb-8 bg-slate-100">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-all duration-700 group-hover:scale-105"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-all" />
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        {cat.icon}
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-emerald-500 transition-colors" />
                                </div>

                                <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight leading-[1.1]">
                                    {cat.name}
                                </h3>

                                <p className="text-slate-500 text-[12px] font-bold uppercase tracking-tight leading-relaxed">
                                    {cat.description}
                                </p>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-end">
                                <Link
                                    href={`/directorio?category=${cat.id}`}
                                    className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] hover:text-slate-950 transition-colors"
                                >
                                    VER TALLERES
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};