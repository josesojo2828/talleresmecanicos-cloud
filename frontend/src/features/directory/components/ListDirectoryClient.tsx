'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search, Wrench, Star, Navigation,
  LayoutGrid, Heart, Phone, Share2, MapPin,
  ChevronRight, Globe, Filter, X, Zap, Settings,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";
import { WorkshopSkeleton } from '@/components/atoms/Skeleton';
import { SEO } from '@/components/atoms/SEO';
import { SEOContent } from '@/features/directory/components/SEOContent';
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
  latitude?: number;
  longitude?: number;
  whatsapp?: string;
  phone?: string;
  city?: City;
  country?: Country;
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

  // Initial Load
  useEffect(() => {
    const init = async () => {
      try {
        const countriesRes = await apiClient.get('/country?filters={"enabled":true}');
        const enabledCountries = countriesRes.data?.body?.data || countriesRes.data?.data || [];
        setCountries(enabledCountries);

        // Fetch categories
        const catRes = await apiClient.get('/workshop-category?filters={"enabled":true}');
        setCategories(catRes.data?.body?.data || catRes.data?.data || []);

        // Default: If only one country enabled, select it
        if (enabledCountries.length === 1) {
          setSelectedCountry(enabledCountries[0]);
          fetchCities(enabledCountries[0].id);
        } else {
             const savedCountryId = localStorage.getItem('preferred_country_id');
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
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Cargando Talleres...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Header />
      <SEO
        title="Directorio de Talleres | Lista de Talleres Mecánicos"
        description="Encuentra los mejores talleres mecánicos en México y Latinoamérica. Filtra por ciudad y especialidad."
      />

      {/* Hero Section */}
      <section className="bg-slate-900 border-b border-white/5 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-500/20">
              <Wrench size={14} /> Red Federal de Talleres
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9]">
              Encontrá el <span className="text-emerald-500">Taller Ideal</span> cerca tuyo.
            </h1>
            <p className="text-slate-400 font-medium text-lg md:text-xl max-w-2xl leading-relaxed">
              Explorá nuestra red de expertos verificados. Buscá por cercanía, especialidad o reputación y mantené tu vehículo en las mejores manos.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-6 -translate-y-10 relative z-20">
        {/* Search & Filters Card */}
        <div className="bg-white/80 backdrop-blur-3xl border border-white rounded-[3rem] shadow-2xl p-8 md:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Search */}
            <div className="lg:col-span-5 space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Búsqueda Directa</label>
              <div className="flex bg-slate-50 border border-slate-100 rounded-3xl px-6 py-4 items-center group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Search className="text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Ej: Pintura, Chevrolet, Frenos..."
                  className="bg-transparent border-none outline-none w-full ml-4 text-xs font-bold text-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Country */}
            <div className="lg:col-span-3 space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Región / País</label>
              <select
                value={selectedCountry?.id || ''}
                onChange={(e) => handleCountrySelect(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-4 text-xs font-bold text-slate-700 outline-none appearance-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
              >
                <option value="">Todos los países</option>
                {countries.map(c => (
                  <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="lg:col-span-4 space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Localidad / Ciudad</label>
              <select
                value={selectedCity?.id || ''}
                onChange={(e) => {
                  const city = cities.find(c => c.id === e.target.value);
                  setSelectedCity(city || null);
                }}
                disabled={!selectedCountry}
                className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-4 text-xs font-bold text-slate-700 outline-none appearance-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <option value="">Todas las ciudades</option>
                {cities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Categories Quick Filter */}
          <div className="mt-10 pt-8 border-t border-slate-50">
             <div className="flex flex-wrap gap-2">
                <button
                   onClick={() => setSelectedCategory(null)}
                   className={cn(
                     "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                     !selectedCategory ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                   )}
                >
                   Todas las Especialidades
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                      selectedCategory === cat.id ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="mb-24">
          <header className="flex items-baseline justify-between mb-10 px-4">
             <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                {subLoading ? 'Buscando...' : `${workshops.length} Talleres Encontrados`}
             </h2>
             <Link href="/directorio" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
                Ver en el Mapa <ArrowRight size={14} />
             </Link>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {subLoading ? (
               [1, 2, 3, 4, 5, 6].map(i => <WorkshopSkeleton key={i} />)
             ) : workshops.length === 0 ? (
               <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                  <Zap size={48} className="mx-auto text-slate-100 mb-6" />
                  <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No encontramos talleres</h3>
                  <p className="text-slate-300 font-bold mt-2">Intentá ajustando los filtros o la zona de búsqueda.</p>
                  <button
                    onClick={() => { setSelectedCountry(null); setSelectedCity(null); setSelectedCategory(null); setSearchQuery(''); }}
                    className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                  >
                    Reiniciar Filtros
                  </button>
               </div>
             ) : (
               workshops.map(shop => (
                 <div key={shop.id} className="group bg-white rounded-[3rem] p-3 border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="aspect-[4/3] rounded-[2.5rem] bg-slate-100 relative overflow-hidden">
                       {shop.logoUrl ? (
                         <Image
                           unoptimized
                           src={shop.logoUrl.startsWith('http') || shop.logoUrl.startsWith('/') ? shop.logoUrl : `/talleres-mecanicos/${shop.logoUrl}`}
                           alt={shop.name}
                           fill
                           className="object-cover group-hover:scale-110 transition-transform duration-700"
                         />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-slate-200">
                            <Wrench size={48} />
                         </div>
                       )}
                       <div className="absolute top-6 right-6">
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                                <Star size={14} className="text-amber-500 fill-amber-500" />
                                <span className="text-[10px] font-black text-slate-900">4.9</span>
                            </div>
                       </div>
                    </div>
                    
                    <div className="p-6">
                       <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-lg border border-emerald-100">
                             {shop.specialty || 'Servicio General'}
                          </span>
                       </div>
                       <h3 className="text-xl font-black text-slate-900 uppercase truncate mb-1 group-hover:text-emerald-600 transition-colors">
                          {shop.name}
                       </h3>
                       <p className="text-sm font-bold text-slate-400 flex items-center gap-2 mb-8">
                          <MapPin size={16} className="text-slate-300" /> {shop.city?.name}, {shop.country?.name}
                       </p>

                       <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                          <div className="flex gap-2">
                             {shop.whatsapp && (
                                <a href={`https://wa.me/${shop.whatsapp}`} target="_blank" className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                                   <Phone size={18} />
                                </a>
                             )}
                             <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100">
                                <Share2 size={18} />
                             </button>
                          </div>
                          <Link href={`/taller/${shop.id}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 hover:translate-x-1 transition-transform">
                             Ver Perfil <ChevronRight size={16} />
                          </Link>
                       </div>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>

        <SEOContent />
      </main>

      <Footer />
    </div>
  );
}
