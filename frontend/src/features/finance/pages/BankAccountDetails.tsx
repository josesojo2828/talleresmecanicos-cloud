import { useTranslations } from "next-intl";

export default function BankAccountDetail({ id }: { id: string }) {
    const t = useTranslations("dashboard.detail");
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4 italic">
                {t("module_prefix")} {t("bank-account").toUpperCase()}
            </h2>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white">{id}</h1>

        </div>
    );
}