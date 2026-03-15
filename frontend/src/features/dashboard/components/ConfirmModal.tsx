"use client";

import { cn } from "@/utils/cn";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { useTranslations } from 'next-intl';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isLoading }: ConfirmModalProps) {
    const t = useTranslations();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            {/* Immersive Overlay */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-fade-in"
                onClick={onCancel}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-bounce-in">
                <div className="p-8 text-center">
                    {/* Visual Warning Indicator */}
                    <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <DynamicIcon name="AlertTriangle" className="w-10 h-10 animate-pulse" />
                    </div>

                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-3 text-white">
                        {title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed px-4">
                        {message}
                    </p>
                </div>

                {/* Technical Action Bar */}
                <div className="flex border-t border-white/5 bg-white/[0.02] p-8 gap-4">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                        {t('action.discard')}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            "flex-1 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95",
                            isLoading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                        ) : (
                            t('action.terminate_record')
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

