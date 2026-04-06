"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    Eye, X, Plus, ChevronUp, ChevronDown,
    Loader2, Wrench, ChevronLeft, ChevronRight
} from "lucide-react";

import { ObjectPage, TableColumn, ObjectActionsScreens } from "@/types/user/dashboard";
import { FormStructure } from "@/types/form/generic.form";
import { SortParam } from "../hooks/useCrud";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { FormGenerator } from "../components/FormGenerator";
import { ConfirmModal } from "../components/ConfirmModal";
import { DataCell } from "../components/DataCell";
import { cn } from "@/utils/cn";
import * as UserForms from "@/types/form/user.form";
import * as RegionForms from "@/types/form/regions.form";
import * as AppForms from "@/types/form/app.form";
import { useAuthStore } from "@/store/useAuthStore";
import { UserRole } from "@/types/enums";

export interface CrudRecord {
    id: string | number;
    [key: string]: unknown;
}

interface CustomCrudProps {
    slug: string;
    config: ObjectPage | null;
    data: CrudRecord[];
    loading: boolean;
    save: (formData: Record<string, unknown>, id?: string | number) => Promise<{ success: boolean; error?: Error }>;
    remove: (id: string | number) => Promise<{ success: boolean; error?: Error }>;
    isMutating: boolean;
    orderBy: SortParam[];
    toggleSort: (field: string) => void;
    filters: Record<string, any>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    page?: number;
    setPage?: (p: number) => void;
    total?: number;
    take?: number;
    initialFilters?: Record<string, any>;
    hideHeader?: boolean;
    hideFilters?: boolean;
    embedded?: boolean;
}

