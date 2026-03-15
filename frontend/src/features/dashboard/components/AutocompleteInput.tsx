"use client";

import { useEffect, useState } from "react";
import { Controller, Control } from "react-hook-form";
import apiClient from "@/utils/api/api.client";
import { FormField } from "@/types/form/generic.form";
import { cn } from "@/utils/cn";

interface AutocompleteInputProps {
    field: FormField;
    control: Control<Record<string, unknown>>;
    parentId?: string | number | null;
}

export function AutocompleteInput({ field, control, parentId }: AutocompleteInputProps) {
    const [options, setOptions] = useState<{ id: string; label: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!field.remote) return;
            if (field.remote.dependsOn && !parentId) {
                setOptions([]);
                return;
            }

            setLoading(true);
            try {
                const { data } = await apiClient.get<{ id: string; label: string }[]>(
                    `/app/select/${field.remote.slug}`,
                    { params: { parentId } }
                );
                setOptions(data);
            } catch (error) {
                console.error("Error fetching options:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [parentId, field.remote]);

    const isLocked = !!field.remote?.dependsOn && !parentId;

    return (
        <Controller
            name={field.name}
            control={control}
            rules={{ required: field.validation?.required }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <div className="relative">
                    <select
                        value={(value as string) || ""}
                        onChange={onChange}
                        disabled={!!field.disabled || isLocked || loading}
                        className={cn(
                            "select w-full",
                            error && "select-error",
                            (isLocked || loading) && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <option value="">
                            {loading ? "Cargando datos..." : isLocked ? `Esperando selección previa...` : field.placeholder || "Seleccionar..."}
                        </option>
                        {options.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                    {loading && (
                        <div className="absolute right-8 top-1/2 -translate-y-1/2">
                            <span className="loading loading-spinner loading-xs" />
                        </div>
                    )}
                </div>
            )}
        />
    );
}