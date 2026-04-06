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
    Globe, Wrench,
    Shield, Layers, Image as ImageIcon
} from 'lucide-react';
import { GalleryManager } from '@/features/dashboard/components/GalleryManager';
import { UserRole } from '@/types/enums';
import { Loader2 } from 'lucide-react';
import CustomCrud from '@/features/dashboard/pages/CustomCrud';
import { WorkDetail } from '@/features/dashboard/components/work/WorkDetail';
import { PublicationDetail } from '@/features/dashboard/components/publication/PublicationDetail';
import { PartDetail } from '@/features/dashboard/components/part/PartDetail';
import { CountryDetail } from '@/features/dashboard/components/country/CountryDetail';
import { ForumPostDetail } from '@/features/dashboard/components/forum-post/ForumPostDetail';
import { CityDetail } from '@/features/dashboard/components/city/CityDetail';
import { SupportAssignmentsManager } from '@/features/dashboard/components/SupportAssignmentsManager';

const EmbeddedCrud = ({ slug, initialFilters, title }: { slug: string, initialFilters?: Record<string, any>, title: string }) => {
    const crud = useCrud(slug);
    const { page, setPage, total, take } = crud;
    
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
                    page={page}
                    setPage={setPage}
                    total={total}
                    take={take}
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

    const { data, loading, updateRecord, refresh } = useFicha(slug, id);
    const { config } = useCrud(slug);
    const t = useTranslations();

    const [activeTab, setActiveTab] = useState('stats');

    const tabs = useMemo(() => {
        const base = [
            { id: 'stats', label: t('ficha.tabs.stats'), icon: <Activity size={16} /> },
            { id: 'records', label: t('ficha.tabs.records'), icon: <Database size={16} /> },
            { id: 'data', label: t('ficha.tabs.data'), icon: <Settings size={16} /> },
        ];
        if (slug === 'workshop') {
            base.splice(2, 0, { id: 'gallery', label: t('ficha.tabs.gallery'), icon: <ImageIcon size={16} /> });
        }

        if (slug === 'user' && data?.role === UserRole.SUPPORT) {
            base.push({ id: 'territory', label: 'Territorios', icon: <Globe size={16} /> });
        }

        return base;
    }, [slug, t, data]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">{t('ficha.loading')}</p>
            </div>
        );
    }

    if (!data || !data.id || (slug === 'user' && data.role === UserRole.ADMIN)) {
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
            case 'workshop':
                return (
                    <div className="space-y-12">
                        <EmbeddedCrud title={t('work.title')} slug="work" initialFilters={{ workshopId: data.id }} />
                        <EmbeddedCrud title={t('inventory.title')} slug="part" initialFilters={{ workshopId: data.id }} />
                        <EmbeddedCrud title={t('publication.title')} slug="publication" initialFilters={{ workshopId: data.id }} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <FichaLayout
            title={slug === 'appointment' && data.client ? `${data.client.firstName} ${data.client.lastName}` : (data.name || data.title || `${data.firstName || ''} ${data.lastName || ''}`.trim() || t('ficha.detail.module_prefix'))}
            subtitle={t('ficha.entity_type', { slug: t(`dashboard.detail.${slug}`, { defaultValue: slug }) })}
            icon={slug === 'country' ? <Globe /> : slug === 'user' ? <Users /> : <Database />}
            createdAt={data.createdAt}
            updatedAt={data.updatedAt}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
            hideHeader={['work', 'publication', 'part'].includes(slug)}
            hideTabs={['work', 'publication', 'part'].includes(slug)}
        >
            {activeTab === 'stats' && (
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
                    {slug === 'work' ? (
                        <WorkDetail data={data} updateRecord={updateRecord} refresh={refresh} />
                    ) : slug === 'publication' ? (
                        <PublicationDetail data={data} updateRecord={updateRecord} refresh={refresh} />
                    ) : slug === 'part' ? (
                        <PartDetail data={data} updateRecord={updateRecord} refresh={refresh} />
                    ) : slug === 'country' ? (
                        <CountryDetail data={data} />
                    ) : slug === 'city' ? (
                        <CityDetail data={data} />
                    ) : slug === 'forum-post' ? (
                        <ForumPostDetail data={data} />
                    ) : (
                        <>
                            <SimpleStats slug={slug} data={data} />

                            {slug === 'workshop' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {/* Latest Works */}
                                    <div className="bg-white/40 p-10 rounded-[3rem] border border-white shadow-xl space-y-6">
                                        <header className="flex items-center justify-between border-b border-slate-100 pb-4">
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                <Wrench size={18} className="text-emerald-500" /> Últimos Trabajos
                                            </h3>
                                            <button onClick={() => setActiveTab('records')} className="text-[10px] font-black uppercase text-emerald-600 hover:scale-105 transition-transform">Ver todos</button>
                                        </header>

                                        <div className="space-y-3">
                                            {data.works?.slice(0, 4).map((work: any) => (
                                                <div key={work.id} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all group cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-colors">
                                                            <Wrench size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-900 line-clamp-1">{work.title}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">{work.publicId}</p>
                                                        </div>
                                                    </div>
                                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-100 whitespace-nowrap">
                                                        {work.status}
                                                    </span>
                                                </div>
                                            ))}
                                            {(!data.works || data.works.length === 0) && (
                                                <div className="text-center py-10 space-y-2 opacity-30">
                                                    <Wrench size={32} className="mx-auto mb-2" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest italic">No hay trabajos registrados</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                </div>
                            )}
                        </>
                    )}
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

            {activeTab === 'gallery' && (
                <div className="max-w-6xl mx-auto px-6">
                    <GalleryManager
                        images={data.images}
                        onUpdate={updateRecord}
                    />
                </div>
            )}

            {activeTab === 'territory' && (
                <SupportAssignmentsManager userId={data.id} />
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
