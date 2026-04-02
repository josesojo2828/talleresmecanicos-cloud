import React from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { 
    Shield, 
    Zap, 
    Wrench, 
    Cpu, 
    Network,
    ArrowUpRight,
    CircleDot
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- Local Components for Editorial Look ---

const SectionLabel = ({ text }: { text: string }) => (
    <div className="flex items-center gap-4 mb-10 overflow-hidden">
        <div className="h-px w-20 bg-slate-100 flex-shrink-0" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic whitespace-nowrap">
            {text}
        </span>
        <div className="h-px w-full bg-slate-100" />
    </div>
);

const FeatureCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => (
    <div className="border border-slate-100 p-12 hover:border-slate-950 transition-all group bg-white relative">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon size={80} strokeWidth={1} />
        </div>
        <div className="w-12 h-12 bg-slate-950 text-emerald-400 flex items-center justify-center mb-10 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
            <Icon size={20} />
        </div>
        <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter mb-6 group-hover:translate-x-2 transition-transform">
            {title}
        </h3>
        <p className="text-slate-400 text-sm font-semibold leading-relaxed tracking-tight max-w-[280px]">
            {description}
        </p>
    </div>
);

export default function NosostrosPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
            <Header />
            
            <main className="flex-1 pt-40 md:pt-64 overflow-hidden">
                
                {/* --- Editorial Hero --- */}
                <section className="px-6 md:px-20 mb-40 md:mb-64">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 md:items-end justify-between">
                        <div className="space-y-12">
                            <h1 className="text-[clamp(4rem,15vw,10rem)] font-black text-slate-950 uppercase italic tracking-tighter leading-[0.85] m-0">
                                NOSOTROS <br /> <span className="text-slate-200 not-italic">EL NÚCLEO.</span>
                            </h1>
                        </div>
                        <div className="max-w-md pb-6 border-b-2 border-slate-950">
                            <p className="text-xl font-black text-slate-950 leading-relaxed uppercase italic">
                                SOMOS LA INFRAESTRUCTURA DE CONFIANZA DETRÁS DE CADA DIAGNÓSTICO EN LA RED.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- Purpose Section --- */}
                <section className="px-6 md:px-20 mb-40 md:mb-64">
                    <div className="max-w-7xl mx-auto">
                        <SectionLabel text="NUESTRO_PROPOSITO" />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                            <div className="text-4xl md:text-6xl font-black text-slate-950 uppercase italic tracking-tighter leading-[0.95]">
                                LA RED QUE <br /> 
                                <span className="text-emerald-500 not-italic">UNIFICA.</span> LA MECÁNICA.
                            </div>
                            
                            <div className="space-y-10">
                                <p className="text-lg md:text-xl font-semibold text-slate-400 leading-relaxed indent-20">
                                    En TALLERES MECÁNICOS, no solo conectamos autos con especialistas. Construimos una capa de interoperabilidad técnica donde la transparencia y la precisión son los únicos lenguajes aceptados.
                                </p>
                                <p className="text-lg md:text-xl font-semibold text-slate-400 leading-relaxed">
                                    Nuestra misión es erradicar la incertidumbre en el servicio automotriz, proporcionando a los talleres las herramientas de vanguardia y a los clientes la seguridad de una red verificada.
                                </p>
                                
                                <div className="pt-10">
                                    <div className="flex flex-wrap gap-8">
                                        <div className="flex items-center gap-4 group cursor-help">
                                            <div className="w-2 h-2 bg-emerald-500 rotate-45 group-hover:scale-150 transition-transform" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">CONFIANZA_MUTUAL</span>
                                        </div>
                                        <div className="flex items-center gap-4 group cursor-help">
                                            <div className="w-2 h-2 bg-emerald-500 rotate-45 group-hover:scale-150 transition-transform" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">PRECISIÓN_TÉCNICA</span>
                                        </div>
                                        <div className="flex items-center gap-4 group cursor-help">
                                            <div className="w-2 h-2 bg-emerald-500 rotate-45 group-hover:scale-150 transition-transform" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">ESCALA_GLOBAL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Grid Manifesto --- */}
                <section className="px-6 md:px-20 mb-40 md:mb-64">
                    <div className="max-w-7xl mx-auto">
                        <SectionLabel text="VALORES_INDUSTRIALES" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            <FeatureCard 
                                icon={Shield}
                                title="SEGURIDAD"
                                description="Protocolos de verificación rigurosos para cada nodo de nuestra red nacional."
                            />
                            <FeatureCard 
                                icon={Zap}
                                title="VELOCIDAD"
                                description="Optimización de procesos para diagnósticos en tiempo real y flujo de datos ágil."
                            />
                            <FeatureCard 
                                icon={Cpu}
                                title="TECNOLOGÍA"
                                description="Inversión constante en software de diagnóstico y sistemas de gestión avanzados."
                            />
                            <FeatureCard 
                                icon={Network}
                                title="COMUNIDAD"
                                description="Un ecosistema vivo de mecánicos y establecimientos que comparten el estándar."
                            />
                        </div>
                    </div>
                </section>

                {/* --- CTA / Connectivity --- */}
                <section className="px-6 md:px-20 mb-40 md:mb-64 bg-slate-950 py-40 md:py-64 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
                    
                    <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
                        <div className="inline-flex items-center gap-4 text-emerald-500">
                            <CircleDot size={20} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[.6em] italic">READY_TO_CONNECT</span>
                        </div>
                        
                        <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
                            ÚNETE AL <br /> <span className="text-emerald-500 not-italic">ESTÁNDAR.</span>
                        </h2>
                        
                        <p className="text-slate-300 text-[10px] font-black uppercase tracking-[.3em] max-w-sm mx-auto leading-relaxed">
                            SE PARTE DE LA RED DE TALLERES MÁS ROBUSTA Y CONFIABLE DEL CONTINENTE.
                        </p>
                        
                        <div className="pt-12">
                            <Link href="/register">
                                <button className="h-20 bg-emerald-500 px-12 text-slate-950 text-[11px] font-black uppercase tracking-[.4em] italic hover:bg-white transition-all flex items-center justify-center gap-6 mx-auto group">
                                    INICIALIZAR CONEXIÓN <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
