import React from "react";
import { Avatar } from "./Avatar";
import { Typography } from "@/components/atoms/Typography";

interface UserCardProps {
    name: string;
    email?: string;
    avatarSrc?: string;
    initials?: string;
    status?: "online" | "offline" | "busy";
    className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
    name,
    email,
    avatarSrc,
    initials,
    status,
    className = "",
}) => {
    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <Avatar
                src={avatarSrc}
                initials={initials || name.substring(0, 2).toUpperCase()}
                status={status}
            />
            <div>
                <Typography variant="H4" className="!mb-0 text-sm font-semibold">
                    {name}
                </Typography>
                {email && (
                    <Typography variant="CAPTION" className="text-xs opacity-60">
                        {email}
                    </Typography>
                )}
            </div>
        </div>
    );
};
