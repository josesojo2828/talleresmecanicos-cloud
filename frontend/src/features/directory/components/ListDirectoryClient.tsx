'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
   Search, Wrench, Star, Navigation,
   LayoutGrid, Heart, Phone, Share2, MapPin,
   ChevronRight, Globe, Filter, X, Zap, Settings,
   ArrowRight
} from 'lucide-react';
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";
import { WorkshopSkeleton } from '@/components/atoms/Skeleton';
import { SEO } from '@/components/atoms/SEO';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';

interface Country {
   id: string;
   name: string;
   flag: string | null;
   enabled: boolean;
}

interface City {
   id: string;
   name: string;
   countryId: string;
}

interface Workshop {
   id: string;
   name: string;
   description: string;
   address: string;
   rating?: number;
   logoUrl?: string;
   images: string[];
   specialty?: string;
   countryId: string;
   cityId: string;
   city?: City;
   country?: Country;
   whatsapp?: string;
}

export default function ListDirectoryClient() {
   const [workshops, setWorkshops] = useState<Workshop[]>([]);
   const [countries, setCountries] = useState<Country[]>([]);
   const [cities, setCities] = useState<City[]>([]);
   const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
   const [selectedCity, setSelectedCity] = useState<City | null>(null);
   const [searchQuery, setSearchQuery] = useState('');
   const [loading, setLoading] = useState(true);
   const [subLoading, setSubLoading] = useState(false);
   const [categories, setCategories] = useState<any[]>([]);
   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

   useEffect(() => {
      const init = async () => {
         try {
            const countriesRes = await apiClient.get('/country?filters={"enabled":true}');
            const enabledCountries = countriesRes.data?.body?.data || countriesRes.data?.data || [];
            setCountries(enabledCountries);

            const catRes = await apiClient.get('/workshop-category?filters={"enabled":true}');
            setCategories(catRes.data?.body?.data || catRes.data?.data || []);

            if (enabledCountries.length === 1) {
               setSelectedCountry(enabledCountries[0]);
               fetchCities(enabledCountries[0].id);
            } else {
               const savedCountryId = typeof window !== 'undefined' ? localStorage.getItem('preferred_country_id') : null;
               if (savedCountryId) {
                  const savedCountry = enabledCountries.find((c: any) => c.id === savedCountryId);
                  if (savedCountry) {
                     setSelectedCountry(savedCountry);
                     fetchCities(savedCountry.id);
                  }
               }
            }
         } catch (err) {
            console.error("Init Error:", err);
         } finally {
            setLoading(false);
         }
      };
      init();
   }, []);

   const fetchCities = async (countryId: string) => {
      try {
         const res = await apiClient.get(`/city?filters={"countryId":"${countryId}"}`);
         setCities(res.data?.body?.data || res.data?.data || []);
      } catch (err) {
         console.error("Error fetching cities:", err);
      }
   };

   const fetchWorkshops = async () => {
      setSubLoading(true);
      try {
         let filter: any = { enabled: true };
         if (selectedCountry) filter.countryId = selectedCountry.id;
         if (selectedCity) filter.cityId = selectedCity.id;
         if (selectedCategory) filter.categoryIds = selectedCategory;

         let queryParams = `filters=${JSON.stringify(filter)}`;
         if (searchQuery) queryParams += `&search=${searchQuery}`;

         const res = await apiClient.get(`/workshop?${queryParams}`);
         setWorkshops(res.data?.body?.data || res.data?.data || []);
      } catch (err) {
         console.error("Error fetching workshops:", err);
      } finally {
         setSubLoading(false);
      }
   };

   useEffect(() => {
      if (loading) return;
      const timer = setTimeout(() => {
         fetchWorkshops();
      }, 400);
      return () => clearTimeout(timer);
   }, [selectedCountry, selectedCity, selectedCategory, searchQuery, loading]);

   const handleCountrySelect = (countryId: string) => {
      const country = countries.find(c => c.id === countryId);
      setSelectedCountry(country || null);
      setSelectedCity(null);
      if (country) {
         localStorage.setItem('preferred_country_id', country.id);
         fetchCities(country.id);
      }
   };

   if (loading) return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-8 px-6 text-center">
         <div className="w-16 h-16 border-4 border-slate-950 border-t-emerald-500 animate-spin" />
         <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-slate-900 italic">CARGANDO_RED_INFRAESTRUCTURA</h2>
      </div>
   );

   return (
      <div className="min-h-screen bg-white flex flex-col pt-32">
         <Header />
         <SEO
            title="Directorio de Talleres | Talleres Mecánicos"
            description="Encuentra los mejores talleres mecánicos verificados de la red Talleres Mecánicos."
         />

         {/* Modern Industrial Hero */}
         <section className="relative px-6 py-24 bg-slate-950 overflow-hidden border-b border-emerald-500/20">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
               style={{ backgroundImage: `radial-gradient(#10b981 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px' }} />

            <div className="max-w-7xl mx-auto relative z-10">
               <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                  <div className="space-y-6 max-w-4xl">
                     <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.85]">
                        LOCALIZA TU <br />
                        <span className="text-emerald-500 not-italic pointer-events-none">NODO DE</span> <br />
                        SERVICIO.
                     </h1>
                  </div>
               </div>
            </div>
         </section>

         {/* Technical Filter Bar */}
         <section className="bg-white border-b border-slate-100 sticky top-[80px] z-40 transition-all">
            <div className="max-w-7xl mx-auto px-6 py-8">
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                  {/* Search Field */}
                  <div className="relative group">
                     <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500">
                        <Search size={18} />
                     </div>
                     <input
                        type="text"
                        placeholder="BUSCAR TALLER O ESPECIALIDAD..."
                        className="w-full bg-slate-50 border border-slate-200 px-14 py-5 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-950 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>

                  {/* Country Select */}
                  <div className="relative">
                     <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Globe size={18} />
                     </div>
                     <select
                        value={selectedCountry?.id || ''}
                        onChange={(e) => handleCountrySelect(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 pl-14 pr-10 py-5 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-950 appearance-none outline-none cursor-pointer"
                     >
                        <option value="">TODOS LOS PAÍSES</option>
                        {countries.map(c => (
                           <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                     </select>
                  </div>

                  {/* City Select */}
                  <div className="relative">
                     <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <MapPin size={18} />
                     </div>
                     <select
                        value={selectedCity?.id || ''}
                        onChange={(e) => {
                           const city = cities.find(c => c.id === e.target.value);
                           setSelectedCity(city || null);
                        }}
                        disabled={!selectedCountry}
                        className="w-full bg-slate-50 border border-slate-200 pl-14 pr-10 py-5 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-950 appearance-none outline-none cursor-pointer disabled:opacity-30"
                     >
                        <option value="">TODAS LAS CIUDADES</option>
                        {cities.map(c => (
                           <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                     </select>
                  </div>

                  {/* Category Quick Selector */}
                  <div className="relative">
                     <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Wrench size={18} />
                     </div>
                     <select
                        value={selectedCategory || ''}
                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                        className="w-full bg-slate-50 border border-slate-200 pl-14 pr-10 py-5 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-950 appearance-none outline-none cursor-pointer"
                     >
                        <option value="">TODAS LAS ESPECIALIDADES</option>
                        {categories.map(cat => (
                           <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                     </select>
                  </div>

               </div>
            </div>
         </section>

         {/* Main Results Grid */}
         <main className="max-w-7xl mx-auto w-full px-6 py-16">
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
               <div>
                  <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic">
                     {subLoading ? 'BUSCANDO_REGISTROS...' : `${workshops.length} TALLERES_ENCONTRADOS`}
                  </h2>
                  <div className="w-20 h-1 bg-emerald-500 mt-2" />
               </div>
               {workshops.length > 0 && (
                  <Link href="/directorio" className="group text-[11px] font-black text-slate-950 uppercase tracking-[0.3em] flex items-center gap-3">
                     VER EN MAPA INTERACTIVO <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
               )}
            </header>

            {subLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {[1, 2, 3, 4, 5, 6].map(i => <WorkshopSkeleton key={i} />)}
               </div>
            ) : workshops.length === 0 ? (
               <div className="py-32 border border-slate-100 bg-slate-50 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white border border-slate-200 flex items-center justify-center text-slate-200 mb-8">
                     <Search size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-950 uppercase tracking-widest mb-4">SIN RESULTADOS EN ESTA ZONA</h3>
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-10">REAJUSTA LOS FILTROS TÉCNICOS PARA AMPLIAR LA BÚSQUEDA.</p>
                  <button
                     onClick={() => { setSelectedCountry(null); setSelectedCity(null); setSelectedCategory(null); setSearchQuery(''); }}
                     className="px-10 py-5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
                  >
                     REINICIAR_CRITERIOS
                  </button>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {workshops.map(shop => (
                     <Link key={shop.id} href={`/taller/${shop.id}`} className="group flex flex-col bg-white border border-slate-100 hover:border-slate-950 transition-all duration-300">
                        <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                           {shop.images?.[0] || shop.logoUrl ? (
                              <div className="relative w-full h-full">
                                 <Image
                                    unoptimized
                                    src={shop.logoUrl || shop.images[0]}
                                    alt={shop.name}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                 />
                              </div>
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-200">
                                 <Wrench size={40} />
                              </div>
                           )}
                           <div className="absolute top-5 right-5">
                              <div className="bg-slate-950/90 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest italic">
                                 {shop.specialty || 'GENERAL'}
                              </div>
                           </div>
                        </div>

                        <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                           <div className="space-y-3">
                              <div className="flex items-center gap-2 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                                 <div className="w-1.5 h-1.5 bg-emerald-500" /> VERIFICADO
                              </div>
                              <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter leading-none group-hover:text-emerald-600 transition-colors">
                                 {shop.name}
                              </h3>
                              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                 <MapPin size={14} className="text-slate-300" /> {shop.city?.name}, {shop.country?.name}
                              </p>
                           </div>

                           <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex gap-4">
                                 {shop.whatsapp && (
                                    <div className="w-10 h-10 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all">
                                       <Phone size={16} />
                                    </div>
                                 )}
                                 <div className="w-10 h-10 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:border-slate-950 transition-all">
                                    <Share2 size={16} />
                                 </div>
                              </div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-slate-950 group-hover:translate-x-2 transition-transform italic flex items-center gap-2">
                                 CONECTAR_AHORA <ArrowRight size={14} />
                              </div>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            )}
         </main>

         <Footer />
      </div>
   );
}
