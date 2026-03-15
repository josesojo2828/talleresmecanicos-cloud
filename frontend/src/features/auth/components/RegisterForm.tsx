"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { FormField } from "./FormField";
import { useRegister } from "../hooks/useRegister";
import { getPasswordStrength } from "../utils/validation";
import { useTranslations } from "next-intl";

export const RegisterForm = () => {
    const t = useTranslations("auth.register");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { handleRegister, isLoading, error, fieldErrors } = useRegister();

    const passwordStrength = password ? getPasswordStrength(password) : null;

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await handleRegister({
            name,
            email,
            password,
            confirmPassword,
            acceptTerms,
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6 mt-8">
            {/* Global Error */}
            {error && (
                <div role="alert" className="alert alert-error text-sm">
                    {error}
                </div>
            )}

            {/* Name Field */}
            <FormField
                label={t("name")}
                type="text"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={fieldErrors.name}
                icon="user"
                disabled={isLoading}
                required
            />

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

            {/* Password Field with Strength Indicator */}
            <div className="space-y-2">
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

                {/* Password Strength Indicator */}
                {password && passwordStrength && (
                    <div className="space-y-2 px-1">
                        <div className="flex gap-1.5">
                            <div className={`h-1 flex-1 rounded-full transition-all duration-500 bg-slate-100 ${passwordStrength.percentage >= 33 ? (passwordStrength.level === "weak" ? "bg-error shadow-sm" : passwordStrength.level === "medium" ? "bg-warning shadow-sm" : "bg-primary shadow-sm") : ""}`}></div>
                            <div className={`h-1 flex-1 rounded-full transition-all duration-500 bg-slate-100 ${passwordStrength.percentage >= 66 ? (passwordStrength.level === "medium" ? "bg-warning shadow-sm" : "bg-primary shadow-sm") : ""}`}></div>
                            <div className={`h-1 flex-1 rounded-full transition-all duration-500 bg-slate-100 ${passwordStrength.percentage >= 90 ? "bg-primary shadow-sm" : ""}`}></div>
                        </div>
                        <Typography variant="P" className={`text-[10px] font-black uppercase tracking-widest ${passwordStrength.level === "weak" ? "text-error" : passwordStrength.level === "medium" ? "text-warning" : "text-primary"}`}>
                            {t("strength.label")} <span className="opacity-60">{passwordStrength.level === "weak" ? t("strength.low") : passwordStrength.level === "medium" ? t("strength.medium") : t("strength.high")}</span>
                        </Typography>
                    </div>
                )}
            </div>

            {/* Confirm Password Field */}
            <FormField
                label={t("confirm")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={fieldErrors.confirmPassword}
                icon="lock"
                showPasswordToggle
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                required
            />

            {/* Terms and Conditions */}
            <div className="space-y-2 px-1">
                <label className="flex items-start gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="checkbox checkbox-primary checkbox-xs mt-0.5 border-slate-200 bg-slate-50"
                        disabled={isLoading}
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-primary transition-colors leading-tight">
                        {t.rich("terms", {
                            terms: () => <Link href="/terminos" className="text-primary hover:text-primary-600 transition-colors font-black">{t("terms_link")}</Link>,
                            privacy: () => <Link href="/privacidad" className="text-primary hover:text-primary-600 transition-colors font-black">{t("privacy_link")}</Link>
                        }) || ""}
                    </span>
                </label>
                {fieldErrors.acceptTerms && (
                    <p className="text-[10px] text-error font-black uppercase tracking-widest px-1">{fieldErrors.acceptTerms}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="PRIMARY"
                size="LG"
                className="w-full h-14 rounded-2xl group shadow-lg shadow-primary/10"
                isLoading={isLoading}
                disabled={isLoading}
            >
                <span className="flex items-center gap-2">
                    {isLoading ? t("loading") : t("button")}
                    {!isLoading && <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-150 transition-transform" />}
                </span>
            </Button>

            {/* Login Link */}
            <p className="text-center">
                <Typography variant="P" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    {t("has_account")}{" "}
                    <Link
                        href="/login"
                        className="text-primary hover:text-primary-600 transition-colors font-black"
                    >
                        {t("login")}
                    </Link>
                </Typography>
            </p>
        </form>
    );
};
