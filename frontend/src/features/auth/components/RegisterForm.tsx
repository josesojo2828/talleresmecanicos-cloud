"use client";

import { useState } from "react";
import Link from "next/link";
// Importes necesarios para react-hook-form
import { useForm } from "react-hook-form"; 
import { useTranslations } from "next-intl";
import { User, Wrench, ArrowLeft } from "lucide-react";

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
    const [step, setStep] = useState(0); // 0: Selección de Rol, 1: Detalles del Formulario
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
            role: null as 'CLIENT' | 'TALLER' | null,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            country: "", // Valor para el AutocompleteInput de País
            city: "",    // Valor para el AutocompleteInput de Ciudad
            acceptTerms: false
        }
    });

    // --- VIGILANCIA DE VALORES (WATCHING) ---
    // Usamos watch para reaccionar a cambios en tiempo real sin re-renders innecesarios de todo el form
    const password = watch("password");
    
    // CRÍTICO: Vigilamos el país seleccionado para pasárselo como dependencia a la ciudad
    const selectedCountryId = watch("country"); 

    const passwordStrength = password ? getPasswordStrength(password) : null;

    // --- MANEJADOR DE ENVÍO (SUBMIT) ---
    // handleSubmit de react-hook-form nos provee los datos ya recolectados
    const onSubmit = async (data: any) => {
        if (!data.role) return; // Validación extra de seguridad
        // Enviamos todo el objeto data (incluyendo country y city) a tu hook de registro
        await handleRegister(data);
    };

    // --- RENDERIZADO: PASO 0 (SELECCIÓN DE ROL) ---
    if (step === 0) {
        return (
            <div className="space-y-8 mt-8 flex flex-col items-center animation-fade-in">
                <Typography variant="H4" className="text-center font-bold text-slate-800">
                    {t("role_selection")}
                </Typography>

                <div className="grid grid-cols-1 gap-4 w-full">
                    {/* Botón Rol CLIENTE */}
                    <button
                        type="button"
                        onClick={() => { 
                            // Seteamos el valor en react-hook-form y avanzamos
                            setValue('role', 'CLIENT'); 
                            setStep(1); 
                        }}
                        className="group p-6 border-2 border-slate-100 rounded-3xl text-left transition-all hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-primary/10 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                <User size={28} />
                            </div>
                            <div className="flex-1">
                                <Typography variant="P" className="font-black text-slate-700 group-hover:text-primary transition-colors text-lg">{t("role_client")}</Typography>
                                <Typography variant="P" className="text-sm text-slate-400 group-hover:text-slate-500 transition-colors leading-tight">{t("role_client_desc")}</Typography>
                            </div>
                        </div>
                    </button>

                    {/* Botón Rol TALLER */}
                    <button
                        type="button"
                        onClick={() => { 
                            setValue('role', 'TALLER'); 
                            setStep(1); 
                        }}
                        className="group p-6 border-2 border-slate-100 rounded-3xl text-left transition-all hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-primary/10 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                <Wrench size={28} />
                            </div>
                            <div className="flex-1">
                                <Typography variant="P" className="font-black text-slate-700 group-hover:text-primary transition-colors text-lg">{t("role_workshop")}</Typography>
                                <Typography variant="P" className="text-sm text-slate-400 group-hover:text-slate-500 transition-colors leading-tight">{t("role_workshop_desc")}</Typography>
                            </div>
                        </div>
                    </button>
                </div>

                <p className="text-center mt-4">
                    <Typography variant="P" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        {t("has_account")}{" "}
                        <Link href="/login" className="text-primary hover:text-primary-600 transition-colors font-black">
                            {t("login")}
                        </Link>
                    </Typography>
                </p>
            </div>
        );
    }

    // --- RENDERIZADO: PASO 1 (FORMULARIO DETALLADO) ---
    return (
        // Usamos handleSubmit para envolver tu onSubmit
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6 animation-fade-in">
            {/* Botón Volver */}
            <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors group"
                disabled={isLoading}
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Volver
            </button>

            {/* Error Global (Backend) */}
            {error && (
                <div role="alert" className="alert alert-error text-sm rounded-xl shadow-inner text-white font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Campos de Nombre y Apellido (Grid) */}
            <div className="grid grid-cols-2 gap-4">
                {/* Asumimos que FormField funciona como input controlado vía value/onChange */}
                <FormField
                    label={t("firstName")}
                    placeholder="Juan"
                    value={watch("firstName")}
                    onChange={(e) => setValue("firstName", e.target.value)}
                    // Mostramos errores del backend preferentemente, o del cliente si existen
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

            {/* Campo Email */}
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

            {/* Campo Contraseña y Fuerza */}
            <div className="space-y-2">
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

                {/* Indicador de Fuerza de Contraseña (UI) */}
                {password && passwordStrength && (
                    <div className="space-y-2 px-1 animation-slide-down">
                        <div className="flex gap-1.5">
                            {/* Barra 1 */}
                            <div className={cn(
                                "h-1 flex-1 rounded-full bg-slate-100 transition-all duration-500", 
                                passwordStrength.percentage >= 33 && (
                                    passwordStrength.level === "weak" ? "bg-error shadow-sm shadow-error/20" : 
                                    passwordStrength.level === "medium" ? "bg-warning shadow-sm shadow-warning/20" : 
                                    "bg-primary shadow-sm shadow-primary/20"
                                )
                            )}></div>
                            {/* Barra 2 */}
                            <div className={cn(
                                "h-1 flex-1 rounded-full bg-slate-100 transition-all duration-500", 
                                passwordStrength.percentage >= 66 && (
                                    passwordStrength.level === "medium" ? "bg-warning shadow-sm shadow-warning/20" : 
                                    "bg-primary shadow-sm shadow-primary/20"
                                )
                            )}></div>
                            {/* Barra 3 */}
                            <div className={cn(
                                "h-1 flex-1 rounded-full bg-slate-100 transition-all duration-500", 
                                passwordStrength.percentage >= 90 && "bg-primary shadow-sm shadow-primary/20"
                            )}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Campo Confirmar Contraseña */}
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

            {/* --- SECCIÓN DE UBICACIÓN (AUTOCOMPLETE INPUTS) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
                {/* Selector de País */}
                <div className="space-y-1.5">
                    <Typography variant="P" className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">País</Typography>
                    <AutocompleteInput
                        // Pasamos el objeto control de useForm obligatoriamente
                        control={control}
                        // Definimos la configuración del campo
                        field={{
                            name: "country", // Nombre del campo en el JSON final
                            placeholder: "Selecciona tu país",
                            remote: { 
                                slug: "COUNTRY" // Slug para la API final: /app/select/COUNTRY
                            },
                            validation: { 
                                required: "Seleccionar país es obligatorio" 
                            },
                        } as any} // 'as any' si hay conflictos estrictos de tipado con FormField
                    />
                </div>

                {/* Selector de Ciudad (DEPENDIENTE) */}
                <div className="space-y-1.5">
                    <Typography variant="P" className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Ciudad</Typography>
                    <AutocompleteInput
                        control={control}
                        // CRÍTICO: Pasamos el ID del país vigilado. 
                        // AutocompleteInput reaccionará cuando este ID cambie.
                        parentId={selectedCountryId} 
                        field={{
                            name: "city",
                            placeholder: "Selecciona tu ciudad",
                            remote: { 
                                slug: "CITY", // Slug para la API final: /app/select/CITY
                                dependsOn: "country" // Indica lógicamente que depende del campo 'country'
                            },
                            validation: { 
                                required: "Seleccionar ciudad es obligatorio" 
                            },
                        } as any}
                    />
                </div>
            </div>

            {/* Términos y Condiciones */}
            <div className="space-y-2 px-1">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                        type="checkbox"
                        // Sincronizado con react-hook-form
                        checked={watch("acceptTerms")}
                        onChange={(e) => setValue("acceptTerms", e.target.checked)}
                        className="checkbox checkbox-primary checkbox-xs mt-0.5 border-slate-200 bg-white transition-all group-hover:border-primary/50"
                        disabled={isLoading}
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors leading-tight">
                        {t.rich("terms", {
                            terms: () => <Link href="/terminos" target="_blank" className="text-primary hover:text-primary-600 font-black decoration-dotted underline underline-offset-2">{t("terms_link")}</Link>,
                            privacy: () => <Link href="/privacidad" target="_blank" className="text-primary hover:text-primary-600 font-black decoration-dotted underline underline-offset-2">{t("privacy_link")}</Link>
                        })}
                    </span>
                </label>
                {/* Error de términos del backend o cliente */}
                {(fieldErrors.acceptTerms || formErrors.acceptTerms) && (
                    <p className="text-[10px] text-error font-black uppercase tracking-widest px-1 animation-fade-in">
                        {fieldErrors.acceptTerms || "Debes aceptar los términos"}
                    </p>
                )}
            </div>

            {/* Botón de Envío */}
            <Button
                type="submit"
                variant="PRIMARY"
                size="LG"
                className="w-full h-14 rounded-2xl group shadow-lg shadow-primary/10 active:scale-[0.99] transition-all"
                isLoading={isLoading}
                disabled={isLoading}
            >
                <span className="flex items-center gap-2.5">
                    {isLoading ? t("loading") : t("button")}
                    {!isLoading && <div className="w-1.5 h-1.5 rounded-full bg-white/80 group-hover:scale-150 transition-transform duration-300" />}
                </span>
            </Button>
        </form>
    );
};
