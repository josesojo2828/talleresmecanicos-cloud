"use client";

import React from "react";

export const TechnicalBackground = () => (
    <>
        {/* Sistema de Fondo Técnico (Dotted Matrix) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03]">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `radial-gradient(#64748b 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            />
        </div>

        {/* Luces sutiles de acento para la consola */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-200/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2" />
    </>
);
