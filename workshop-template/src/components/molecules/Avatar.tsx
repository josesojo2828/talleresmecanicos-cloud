import React from "react";

interface AvatarProps {
    src?: string;
    alt?: string;
    initials?: string;
    size?: "SM" | "MD" | "LG";
    status?: "online" | "offline" | "busy";
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = "Avatar",
    initials,
    size = "MD",
    status,
    className = "",
}) => {
    const sizeClasses = {
        SM: "w-8",
        MD: "w-10",
        LG: "w-16",
    };

    const statusClass = status ? `avatar-${status}` : "";

    return (
        <div className={`avatar ${statusClass} ${className}`}>
            <div className={`${sizeClasses[size]} rounded-full`}>
                {src ? (
                    <img src={src} alt={alt} />
                ) : (
                    <div className="bg-base-300 text-base-content flex items-center justify-center h-full font-bold">
                        {initials || "?"}
                    </div>
                )}
            </div>
        </div>
    );
};

