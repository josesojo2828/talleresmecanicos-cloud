export type InputType =
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'select'       // Selección simple estática
    | 'autocomplete' // Búsqueda dinámica en el backend (ObjectSelect[])
    | 'date'
    | 'textarea'
    | 'switch'
    | 'checkbox'
    | 'checkbox_single'
    | 'radio'
    | 'file'
    | 'image'
    | 'icon_picker';

export interface FormOption {
    label: string;
    value: string | number | boolean;
}

export interface FormValidation {
    /** Determina si el campo no puede quedar vacío */
    required?: boolean;

    /** Valor numérico mínimo permitido */
    min?: number;

    /** Valor numérico máximo permitido */
    max?: number;

    /** Cantidad mínima de caracteres (para strings) */
    minLength?: number;

    /** Cantidad máxima de caracteres (para strings) */
    maxLength?: number;

    /** * Expresión regular para validaciones complejas
     * Ejemplo: "^[0-9]{10}$" para teléfonos de 10 dígitos
     */
    pattern?: string;

    /** * Mensaje de error personalizado que se mostrará al usuario.
     * Puede ser una cadena de texto o una llave de traducción (i18n).
     */
    customMessage?: string;
}

// Nueva interfaz para configurar búsquedas al servidor
export interface RemoteConfig {
    slug: string;        // El slug que espera tu controlador: 'COUNTRY', 'CITY', etc.
    dependsOn?: string;  // El 'name' de otro campo del que depende (ej: 'countryId')
    minLength?: number;  // Caracteres mínimos antes de disparar la búsqueda
}

export interface FormField {
    name: string;
    label: string;
    type: InputType;
    placeholder?: string;
    defaultValue?: string | number | boolean;
    translatable?: boolean;

    // Si es un 'select' normal, usamos options.
    // Si es 'autocomplete', usamos remote.
    options?: FormOption[];
    remote?: RemoteConfig;

    validation?: FormValidation;
    disabled?: boolean;
    gridCols?: number;
}

export interface FormStructure {
    /** Identificador único del formulario (ej: 'user-create', 'address-edit') */
    slug: string;

    /** Título principal que se mostrará en el Modal o la cabecera (ej: 'Crear Usuario') */
    title?: string;

    /** Descripción breve o instrucciones para el usuario */
    description?: string;

    /** Array con la configuración de cada uno de los inputs */
    fields: FormField[];

    /** * Opcional: Texto para el botón de envío
     * @default 'Guardar'
     */
    submitButtonText?: string;
}

