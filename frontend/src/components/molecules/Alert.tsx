import React from "react";
import { Icon } from "@/components/atoms/Icon";
import { IconName } from "@/config/icons";
import { Typography } from "@/components/atoms/Typography";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const VARIANTS: Record<AlertVariant, { colorClass: string; icon: IconName; borderClass: string }> = {
    success: {
        colorClass: "bg-emerald-500",
        borderClass: "border-emerald-500/10",
        icon: "check-circle"
    },
    error: {
        colorClass: "bg-rose-500",
        borderClass: "border-rose-500/10",
        icon: "alert-circle"
    },
    warning: {
        colorClass: "bg-amber-500",
        borderClass: "border-amber-500/10",
        icon: "alert-triangle"
    },
    info: {
        colorClass: "bg-primary",
        borderClass: "border-primary/10",
        icon: "info"
    },
};

export const Alert: React.FC<AlertProps> = ({
    variant = "info",
    title,
    children,
    className = "",
}) => {
    const style = VARIANTS[variant];

    return (
        <div
            className={`
                relative overflow-hidden flex items-center gap-3 md:gap-4 p-3 md:p-4 w-full md:min-w-[320px] 
                bg-white/80 backdrop-blur-2xl border border-slate-100
                rounded-xl md:rounded-2xl shadow-xl shadow-slate-200/40
                animate-fade-in-up group hover:border-primary/20 transition-all duration-300
                ${className}
            `}
        >
            {/* Left Status Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 md:w-1.5 ${style.colorClass} opacity-80`} />

            {/* Icon Bubble */}
            <div className={`
                flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl shrink-0
                bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform
            `}>
                <Icon icon={style.icon} className={`h-4 w-4 md:h-5 md:w-5 ${variant === 'info' ? 'text-primary' : `text-${style.colorClass.replace('bg-', '')}`}`} />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-0.5">
                {title && (
                    <Typography variant="CAPTION" className="text-slate-900 font-black tracking-widest block text-[9px] md:text-inherit">
                        {title}
                    </Typography>
                )}
                <Typography variant="P" className="!text-[10px] md:!text-[11px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
                    {children}
                </Typography>
            </div>

            {/* Decorative Pulse Glow */}
            <div className={`absolute -right-4 -top-4 w-12 h-12 rounded-full ${style.colorClass} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
        </div>
    );
};

