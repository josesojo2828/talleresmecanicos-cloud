"use client";

import { HelpCircle, ChevronDown } from "lucide-react";
import { Typography } from "@/components/atoms/Typography";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import apiClient from "@/utils/api/api.client";

interface Question {
    id: string;
    question: Record<string, string>;
    response: Record<string, string>;
    enabled: boolean;
}

export const FAQ = () => {
    const t = useTranslations("landing.faq");
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await apiClient.get('/question', {
                    params: { take: 10 }
                });
                const body = res.data?.body || res.data;
                const data = (body?.data || []) as Question[];
                setQuestions(data.filter(q => q.enabled));
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const getTranslation = (field: Record<string, string> | string | undefined | null) => {
        if (!field) return "";
        if (typeof field === 'string') return field;
        return field['es'] || Object.values(field)[0] || "";
    };

    if (!loading && questions.length === 0) return null;

    return (
        <section className="py-16 px-4 relative z-10 bg-slate-50/50">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect text-primary text-[10px] font-bold uppercase tracking-widest border border-white/50 shadow-sm">
                        <HelpCircle className="w-3.5 h-3.5" />
                        {t("badge")}
                    </div>
                    <Typography variant="H2" className="text-slate-900 !text-3xl font-black">
                        {t("title")}
                    </Typography>
                    <Typography variant="P" className="text-slate-500 max-w-lg mx-auto text-sm font-medium">
                        {t("subtitle")}
                    </Typography>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-10 opacity-50 uppercase tracking-[0.2em] font-black text-[9px] animate-pulse text-slate-400">
                            Cargando Preguntas...
                        </div>
                    ) : (
                        questions.map((faq, index) => (
                            <div
                                key={faq.id}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className={`glass-card transition-all duration-300 cursor-pointer overflow-hidden border-white/50 ${openIndex === index ? 'p-6 bg-white/80' : 'p-4 bg-white/40'}`}
                            >
                                <div className="flex justify-between items-center gap-4">
                                    <span className={`text-sm font-bold transition-colors ${openIndex === index ? 'text-primary' : 'text-slate-800'}`}>
                                        {getTranslation(faq.question)}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : ''}`} />
                                </div>
                                <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <p className="text-slate-500 text-xs leading-relaxed font-medium">
                                            {getTranslation(faq.response)}
                                        </p>
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
