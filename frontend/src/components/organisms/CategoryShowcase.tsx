"use client";

import Link from "next/link";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { ArrowRight, Settings2, Sparkles } from "lucide-react";
import { CategoryCard } from "@/components/molecules/CategoryCard";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import apiClient from "@/utils/api/api.client";

interface Category {
    id: string;
    name: Record<string, string>;
    description: Record<string, string>;
    icon: string;
    color: string;
}

export const CategoryShowcase = () => {
    const t = useTranslations("landing.categories");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiClient.get('/workshop-category', {
                    params: { take: 6 }
                });
                const body = res.data?.body || res.data;
                const data = body?.data || [];
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const getTranslation = (field: Record<string, string> | string | undefined | null) => {
        if (!field) return "";
        if (typeof field === 'string') return field;
        return field['es'] || Object.values(field)[0] || "";
    };

    if (!loading && categories.length === 0) return null;

    return (
        <section className="py-24 px-6 relative z-10 overflow-hidden bg-white">
            {/* Patrón de fondo técnico (Grid de ingeniería sutil) */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header de Sección */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                            <Settings2 size={14} />
                            {t("subtitle")}
                        </div>
                        <h2 className="text-slate-900 text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
                            {t.rich("title", {
                                span: (chunks) => <span className="text-emerald-600">{chunks}</span>
                            })}
                        </h2>
                    </div>
                    <Link href="/directorio">
                        <Button className="group bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 py-6 text-sm font-bold shadow-lg shadow-emerald-100 transition-all">
                            {t("cta")} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Grid de Categorías */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        // Skeleton simple
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 rounded-[2rem] bg-slate-50 animate-pulse border border-slate-100" />
                        ))
                    ) : (
                        categories.map((cat) => (
                            <div key={cat.id} className="group relative">
                                {/* Decoración de fondo al hacer hover */}
                                <div className="absolute -inset-2 bg-emerald-50 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100" />

                                <div className="relative bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm transition-all duration-500 group-hover:border-emerald-200 group-hover:-translate-y-1">
                                    <CategoryCard
                                        icon={cat.icon || 'cat-professional'}
                                        title={getTranslation(cat.name)}
                                        description={getTranslation(cat.description)}
                                        // Forzamos el color a la paleta emerald si no viene definido, 
                                        // o lo usamos como un acento muy suave.
                                        color={cat.color || "#10b981"}
                                    />

                                    {/* Indicador de "Ver más" que aparece en hover */}
                                    <div className="mt-4 flex items-center text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black uppercase tracking-widest">
                                        Explorar especialidad <Sparkles className="ml-2 w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};