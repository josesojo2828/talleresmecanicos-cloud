"use client";

import { useForm, Controller, Control } from "react-hook-form";
import { FormStructure, FormField } from "@/types/form/generic.form";
import apiClient from "@/utils/api/api.client";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { IconPicker } from "./IconPicker";
import { LocationPicker } from "./LocationPicker";
import { useTranslations } from "next-intl";

import { Save } from "lucide-react";
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
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!field.remote) return;
            if (field.remote.dependsOn && !parentId) { setOptions([]); return; }
            
            setLoading(true);
            try {
                const res = await apiClient.get(`/app/select/${field.remote.slug}`, { 
                    params: { parentId, param: search } 
                });
                const data = res.data?.body || res.data;
                setOptions(Array.isArray(data) ? data : []);
            } finally { setLoading(false); }
        };

        const timeout = setTimeout(load, 300); // Debounce
        return () => clearTimeout(timeout);
    }, [parentId, field.remote, search]);

    return (
        <Controller
            name={field.name}
            control={control}
            rules={{ required: field.validation?.required }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const selectedLabel = options.find(opt => opt.id === value)?.label || "";
                
                return (
                    <div className="relative dropdown w-full">
                        <div className="relative group/search">
                            <input
                                type="text"
                                className={cn(
                                    "input input-sm w-full h-10 pr-10",
                                    error && "input-error",
                                    (loading || (!!field.remote?.dependsOn && !parentId)) && "opacity-60 cursor-not-allowed"
                                )}
                                placeholder={loading ? t('action.processing') : (selectedLabel || t(field.placeholder || 'error.select_option'))}
                                value={isOpen ? search : (selectedLabel || "")}
                                onFocus={() => setIsOpen(true)}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    if (!isOpen) setIsOpen(true);
                                }}
                                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                                disabled={loading || (!!field.remote?.dependsOn && !parentId)}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none group-hover/search:opacity-60 transition-opacity">
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <DynamicIcon name="Search" className="w-4 h-4" />
                                )}
                            </div>
                        </div>

                        {isOpen && options.length > 0 && (
                            <ul className="dropdown-content z-[100] menu p-2 shadow-2xl bg-white border border-slate-100 rounded-2xl w-full mt-2 max-h-60 overflow-y-auto block animate-in fade-in slide-in-from-top-2 duration-300">
                                {options.map(opt => (
                                    <li key={opt.id} className="mb-0.5">
                                        <button
                                            type="button"
                                            className={cn(
                                                "flex flex-col items-start p-3 text-left rounded-xl hover:bg-slate-50 transition-all",
                                                value === opt.id ? "bg-primary/5 text-primary border border-primary/10" : "text-slate-600"
                                            )}
                                            onClick={() => {
                                                onChange(opt.id);
                                                setSearch("");
                                                setIsOpen(false);
                                            }}
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-tight leading-none mb-1">{opt.label.split(' - ')[0]}</span>
                                            {opt.label.includes(' - ') && (
                                                <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest leading-none">{opt.label.split(' - ')[1]}</span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {isOpen && options.length === 0 && search && (
                            <div className="dropdown-content z-[100] p-4 shadow-2xl bg-white border border-slate-100 rounded-2xl w-full mt-2 text-center">
                                <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">{t('error.no_results') || 'No se encontraron resultados'}</p>
                            </div>
                        )}
                    </div>
                );
            }}
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
                                                    : (field.remote?.slug === 'VEHICLE' 
                                                        ? user?.id 
                                                        : (['PART_CATEGORY', 'PART', 'WORKSHOP_CATEGORY', 'WORKSHOP_CLIENT'].includes(field.remote?.slug || "") 
                                                            ? (user as any)?.workshop?.id 
                                                            : undefined))
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

                                    case 'select':
                                        return (
                                            <select
                                                {...register(fieldName, { required: field.validation?.required })}
                                                className={cn("select select-bordered select-sm w-full h-10", currentError && "select-error")}
                                            >
                                                {field.placeholder && <option value="">{t(field.placeholder)}</option>}
                                                {(field.options || []).map((opt) => (
                                                    <option key={String(opt.value)} value={String(opt.value)}>
                                                        {t(opt.label)}
                                                    </option>
                                                ))}
                                            </select>
                                        );

                                    case 'date':
                                        return (
                                            <input
                                                type="date"
                                                {...register(fieldName, { required: field.validation?.required })}
                                                className={cn("input input-bordered input-sm w-full h-10", currentError && "input-error")}
                                            />
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
                                                        
                                                        selectedFiles.forEach(file => {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                const base64String = reader.result as string;
                                                                if (field.multiple) {
                                                                    const currentFiles = Array.isArray(control._formValues[field.name]) ? control._formValues[field.name] : [];
                                                                    onChange([...currentFiles, base64String].slice(0, field.validation?.max || 10));
                                                                } else {
                                                                    onChange(base64String);
                                                                }
                                                            };
                                                            reader.readAsDataURL(file);
                                                        });
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
                                                                            <img
                                                                                src={typeof file === 'string' ? file : URL.createObjectURL(file as any)}
                                                                                alt="preview"
                                                                                className="w-full h-full object-cover"
                                                                                onLoad={(e) => {
                                                                                    if (typeof file !== 'string') {
                                                                                        URL.revokeObjectURL((e.target as HTMLImageElement).src);
                                                                                    }
                                                                                }}
                                                                            />
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

                                    case 'location_picker':
                                        return (
                                            <LocationPicker
                                                value={{
                                                    lat: Number(formValues.latitude || 0) || 0,
                                                    lng: Number(formValues.longitude || 0) || 0
                                                }}
                                                onChange={(val) => {
                                                    setValue('latitude', val.lat, { shouldDirty: true });
                                                    setValue('longitude', val.lng, { shouldDirty: true });
                                                }}
                                            />
                                        );

                                    case 'color':
                                        return (
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="color"
                                                    {...register(fieldName, { required: field.validation?.required })}
                                                    className={cn("w-10 h-10 p-0 cursor-pointer rounded-xl bg-transparent border-none appearance-none disabled:opacity-50", currentError && "input-error")}
                                                />
                                                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                                                    {formValues[fieldName] as string || '#000000'}
                                                </span>
                                            </div>
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

            <footer className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8 border-t border-slate-100 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-ghost text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
                >
                    {t('action.discard')}
                </button>
                <button
                    type="submit"
                    className="btn bg-slate-900 hover:bg-emerald-600 text-white border-none px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-all duration-300"
                >
                    <Save size={14} className="mr-1" />
                    {structure.submitButtonText
                        ? t(structure.submitButtonText)
                        : (isUpdate ? t('action.update') : t('action.create_entry') || 'Guardar')}
                </button>
            </footer>
        </form>
    );
}
