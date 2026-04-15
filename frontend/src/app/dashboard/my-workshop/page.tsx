"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
    Wrench, MapPin, Phone, Globe, Clock,
    Save, CheckCircle, AlertCircle, Trash2,
    Instagram, Facebook, Twitter, Plus,
    ChevronRight, Camera, Image as ImageIcon,
    Layout, Smartphone, Info,
    Tag
} from "lucide-react";
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/useAuthStore";
import { useAlertStore } from "@/store/useAlertStore";
import { getFullImagePath } from "@/utils/image";
import { LocationPicker } from "@/features/dashboard/components/LocationPicker";

const DAYS = [
    { key: "monday", label: "Lunes" },
    { key: "tuesday", label: "Martes" },
    { key: "wednesday", label: "Miércoles" },
    { key: "thursday", label: "Jueves" },
    { key: "friday", label: "Viernes" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" }
];

interface ScheduleDay {
    enabled: boolean;
    open: string;
    close: string;
}

interface WorkshopFormData {
    name: string;
    description: string;
    address: string;
    phone: string;
    whatsapp: string;
    website: string;
    latitude: number;
    longitude: number;
    socialMedia: {
        instagram: string;
        facebook: string;
        twitter: string;
    };
    openingHours: Record<string, ScheduleDay>;
    categoryIds: string[];
    countryId: string;
    cityId: string;
}

export default function MyWorkshopPage() {
    const t = useTranslations();
    const [workshop, setWorkshop] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    // Images state
    const [logo, setLogo] = useState<File | null>(null);
    const [showcaseImages, setShowcaseImages] = useState<(File | string)[]>([]);

    const { register, handleSubmit, control, setValue, watch, reset } = useForm<WorkshopFormData>();
    const selectedCountryId = watch("countryId");

    const fetchWorkshop = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/my-workshop');
            const data = res.data?.body?.data?.[0] || res.data?.data?.[0] || res.data?.[0];

            if (data) {
                setWorkshop(data);

                // Parse openingHours safely
                let parsedHours = {};
                try {
                    parsedHours = typeof data.openingHours === 'string' ? JSON.parse(data.openingHours) : (data.openingHours || {});
                } catch (e) {
                    parsedHours = {};
                }

                // Default empty state for all days
                const finalHours: any = {};
                DAYS.forEach(d => {
                    finalHours[d.key] = (parsedHours as any)[d.key] || { enabled: false, open: "08:00", close: "18:00" };
                });

                reset({
                    name: data.name,
                    description: data.description || "",
                    address: data.address || "",
                    phone: data.phone || "",
                    whatsapp: data.whatsapp || "",
                    website: data.website || "",
                    latitude: data.latitude,
                    longitude: data.longitude,
                    socialMedia: data.socialMedia || { instagram: "", facebook: "", twitter: "" },
                    openingHours: finalHours,
                    categoryIds: data.categories ? data.categories.map((c: any) => c.id) || [] : [],
                    countryId: data.countryId || "",
                    cityId: data.cityId || ""
                });

                if (data.images) setShowcaseImages(data.images);
            }
        } catch (error) {
            console.error("Error fetching workshop:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await apiClient.get('/app/select/WORKSHOP_CATEGORY');
            setCategories(res.data?.body || res.data || []);
        } catch (e) { console.error(e); }
    }

    const fetchCountries = async () => {
        try {
            const res = await apiClient.get('/app/select/COUNTRY');
            setCountries(res.data?.body || res.data || []);
        } catch (e) { console.error(e); }
    }

    const fetchCities = async (parentId?: string) => {
        try {
            const res = await apiClient.get('/app/select/CITY', { params: { parentId } });
            setCities(res.data?.body || res.data || []);
        } catch (e) { console.error(e); }
    }

    useEffect(() => {
        fetchWorkshop();
        fetchCategories();
        fetchCountries();
    }, []);

    useEffect(() => {
        if (selectedCountryId) {
            fetchCities(selectedCountryId);
        } else {
            setCities([]);
        }
    }, [selectedCountryId]);

    const onSubmit = async (data: WorkshopFormData) => {
        try {
            setIsSaving(true);

            let logoKey = workshop.logoKey || workshop.logoUrl;
            // Solo limpiamos si es una URL externa (http)
            if (logoKey && typeof logoKey === 'string' && logoKey.startsWith('http')) {
                logoKey = logoKey.split('/').pop() || logoKey;
            }

            // 1. Upload Logo if changed
            if (logo) {
                const formData = new FormData();
                formData.append('file', logo);
                const res = await apiClient.post('/my-workshop/upload-logo', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                logoKey = (res.data?.body?.key || res.data?.key);
            }

            // 2. Handle Showcase Images
            const newFileImages = showcaseImages.filter(img => img instanceof File) as File[];
            
            // Retener las imágenes que ya son strings (viejas)
            const retainedKeys = showcaseImages
                .filter(img => typeof img === 'string')
                .map(img => {
                    const str = img as string;
                    // Solo limpiamos si es una URL externa (http)
                    // Si es un path relativo (como workshops/images/...) lo mantenemos íntegro
                    if (str.startsWith('http')) {
                        return str.split('/').pop() || str;
                    }
                    return str;
                })
                .filter(Boolean);

            let newlyUploadedKeys: string[] = [];
            if (newFileImages.length > 0) {
                const formData = new FormData();
                newFileImages.forEach(file => formData.append('files', file));
                const res = await apiClient.post('/my-workshop/upload-images', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const uploadResults = res.data?.body || res.data;
                newlyUploadedKeys = Array.isArray(uploadResults)
                    ? uploadResults.map((r: any) => r.key)
                    : [uploadResults.key].filter(Boolean);
            }

            const finalImageKeys = [...retainedKeys, ...newlyUploadedKeys];

            // 3. Prepare final body
            const body = {
                ...data,
                openingHours: JSON.stringify(data.openingHours),
                logoUrl: logoKey,
                images: finalImageKeys
            };

            await apiClient.put(`/my-workshop/${workshop.id}`, body);
            await fetchWorkshop();
            setLogo(null);
            useAlertStore.getState().addAlert("¡Cambios guardados con éxito!", "success");
        } catch (error) {
            console.error("Error updating workshop:", error);
            useAlertStore.getState().addAlert("Error al guardar los cambios.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'showcase') => {
        const files = e.target.files;
        if (!files) return;

        if (type === 'logo') {
            setLogo(files[0]);
        } else {
            const newImages = Array.from(files);
            const totalImages = showcaseImages.length + newImages.length;
            if (totalImages > 5) {
                useAlertStore.getState().addAlert("Máximo 5 imágenes permitidas.", "warning");
                const available = 5 - showcaseImages.length;
                setShowcaseImages([...showcaseImages, ...newImages.slice(0, available)]);
            } else {
                setShowcaseImages([...showcaseImages, ...newImages]);
            }
        }
    }

    const removeImage = (index: number) => {
        setShowcaseImages(showcaseImages.filter((_, i) => i !== index));
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preparando Panel Administrativo...</p>
            </div>
        );
    }

    if (!workshop) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4 text-center">
                <AlertCircle size={48} className="text-rose-500" />
                <h2 className="text-xl font-black uppercase text-slate-900">No se encontró información del taller</h2>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 max-w-sm">
                    Inicie sesión nuevamente o comuníquese con soporte para inicializar su perfil.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Admin Header */}
            <div className="flex items-center justify-between mb-10 px-4 md:px-0">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
                        Gestión de Taller
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2 italic">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Configuración de perfil administrativo
                    </p>
                </div>

                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSaving}
                    className={cn(
                        "group relative px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 disabled:opacity-50",
                        isSaving && "pl-12"
                    )}
                >
                    {isSaving && <Clock className="w-4 h-4 animate-spin absolute left-6 top-1/2 -translate-y-1/2" />}
                    <span className="flex items-center gap-2">
                        <Save size={16} className="group-hover:translate-x-1 transition-transform" />
                        Guardar Cambios
                    </span>
                </button>
            </div>

            <form className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Main Column */}
                <div className="xl:col-span-8 space-y-8">

                    {/* Sección: Información General */}
                    <div className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-sm relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -translate-y-20 translate-x-20 transition-transform duration-700 group-hover:scale-110" />

                        <header className="flex items-center gap-3 mb-8 relative">
                            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <Info size={20} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 italic">Identidad Corporativa</h3>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 italic leading-none">Nombre comercial</label>
                                <input {...register("name")} className="input w-full bg-slate-50 border-transparent focus:bg-white" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 italic leading-none">Descripción del servicio</label>
                                <textarea {...register("description")} className="textarea w-full bg-slate-50 border-transparent focus:bg-white min-h-[120px]" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 italic leading-none">Dirección física</label>
                                <input {...register("address")} className="input w-full bg-slate-50 border-transparent focus:bg-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 italic leading-none">País</label>
                                <select {...register("countryId")} className="select w-full bg-slate-50 border-transparent focus:bg-white text-xs font-bold">
                                    <option value="">Seleccionar País...</option>
                                    {countries.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 italic leading-none">Ciudad</label>
                                <select {...register("cityId")} className="select w-full bg-slate-50 border-transparent focus:bg-white text-xs font-bold" disabled={!selectedCountryId}>
                                    <option value="">Seleccionar Ciudad...</option>
                                    {cities.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Sección: Especialidades */}
                    <div className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-sm">
                        <header className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                <Tag size={20} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 italic">Especialidades del Taller</h3>
                        </header>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {categories && categories.length > 0 && categories.map((cat) => (
                                <label key={cat.id} className={cn(
                                    "flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer hover:bg-slate-50",
                                    (watch("categoryIds") || []).includes(cat.id)
                                        ? "bg-purple-50 border-purple-200 text-purple-700 font-bold"
                                        : "border-slate-100 text-slate-500"
                                )}>
                                    <input
                                        type="checkbox"
                                        value={cat.id}
                                        checked={(watch("categoryIds") || []).includes(cat.id)}
                                        className="checkbox checkbox-primary checkbox-sm border-slate-300"
                                        onChange={(e) => {
                                            const current = watch("categoryIds") || [];
                                            if (e.target.checked) {
                                                setValue("categoryIds", [...current, cat.id]);
                                            } else {
                                                setValue("categoryIds", current.filter(id => id !== cat.id));
                                            }
                                        }}
                                    />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{cat.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sección: Ubicación Geográfica (Mapa) */}
                    <div className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <header className="flex items-center gap-3 mb-8 relative">
                            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                                <MapPin size={20} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 italic">Coordenadas de la Sede</h3>
                        </header>
                        <div className="w-full h-[400px] rounded-[2rem] overflow-hidden border-2 border-slate-100">
                             <Controller
                                 name="latitude"
                                 control={control}
                                 render={({ field: latField }) => (
                                     <Controller
                                         name="longitude"
                                         control={control}
                                         render={({ field: lngField }) => (
                                             <LocationPicker 
                                                 value={{ lat: Number(latField.value) || 0, lng: Number(lngField.value) || 0 }}
                                                 onChange={(loc) => {
                                                     latField.onChange(loc.lat);
                                                     lngField.onChange(loc.lng);
                                                 }}
                                             />
                                         )}
                                     />
                                 )}
                             />
                        </div>
                    </div>

                    {/* Sección: Horarios Detallados */}
                    <div className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-sm">
                        <header className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 italic">Calendario Operativo</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Configura las horas de atención por día</p>
                            </div>
                        </header>

                        <div className="space-y-4">
                            {DAYS.map((day) => (
                                <div key={day.key} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-3xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-sm hover:border-slate-100 transition-all">
                                    <div className="flex items-center gap-4 w-full sm:w-40">
                                        <Controller
                                            name={`openingHours.${day.key}.enabled`}
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type="checkbox"
                                                    className="toggle toggle-primary toggle-sm"
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                            )}
                                        />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">{day.label}</span>
                                    </div>

                                    <div className={cn(
                                        "flex-1 flex items-center justify-end gap-3 transition-opacity duration-300",
                                        !watch(`openingHours.${day.key}.enabled`) && "opacity-20 pointer-events-none"
                                    )}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black opacity-30 uppercase italic">Apertura</span>
                                            <input type="time" {...register(`openingHours.${day.key}.open`)} className="input input-sm border-none bg-white text-xs font-bold w-32" />
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black opacity-30 uppercase italic">Cierre</span>
                                            <input type="time" {...register(`openingHours.${day.key}.close`)} className="input input-sm border-none bg-white text-xs font-bold w-32" />
                                        </div>
                                    </div>

                                    {!watch(`openingHours.${day.key}.enabled`) && (
                                        <span className="absolute right-8 text-[9px] font-black text-slate-300 uppercase italic tracking-tighter">Cerrado</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="xl:col-span-4 space-y-8">

                    {/* Branding: Logo & Images */}
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-16 translate-x-16" />

                        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-8 flex items-center gap-2 italic">
                            <Camera size={16} /> Identidad Visual
                        </h3>

                        {/* Logo Upload */}
                        <div className="mb-8 text-center group">
                            <div className="relative inline-block">
                                <div className="w-28 h-28 bg-white/5 rounded-[2rem] border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 transition-all overflow-hidden relative">
                                    {logo ? (
                                        <img src={URL.createObjectURL(logo)} className="w-full h-full object-cover" />
                                    ) : workshop.logoUrl ? (
                                        <img 
                                            src={getFullImagePath(workshop.logoUrl)} 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <>
                                            <Plus size={24} className="text-white/40 mb-1" />
                                            <span className="text-[8px] font-black uppercase tracking-tighter text-white/40">Logo</span>
                                        </>
                                    )}
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'logo')} />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <ImageIcon size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Showcase Images (Max 5) */}
                        <div className="space-y-4">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-4 italic">Galería de fotos (Máx. 5)</p>
                            <div className="grid grid-cols-3 gap-3">
                                {showcaseImages.map((img, idx) => (
                                    <div key={idx} className="aspect-square bg-white/5 rounded-2xl overflow-hidden relative group">
                                        <img
                                            src={
                                                typeof img !== 'string' 
                                                    ? URL.createObjectURL(img) 
                                                    : getFullImagePath(img)
                                            }
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute inset-0 bg-rose-500/80 items-center justify-center hidden group-hover:flex transition-all"
                                        >
                                            <Trash2 size={20} className="text-white" />
                                        </button>
                                    </div>
                                ))}
                                {showcaseImages.length < 5 && (
                                    <label className="aspect-square bg-white/10 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all hover:border-emerald-400">
                                        <Plus size={24} className="text-white/20" />
                                        <input type="file" className="hidden" multiple onChange={(e) => handleFileChange(e, 'showcase')} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact & Social */}
                    <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 italic flex items-center gap-2">
                                <Smartphone size={14} /> Canales Digitales
                            </h3>
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                                        <Instagram size={14} className="text-rose-500" />
                                    </div>
                                    <input {...register("socialMedia.instagram")} placeholder="@instagram" className="input bg-slate-50 w-full pl-10 text-xs border-transparent focus:bg-white" />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                                        <Facebook size={14} className="text-blue-600" />
                                    </div>
                                    <input {...register("socialMedia.facebook")} placeholder="URL Facebook" className="input bg-slate-50 w-full pl-10 text-xs border-transparent focus:bg-white" />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                                        <Twitter size={14} className="text-sky-400" />
                                    </div>
                                    <input {...register("socialMedia.twitter")} placeholder="@twitter_x" className="input bg-slate-50 w-full pl-10 text-xs border-transparent focus:bg-white" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic flex items-center gap-2">
                                Ventanillas Directas
                            </h3>
                            <div className="space-y-4">
                                <input {...register("phone")} placeholder="Teléfono" className="input bg-slate-50 w-full text-xs border-transparent focus:bg-white" />
                                <input {...register("whatsapp")} placeholder="WhatsApp" className="input bg-slate-50 w-full text-xs border-transparent focus:bg-white" />
                                <input {...register("website")} placeholder="Sitio Web" className="input bg-slate-50 w-full text-xs border-transparent focus:bg-white" />
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}

