"use client";

import React from "react";
import { useAlertStore } from "@/store/useAlertStore";
import { Alert } from "@/components/molecules/Alert";
import { Icon } from "@/components/atoms/Icon";

export const AlertContainer: React.FC = () => {
    const { alerts, removeAlert } = useAlertStore();

    return (
        <div className="fixed bottom-4 md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-[100] flex flex-col gap-3 md:gap-4 max-w-none md:max-w-md w-auto md:w-full pointer-events-none">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className="pointer-events-auto relative group animate-fade-in-up transition-all duration-500"
                >
                    <Alert variant={alert.type} className="shadow-2xl pr-12 md:pr-14 border-white/5 bg-slate-900/40 backdrop-blur-3xl">
                        {alert.message}
                    </Alert>

                    <button
                        onClick={() => removeAlert(alert.id)}
                        className="
                            absolute top-1/2 -translate-y-1/2 right-3 md:right-4 
                            p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white/5 border border-white/10 
                            text-slate-400 hover:text-white hover:bg-white/10 
                            transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100
                        "
                    >
                        <Icon icon="close" className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>

                    {/* Progress Bar (Visual only for now) */}
                    <div className="absolute bottom-1 left-4 right-4 h-0.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-white opacity-20 shimmer-base animate-shimmer`}
                            style={{ animationDuration: `${alert.duration || 3000}ms` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};
