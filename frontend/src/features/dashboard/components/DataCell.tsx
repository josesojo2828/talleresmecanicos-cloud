"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocalTranslation, TranslatableField } from "../hooks/useLocalTranslation";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { TableColumn } from "@/types/user/dashboard";
import { cn } from "@/utils/cn";

interface CrudRecord {
    id: string | number;
    [key: string]: unknown;
}

interface DataCellProps {
    value: unknown;
    column: TableColumn;
    item: CrudRecord;
    onToggle?: (key: string, current: boolean) => void;
    canToggle?: boolean;
    isMutating?: boolean;
}

// Utility to get nested values like 'user.firstName'
const getDeepValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const DataCell: React.FC<DataCellProps> = ({ 
    value, column, item, onToggle, canToggle, isMutating 
}) => {
    const t = useTranslations();
    const { tField } = useLocalTranslation();
    
    // Extraer el valor real si es una propiedad anidada (ej: user.name)
    const realValue = column.key.includes('.') ? getDeepValue(item, column.key) : value;

    if (realValue === null || realValue === undefined || realValue === "")
        return <span className="text-slate-300 font-medium text-[10px] italic">{t('dashboard.no_data')}</span>;
    
    switch (column.type) {
        case 'date':
            return <span className="text-xs font-medium text-slate-500 tabular-nums">{new Date(realValue as string).toLocaleDateString()}</span>;
        
        case 'currency':
            return <span className="text-xs font-bold text-slate-900 tabular-nums">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(realValue as number)}
            </span>;
        
        case 'boolean':
            const isEnabled = !!realValue;
            if (column.key === 'enabled' && canToggle) {
                return (
                    <button
                        disabled={isMutating}
                        onClick={(e) => {
                            e.preventDefault();
                            onToggle?.(column.key, isEnabled);
                        }}
                        className={cn(
                            "group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-all focus:outline-none disabled:opacity-50",
                            isEnabled ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-slate-200"
                        )}
                    >
                        <span
                            className={cn(
                                "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                                isEnabled ? "translate-x-4.5" : "translate-x-1"
                            )}
                        />
                    </button>
                );
            }
            return <StatusBadge status={isEnabled ? "active" : "inactive"} />;
        
        case 'badge':
            return <StatusBadge status={String(realValue)} variant="table" />;
        
        default:
            const content = typeof realValue === 'object' ? tField(realValue as TranslatableField) : String(realValue);
            return <span className="text-xs font-semibold text-slate-700 truncate max-w-[180px] block">{content}</span>;
    }
};
