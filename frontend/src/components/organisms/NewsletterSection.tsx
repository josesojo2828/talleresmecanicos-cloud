"use client";

import { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useTranslations } from "next-intl";

export const NewsletterSection = () => {
    const t = useTranslations("landing.newsletter");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");
        await new Promise(r => setTimeout(r, 1200));
        setStatus("success");
        setEmail("");
    };

    return (
        <section className="py-16 px-4 relative z-10">
            <div className="max-w-4xl mx-auto p-8 md:p-12 text-center glass-card border-white/50 shadow-xl overflow-hidden relative">
                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect text-primary text-[10px] font-bold uppercase tracking-widest mb-6 border border-white/40 shadow-sm">
                        <Mail className="w-3.5 h-3.5" />
                        {t("badge")}
                    </div>

                    <Typography variant="H2" className="text-slate-900 mb-4 !text-3xl font-black">
                        {t("title")}
                    </Typography>
                    <Typography variant="P" className="text-slate-500 mb-8 max-w-xl mx-auto text-sm font-medium">
                        {t.rich("description", {
                            span: (chunks) => <strong>{chunks}</strong>,
                            br: () => <br />,
                            strong: (chunks) => <strong>{t("no_spam")}</strong>
                        })}
                    </Typography>

                    {status === "success" ? (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-6 rounded-2xl max-w-md mx-auto animate-fade-in shadow-sm">
                            <Check className="w-8 h-8 mx-auto mb-3" />
                            <Typography variant="H4" className="mb-1 !text-lg">{t("success.title")}</Typography>
                            <Typography variant="P" className="text-xs">{t("success.desc")}</Typography>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <div className="flex-1">
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder={t("placeholder")}
                                    required
                                    className="!bg-white/60 h-10 text-xs"
                                />
                            </div>
                            <Button
                                type="submit"
                                isLoading={status === "loading"}
                                className="sm:w-auto w-full h-10 px-6 text-xs font-bold"
                            >
                                {t("button")} <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    )}

                    <Typography variant="P" className="text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-widest">
                        {t("footer")}
                    </Typography>
                </div>
            </div>
        </section>
    );
};
