"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { FormField } from "./FormField";
import { useLogin } from "../hooks/useLogin";
import { useTranslations } from "next-intl";

export const LoginForm = () => {
    const t = useTranslations("auth.login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { handleLogin, isLoading, error, fieldErrors } = useLogin();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await handleLogin({ email, password, rememberMe });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6 mt-8">
            {/* Global Error */}
            {error && (
                <div role="alert" className="alert alert-error text-sm">
                    {error}
                </div>
            )}

            {/* Email Field */}
            <FormField
                label={t("email")}
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
                icon="mail"
                disabled={isLoading}
                required
            />

            {/* Password Field */}
            <FormField
                label={t("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
                icon="lock"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                required
            />

            {/* Remember Me */}
            <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="checkbox checkbox-primary checkbox-xs border-slate-200 bg-slate-50"
                        disabled={isLoading}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary transition-colors">{t("remember")}</span>
                </label>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="PRIMARY"
                size="LG"
                className="w-full h-12 rounded-xl group font-bold tracking-tight shadow-md hover:shadow-lg transition-all"
                isLoading={isLoading}
                disabled={isLoading}
            >
                <span className="flex items-center gap-2">
                    {isLoading ? t("loading") : t("button")}
                </span>
            </Button>


        </form>
    );
};
