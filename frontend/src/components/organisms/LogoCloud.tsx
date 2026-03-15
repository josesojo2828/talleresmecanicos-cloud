import { Typography } from "@/components/atoms/Typography";
import { useTranslations } from "next-intl";

export const LogoCloud = () => {
    const t = useTranslations("landing.logo_cloud");
    return (
        <section className="py-8 border-y border-slate-100 bg-slate-50/30 backdrop-blur-sm relative z-10">
            <div className="max-w-5xl mx-auto px-4 overflow-hidden">
                <Typography variant="P" className="text-center text-[9px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-0 animate-pulse">
                    {t("text")}
                </Typography>
            </div>
        </section>
    );
};
