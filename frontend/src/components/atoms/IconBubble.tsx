import React from "react";

interface IconBubbleProps {
    children: React.ReactNode;
    colorClass?: string;
    className?: string;
}

export const IconBubble: React.FC<IconBubbleProps> = ({
    children,
    colorClass = "text-primary bg-primary/10",
    className = ""
}) => {
    return (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.02)] border border-white/80 ${colorClass} ${className}`}>
            {children}
        </div>
    );
};
