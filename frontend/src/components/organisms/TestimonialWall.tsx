"use client";

import React from "react";
import { Typography } from "@/components/atoms/Typography";
import { GlassCard } from "@/components/molecules/GlassCard";
import { Star, Quote } from "lucide-react";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import apiClient from "@/utils/api/api.client";

interface Testimonial {
    id: string;
    name: string;
    message: Record<string, string>;
}

export const TestimonialWall = () => {
    const t = useTranslations("landing.testimonials");
    const locale = useLocale();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await apiClient.get('/testimonials', {
                    params: { take: 9 } // Suficientes para el "wall"
                });
                const body = res.data?.body || res.data;
                const data = (body?.data || []) as Testimonial[];
                setTestimonials(data);
            } catch (error) {
                console.error("Error fetching testimonials:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const getTranslation = (field: Record<string, string> | string | undefined | null) => {
        if (!field) return "";
        if (typeof field === 'string') return field;
        return field[locale] || field['es'] || "";
    };

    if (!loading && testimonials.length === 0) return null;

    return (
        <section className="py-24 px-4 bg-slate-50 relative z-10 border-y border-slate-100">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 text-primary font-bold mb-4 uppercase tracking-widest text-[10px]">
                        <Quote className="w-4 h-4" /> {t("badge")}
                    </div>
                    <Typography variant="H2" className="text-slate-900 !text-4xl font-black">{t("title")}</Typography>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {loading ? (
                        <div className="col-span-full text-center py-20 opacity-50 uppercase tracking-widest font-black text-[10px] animate-pulse text-slate-400">
                            Cargando Testimonios...
                        </div>
                    ) : (
                        testimonials.map((test) => (
                            <div
                                key={test.id}
                                className="break-inside-avoid glass-card p-8 bg-white hover:bg-white transition-all duration-500 border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 !rounded-3xl group"
                            >
                                <div className="flex gap-1 mb-5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <Typography variant="P" className="text-slate-600 italic mb-8 leading-relaxed text-sm font-medium">
                                    &quot;{getTranslation(test.message)}&quot;
                                </Typography>
                                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm shadow-inner">
                                        {test.name.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-slate-900 text-sm tracking-tight">{test.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usuario Verificado</p>
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
