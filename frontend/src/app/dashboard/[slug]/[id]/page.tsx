"use client";

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFicha } from '@/features/dashboard/hooks/useFicha';
import { FichaLayout } from '@/features/dashboard/components/FichaLayout';
import { useTranslations } from 'next-intl';
import { SimpleStats } from '@/features/dashboard/components/SimpleStats';
import { FormGenerator } from '@/features/dashboard/components/FormGenerator';
import { useCrud } from '@/features/dashboard/hooks/useCrud';
import { 
    Activity, Database, Settings, Users, 
    Globe, Wrench, MessageSquare, 
    Shield, Layers
} from 'lucide-react';
import { UserRole } from '@/types/enums';
import { Loader2 } from 'lucide-react';
import CustomCrud from '@/features/dashboard/pages/CustomCrud';

const EmbeddedCrud = ({ slug, initialFilters, title }: { slug: string, initialFilters?: Record<string, any>, title: string }) => {
    const crud = useCrud(slug);
    return (
        <div className="space-y-4">
            <header className="flex items-center gap-2.5 px-6">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</h3>
            </header>
            <div className="bg-white/40 border border-white/50 rounded-[2rem] overflow-hidden">
                <CustomCrud 
                    {...crud} 
                    slug={slug}
                    initialFilters={initialFilters} 
                    embedded 
                    hideHeader 
                    hideFilters 
                />
            </div>
        </div>
    );
};

export default function RecordDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const id = params.id as string;
    
    const { data, loading, isMutating, updateRecord } = useFicha(slug, id);
    const { config } = useCrud(slug);
    const t = useTranslations();
    
    const [activeTab, setActiveTab] = useState('stats');

    const tabs = useMemo(() => {
        const base = [
            { id: 'stats', label: t('ficha.tabs.stats'), icon: <Activity size={16} /> },
            { id: 'records', label: t('ficha.tabs.records'), icon: <Database size={16} /> },
            { id: 'data', label: t('ficha.tabs.data'), icon: <Settings size={16} /> },
        ];
        return base;
    }, [slug, t]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">{t('ficha.loading')}</p>
            </div>
        );
    }

    if (!data || (slug === 'user' && data.role === UserRole.ADMIN)) {
        return (
            <div className="text-center py-40 flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 border border-rose-100 shadow-xl shadow-rose-900/5">
                    <Shield size={40} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{t('ficha.error.restricted_title')}</h1>
                    <p className="text-sm font-bold text-slate-400 mt-2">{t('ficha.error.restricted_desc')}</p>
                </div>
                <button 
                    onClick={() => router.back()} 
                    className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                >
                    {t('action.back')}
                </button>
            </div>
        );
    }

    // Identify Internal Records based on Slug and Data
    const getInternalRecordsContent = () => {
        switch (slug) {
            case 'country':
                return (
                    <div className="space-y-12">
                        <EmbeddedCrud title={t('dashboard.detail.city')} slug="city" initialFilters={{ countryId: data.id }} />
                        <EmbeddedCrud title={t('dashboard.detail.workshop')} slug="workshop" initialFilters={{ countryId: data.id }} />
                        <EmbeddedCrud title={t('dashboard.detail.user')} slug="user" initialFilters={{ countryId: data.id }} />
                    </div>
                );
            case 'city':
                return (
                    <div className="space-y-12">
                        <EmbeddedCrud title={t('dashboard.detail.workshop')} slug="workshop" initialFilters={{ cityId: data.id }} />
                    </div>
                );
            case 'user':
                const isTaller = data.role === 'TALLER';
                return (
                    <div className="space-y-12">
                        {isTaller && (
                            <EmbeddedCrud title={t('publication.title')} slug="forum-post" initialFilters={{ userId: data.id }} />
                        )}
                    </div>
                );
            case 'forum-post':
                return (
                    <div className="space-y-12">
                        <EmbeddedCrud title={t('dashboard.detail.forum-comment')} slug="forum-comment" initialFilters={{ postId: data.id }} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <FichaLayout
            title={data.name || data.title || `${data.firstName} ${data.lastName}`}
            subtitle={t('ficha.entity_type', { slug: t(`dashboard.detail.${slug}`) })}
            icon={slug === 'country' ? <Globe /> : slug === 'user' ? <Users /> : <Database />}
            createdAt={data.createdAt}
            updatedAt={data.updatedAt}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
        >
            {activeTab === 'stats' && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <SimpleStats slug={slug} data={data} />
                </div>
            )}

            {activeTab === 'records' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    {getInternalRecordsContent() || (
                        <div className="text-center py-20 opacity-30">
                            <Layers size={48} className="mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest">{t('ficha.no_records')}</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'data' && (
                <div className="max-w-4xl mx-auto bg-white/50 p-10 rounded-[2.5rem] border border-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {config?.form ? (
                        <FormGenerator 
                            structure={config.form}
                            defaultValues={data}
                            isUpdate={true}
                            onSubmit={updateRecord}
                            onCancel={() => setActiveTab('stats')}
                        />
                    ) : (
                        <div className="text-center py-20 opacity-30 text-[10px] font-black uppercase tracking-widest italic">
                            {t('ficha.no_form')}
                        </div>
                    )}
                </div>
            )}
        </FichaLayout>
    );
}
