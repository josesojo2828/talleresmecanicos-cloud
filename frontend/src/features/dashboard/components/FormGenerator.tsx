"use client";

import { useForm, Controller, Control } from "react-hook-form";
import { FormStructure, FormField } from "@/types/form/generic.form";
import apiClient from "@/utils/api/api.client";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { IconPicker } from "./IconPicker";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/store/useAuthStore";
import { OnboardingBanner } from "./OnboardingBanner";

interface FormGeneratorProps {
    structure: FormStructure;
    defaultValues?: Record<string, unknown>;
    isUpdate?: boolean;
    onSubmit: (data: Record<string, unknown>) => void;
    onCancel: () => void;
}

const AutocompleteInput = ({ field, control, parentId }: { field: FormField; control: Control<Record<string, unknown>>; parentId?: unknown }) => {
    const t = useTranslations();
    const [options, setOptions] = useState<{ id: string; label: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!field.remote) return;
            // Solo restringimos si hay una dependencia explícita que está vacía
            if (field.remote.dependsOn && !parentId) { setOptions([]); return; }
            
            setLoading(true);
            try {
                const res = await apiClient.get(`/app/select/${field.remote.slug}`, { params: { parentId } });
                const data = res.data?.body || res.data;
                setOptions(Array.isArray(data) ? data : []);
            } finally { setLoading(false); }
        };
        load();
    }, [parentId, field.remote]);

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
                        disabled={loading || (!!field.remote?.dependsOn && !parentId)}
                        className={cn(
                            "select w-full",
                            error && "select-error",
                            (loading || (!!field.remote?.dependsOn && !parentId)) && "opacity-60 cursor-not-allowed text-xs font-bold"
                        )}
                    >
                        <option value="">{loading ? t('action.processing') : t(field.placeholder || 'error.select_option')}</option>
                        {options.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <DynamicIcon name="ChevronDown" className="w-4 h-4" />
                    </div>
                </div>
            )}
        />
    );
};

