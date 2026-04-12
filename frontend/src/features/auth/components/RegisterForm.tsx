"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form"; 
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { User, Wrench, ArrowLeft, ArrowRight, CheckCircle2, Mail, Lock, Briefcase, Map as MapIcon } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { FormField } from "./FormField"; // Asumimos que este componente existe y funciona
import { useRegister } from "../hooks/useRegister";
import { getPasswordStrength } from "../utils/validation";
// Asegúrate de que esta ruta de importación sea correcta
import { cn } from "@/utils/cn";
import { AutocompleteInput } from "@/features/dashboard/components/AutocompleteInput";

export const RegisterForm = () => {
    const t = useTranslations("auth.register");
    const searchParams = useSearchParams();
    const urlRole = searchParams.get("role")?.toUpperCase();

    const [step, setStep] = useState(1); 
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Hook personalizado para el registro (asumimos que maneja la lógica de API final)
    const { handleRegister, isLoading, error, fieldErrors } = useRegister();

    // --- CONFIGURACIÓN DE REACT HOOK FORM ---
    const { 
        control, 
        handleSubmit, 
        watch, 
        setValue, 
        formState: { errors: formErrors } // Errores de validación del lado del cliente
    } = useForm({
        // Definimos valores por defecto para todos los campos
        defaultValues: {
            role: (urlRole === 'TALLER' || urlRole === 'CLIENT' ? urlRole : 'CLIENT') as 'CLIENT' | 'TALLER' | null,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            country: "", // Valor para el AutocompleteInput de País
            city: "",    // Valor para el AutocompleteInput de Ciudad
            workshopName: "",
            workshopAddress: "",
            acceptTerms: false
        }
    });

    const password = watch("password");
    const selectedCountryId = watch("country"); 
    const currentRole = watch("role");

    const passwordStrength = password ? getPasswordStrength(password) : null;

    // --- LOGICA DE PASOS ---
    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const isStep1Valid = !!currentRole;
    const isStep2Valid = watch("firstName") && watch("lastName") && watch("email") && watch("password") && watch("confirmPassword") && (watch("password") === watch("confirmPassword"));

    // --- MANEJADOR DE ENVÍO (SUBMIT) ---
    const onSubmit = async (data: any) => {
        console.log("🚀 Submit Iniciado con datos:", data);
        if (!data.role) return; 
        await handleRegister(data);
    };

    const onError = (errors: any) => {
        console.error("❌ Errores de validación en el Formulario:", errors);
    };

    return (
        <div className="w-full space-y-8">
            {/* --- INDICADOR DE PROGRESO PREMIUM --- */}
            <div className="flex items-center justify-between mb-8 px-2 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500 ease-out" 
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
                
                {[1, 2, 3].map((s) => (
                    <div 
                        key={s} 
                        className={cn(
                            "relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500",
                            step === s ? "bg-emerald-500 text-white scale-125 shadow-lg shadow-emerald-500/20" : 
                            step > s ? "bg-emerald-500 text-white" : "bg-white border-2 border-slate-100 text-slate-300"
                        )}
                    >
                        {step > s ? <CheckCircle2 size={14} /> : s}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6 text-left">
                {/* Error Global (Backend) */}
                {error && (
                    <div role="alert" className="alert alert-error text-sm rounded-xl shadow-inner text-white font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* --- PASO 1: SELECCIÓN DE PERFIL --- */}
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Primer Paso</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t("role_selection") || "Selecciona tu perfil de usuario"}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                type="button"
                                onClick={() => { setValue("role", 'CLIENT'); nextStep(); }}
                                className={cn(
                                    "flex items-center gap-6 p-6 border-2 rounded-[2rem] transition-all duration-300 group relative overflow-hidden text-left",
                                    watch("role") === 'CLIENT' 
                                        ? "border-emerald-500 bg-emerald-50/50" 
                                        : "border-slate-50 bg-slate-50/30 hover:border-slate-200"
                                )}
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0",
                                    watch("role") === 'CLIENT' ? "bg-emerald-500 text-white scale-110" : "bg-white text-slate-400 group-hover:text-emerald-500 shadow-sm"
                                )}>
                                    <User size={28} />
                                </div>
                                <div className="space-y-1">
                                    <span className={cn("text-xs font-black uppercase tracking-widest block transition-colors", watch("role") === 'CLIENT' ? "text-emerald-600" : "text-slate-600")}>
                                        {t("role_client") || "Soy Cliente"}
                                    </span>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Busco talleres para reparar mi vehículo</p>
                                </div>
                                <div className="ml-auto">
                                    <ArrowRight size={18} className={cn("transition-all", watch("role") === 'CLIENT' ? "text-emerald-500 translate-x-1" : "text-slate-200")} />
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => { setValue("role", 'TALLER'); nextStep(); }}
                                className={cn(
                                    "flex items-center gap-6 p-6 border-2 rounded-[2rem] transition-all duration-300 group relative overflow-hidden text-left",
                                    watch("role") === 'TALLER' 
                                        ? "border-emerald-500 bg-emerald-50/50" 
                                        : "border-slate-50 bg-slate-50/30 hover:border-slate-200"
                                )}
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0",
                                    watch("role") === 'TALLER' ? "bg-emerald-500 text-white scale-110" : "bg-white text-slate-400 group-hover:text-emerald-500 shadow-sm"
                                )}>
                                    <Wrench size={28} />
                                </div>
                                <div className="space-y-1">
                                    <span className={cn("text-xs font-black uppercase tracking-widest block transition-colors", watch("role") === 'TALLER' ? "text-emerald-600" : "text-slate-600")}>
                                        {t("role_workshop") || "Soy Taller"}
                                    </span>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Quiero gestionar mi negocio y recibir clientes</p>
                                </div>
                                <div className="ml-auto">
                                    <ArrowRight size={18} className={cn("transition-all", watch("role") === 'TALLER' ? "text-emerald-500 translate-x-1" : "text-slate-200")} />
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* --- PASO 2: CREDENCIALES --- */}
                {step === 2 && (
                    <div className="space-y-6 animate-slide-up">
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Tu Cuenta</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Información básica para acceder</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label={t("firstName")}
                                placeholder="Juan"
                                value={watch("firstName")}
                                onChange={(e) => setValue("firstName", e.target.value)}
                                error={fieldErrors.firstName || formErrors.firstName?.message}
                                icon="user"
                                disabled={isLoading}
                                required
                            />
                            <FormField
                                label={t("lastName")}
                                placeholder="Pérez"
                                value={watch("lastName")}
                                onChange={(e) => setValue("lastName", e.target.value)}
                                error={fieldErrors.lastName || formErrors.lastName?.message}
                                icon="user"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <FormField
                            label={t("email")}
                            type="email"
                            placeholder="tu@email.com"
                            value={watch("email")}
                            onChange={(e) => setValue("email", e.target.value)}
                            error={fieldErrors.email || formErrors.email?.message}
                            icon="mail"
                            disabled={isLoading}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label={t("password")}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={watch("password")}
                                onChange={(e) => setValue("password", e.target.value)}
                                error={fieldErrors.password || formErrors.password?.message}
                                icon="lock"
                                showPasswordToggle
                                showPassword={showPassword}
                                onTogglePassword={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                                required
                            />
                            <FormField
                                label={t("confirm")}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={watch("confirmPassword")}
                                onChange={(e) => setValue("confirmPassword", e.target.value)}
                                error={fieldErrors.confirmPassword || formErrors.confirmPassword?.message}
                                icon="lock"
                                showPasswordToggle
                                showPassword={showConfirmPassword}
                                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="button" variant="GHOST" className="flex-1" onClick={prevStep}>Atrás</Button>
                            <Button type="button" variant="PRIMARY" className="flex-1" onClick={nextStep} disabled={!isStep2Valid}>Continuar</Button>
                        </div>
                    </div>
                )}

                {/* --- PASO 3: DETALLES Y UBICACIÓN --- */}
                {step === 3 && (
                    <div className="space-y-6 animate-slide-up">
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Finalizando</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Ubicanos tu posición en el mapa</p>
                        </div>

                        {/* Campos de Taller (Solo si es taller) */}
                        {watch("role") === 'TALLER' && (
                            <div className="space-y-4 bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-100">
                                <Typography variant="P" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 px-1 italic">Datos Comerciales</Typography>
                                
                                <FormField
                                    label="Nombre del Taller"
                                    placeholder="Ej: Mario Motors"
                                    value={watch("workshopName")}
                                    onChange={(e) => setValue("workshopName", e.target.value)}
                                    error={fieldErrors.workshopName || formErrors.workshopName?.message}
                                    icon="briefcase"
                                    className="bg-white"
                                    disabled={isLoading}
                                />

                                <FormField
                                    label="Dirección"
                                    placeholder="Calle principal..."
                                    value={watch("workshopAddress")}
                                    onChange={(e) => setValue("workshopAddress", e.target.value)}
                                    error={fieldErrors.workshopAddress || formErrors.workshopAddress?.message}
                                    icon="map"
                                    className="bg-white"
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Typography variant="P" className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">País</Typography>
                                <AutocompleteInput
                                    control={control}
                                    field={{
                                        name: "country",
                                        placeholder: "Seleccioná país",
                                        remote: { slug: "COUNTRY", filters: { enabled: true } },
                                        validation: { required: "Elegí tu país" },
                                    } as any}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Typography variant="P" className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Ciudad</Typography>
                                <AutocompleteInput
                                    control={control}
                                    parentId={selectedCountryId} 
                                    field={{
                                        name: "city",
                                        placeholder: "Elegí ciudad",
                                        remote: { slug: "CITY", dependsOn: "country", filters: { enabled: true } },
                                        validation: { required: "Elegí tu ciudad" },
                                    } as any}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <label className="flex items-center gap-3 cursor-pointer group px-1">
                                <input
                                    type="checkbox"
                                    checked={watch("acceptTerms")}
                                    onChange={(e) => setValue("acceptTerms", e.target.checked)}
                                    className="checkbox checkbox-emerald border-slate-200"
                                    disabled={isLoading}
                                />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
                                    {t.rich("terms", {
                                        terms: () => <Link href="/terminos" target="_blank" className="text-emerald-600 underline font-black">{t("terms_link")}</Link>,
                                        privacy: () => <Link href="/privacidad" target="_blank" className="text-emerald-600 underline font-black">{t("privacy_link")}</Link>
                                    })}
                                </span>
                            </label>

                            <div className="flex gap-4">
                                <Button type="button" variant="GHOST" className="flex-1" onClick={prevStep} disabled={isLoading}>Atrás</Button>
                                <Button 
                                    type="submit" 
                                    variant="PRIMARY" 
                                    className="flex-[2] h-14 rounded-2xl shadow-xl shadow-emerald-500/20" 
                                    isLoading={isLoading} 
                                    disabled={isLoading || !watch("acceptTerms")}
                                >
                                    ¡LISTO, EMPECEMOS!
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

