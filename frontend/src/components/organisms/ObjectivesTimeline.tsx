"use client";

import { useEffect, useState } from "react";
import { Typography } from "@/components/atoms/Typography";
import { useTranslations } from "next-intl";
import { useLocalTranslation, TranslatableField } from "@/features/dashboard/hooks/useLocalTranslation";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";

interface ObjectiveItem {
    id: string;
    objetivo: TranslatableField;
    description: TranslatableField;
    icon: string;
}

export const ObjectivesTimeline = () => {
    const t = useTranslations('about');
    const { tField } = useLocalTranslation();
    const [objectives, setObjectives] = useState<ObjectiveItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/objective')
            .then(res => {
                setObjectives(res.data?.body.data || []);
                setLoading(false);
            })
            .catch(() => {
                setObjectives([]);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (loading || objectives.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [objectives, loading]);

    if (!loading && objectives.length === 0) return null;

    return (
        <section className="py-24 relative overflow-hidden bg-[#f8fafc]">
            {/* Background Diagram Elements */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[2px] border-primary rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[2px] border-primary rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <Typography variant="H2" className="mb-6 text-slate-900 uppercase tracking-tighter !text-5xl font-black">
                        {t('objectives_title')}
                    </Typography>
                    <div className="w-40 h-2 bg-primary/20 mx-auto rounded-full" />
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Vertical connecting line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-10 hidden md:block" />

                </div>
            </div>
        </section>
    );
};
