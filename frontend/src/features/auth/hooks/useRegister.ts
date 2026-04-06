"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterData } from "../types/auth.types";
import { register as registerService } from "../services/authService";
import { setToken, setUser } from "../utils/tokenManager";
import { validateRegisterForm } from "../utils/validation";

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    const handleRegister = async (data: RegisterData) => {
        setIsLoading(true);
        setError(null);
        setFieldErrors({});

        console.log("🏁 useRegister iniciado. Preparando parámetros para validación...");
        
        try {
            console.log("Parametros:", {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password ? "***" : "MISSING",
                confirm: data.confirmPassword ? "***" : "MISSING",
                terms: data.acceptTerms,
                country: data.country,
                city: data.city,
                role: data.role,
                wName: data.workshopName,
                wAddr: data.workshopAddress
            });

            // Client-side validation
            const validationErrors = validateRegisterForm(
                data.firstName,
                data.lastName,
                data.email,
                data.password,
                data.confirmPassword,
                data.acceptTerms,
                data.country,
                data.city,
                data.role,
                data.workshopName,
                data.workshopAddress
            );

            if (validationErrors.length > 0) {
                console.warn("⚠️ Validación manual fallida:", validationErrors);
                const errors: Record<string, string> = {};
                validationErrors.forEach(err => {
                    errors[err.field] = err.message;
                });
                setFieldErrors(errors);
                setIsLoading(false);
                return;
            }
        } catch (validationCrash) {
            console.error("🔥 CRASH en validateRegisterForm:", validationCrash);
            setError("Error interno de validación. Por favor, revisa los campos.");
            setIsLoading(false);
            return;
        }

        console.log("✅ Validación manual exitosa. Llamando al servicio API...");

        try {
            const response = await registerService(data);
            // Save token and user
            setToken(response.token, true); // Remember user after registration
            setUser(response.user);
            // Redirect to dashboard or home
            router.push("/");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error al registrarse. Por favor intenta de nuevo.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        handleRegister,
        isLoading,
        error,
        fieldErrors,
    };
};
