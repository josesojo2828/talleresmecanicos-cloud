"use client";
import React, { useEffect, useState } from "react";
import apiClient from "@/utils/api/api.client";
import { Button } from "@/components/atoms/Button";
import { GlassCard } from "@/components/molecules/GlassCard";
import { TechnicalBackground } from "@/components/atoms/TechnicalBackground";

export default function WorkshopLanding() {
  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const slug = process.env.NEXT_PUBLIC_WORKSHOP_SLUG;

  useEffect(() => {
    console.log("🛠️ NEXT_PUBLIC_WORKSHOP_SLUG:", slug);
    console.log("🛰️ NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

    const fetchWorkshop = async () => {
      try {
        console.log(`🔍 Iniciando búsqueda para el slug: ${slug}...`);
        // El backend usa '/workshop' en singular para el CRUD principal
        const response = await apiClient.get(`/workshop?slug=${slug}`);

        console.log("✅ Respuesta recibida:", response.status);
        console.log("📦 Datos brutos:", response.data);

        // El backend devuelve una estructura { body: { total, data: [] }, ... }
        const workshopData = response.data.body?.data || response.data?.data || [];

        if (workshopData && workshopData.length > 0) {
          const found = workshopData[0];
          console.log("🏁 Taller identificado:", found.name, `(ID: ${found.id})`);
          setWorkshop(found);
        } else {
          console.warn("⚠️ No se encontró ningún taller con ese slug en los datos devueltos.");
        }
      } catch (error: any) {
        console.error("❌ Error en la llamada al API:", error.message);
        if (error.response) {
          console.error("📄 Detalles del error:", error.response.status, error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchWorkshop();
    } else {
      console.error("🚨 CRITICAL: NEXT_PUBLIC_WORKSHOP_SLUG no está definido!");
      setLoading(false);
    }
  }, [slug]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Sincronizando Motores...</p>
    </div>
  );

  if (!workshop) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">TALLER NO ENCONTRADO</h1>
      <p className="text-slate-500 mb-8 uppercase text-xs font-bold tracking-widest">El identificador <span className="text-red-500 font-mono">"{slug}"</span> no está registrado.</p>
      <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 mb-8 max-w-md text-left">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Logs de Depuración</p>
        <ul className="space-y-1 text-[10px] font-mono text-slate-600">
          <li>• Host: {typeof window !== 'undefined' ? window.location.host : 'SSR'}</li>
          <li>• API: {process.env.NEXT_PUBLIC_API_URL}</li>
          <li>• Target Slug: {slug}</li>
        </ul>
      </div>
      <Button onClick={() => window.location.reload()} size="lg">Reintentar Conexión</Button>
    </div>
  );

  // Mapeo de publicaciones como servicios para el ejemplo
  const services = workshop.publications || [];

  return (
    <div className="min-h-screen relative overflow-hidden bg-white selection:bg-emerald-100 selection:text-emerald-900">
      <TechnicalBackground />

      {/* Header Minimalista (Flotante) */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="font-black text-2xl tracking-tighter italic text-slate-950 uppercase">
          {workshop.name} <span className="text-emerald-600 not-italic">.</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" className="hidden md:flex uppercase text-xs font-bold">Servicios</Button>
          <Button variant="outline" size="sm" className="uppercase text-xs font-bold border-2">WhatsApp</Button>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section Industrial */}
        <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded">
                Taller Verificado
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter text-slate-950 uppercase italic">
                ESTÁNDAR<br />
                <span className="text-emerald-600 not-italic">MECÁNICO</span><br />
                DE PRECISIÓN.
              </h1>
              <p className="text-slate-500 max-w-xl text-lg leading-relaxed font-bold uppercase tracking-tight opacity-80">
                {workshop.description || "Brindamos soluciones integrales para tu vehículo con tecnología de punta y personal especializado."}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="px-12 h-16 text-lg">SOLICITAR TURNO</Button>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-emerald-600/5 blur-3xl rounded-full" />
              <GlassCard className="aspect-square flex items-center justify-center border-slate-200 p-0 overflow-hidden relative">
                <div className="w-full h-full bg-slate-50/50 flex flex-col items-center justify-center text-slate-200">
                  <svg className="w-32 h-32 mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  <span className="uppercase text-[10px] font-black tracking-[0.5em] text-slate-400">Auth. System Overlay</span>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="py-24 px-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16 border-b-4 border-slate-950 pb-6">
              <h2 className="text-5xl font-black text-slate-950 uppercase italic leading-none">
                Servicios <span className="text-emerald-600 not-italic">Vigentes</span>
              </h2>
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest hidden md:block">
                Actualizado hoy &mdash; {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.length > 0 ? services.map((p: any) => (
                <GlassCard key={p.id} className="group hover:border-emerald-500 transition-all duration-500 hover:-translate-y-2 bg-white/50">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-2 bg-slate-950 text-white rounded text-[10px] font-black uppercase tracking-widest">
                      REF-{p.id.substring(0, 4)}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-3 uppercase italic tracking-tighter text-slate-900 leading-none">{p.title}</h3>
                  <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed opacity-80">{p.description}</p>
                  <div className="flex justify-between items-center mt-auto pt-6 border-t border-slate-200/50">
                    <div className="text-2xl font-black text-emerald-600 tracking-tighter">
                      ${p.price || "---"}
                    </div>
                    <Button variant="ghost" size="sm" className="font-black italic uppercase text-xs hover:bg-emerald-50">Detalles</Button>
                  </div>
                </GlassCard>
              )) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-400 font-black italic uppercase tracking-widest text-lg">No hay servicios publicados actualmente</p>
                  <p className="text-slate-400 text-xs mt-2 uppercase">Consultá por WhatsApp para presupuesto a medida</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Minimalista */}
      <footer className="py-16 border-t border-slate-200 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-2">
            <div className="font-black text-xl tracking-tighter italic text-slate-950 uppercase">
              {workshop.name} <span className="text-emerald-600 not-italic">.</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              &copy; {new Date().getFullYear()} — Plataforma Talleres Mecánicos SaaS
            </p>
          </div>

          <div className="flex gap-10">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Legal</span>
              <a href="#" className="text-xs font-bold uppercase hover:text-emerald-600 transition-colors">Términos</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Soporte</span>
              <a href="#" className="text-xs font-bold uppercase hover:text-emerald-600 transition-colors">Ayuda</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
