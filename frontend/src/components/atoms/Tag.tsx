import React from "react";
import { UI } from "@/config/ui";

interface TagProps {
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
    className?: string;
}

export const Tag: React.FC<TagProps> = ({
    children,
    active = false,
    onClick,
    className = ""
}) => {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center whitespace-nowrap shadow-sm ${active ? UI.GLASS.TAG_ACTIVE : UI.GLASS.TAG
                } ${className}`}
        >
            {children}
        </button>
    );
};
