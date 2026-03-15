"use client";

import { useEffect, useState } from "react";
import { Typography } from "@/components/atoms/Typography";
import { useTranslations } from "next-intl";
import { useLocalTranslation, TranslatableField } from "@/features/dashboard/hooks/useLocalTranslation";
import { GlassCard } from "@/components/molecules/GlassCard";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import apiClient from "@/utils/api/api.client";

interface ValueItem {
    id: string;
    title: TranslatableField;
    description: TranslatableField;
    icon: string;
}

export const ValuesGrid = () => {
    const t = useTranslations('about');
    const { tField } = useLocalTranslation();
    const [values, setValues] = useState<ValueItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/value')
            .then(res => {
                setValues(res.data?.body.data || []);
                setLoading(false);
            })
            .catch(() => {
                setValues([]);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (loading || values.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [values, loading]);

    if (!loading && values.length === 0) return null;

    return (
        <section className="py-24 relative overflow-hidden bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <Typography variant="H2" className="mb-6 text-slate-900 uppercase tracking-tighter !text-5xl font-black">
                        {t('values_title')}
                    </Typography>
                    <div className="w-20 h-2 bg-primary/20 mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="h-64 bg-slate-50 animate-pulse rounded-[3rem]" />
                        ))
                    ) : (
                        values.map((val) => (
                            <div key={val.id} className="reveal group">
                                <GlassCard className="p-10 h-full text-center relative overflow-hidden transition-all duration-500 hover:shadow-2xl group-hover:-translate-y-3 rounded-[3rem] border-slate-100 bg-white shadow-sm">
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 group-hover:bg-primary transition-all duration-500">
                                            <DynamicIcon name={val.icon} className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <Typography variant="H4" className="mb-4 text-slate-900 uppercase tracking-tight !text-2xl font-black">
                                            {tField(val.title)}
                                        </Typography>
                                        <Typography variant="P" className="text-slate-600 text-base leading-relaxed font-semibold">
                                            {tField(val.description)}
                                        </Typography>
                                    </div>
                                </GlassCard>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};
