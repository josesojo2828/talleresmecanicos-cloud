"use client";

import Link from "next/link";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { ArrowRight, ChevronRight, Settings2, Sparkles } from "lucide-react";
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
        <section className="py-32 px-6 relative z-10 bg-white border-b border-slate-100">
            {/* Engineering Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto relative z-10">

                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                    <div className="space-y-6">
                        <h2 className="text-slate-950 text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase italic">
                            {t.rich("title", {
                                span: (chunks) => <span className="text-emerald-600 not-italic">{chunks}</span>
                            })}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 bg-slate-100 border border-slate-100">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-white animate-pulse" />
                        ))
                    ) : (
                        categories.map((cat) => (
                            <div key={cat.id} className="group bg-white p-12 transition-all hover:bg-slate-50 relative overflow-hidden">
                                <div className="space-y-10 relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div className="w-14 h-14 bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-emerald-500 transition-all duration-500">
                                            {/* We use a simplified icon or the first letter if it's a string, or an icon-font component if available */}
                                            <span className="text-slate-950 font-black text-xl uppercase tracking-tighter italic">{getTranslation(cat.name).charAt(0)}</span>
                                        </div>
                                        <ArrowRight className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={20} />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight italic leading-none group-hover:text-emerald-600 transition-colors">
                                            {getTranslation(cat.name)}
                                        </h3>
                                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-tight leading-relaxed line-clamp-3">
                                            {getTranslation(cat.description)}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/directorio?category=${cat.id}`}
                                        className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover:text-emerald-600 transition-colors"
                                    >
                                        EXPLORAR REGISTROS <ChevronRight size={12} />
                                    </Link>
                                </div>

                                {/* Technical Accent */}
                                <div className="absolute top-0 right-0 w-16 h-px bg-slate-100 group-hover:bg-emerald-500 transition-colors" />
                                <div className="absolute top-0 right-0 w-px h-16 bg-slate-100 group-hover:bg-emerald-500 transition-colors" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};