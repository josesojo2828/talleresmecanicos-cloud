import { FormStructure } from './generic.form';

/**
 * Módulo de Autenticación
 * Definiciones para: Login y Registro.
 */

// --- LOGIN ---
export const LoginForm: FormStructure = {
    slug: 'login',
    title: 'auth.login.title',
    description: 'auth.login.description',
    submitButtonText: 'auth.login.button',
    fields: [
        {
            name: 'email',
            label: 'auth.email',
            type: 'email',
            placeholder: 'correo@ejemplo.com',
            validation: {
                required: true,
                pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
                customMessage: 'El correo electrónico no es válido'
            }
        },
        {
            name: 'password',
            label: 'auth.password',
            type: 'password',
            validation: {
                required: true,
                minLength: 6,
                customMessage: 'La contraseña debe tener al menos 6 caracteres'
            }
        },
    ]
};

// --- REGISTER ---
export const RegisterForm: FormStructure = {
    slug: 'register',
    title: 'auth.register.title',
    description: 'auth.register.description',
    submitButtonText: 'auth.register.button',
    fields: [
        {
            name: 'firstName',
            label: 'auth.firstName',
            type: 'text',
            gridCols: 2,
            validation: { required: true, customMessage: 'El nombre es requerido' }
        },
        {
            name: 'lastName',
            label: 'auth.lastName',
            type: 'text',
            gridCols: 2,
            validation: { required: true, customMessage: 'El apellido es requerido' }
        },
        {
            name: 'email',
            label: 'auth.email',
            type: 'email',
            validation: {
                required: true,
                pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
                customMessage: 'El correo electrónico no es válido'
            }
        },
        {
            name: 'password',
            label: 'auth.password',
            type: 'password',
            validation: {
                required: true,
                minLength: 6,
                customMessage: 'La contraseña debe tener al menos 6 caracteres'
            }
        }
    ]
};