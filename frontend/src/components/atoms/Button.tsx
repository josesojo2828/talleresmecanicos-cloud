import React from "react";
import { UI } from "@/config/ui";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof UI.COLORS;
    size?: keyof typeof UI.SIZES;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "PRIMARY",
    size = "MD",
    isLoading = false,
    leftIcon,
    rightIcon,
    className = "",
    disabled,
    ...props
}) => {
    const isPremium = variant === "PREMIUM";
    const baseStyles = isPremium ? "px-7 py-3.5 font-bold flex items-center justify-center rounded-full text-sm tracking-wide z-10 relative overflow-hidden group" : "btn";
    const variantStyles = UI.COLORS[variant];
    const sizeStyles = UI.SIZES[size];

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className} ${isLoading ? 'opacity-80 pointer-events-none' : ''}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isPremium && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            )}
            <span className="relative z-10 flex items-center">
                {isLoading && (
                    <span className="loading loading-spinner loading-sm mr-2" />
                )}
                {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
            </span>
        </button>
    );
};
