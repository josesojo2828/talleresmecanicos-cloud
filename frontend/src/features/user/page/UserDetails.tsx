import { useTranslations } from "next-intl";

export default function UserDetail({ id }: { id: string }) {
    const t = useTranslations("dashboard.detail");
    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
            <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-4 italic">
                {t("module_prefix")} {t("user").toUpperCase()}
            </h2>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900">{id}</h1>
        </div>
    );
}
