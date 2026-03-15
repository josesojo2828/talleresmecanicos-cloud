import { InputHTMLAttributes } from "react";
import { Icon } from "@/components/atoms/Icon";
import { IconName } from "@/config/icons";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: IconName;
    showPasswordToggle?: boolean;
    onTogglePassword?: () => void;
    showPassword?: boolean;
}

export const FormField = ({
    label,
    error,
    icon,
    showPasswordToggle,
    onTogglePassword,
    showPassword,
    className = "",
    ...props
}: FormFieldProps) => {
    return (
        <fieldset className="fieldset w-full space-y-1.5">
            <legend className="fieldset-legend text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mb-2 px-1">
                {label}
            </legend>
            <div className="relative group/field">
                {/* Icon */}
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-primary transition-colors pointer-events-none z-10">
                        <Icon icon={icon} className="w-5 h-5 transition-transform group-focus-within/field:scale-110" />
                    </div>
                )}

                {/* Input */}
                <input
                    className={`
                        w-full h-14 bg-white border border-slate-100 rounded-2xl font-sans text-sm text-slate-800 placeholder:text-slate-400
                        focus:outline-none focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5
                        shadow-sm hover:border-slate-200
                        transition-all duration-300
                        ${icon ? "pl-12" : "px-5"}
                        ${showPasswordToggle ? "pr-12" : "px-5"}
                        ${error ? "border-error/30 focus:ring-error/5 focus:border-error" : ""}
                        ${className}
                    `}
                    {...props}
                />

                {/* Password Toggle */}
                {showPasswordToggle && onTogglePassword && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="btn btn-ghost btn-sm btn-circle absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <Icon icon={showPassword ? "eye-off" : "eye"} className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-[10px] text-error font-black uppercase tracking-widest flex items-center gap-1.5 px-1 py-1 animate-fade-in">
                    <Icon icon="alert-circle" className="w-3.5 h-3.5" />
                    {error}
                </p>
            )}
        </fieldset>
    );
};