export function FormGenerator({ structure, defaultValues, isUpdate, onSubmit, onCancel }: FormGeneratorProps) {
    const t = useTranslations();
    const { user } = useAuthStore();
    const [activeLang, setActiveLang] = useState('es');

    const hasTranslatableFields = structure.fields.some(f => f.translatable);

    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<Record<string, unknown>>({
        defaultValues: defaultValues || {}
    });

    const formValues = watch();

    useEffect(() => {
        // Auto-locate for Service Request if fields exist and no values provided
        if (structure.slug === 'service-request' && !isUpdate) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    setValue("latitude", pos.coords.latitude);
                    setValue("longitude", pos.coords.longitude);
                });
            }
        }
    }, [structure.slug, isUpdate, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {hasTranslatableFields && (
                <div className="flex gap-2 p-1 bg-base-200/50 rounded-2xl w-fit border border-base-300">
                    {['es', 'en', 'ja'].map(lang => (
                        <button
                            key={lang}
                            type="button"
                            onClick={() => setActiveLang(lang)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeLang === lang
                                    ? "bg-primary text-primary-content shadow-sm"
                                    : "opacity-50 hover:opacity-100 hover:bg-base-300"
                            )}
                        >
                            {t(`language.${lang}`)}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {structure.fields.map((field) => {
                    const fieldName = field.translatable ? `${field.name}.${activeLang}` : field.name;
                    // Fix nested Error Access
                    const currentError = field.translatable
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ? (errors as any)[field.name]?.[activeLang]
                        : errors[field.name];

                    if (field.type === 'hidden') {
                        return <input key={field.name} type="hidden" {...register(field.name)} />;
                    }

                    return (
                        <div
                            key={`${field.name}-${field.translatable ? activeLang : 'static'}`}
                            className={cn(field.gridCols === 2 ? "sm:col-span-2" : "sm:col-span-1")}
                        >
                            {!['switch', 'checkbox_single'].includes(field.type) && (
                                <label className="block text-[9px] font-black opacity-50 uppercase tracking-widest mb-1.5 ml-1 italic leading-none">
                                    {t(field.label)} {field.translatable && `(${activeLang.toUpperCase()})`}
                                </label>
                            )}

                            {(() => {
                                switch (field.type) {
                                    case 'autocomplete':
                                        return (
                                            <AutocompleteInput
                                                field={field}
                                                control={control}
                                                parentId={field.remote?.dependsOn 
                                                    ? formValues[field.remote.dependsOn] 
                                                    : (field.remote?.slug === 'VEHICLE' ? user?.id : undefined)
                                                }
                                            />
                                        );

                                    case 'number':
                                        return (
                                            <input
                                                type="number"
                                                step="any"
                                                {...register(field.name, {
                                                    required: field.validation?.required,
                                                    valueAsNumber: true
                                                })}
                                                className={cn("input input-sm w-full h-10", errors[field.name] && "input-error")}
                                                placeholder={field.placeholder ? t(field.placeholder) : "0.00"}
                                            />
                                        );

                                    case 'switch':
                                        return (
                                            <Controller
                                                name={field.name}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <label className="flex items-center justify-between p-3 bg-base-200/50 rounded-xl cursor-pointer border border-base-300">
                                                        <span className="text-[9px] font-black opacity-60 uppercase tracking-widest italic">{t(field.label)}</span>
                                                        <input
                                                            type="checkbox"
                                                            className="toggle toggle-primary toggle-sm"
                                                            checked={!!value}
                                                            onChange={(e) => onChange(e.target.checked)}
                                                        />
                                                    </label>
                                                )}
                                            />
                                        );

                                    case 'radio':
                                        return (
                                            <div className="flex flex-wrap gap-2">
                                                {(field.options || []).map((opt) => (
                                                    <label key={String(opt.value)} className="flex-1 min-w-[80px] cursor-pointer">
                                                        <input type="radio" value={String(opt.value)} {...register(field.name)} className="peer hidden" />
                                                        <div className="p-2 text-center border border-base-300 rounded-lg peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-content transition-all">
                                                            <span className="text-[9px] font-black uppercase italic leading-none">{t(opt.label)}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        );

                                    case 'textarea':
                                        return (
                                            <textarea
                                                {...register(fieldName, { required: field.validation?.required && (!field.translatable || activeLang === 'es') })}
                                                className={cn("textarea textarea-sm w-full min-h-[80px]", currentError && "textarea-error")}
                                                placeholder={field.placeholder ? t(field.placeholder) : ""}
                                            />
                                        );

                                    case 'image':
                                        return (
                                            <Controller
                                                name={field.name}
                                                control={control}
                                                render={({ field: { onChange, value } }) => {
                                                    const files = Array.isArray(value) ? value : (value ? [value] : []);
                                                    
                                                    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
                                                        const selectedFiles = Array.from(e.target.files || []);
                                                        if (field.multiple) {
                                                            onChange([...files, ...selectedFiles].slice(0, field.validation?.max || 10));
                                                        } else {
                                                            onChange(selectedFiles[0]);
                                                        }
                                                    };

                                                    return (
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-center w-full">
                                                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-base-300 rounded-[1.5rem] cursor-pointer hover:bg-base-200/50 transition-all hover:border-primary/50">
                                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                        <DynamicIcon name="UploadCloud" className="w-8 h-8 mb-3 text-slate-400" />
                                                                        <p className="mb-2 text-[10px] font-black uppercase tracking-widest italic text-slate-500">
                                                                            {field.multiple ? t('action.upload_files') : t('action.upload_file')}
                                                                        </p>
                                                                    </div>
                                                                    <input
                                                                        type="file"
                                                                        multiple={field.multiple}
                                                                        className="hidden"
                                                                        onChange={handleFile}
                                                                        accept={field.type === 'image' ? 'image/*' : undefined}
                                                                    />
                                                                </label>
                                                            </div>
                                                            
                                                            {files.length > 0 && (
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                                    {files.map((file: any, idx: number) => (
                                                                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-base-300 bg-base-200">
                                                                            {file instanceof File && (
                                                                                <img
                                                                                    src={URL.createObjectURL(file)}
                                                                                    alt="preview"
                                                                                    className="w-full h-full object-cover"
                                                                                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                                                                />
                                                                            )}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    if (field.multiple) {
                                                                                        onChange(files.filter((_, i) => i !== idx));
                                                                                    } else {
                                                                                        onChange(null);
                                                                                    }
                                                                                }}
                                                                                className="absolute top-1 right-1 btn btn-circle btn-xs btn-error btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            >
                                                                                <DynamicIcon name="X" className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }}
                                            />
                                        );


                                    case 'icon_picker':
                                        return (
                                            <Controller
                                                name={field.name}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <IconPicker
                                                        value={value as string}
                                                        onChange={onChange}
                                                        error={!!errors[field.name]}
                                                        disabled={field.disabled}
                                                    />
                                                )}
                                            />
                                        );

                                    default:
                                        return (
                                            <input
                                                type={field.type}
                                                {...register(fieldName, { required: field.validation?.required && (!field.translatable || activeLang === 'es') })}
                                                className={cn("input w-full", currentError && "input-error")}
                                                placeholder={field.placeholder ? t(field.placeholder) : ""}
                                            />
                                        );
                                }
                            })()}

                            {currentError && (
                                <p className="text-[9px] font-black text-error mt-2 ml-1 uppercase tracking-tighter flex items-center gap-1 italic">
                                    <DynamicIcon name="AlertCircle" className="w-3 h-3" />
                                    {t('error.bad_request')}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>

            <footer className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-base-200 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-ghost text-[10px] font-black uppercase tracking-widest italic"
                >
                    {t('action.discard')}
                </button>
                <button
                    type="submit"
                    className="btn btn-neutral text-[10px] font-black uppercase tracking-widest"
                >
                    {structure.submitButtonText
                        ? t(structure.submitButtonText)
                        : (isUpdate ? t('action.update') : t('action.create_entry') || 'Crear')}
                </button>
            </footer>
        </form>
    );
}
