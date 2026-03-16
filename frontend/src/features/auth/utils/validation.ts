import { ValidationError } from "../types/auth.types";

/**
 * Validates email format
 */
export const validateEmail = (email: string): string | null => {
    if (!email) {
        return "El email es requerido";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Por favor ingresa un email válido";
    }

    if (email.length > 255) {
        return "El email es demasiado largo";
    }

    return null;
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): string | null => {
    if (!password) {
        return "La contraseña es requerida";
    }

    if (password.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres";
    }

    if (!/[A-Z]/.test(password)) {
        return "La contraseña debe contener al menos una mayúscula";
    }

    if (!/[0-9]/.test(password)) {
        return "La contraseña debe contener al menos un número";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "La contraseña debe contener al menos un carácter especial";
    }

    return null;
};

/**
 * Validates a name field (firstName or lastName)
 */
export const validateName = (name: string, fieldName: string = "El nombre"): string | null => {
    if (!name) {
        return `${fieldName} es requerido`;
    }

    if (name.length < 2) {
        return `${fieldName} debe tener al menos 2 caracteres`;
    }

    if (name.length > 100) {
        return `${fieldName} es demasiado largo`;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
        return `${fieldName} solo puede contener letras y espacios`;
    }

    return null;
};

/**
 * Validates password confirmation
 */
export const validatePasswordMatch = (
    password: string,
    confirmPassword: string
): string | null => {
    if (!confirmPassword) {
        return "Por favor confirma tu contraseña";
    }

    if (password !== confirmPassword) {
        return "Las contraseñas no coinciden";
    }

    return null;
};

/**
 * Get password strength level
 */
export const getPasswordStrength = (password: string): {
    level: "weak" | "medium" | "strong";
    percentage: number;
} => {
    let strength = 0;

    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 15;

    if (strength < 50) {
        return { level: "weak", percentage: strength };
    } else if (strength < 80) {
        return { level: "medium", percentage: strength };
    } else {
        return { level: "strong", percentage: strength };
    }
};

/**
 * Validate entire login form
 */
export const validateLoginForm = (email: string, password: string): ValidationError[] => {
    const errors: ValidationError[] = [];

    const emailError = validateEmail(email);
    if (emailError) {
        errors.push({ field: "email", message: emailError });
    }

    if (!password) {
        errors.push({ field: "password", message: "La contraseña es requerida" });
    }

    return errors;
};

/**
 * Validate entire register form
 */
export const validateRegisterForm = (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
    acceptTerms: boolean,
    country: string,
    city: string
): ValidationError[] => {
    const errors: ValidationError[] = [];

    const firstNameError = validateName(firstName, "El nombre");
    if (firstNameError) {
        errors.push({ field: "firstName", message: firstNameError });
    }

    const lastNameError = validateName(lastName, "El apellido");
    if (lastNameError) {
        errors.push({ field: "lastName", message: lastNameError });
    }

    const emailError = validateEmail(email);
    if (emailError) {
        errors.push({ field: "email", message: emailError });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        errors.push({ field: "password", message: passwordError });
    }

    const confirmError = validatePasswordMatch(password, confirmPassword);
    if (confirmError) {
        errors.push({ field: "confirmPassword", message: confirmError });
    }

    if (!acceptTerms) {
        errors.push({ field: "acceptTerms", message: "Debes aceptar los términos y condiciones" });
    }

    if(!country) {
        errors.push({ field: "country", message: "Selecciona tu país" });
    }

    if(!city) {
        errors.push({ field: "city", message: "Selecciona tu ciudad" });
    }

    return errors;
};
