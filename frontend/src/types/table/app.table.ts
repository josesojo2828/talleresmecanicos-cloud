import { TableColumn } from "@/types/user/dashboard";

export const ModuleColumns: Record<string, TableColumn[]> = {
    // --- USUARIO Y SESIONES ---
    'user': [
        { key: 'firstName', label: 'Nombre', type: 'text', responsive: 'always' },
        { key: 'lastName', label: 'Apellido', type: 'text', responsive: 'always' },
        { key: 'email', label: 'Email', type: 'text', responsive: 'always' },
        { key: 'role', label: 'Rol', type: 'badge', responsive: 'always' },
        { key: 'enabled', label: 'Estado', type: 'boolean', responsive: 'always' }
    ],
    'profile': [
        { key: 'avatarUrl', label: 'Avatar', type: 'text', responsive: 'lg' }
    ],
    'session': [
        { key: 'ipAddress', label: 'IP', type: 'text', responsive: 'always' },
        { key: 'userAgent', label: 'Dispositivo', type: 'text', responsive: 'md' },
        { key: 'createdAt', label: 'Fecha', type: 'date', responsive: 'always' }
    ],
    'notification': [
        { key: 'title', label: 'Título', type: 'text', responsive: 'always' },
        { key: 'isRead', label: 'Leído', type: 'boolean', responsive: 'always' },
        { key: 'createdAt', label: 'Enviado', type: 'date', responsive: 'md' }
    ],

    // --- REGIONES ---
    'country': [
        { key: 'flag', label: '🏳️', type: 'avatar', responsive: 'always' },
        { key: 'name', label: 'País', type: 'text', responsive: 'always' },
        { key: 'enabled', label: 'Habilitado', type: 'boolean', responsive: 'always' }
    ],
    'city': [
        { key: 'name', label: 'Ciudad', type: 'text', responsive: 'always' },
        { key: 'country.name', label: 'País', type: 'text', responsive: 'md' },
        { key: 'country.flag', label: '🏳️', type: 'avatar', responsive: 'always' },
        { key: 'enabled', label: 'Habilitado', type: 'boolean', responsive: 'always' }
    ],

    // --- TALLERES ---
    'workshop-category': [
        { key: 'name', label: 'Categoría', type: 'text', responsive: 'always' },
        { key: 'enabled', label: 'Habilitado', type: 'boolean', responsive: 'always' }
    ],
    'workshop': [
        { key: 'name', label: 'Taller', type: 'text', responsive: 'always' },
        { key: 'country.name', label: 'País', type: 'text', responsive: 'md' },
        { key: 'city.name', label: 'Ciudad', type: 'text', responsive: 'md' },
        { key: 'phone', label: 'Teléfono', type: 'text', responsive: 'md' },
        { key: 'enabled', label: 'Visible', type: 'boolean', responsive: 'always' }
    ],
    'publication': [
        { key: 'title', label: 'Título', type: 'text', responsive: 'always' },
        { key: 'workshop.name', label: 'Taller', type: 'text', responsive: 'md' },
        { key: 'enabled', label: 'Activo', type: 'boolean', responsive: 'always' }
    ],

    // --- FORO ---
    'forum-post': [
        { key: 'title', label: 'Título', type: 'text', responsive: 'always' },
        { key: 'user.email', label: 'Autor', type: 'text', responsive: 'md' },
        { key: 'enabled', label: 'Estado', type: 'boolean', responsive: 'always' }
    ],

    // --- SOPORTE ---
    'support-assignment': [
        { key: 'user.email', label: 'Soporte', type: 'text', responsive: 'always' },
        { key: 'country.name', label: 'País', type: 'text', responsive: 'md' },
        { key: 'city.name', label: 'Ciudad', type: 'text', responsive: 'md' }
    ]
};