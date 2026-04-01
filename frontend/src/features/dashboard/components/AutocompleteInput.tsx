"use client";

import { useEffect, useState } from "react";
import { Controller, Control } from "react-hook-form";
// Asegúrate de que esta ruta a tu apiClient sea correcta
import apiClient from "@/utils/api/api.client"; 
import { cn } from "@/utils/cn";

// He simplificado las interfaces aquí para que sea copy-pasteable,
// asumiendo que FormField y remote vienen estructurados así.
interface FormField {
    name: string;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    remote?: {
        slug: string;
        dependsOn?: string;
    };
    validation?: {
        required?: boolean | string;
    };
}

interface AutocompleteInputProps {
    field: FormField;
    control: Control<any>; // 'any' para compatibilidad genérica con useForm
    parentId?: string | number | null;
}

export function AutocompleteInput({ field, control, parentId }: AutocompleteInputProps) {
    // Inicializamos estrictamente como un array vacío
    const [options, setOptions] = useState<{ id: string; label: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorFetching, setErrorFetching] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            // 1. Validaciones iniciales
            if (!field.remote?.slug) return;

            // 2. Si depende de otro campo y ese campo está vacío, reseteamos opciones y salimos
            if (field.remote.dependsOn && !parentId) {
                setOptions([]);
                return;
            }

            setLoading(true);
            setErrorFetching(false);

            try {
                // Hacemos la petición GET a tu API
                const response = await apiClient.get(`/app/select/${field.remote.slug}`, {
                    params: { parentId } // Enviamos parentId si existe
                });

                // --- PARCHE DE SEGURIDAD CRÍTICO ---
                // Verificamos si response.data.body es REALMENTE un array antes de guardarlo.
                // Si la API devuelve un error (ej. {error: "..."}), Array.isArray será false.
                if (Array.isArray(response.data.body)) {
                    setOptions(response.data.body);
                } else {
                    // Si no es array, registramos el error y forzamos array vacío
                    console.error(`La API para slug "${field.remote.slug}" NO devolvió una lista [] :`, response.data);
                    setOptions([]);
                }
            } catch (error) {
                // Si hay error de red o HTTP (500, 404), capturamos aquí
                console.error(`Error de red/servidor cargando "${field.remote.slug}":`, error);
                setErrorFetching(true);
                setOptions([]); // Vaciamos para evitar el crash del .map
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // Solo re-ejecutar si cambia el parentId o la configuración del slug
    }, [parentId, field.remote?.slug, field.remote?.dependsOn]);

    // Lógica para determinar si el select debe estar bloqueado
    const isLocked = !!field.remote?.dependsOn && !parentId;

    return (
        <Controller
            name={field.name}
            control={control}
            // Reglas de validación básicas
            rules={{ 
                required: field.validation?.required === true ? "Este campo es obligatorio" : field.validation?.required 
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <div className="relative w-full">
                    {/* Estilos base usando DaisyUI (clase 'select') y Tailwind */}
                    <select
                        value={(value as string) || ""}
                        onChange={onChange}
                        // Deshabilitar si está cargando, bloqueado por dependencia, o deshabilitado explícitamente
                        disabled={!!field.disabled || isLocked || loading}
                        className={cn(
                            "select select-bordered w-full transition-all duration-200",
                            "bg-slate-50 border-slate-200 text-slate-700 focus:border-primary",
                            // Estilos de error
                            error && "select-error border-error",
                            // Estilos de deshabilitado
                            (isLocked || loading) && "opacity-60 cursor-not-allowed bg-slate-100"
                        )}
                    >
                        {/* Opción por defecto (Placeholder dinámico) */}
                        <option value="" disabled={loading}>
                            {loading 
                                ? "Cargando datos..." 
                                : isLocked 
                                    ? `Esperando selección previa...` 
                                    : errorFetching 
                                        ? "Error al cargar opciones" 
                                        : field.placeholder || "Seleccionar..."
                            }
                        </option>

                        {/* --- RENDERIZADO SEGURO DE OPCIONES --- */}
                        {/* El uso de Array.isArray aquí es doble redundancia de seguridad */}
                        {Array.isArray(options) && options.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Spinner de carga miniatura (DaisyUI 'loading') */}
                    {loading && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="loading loading-spinner loading-xs text-primary/70" />
                        </div>
                    )}

                    {/* Mensaje de error de validación de React Hook Form */}
                    {error && (
                        <p className="text-[10px] text-error font-black uppercase tracking-widest mt-1.5 px-1 animation-fade-in">
                            {error.message}
                        </p>
                    )}
                </div>
            )}
        />
    );
}