export default function CustomCrud({
    slug, config, data, loading, save, remove, isMutating, orderBy, toggleSort, filters, setFilters,
    initialFilters, hideHeader, hideFilters, embedded,
    page, setPage, total, take
}: CustomCrudProps) {
    const router = useRouter();
    const t = useTranslations();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [activeRecord, setActiveRecord] = useState<CrudRecord | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

    React.useEffect(() => {
        if (initialFilters && Object.keys(initialFilters).length > 0) {
            setFilters(prev => ({ ...prev, ...initialFilters }));
        }
    }, [initialFilters, setFilters]);

    const activeColumns: TableColumn[] = useMemo(() => config?.columns || [], [config]);

    const getFormStructure = (currentSlug: string): FormStructure | null => {
        const localForms: Record<string, FormStructure> = {
            'user': UserForms.UserCreateForm, 'address': UserForms.AddressCreateForm,
            'country': RegionForms.CountryForm, 'city': RegionForms.CityForm,
            'workshop': AppForms.WorkshopForm, 'workshop-category': AppForms.WorkshopCategoryForm,
            'forum-post': AppForms.ForumPostForm, 'publication': AppForms.PublicationForm,
        };
        return localForms[currentSlug] || config?.form || null;
    };

    const getFilteredFormStructure = (): FormStructure | null => {
        const base = getFormStructure(slug);
        if (!base) return null;
        const currentUser = useAuthStore.getState().user;
        const canManageStatus = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPPORT;
        return canManageStatus ? base : { ...base, fields: base.fields.filter(f => f.name !== 'enabled') };
    };

    const filteredData = useMemo(() => {
        if (statusFilter === 'all') return data;
        const target = statusFilter === 'enabled';
        return data.filter(item => (item.enabled === target) || (target === true && item.enabled === undefined));
    }, [data, statusFilter]);

    const handleAction = (act: ObjectActionsScreens, item: CrudRecord): void => {
        setActiveRecord(item);
        const label = act.label?.toLowerCase() || "";
        if (label.includes('delete') || label.includes('borrar')) setShowConfirm(true);
        else setShowModal(true);
    };

    return (
        <div className="w-full">
            {!hideFilters && (
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    {data.some(item => 'enabled' in item) && (
                        <div className="flex bg-white rounded-2xl p-1 border border-slate-200 shadow-sm">
                            <button onClick={() => setStatusFilter('all')} className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'all' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}>{t('status.all')}</button>
                            <button onClick={() => setStatusFilter('enabled')} className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'enabled' ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-emerald-600")}>{t('status.enabled')}</button>
                            <button onClick={() => setStatusFilter('disabled')} className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'disabled' ? "bg-rose-600 text-white shadow-lg" : "text-slate-400 hover:text-rose-600")}>{t('status.disabled')}</button>
                        </div>
                    )}
                    {config?.filters?.map(f => (
                        <div key={f.key} className="flex items-center bg-white rounded-2xl px-4 py-1 border border-slate-200 shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-3 border-r border-slate-100 pr-3">{f.label}</span>
                            {f.type === 'select' && (
                                <select value={filters[f.key] || ''} onChange={(e) => setFilters(prev => ({ ...prev, [f.key]: e.target.value || undefined }))} className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-slate-600 min-w-[120px] appearance-none">
                                    <option value="">{t('status.all')}</option>
                                    {f.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className={cn("bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden relative group/crud", embedded && "rounded-none border-none shadow-none bg-transparent")}>
                {!hideHeader && (
                    <header className="px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-white">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100"><Wrench size={20} /></div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">{config?.title ? t(config.title) : slug}</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />{t('dashboard.management')}</p>
                            </div>
                        </div>
                        {config?.actions?.some(a => a.action === 'add') && (
                            <button onClick={() => { setActiveRecord(undefined); setShowModal(true); }} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-100 active:scale-95"><Plus size={16} /> <span className="hidden sm:inline">{t('action.add')}</span></button>
                        )}
                    </header>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-0">
                        <thead className="bg-slate-50/50">
                            <tr>
                                {activeColumns.map((col) => (
                                    <th key={col.key} onClick={() => toggleSort(col.key)} className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 cursor-pointer hover:text-slate-900 transition-colors text-left">{t(col.label)}</th>
                                ))}
                                <th className="px-8 py-4 border-b border-slate-100 text-right text-[10px] font-black text-slate-300 uppercase">{t('dashboard.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredData.map((item) => {
                                const currentUser = useAuthStore.getState().user;
                                const canManageStatus = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPPORT;
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group/row border-b border-slate-50 last:border-0 hover:shadow-[inset_4px_0_0_0_#10b981]">
                                        {activeColumns.map((col) => (
                                            <td key={`${item.id}-${col.key}`} className="px-8 py-5">
                                                <DataCell value={item[col.key]} column={col} item={item} canToggle={canManageStatus} isMutating={isMutating} onToggle={(key, current) => save({ [key]: !current }, item.id)} />
                                            </td>
                                        ))}
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button onClick={() => router.push(`/dashboard/${slug}/${item.id}`)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 transition-all shadow-sm"><Eye size={14} /></button>
                                                {config?.actionsRows.map((act, idx) => (
                                                    <button key={idx} onClick={() => handleAction(act, item)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 transition-all shadow-sm"><DynamicIcon name={act.icon} className="w-3.5 h-3.5" /></button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {page !== undefined && setPage && total !== undefined && take !== undefined && total > take && (
                    <footer className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mostrando <span className="text-slate-900">{(page - 1) * take + 1}</span> a <span className="text-slate-900">{Math.min(page * take, total)}</span> de <span className="text-slate-900">{total}</span></div>
                        <div className="flex items-center gap-2">
                            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 shadow-sm"><ChevronLeft size={16} /></button>
                            {Array.from({ length: Math.min(5, Math.ceil(total / take)) }).map((_, i) => (
                                <button key={i + 1} onClick={() => setPage(i + 1)} className={cn("w-8 h-8 rounded-lg text-[10px] font-black transition-all", page === i + 1 ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-100 text-slate-400 hover:text-emerald-600")}>{i + 1}</button>
                            ))}
                            <button disabled={page >= Math.ceil(total / take)} onClick={() => setPage(page + 1)} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 disabled:opacity-30 shadow-sm"><ChevronRight size={16} /></button>
                        </div>
                    </footer>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                        <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white"><Plus size={16} /></div><h3 className="text-base font-black text-slate-900 uppercase tracking-tight">{activeRecord ? t('action.modify_record') : t('action.create_entry')}</h3></div>
                            <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={18} /></button>
                        </header>
                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {getFormStructure(slug) ? <FormGenerator structure={getFilteredFormStructure()!} defaultValues={activeRecord ? (activeRecord as Record<string, unknown>) : { ...initialFilters }} isUpdate={!!activeRecord} onSubmit={async (fd) => { const r = await save(fd, activeRecord?.id); if (r.success) setShowModal(false); }} onCancel={() => setShowModal(false)} /> : <div className="py-10 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest">{t('ficha.no_form')}</div>}
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal isOpen={showConfirm} title={t('action.terminate_record')} message={t('dialog.delete_confirm', { slug })} isLoading={isMutating} onConfirm={async () => { if (activeRecord?.id) { const r = await remove(activeRecord.id); if (r.success) setShowConfirm(false); } }} onCancel={() => setShowConfirm(false)} />
        </div>
    );
}
