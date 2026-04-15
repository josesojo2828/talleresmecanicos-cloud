"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form"; 
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { User, Wrench, ArrowLeft, ArrowRight, CheckCircle2, Mail, Lock, Briefcase, Map as MapIcon, AlertCircle } from "lucide-react";

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
    // Remover autodetección de rol, forzalo a CLIENTE

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
            role: 'CLIENT' as 'CLIENT' | 'TALLER' | null,
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

    // --- LÓGICA DE ERRORES POR PASO ---
    const getErrorsForStep = (s: number) => {
        if (s === 1) return fieldErrors.role ? [fieldErrors.role] : [];
        if (s === 2) {
            const fields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
            return fields.map(f => fieldErrors[f]).filter(Boolean);
        }
        if (s === 3) {
            const fields = ['country', 'city', 'workshopName', 'workshopAddress', 'acceptTerms'];
            return fields.map(f => fieldErrors[f]).filter(Boolean);
        }
        return [];
    };

    const stepHasErrors = (s: number) => getErrorsForStep(s).length > 0;
    const totalFieldsWithErrors = Object.keys(fieldErrors).length;

    // --- MANEJADOR DE ENVÍO (SUBMIT) ---
    const onSubmit = async (data: any) => {
        console.log("🚀 Submit Iniciado con datos:", data);
        if (!data.role) {
            console.error("Error: No se detectó un rol seleccionado.");
            return;
        } 
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
                            "relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500",
                            step === s ? (stepHasErrors(s) ? "bg-red-500 text-white scale-125 shadow-lg shadow-red-500/20" : "bg-emerald-500 text-white scale-125 shadow-lg shadow-emerald-500/20") : 
                            stepHasErrors(s) ? "bg-red-500 text-white shadow-md animate-pulse" :
                            step > s ? "bg-emerald-500 text-white" : "bg-white border-2 border-slate-100 text-slate-300"
                        )}
                    >
                        {step > s && !stepHasErrors(s) ? <CheckCircle2 size={14} /> : s}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6 text-left">
                {/* --- BANNER DE ERRORES GLOBAL (MEJORADO) --- */}
                {(error || totalFieldsWithErrors > 0) && (
                    <div className="bg-red-50 border-2 border-red-100 p-5 rounded-[2rem] space-y-3 animate-fade-in shadow-sm">
                        <div className="flex items-center gap-3 text-red-600 font-black uppercase tracking-widest text-[10px]">
                             <AlertCircle className="w-4 h-4" />
                             Atención: Revisa los siguientes puntos
                        </div>
                        <div className="space-y-2">
                            {error && <p className="text-xs text-red-700 font-bold">{error}</p>}
                            {totalFieldsWithErrors > 0 && (
                                <ul className="grid grid-cols-1 gap-1">
                                    {Object.entries(fieldErrors).map(([key, msg]) => (
                                        <li key={key} className="text-[10px] text-red-500 font-bold uppercase tracking-tight flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-red-400" />
                                            {msg}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {/* --- PASO 1: INFO INICIAL (Sustituye a selección de rol) --- */}
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="space-y-2 text-center">
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <User size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">¡Bienvenido!</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Estás a un paso de gestionar tus vehículos con la mejor tecnología.</p>
                        </div>
                        
                        <div className="pt-4">
                            <Button 
                                type="button" 
                                variant="PRIMARY" 
                                className="w-full h-14 rounded-2xl shadow-xl shadow-emerald-500/20"
                                onClick={nextStep}
                            >
                                COMENCER EL REGISTRO
                            </Button>
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

                        {/* Solo campos de Cliente/Ubicación */}

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
                                {fieldErrors.country && (
                                    <p className="text-[10px] text-error font-black uppercase tracking-widest mt-1 px-1">
                                        {fieldErrors.country}
                                    </p>
                                )}
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
                                {fieldErrors.city && (
                                    <p className="text-[10px] text-error font-black uppercase tracking-widest mt-1 px-1">
                                        {fieldErrors.city}
                                    </p>
                                )}
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

