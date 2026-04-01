"use client";

import { useCrud } from "@/features/dashboard/hooks/useCrud";
import CustomCrud from "@/features/dashboard/pages/CustomCrud";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, Loader2 } from "lucide-react";

export default function SlugCrudPage() {
    const params = useParams();
    const slug = params.slug as string;
    const t = useTranslations();

    const {
        config, data, loading, save, remove, isMutating,
        orderBy, toggleSort, search, setSearch, filters, setFilters,
        page, setPage, total, take
    } = useCrud(slug);

    return (
        <div className="w-full space-y-8">
            {/* Buscador */}
            <div className="px-4 md:px-0">
                <div className="relative max-w-md group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder={t('dashboard.search')}
                        className="w-full h-12 pl-12 pr-12 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {loading && data.length > 0 && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        </div>
                    )}
                </div>
            </div>

            {/* IMPORTANTE: No ponemos animaciones aquí que usen 'transform' 
                ni 'relative' con z-index bajo para que el CustomCrud 
                pueda "escapar" a pantalla completa.
            */}
            <CustomCrud
                remove={remove}
                slug={slug}
                config={config}
                data={data}
                loading={loading}
                save={save}
                isMutating={isMutating}
                orderBy={orderBy}
                toggleSort={toggleSort}
                filters={filters}
                setFilters={setFilters}
                page={page}
                setPage={setPage}
                total={total}
                take={take}
            />
        </div>
    );
}