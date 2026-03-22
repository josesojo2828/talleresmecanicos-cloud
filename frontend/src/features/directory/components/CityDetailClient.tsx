'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, Wrench, Navigation, Star, 
  ChevronRight, Phone, Share2, 
  ArrowLeft, Search, Filter 
} from 'lucide-react';
import apiClient from '@/utils/api/api.client';
import { cn } from '@/utils/cn';
import { WorkshopSkeleton } from '@/components/atoms/Skeleton';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';

interface CityDetailClientProps {
  id: string;
}

export default function CityDetailClient({ id }: CityDetailClientProps) {
  const [city, setCity] = useState<any>(null);
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityRes = await apiClient.get(`/city/${id}`);
        setCity(cityRes.data?.body || cityRes.data);

        const workshopsRes = await apiClient.get(`/workshop?filters={"cityId":"${id}","enabled":true}`);
        setWorkshops(workshopsRes.data?.body?.data || workshopsRes.data?.data || []);
      } catch (err) {
        console.error('Error fetching city data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const filteredWorkshops = workshops.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex flex-col pt-24">
      <Header />
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!city) return <div>Ciudad no encontrada.</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Header />
      
      {/* City Hero */}
      <div className="bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <Link href="/directorio" className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-transform">
              <ArrowLeft size={16} /> Volver al Directorio
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
              Talleres en <span className="text-emerald-500">{city.name}</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-xl text-lg">
              Encuentra los mecánicos más confiables y especializados en {city.name}, {city.country?.name}. Calidad garantizada para tu vehículo.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 text-center min-w-[240px]">
            <div className="text-5xl font-black text-emerald-500 mb-1">{workshops.length}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Talleres Verificados</div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full px-6 flex-1 py-12 space-y-12">
        
        {/* Filtros Rápidos */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full bg-white rounded-[2rem] border border-slate-200 px-8 py-4 flex items-center shadow-sm focus-within:shadow-md transition-all">
            <Search className="text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="¿Qué servicio buscas? (Ejem: Frenos, Pintura...)"
              className="w-full bg-transparent border-none outline-none ml-4 text-xs font-bold text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <Filter size={16} /> Ver en Mapa
            </button>
          </div>
        </section>

        {/* Listado de Talleres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkshops.map((shop) => (
            <Link href={`/taller/${shop.id}`} key={shop.id}>
              <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 p-2 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[4/3] rounded-[2rem] bg-slate-50 relative overflow-hidden">
                  {shop.logoUrl ? (
                    <Image
                      unoptimized 
                      src={shop.logoUrl} 
                      alt={shop.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Wrench size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg flex items-center gap-1.5">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-black text-slate-900">4.9</span>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg">
                    {shop.specialty || 'General'}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 uppercase mt-4 group-hover:text-emerald-600 transition-colors">
                    {shop.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-2">
                    <MapPin size={14} className="text-slate-300" /> {shop.address}
                  </p>
                  
                  <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                    <div className="flex gap-2">
                       {shop.whatsapp && (
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Phone size={16} />
                        </div>
                      )}
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                        <Share2 size={16} />
                      </div>
                    </div>
                    <div className="text-[10px] font-black uppercase text-emerald-500 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      Ver Ficha <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {filteredWorkshops.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4 opacity-30 italic">
               <Navigation size={48} className="mx-auto" />
               <p className="text-[10px] font-black uppercase tracking-widest">No hay resultados para esta búsqueda</p>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
