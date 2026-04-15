'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search, Wrench, Star, Navigation,
  LayoutGrid, Heart, Plus, Minus,
  MessageCircle, Phone, Share2, MapPin,
  ChevronRight, Globe, LogIn,
  LogOut, Filter, X, Zap, Settings
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from "@/utils/api/api.client";
import { useAlertStore } from '@/store/useAlertStore';
import { cn } from "@/utils/cn";
import { Map } from "@/components/molecules/Map";
import { WorkshopSkeleton } from '@/components/atoms/Skeleton';
import { SEO } from '@/components/atoms/SEO';
import { SEOContent } from '@/features/directory/components/SEOContent';
import { getFullImagePath } from '@/utils/image';

// --- Types ---
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
  pricePerDiagnostic?: number;
  countryId: string;
  cityId: string;
  latitude?: number;
  longitude?: number;
  whatsapp?: string;
  phone?: string;
  city?: City;
  country?: Country;
}

interface DirectoryClientProps {
  initialCountryId?: string;
  initialCityId?: string;
}

function DirectoryContent({ initialCountryId, initialCityId }: DirectoryClientProps) {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout } = useAuthStore();
  // -- States --
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [isLocationFilterOpen, setIsLocationFilterOpen] = useState(true);
  const [isSpecialtyFilterOpen, setIsSpecialtyFilterOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [mobileView, setMobileView] = useState<'list' | 'map'>('map'); // Default to map on mobile as requested
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // -- Handling Search Params --
  useEffect(() => {
    const view = searchParams.get('view');
    const search = searchParams.get('search');
    
    if (view === 'map') {
      setMobileView('map');
    } else if (view === 'list') {
      setMobileView('list');
      setShowMobileList(true);
    }

    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // -- Initial Load --
  useEffect(() => {
    const init = async () => {
      try {
        // 1. Fetch enabled countries
        const countriesRes = await apiClient.get('/country?filters={"enabled":true}');
        const enabledCountries = countriesRes.data?.body?.data || countriesRes.data?.data || [];
        setCountries(enabledCountries);

        // 2. Priority check: Prop
        if (initialCountryId) {
          const propCountry = enabledCountries.find((c: any) => c.id === initialCountryId);
          if (propCountry) {
            setSelectedCountry(propCountry);
            fetchCities(propCountry.id);
            setLoading(false);
            return;
          }
        }

        // 3. Priority check: No countries? Skip modal and show general directory (#4)
        if (enabledCountries.length === 0) {
          setShowCountryModal(false);
          setLoading(false);
          return;
        }

        // 4. Priority check: Session User (#2)
        let initialCountry = null;
        if (isAuthenticated && user?.countryId) {
          initialCountry = enabledCountries.find((c: any) => c.id === user.countryId);
        }

        if (initialCountry) {
          setSelectedCountry(initialCountry);
          fetchCities(initialCountry.id);
          setLoading(false);
          return;
        }

        // 5. Priority check: Geolocation (#1)
        if ("geolocation" in navigator) {
          try {
            const position = await new Promise<GeolocationPosition | null>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3500 });
            });

            if (position) {
              setUserLocation([position.coords.latitude, position.coords.longitude]);
              setSortByDistance(true);
              // Fetch categories regardless
              const catRes = await apiClient.get('/workshop-category?filters={"enabled":true}');
              setCategories(catRes.data?.body?.data || catRes.data?.data || []);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn("Geolocation denied or timeout");
          }
        }

        // 6. Default check: LocalStorage
        const savedCountryId = localStorage.getItem('preferred_country_id');
        if (savedCountryId) {
          const savedCountry = enabledCountries.find((c: any) => c.id === savedCountryId);
          if (savedCountry) {
            setSelectedCountry(savedCountry);
            fetchCities(savedCountry.id);
            setLoading(false);
            return;
          }
        }

        // 7. If none of the above, show modal (#3)
        setShowCountryModal(true);

        // 8. Fetch categories
        const catRes = await apiClient.get('/workshop-category?filters={"enabled":true}');
        setCategories(catRes.data?.body?.data || catRes.data?.data || []);

      } catch (err) {
        console.error("Init Error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [isAuthenticated, user, initialCountryId]);

  // Handle City Selection if initialCityId is provided
  useEffect(() => {
    if (initialCityId && cities.length > 0) {
      const city = cities.find(c => c.id === initialCityId);
      if (city) setSelectedCity(city);
    }
  }, [cities, initialCityId]);

  // -- Fetching Logic --
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
      if (selectedCountry || searchQuery || userLocation || countries.length === 0) {
        fetchWorkshops();
      }
    }, 300); // Debounce
    return () => clearTimeout(timer);
  }, [selectedCountry, selectedCity, selectedCategory, searchQuery, userLocation, loading, countries.length]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedCity(null);
    localStorage.setItem('preferred_country_id', country.id);
    fetchCities(country.id);
    setShowCountryModal(false);
  };

  const sortedWorkshops = useMemo(() => {
    let list = [...workshops];

    if (sortByDistance && userLocation) {
      list.sort((a, b) => {
        const distA = Math.sqrt(Math.pow((a.latitude || 0) - userLocation[0], 2) + Math.pow((a.longitude || 0) - userLocation[1], 2));
        const distB = Math.sqrt(Math.pow((b.latitude || 0) - userLocation[0], 2) + Math.pow((b.longitude || 0) - userLocation[1], 2));
        return distA - distB;
      });
    } else {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [workshops, sortByDistance, userLocation]);

  const ProfileTile = () => {
    if (!isAuthenticated) {
      return (
        <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <h4 className="text-sm font-black uppercase tracking-widest mb-2 italic">Bienvenido</h4>
          <p className="text-[10px] text-slate-400 font-bold mb-6">Únete a la red más grande de talleres mecánicos.</p>
          <div className="flex flex-col gap-2 relative">
            <Link href="/auth/login" className="bg-emerald-500 hover:bg-emerald-400 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
              Iniciar Sesión
            </Link>
            <Link href="/auth/register" className="bg-white/10 hover:bg-white/20 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all">
              Crear Cuenta
            </Link>
          </div>
        </div>
      );
    }

    const getInitials = (userName?: string) => {
      if (!userName) return 'U';
      return userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
      <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl overflow-hidden relative border-2 border-white shadow-md">
          {getInitials(user?.firstName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-0.5"><strong className='text-lg'>{selectedCountry?.flag}</strong> Hola,</p>
          <h4 className="text-sm font-black text-slate-900 truncate uppercase mt-[-2px]">{user?.firstName}</h4>
          <Link href="/dashboard" className="text-[9px] font-bold text-slate-400 hover:text-emerald-500 flex items-center gap-1 transition-colors uppercase mt-1">
            Mi Dashboard <ChevronRight size={10} />
          </Link>
        </div>
        <button onClick={() => logout()} className="w-10 h-10 rounded-xl hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all flex items-center justify-center">
          <LogOut size={18} />
        </button>
      </div>
    );
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Cargando Directorio...</p>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 p-4 md:p-6 gap-6 overflow-hidden text-slate-700">
      <SEO
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": sortedWorkshops.slice(0, 10).map((shop, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "LocalBusiness",
              "name": shop.name,
              "image": shop.logoUrl,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": shop.address,
                "addressLocality": shop.city?.name,
                "addressCountry": shop.country?.name
              }
            }
          }))
        }}
      />

      {/* --- Sidebar Estilo Glass (Izquierda) --- */}
      <aside className="hidden lg:flex w-24 bg-slate-900 rounded-[3rem] shadow-2xl flex flex-col items-center py-10 gap-10 relative z-50">
        <Link href="/" className="bg-emerald-500 p-4 rounded-[1.5rem] shadow-lg shadow-emerald-500/40 text-white hover:scale-110 active:scale-95 transition-all">
          <Wrench size={24} />
        </Link>

        <nav className="flex flex-col gap-10 flex-1">
          <Link href="/dashboard" className="group relative flex items-center justify-center">
            <LayoutGrid className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
            <span className="absolute left-16 bg-slate-800 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-4 group-hover:translate-x-0 shadow-xl z-[100] whitespace-nowrap border border-white/10">Dashboard</span>
          </Link>
          <div className="group relative flex items-center justify-center">
            <Navigation className="text-emerald-400" />
            <span className="absolute left-16 bg-slate-800 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-4 group-hover:translate-x-0 shadow-xl z-[100] whitespace-nowrap border border-white/10">Mapa</span>
          </div>
          <Link href="/comunidad" className="group relative flex items-center justify-center">
            <div className="relative">
              <MessageCircle className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
            </div>
            <span className="absolute left-16 bg-slate-800 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-4 group-hover:translate-x-0 shadow-xl z-[100] whitespace-nowrap border border-white/10">Comunidad</span>
          </Link>
        </nav>

        <div className="flex flex-col gap-8 pb-4">
          {isAuthenticated ? (
            <button onClick={() => logout()} className="text-slate-500 hover:text-rose-500 transition-colors">
              <LogOut size={22} />
            </button>
          ) : (
            <Link href="/auth/login" className="text-slate-500 hover:text-emerald-400 transition-colors">
              <LogIn size={22} />
            </Link>
          )}
        </div>
      </aside>

      {/* --- MOBILE TOP LOGO/MENU --- */}
      <div className="lg:hidden absolute top-10 left-8 z-[80]">
        <button 
          onClick={() => setShowMobileMenu(true)}
          className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 active:scale-95 transition-all"
        >
          <Settings size={20} className="text-emerald-500" />
        </button>
      </div>

      {/* --- Contenedor Principal --- */}
      <main className="flex-1 flex flex-col gap-4 md:gap-6 min-w-0">

        {/* Navigation & Search Bar */}
        <header className="hidden lg:flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6">
          <div className="flex-1 bg-white/80 backdrop-blur-2xl border border-white shadow-xl rounded-[2.5rem] px-6 md:px-8 py-3 flex items-center group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <button 
              onClick={() => setShowCountryModal(true)}
              className="flex items-center gap-2 pr-4 border-r border-slate-200 mr-4 hover:bg-slate-50 transition-all py-2 rounded-xl"
            >
               <span className="text-lg leading-none">{selectedCountry?.flag || '🌎'}</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{selectedCountry?.name || 'País'}</span>
            </button>
            <Search className="text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Buscar taller o especialidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full ml-3 md:ml-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-800 placeholder:text-slate-300 placeholder:normal-case placeholder:font-bold placeholder:tracking-normal"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            )}
          </div>


        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">

          {/* LADO IZQUIERDO: Listado de Talleres (Escritorio) */}
          <section className={cn(
            "hidden lg:flex bg-white/40 backdrop-blur-xl border border-white rounded-[3rem] shadow-2xl transition-all duration-500 overflow-hidden relative z-20",
            isSidebarOpen ? "w-[420px]" : "w-0 opacity-0 pointer-events-none"
          )}>
            <div className="p-8 flex flex-col h-full">

              <ProfileTile />

              {/* Filtros Geográficos */}
              <div className="mt-8 space-y-6">
                <div className="space-y-4">
                  <header className="flex items-center justify-between px-2 cursor-pointer group" onClick={() => setIsLocationFilterOpen(!isLocationFilterOpen)}>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-slate-600 transition-colors">
                      <Filter size={14} /> Filtro de Ubicación
                    </h5>
                    <div className="flex items-center gap-3">
                      {selectedCountry && (
                        <button onClick={(e) => { e.stopPropagation(); setShowCountryModal(true); }} className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter hover:underline">Cambiar País</button>
                      )}
                      {isLocationFilterOpen ? <Minus size={12} className="text-slate-300" /> : <Plus size={12} className="text-slate-300" />}
                    </div>
                  </header>

                  {isLocationFilterOpen && (
                    <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <button
                        onClick={() => setShowCountryModal(true)}
                        className="relative group/country text-left"
                      >
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
                          {selectedCountry?.flag ? (
                            selectedCountry.flag.startsWith('http') || selectedCountry.flag.startsWith('/') ? (
                                <img src={selectedCountry.flag} className="w-full h-full object-cover rounded-full shadow-sm" />
                            ) : (
                                <span className="text-sm">{selectedCountry.flag}</span>
                            )
                          ) : (
                            <Globe size={14} className="text-slate-400" />
                          )}
                        </div>
                        <div className="w-full bg-white border border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-800 group-hover/country:border-emerald-500 transition-colors shadow-sm truncate">
                          {selectedCountry?.name || 'Seleccionar País'}
                        </div>
                      </button>

                      <select
                        value={selectedCity?.id || ''}
                        onChange={(e) => {
                          const city = cities.find(c => c.id === e.target.value);
                          setSelectedCity(city || null);
                        }}
                        className="bg-white border border-slate-100 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-800 appearance-none outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                      >
                        <option value="">Todas las Ciudades</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <header className="px-2 flex items-center justify-between cursor-pointer group" onClick={() => setIsSpecialtyFilterOpen(!isSpecialtyFilterOpen)}>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-slate-600 transition-colors">
                      <Settings size={14} /> Especialidad
                    </h5>
                    {isSpecialtyFilterOpen ? <Minus size={12} className="text-slate-300" /> : <Plus size={12} className="text-slate-300" />}
                  </header>
                  {isSpecialtyFilterOpen && (
                    <div className="flex flex-wrap gap-2 px-2 pb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border", !selectedCategory ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-white text-slate-400 border-slate-100 hover:border-emerald-200")}
                      >
                        Todas
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border", selectedCategory === cat.id ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-white text-slate-400 border-slate-100 hover:border-emerald-200")}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between mb-6 px-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
                  {workshops.length} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Resultados</span>
                </h3>
                <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      viewMode === 'list' ? "bg-white text-emerald-500 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      viewMode === 'grid' ? "bg-white text-emerald-500 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <Zap size={16} />
                  </button>
                </div>
              </div>

              {/* Scrollable Workshop List */}
              <div className={cn(
                "flex-1 overflow-y-auto pr-2 custom-scrollbar",
                viewMode === 'grid' ? "grid grid-cols-2 gap-4 content-start" : "space-y-6"
              )}>
                {subLoading ? (
                  [1, 2, 3, 4].map(i => <WorkshopSkeleton key={i} />)
                ) : workshops.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center col-span-full">
                    <Zap size={40} className="text-slate-200 mb-4" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No hay talleres en esta zona todavía</p>
                    <button
                      onClick={() => { setSelectedCity(null); setSearchQuery(''); }}
                      className="mt-4 text-[10px] font-bold text-emerald-500 uppercase hover:underline"
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                ) : (
                  sortedWorkshops.map((shop) => (
                    <div
                      key={shop.id}
                      className={cn(
                        "group bg-white p-4 rounded-[2rem] border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative",
                        viewMode === 'grid' ? "flex flex-col h-full" : ""
                      )}
                    >
                      <div className={cn("flex gap-4", viewMode === 'grid' ? "flex-col" : "")}>
                        <div className={cn(
                          "rounded-2xl bg-slate-50 overflow-hidden relative shrink-0",
                          viewMode === 'grid' ? "w-full h-32" : "w-24 h-24"
                        )}>
                          {/* Banner / Main Image */}
                          <Image
                            unoptimized
                            src={getFullImagePath(shop.images?.[0] || shop.logoUrl) || 'https://placehold.co/400x300/f8fafc/94a3b8?text=...'}
                            alt={shop.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          
                          {/* Logo Overlay (si hay banner) */}
                          {shop.logoUrl && shop.images?.[0] && (
                             <div className="absolute bottom-2 left-2 w-8 h-8 rounded-lg bg-white p-0.5 shadow-lg border border-white/20 z-10 transition-transform group-hover:scale-110">
                                <div className="relative w-full h-full rounded-md overflow-hidden">
                                   <Image
                                      unoptimized
                                      src={getFullImagePath(shop.logoUrl)}
                                      alt={`${shop.name} logo`}
                                      fill
                                      className="object-cover"
                                   />
                                </div>
                             </div>
                          )}

                          <div className="absolute top-2 right-2 flex gap-1">
                            <button className="w-7 h-7 bg-white/60 backdrop-blur-md rounded-lg flex items-center justify-center text-slate-800 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95">
                              <Heart size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <header className="flex justify-between items-start mb-1">
                            <span className="text-[8px] font-black text-emerald-500 uppercase bg-emerald-50 px-2 py-1 rounded-lg">
                              {(shop as any).specialty || 'General'}
                            </span>
                          </header>
                          <h4 className="text-sm font-black text-slate-800 truncate uppercase mt-1 leading-tight">{shop.name}</h4>
                          <p className="text-[9px] font-medium text-slate-400 line-clamp-1 mt-1 flex items-center gap-1">
                            <MapPin size={10} /> {shop.city?.name}
                          </p>
                          <div className={cn("flex items-center justify-between mt-4", viewMode === 'grid' ? "flex-col items-stretch gap-2" : "")}>
                            <div className="flex gap-2">
                              {shop.whatsapp && (
                                <a href={`https://wa.me/${shop.whatsapp}`} target="_blank" className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                                  <Phone size={14} />
                                </a>
                              )}
                              <button className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all">
                                <Share2 size={14} />
                              </button>
                            </div>
                            <Link href={`/taller/${shop.id}`} className="text-[9px] font-black uppercase text-emerald-500 hover:translate-x-1 transition-transform flex items-center gap-1 bg-emerald-50/50 px-4 py-2 rounded-xl justify-center">
                              Ver Ficha <ChevronRight size={12} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Content SEO for Indexing */}
                <SEOContent />
              </div>
            </div>
          </section>

          {/* Map Container - Full screen on Mobile */}
          <section className="flex-1 relative bg-slate-200 lg:rounded-[3rem] overflow-hidden shadow-inner border border-white transition-all duration-500 -m-4 md:-m-0 z-10">
            <Map
              center={userLocation || [19.4326, -99.1332]}
              zoom={userLocation ? 12 : 5}
              userLocation={userLocation}
              markers={workshops.map(w => ({
                lat: w.latitude || 0,
                lng: w.longitude || 0,
                title: w.name,
                address: w.address,
                phone: w.phone,
                logoUrl: w.logoUrl ? (w.logoUrl.startsWith('http') || w.logoUrl.startsWith('/') ? w.logoUrl : `/explorar-red/${w.logoUrl}`) : undefined
              }))}
            />

            {/* Toggle Sidebar Button (Desktop) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "hidden lg:flex absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-16 bg-white border border-slate-100 rounded-r-2xl shadow-xl z-[60] hover:pl-2 transition-all flex-col items-center justify-center text-slate-400 font-black text-[10px]",
                !isSidebarOpen && "left-0"
              )}
              title={isSidebarOpen ? "Cerrar filtros" : "Abrir filtros"}
            >
              {isSidebarOpen ? <X size={14} /> : <Filter size={14} />}
            </button>
          </section>

        </div>
      </main>
      
      {/* --- MOBILE CONTROLS (Floating) --- */}
      <div className="lg:hidden fixed bottom-6 left-0 right-0 z-[80] px-6 space-y-4 animate-in slide-in-from-bottom-5 duration-500">
        
        {/* Search floating bar */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-full px-5 py-2 flex items-center shadow-2xl">
          <Search className="text-emerald-500" size={16} />
          <input 
            type="text" 
            placeholder="Buscar talleres..." 
            className="bg-transparent border-none outline-none flex-1 ml-2 text-[9px] font-black uppercase text-white placeholder:text-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setShowMobileFilters(true)} className="p-1 px-2 border-l border-white/10 text-emerald-500">
            <Filter size={16} />
          </button>
        </div>

        {/* Buttons Toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowMobileList(true)}
            className="flex-1 bg-white text-slate-900 px-5 py-3 rounded-[1.2rem] shadow-2xl flex items-center justify-center gap-2 border border-white/20 font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all"
          >
            <LayoutGrid size={16} className="text-emerald-500" /> Ver Lista
          </button>

        </div>
      </div>

      {/* --- MODAL: Mobile Filters --- */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 lg:hidden" onClick={() => setShowMobileFilters(false)}>
           <div className="bg-white rounded-t-[2.5rem] w-full p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-10 duration-500" onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1bg-slate-100 rounded-full mx-auto mb-8" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-900 uppercase">Filtros</h3>
                <button onClick={() => setShowMobileFilters(false)} className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400"><X size={18} /></button>
              </div>

              <div className="space-y-8">
                 {/* Reusing existing filter logic here internally or simplified */}
                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Región</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button onClick={() => { setShowMobileFilters(false); setShowCountryModal(true); }} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[9px] font-black uppercase text-slate-600 truncate flex items-center gap-2">
                          <Globe size={12} className="text-emerald-500" /> {selectedCountry?.name || "País"}
                       </button>
                       <select 
                        value={selectedCity?.id || ''}
                        onChange={(e) => {
                          const city = cities.find(c => c.id === e.target.value);
                          setSelectedCity(city || null);
                        }}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[9px] font-black uppercase text-slate-600 outline-none appearance-none"
                       >
                          <option value="">Todas las Ciudades</option>
                          {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Especialidad</label>
                    <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setSelectedCategory(null)}
                          className={cn("px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all", !selectedCategory ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400")}
                        >Todas</button>
                        {categories.map(cat => (
                          <button 
                             key={cat.id} 
                             onClick={() => setSelectedCategory(cat.id)}
                             className={cn("px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all", selectedCategory === cat.id ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400")}
                          >{cat.name}</button>
                        ))}
                    </div>
                 </div>

                 <button onClick={() => setShowMobileFilters(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
                    Aplicar
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: Mobile Workshop List --- */}
      {showMobileList && (
        <div className="fixed inset-0 z-[100] bg-slate-50 lg:hidden flex flex-col p-6 overflow-hidden animate-in slide-in-from-right-10 duration-500">
           <header className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Talleres Cercanos</h2>
              <button 
                onClick={() => setShowMobileList(false)}
                className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-xl flex items-center justify-center text-slate-400 active:scale-90 transition-all"
              >
                <X size={24} />
              </button>
           </header>

           <div className="bg-emerald-50 rounded-2xl p-4 mb-6 flex items-center gap-3 border border-emerald-100">
              <Zap className="text-emerald-500" size={18} />
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                Mostrando {workshops.length} talleres en {selectedCity?.name || selectedCountry?.name || 'tu zona'}
              </p>
           </div>

           <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pb-10">
              {sortedWorkshops.map(shop => (
                <div key={shop.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-white hover:shadow-xl transition-all">
                   <div className="flex items-start gap-5">
                      <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden shadow-inner shrink-0 relative">
                        {/* Banner / Main Image */}
                        <Image 
                          unoptimized 
                          src={getFullImagePath(shop.images?.[0] || shop.logoUrl) || 'https://placehold.co/400x300/f8fafc/94a3b8?text=...'} 
                          alt={shop.name} 
                          fill 
                          className="object-cover" 
                        />
                        
                        {/* Logo Overlay */}
                        {shop.logoUrl && shop.images?.[0] && (
                           <div className="absolute bottom-1.5 left-1.5 w-6 h-6 rounded-lg bg-white p-0.5 shadow-lg border border-white/20 z-10 transition-transform active:scale-110">
                              <div className="relative w-full h-full rounded-md overflow-hidden">
                                 <Image
                                    unoptimized
                                    src={getFullImagePath(shop.logoUrl)}
                                    alt={`${shop.name} logo`}
                                    fill
                                    className="object-cover"
                                 />
                              </div>
                           </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <span className="text-[8px] font-black text-emerald-500 uppercase bg-emerald-50 px-2 py-1 rounded-lg">{(shop as any).specialty || 'General'}</span>
                         <h4 className="text-sm font-black text-slate-900 mt-2 truncate uppercase">{shop.name}</h4>
                         <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">{shop.city?.name}</p>
                         
                         <div className="flex gap-4 mt-6">
                            <a href={`https://wa.me/${shop.whatsapp}`} target="_blank" className="flex-1 bg-emerald-500 text-white h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                               <Phone size={14} /> WhatsApp
                            </a>
                            <Link href={`/taller/${shop.id}`} className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-all">
                               <ChevronRight size={18} />
                            </Link>
                         </div>
                      </div>
                   </div>
                </div>
              ))}

              {workshops.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-center opacity-40">
                  <Zap size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest mt-4">No se encontraron talleres</p>
                </div>
              )}
           </div>
        </div>
      )}

      {/* --- MODAL: Country Selection --- */}
      {showCountryModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 animate-in fade-in duration-300"
        >
          <div
            className="bg-white rounded-[3rem] p-10 md:p-14 max-w-2xl w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -translate-y-32 translate-x-32" />

            <header className="relative mb-10 text-center">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                <Globe size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Personaliza tu vista</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 italic leading-none">
                Selecciona tu país para mostrarte resultados relevantes
              </p>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative">
              {countries.map((country) => (
                <button
                  key={country.id}
                  onClick={() => handleCountrySelect(country)}
                  className="p-4 rounded-[2rem] border-2 border-slate-50 bg-slate-50/50 hover:bg-white hover:border-emerald-500 hover:shadow-xl transition-all group flex flex-col items-center gap-3 text-center"
                >
                  <div className="w-14 h-14 mb-3">
                    {country.flag ? (
                      country.flag.startsWith('http') || country.flag.startsWith('/') ? (
                        <img src={country.flag} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <p className='h-full text-4xl'>{country.flag}</p>
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-100">
                        <Globe size={24} />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{country.name}</span>
                </button>
              ))}
            </div>

            <p className="mt-10 text-[9px] font-bold text-slate-300 uppercase text-center tracking-widest italic">
              Usamos tu ubicación para mejorar los tiempos de respuesta y filtros rápidos.
            </p>
          </div>
        </div>
      )}

      {/* --- MODAL: Mobile Menu (Sidebar links) --- */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-[120] flex items-center justify-start lg:hidden" onClick={() => setShowMobileMenu(false)}>
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" />
           <div className="bg-white h-full w-[80%] max-w-[280px] rounded-r-[2.5rem] p-8 shadow-2xl relative animate-in slide-in-from-left-10 duration-500 flex flex-col" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="absolute top-8 right-6 w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"
              >
                <X size={18} />
              </button>

              <div className="mt-4 mb-10">
                 <div className="bg-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-xl shadow-emerald-500/20">
                    <Wrench size={24} />
                 </div>
                 <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">Talleres <br /> Mecánicos</h2>
              </div>

              <div className="flex-1 space-y-3">
                 <Link href="/dashboard" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl group active:scale-95 transition-all">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500">
                       <LayoutGrid size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Mi Dashboard</span>
                 </Link>

                 <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl group active:scale-95 transition-all outline outline-emerald-100">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md text-white">
                       <Navigation size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Explorar Mapa</span>
                 </div>

                 <Link href="/comunidad" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl group active:scale-95 transition-all">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500">
                       <MessageCircle size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Comunidad</span>
                 </Link>
              </div>

              <div className="pt-8 border-t border-slate-100 scale-90 origin-left">
                 <ProfileTile />
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default function DirectoryClient(props: DirectoryClientProps) {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <DirectoryContent {...props} />
    </Suspense>
  );
}
