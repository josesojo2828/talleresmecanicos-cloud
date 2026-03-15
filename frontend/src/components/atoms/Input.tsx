import React from "react";
import { UI } from "@/config/ui";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    size?: keyof typeof UI.INPUT.SIZES;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    size = "MD",
    className = "",
    id,
    ...props
}) => {
    const inputSize = UI.INPUT.SIZES[size];
    const isGlass = size === "XL" || className.includes("glass");
    const variant = error
        ? UI.INPUT.VARIANTS.ERROR
        : (isGlass ? UI.INPUT.VARIANTS.GLASS : UI.INPUT.VARIANTS.DEFAULT);

    return (
        <fieldset className="fieldset w-full">
            {label && (
                <legend className={`fieldset-legend ${isGlass ? 'text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1' : ''}`}>
                    {label}
                </legend>
            )}
            <input
                id={id}
                className={`${UI.INPUT.BASE} ${inputSize} ${variant} ${className} w-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.03)] placeholder-slate-400`}
                {...props}
            />
            {error && <p className="label text-error text-xs mt-1 font-bold">{error}</p>}
        </fieldset>
    );
};
