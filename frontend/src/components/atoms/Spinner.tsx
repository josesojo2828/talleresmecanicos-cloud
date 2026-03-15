import React from "react";

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "loading-sm",
        md: "loading-md",
        lg: "loading-lg",
    };

    return (
        <span
            className={`loading loading-spinner ${sizeClasses[size]} ${className}`}
        />
    );
};

