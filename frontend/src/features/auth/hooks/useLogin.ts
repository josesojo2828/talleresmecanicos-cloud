"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginCredentials } from "../types/auth.types";
import { login as loginService, logout as logoutService } from "../services/authService";
import { validateLoginForm } from "../utils/validation";
import { useAuthStore } from "@/store/useAuthStore";

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    // Acciones del Store
    const loginInStore = useAuthStore((state) => state.login);
    const logoutInStore = useAuthStore((state) => state.logout);

    const handleLogin = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);
        setFieldErrors({});

        // Validaciones locales
        const validationErrors = validateLoginForm(credentials.email, credentials.password);
        if (validationErrors.length > 0) {
            const errors: Record<string, string> = {};
            validationErrors.forEach(err => { errors[err.field] = err.message; });
            setFieldErrors(errors);
            setIsLoading(false);
            return;
        }

        try {
            // Llamada al servicio (retorna el body directamente)
            const data = await loginService(credentials);
            const backendUser = data.user;
            const token = data.access_token;
            const language = ((backendUser as unknown) as Record<string, string>)['languaje'] || 'es'; // El backend enviaba 'languaje' con j
            const sidebar = data.dashboard.sidebar;
            const pages = data.dashboard.pages;

            loginInStore(
                {
                    ...backendUser,
                },
                token,
                language,
                sidebar,
                pages
            );

            router.push("/dashboard");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutService(); // Llamada opcional al backend
        } finally {
            logoutInStore(); // Limpia Zustand y LocalStorage
            router.push("/login");
        }
    };

    return {
        handleLogin,
        handleLogout,
        isLoading,
        error,
        fieldErrors,
    };
};