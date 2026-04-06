"use client";

import React, { useState, useRef } from "react";
import { UI } from "@/config/ui";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    spotlightColor?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = "",
    hover = true,
    spotlightColor = "rgba(34, 197, 94, 0.08)",
    onClick
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            className={`
                relative overflow-hidden group
                ${UI.GLASS.CARD}
                ${hover ? 'transition-transform duration-500 hover:-translate-y-1' : ''}
                ${className}
            `}
        >
            {/* Dynamic Spotlight overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                style={{
                    background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />

            {/* Subtle inner reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none rounded-[2rem] z-0"></div>

            {/* Content wrapper */}
            <div className="relative z-10 h-full">{children}</div>
        </div>
    );
};
