"use client";

import UserDetail from "@/features/user/page/UserDetails";
import CityDetail from "@/features/region/pages/CityDetails";
import RegionDetail from "@/features/region/pages/RegionDetails";
import CountryDetail from "@/features/region/pages/CountryDetails";
import StateDetail from "@/features/region/pages/StateDetails";
import CurrencyDetail from "@/features/region/pages/CurrencyDetails";
import BankAccountDetail from "@/features/finance/pages/BankAccountDetails";
import CryptoDetail from "@/features/finance/pages/CryptoDetails";
import TransactionDetail from "@/features/finance/pages/TransactionDetails";
import SubscriptionDetail from "@/features/subscription/pages/SubscriptionDetails";
import SubscriptionPlanDetail from "@/features/subscription/pages/SubscriptionPlanDetails";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface FactoryProps {
    slug: string;
    id: string; // Pasamos el ID en lugar de data: any
}

export default function EntityDetailFactory({ slug, id }: FactoryProps) {
    const t = useTranslations("dashboard.detail");

    // Diccionario de componentes de detalle
    const views: Record<string, ReactNode> = {
        'user': <UserDetail id={id} />,
        'city': <CityDetail id={id} />,
        'region': <RegionDetail id={id} />,
        'country': <CountryDetail id={id} />,
        'state': <StateDetail id={id} />,
        'currency': <CurrencyDetail id={id} />,
        'bank-account': <BankAccountDetail id={id} />,
        'crypto-wallet': <CryptoDetail id={id} />,
        'transaction': <TransactionDetail id={id} />,
        'subscription': <SubscriptionDetail id={id} />,
        'subscription-plan': <SubscriptionPlanDetail id={id} />,
    };

    return views[slug] || (
        <div className="p-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <h2 className="text-xl font-black text-slate-400 uppercase italic tracking-tighter">
                {t("router_prefix")} {slug.toUpperCase()}
            </h2>
            <p className="text-[10px] font-mono text-slate-300 mt-2">{t("resolver_prefix")} {id}</p>
        </div>
    );
}