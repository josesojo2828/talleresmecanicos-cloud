"use client";

import { useLocale } from "next-intl";

/**
 * Tipo que soporta los valores que devuelve la Base de Datos desde un JSON field.
 * Puede ser un objeto anidado por idiomas, un string (si hay fallas de compatibilidad) o null.
 */
export type TranslatableField = Record<string, string> | string | null | undefined;

/**
 * Hook utilitario para parsear y devolver el lenguaje correcto de campos JSON anidados.
 * Ideal para renderizar Categorías, Recursos, Misiones, etc., en la web pública.
 */
export const useLocalTranslation = () => {
    // 1. Obtenemos el idioma actual (Ej. 'es', 'en', 'pt') de la configuración de next-intl
    const locale = useLocale();

    /**
     * Devuelve el texto exacto según el idioma en el que está el usuario navegando.
     * @param field - El JSON que viene desde la base de datos de Prisma
     * @param fallbackLang - Idioma de respaldo por si el traductor olvidó añadir el idioma actual (default: 'es')
     */
    const tField = (field: TranslatableField, fallbackLang: string = "es"): string => {
        // Validación de nulidad o campo vacío
        if (!field) return "";

        // Si la BD devolvió un texto plano (Compatibilidad con migraciones o datos viejos)
        if (typeof field === "string") return field;

        // Comprobación segura y acceso al lenguaje actual ('es', 'en')
        // Si no existe, usa el fallback ('es') o la primera clave que exista
        return field[locale] || field[fallbackLang] || field[Object.keys(field)[0]] || "";
    };

    return { tField, locale };
};
