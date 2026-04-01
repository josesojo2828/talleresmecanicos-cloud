import { TableColumn } from "@/types/user/dashboard";

export const ModuleColumns: Record<string, TableColumn[]> = {
    // --- USUARIO Y SESIONES ---
    'user': [
        { key: 'firstName', label: 'headers.firstName', type: 'text', responsive: 'always' },
        { key: 'lastName', label: 'headers.lastName', type: 'text', responsive: 'always' },
        { key: 'email', label: 'headers.email', type: 'text', responsive: 'always' },
        { key: 'role', label: 'headers.role', type: 'badge', responsive: 'always' },
        { key: 'enabled', label: 'headers.status', type: 'boolean', responsive: 'always' }
    ],
    'profile': [
        { key: 'avatarUrl', label: 'Avatar', type: 'text', responsive: 'lg' }
    ],
    'session': [
        { key: 'ipAddress', label: 'IP', type: 'text', responsive: 'always' },
        { key: 'userAgent', label: 'Dispositivo', type: 'text', responsive: 'md' },
        { key: 'createdAt', label: 'headers.date', type: 'date', responsive: 'always' }
    ],
    'notification': [
        { key: 'title', label: 'headers.title', type: 'text', responsive: 'always' },
        { key: 'isRead', label: 'Leído', type: 'boolean', responsive: 'always' },
        { key: 'createdAt', label: 'Enviado', type: 'date', responsive: 'md' }
    ],

    // --- REGIONES ---
    'country': [
        { key: 'flag', label: '🏳️', type: 'avatar', responsive: 'always' },
        { key: 'name', label: 'headers.country', type: 'text', responsive: 'always' },
        { key: 'enabled', label: 'Habilitado', type: 'boolean', responsive: 'always' }
    ],
    'city': [
        { key: 'name', label: 'headers.city', type: 'text', responsive: 'always' },
        { key: 'country.name', label: 'headers.country', type: 'text', responsive: 'md' },
        { key: 'country.flag', label: '🏳️', type: 'avatar', responsive: 'always' },
        { key: 'enabled', label: 'Habilitado', type: 'boolean', responsive: 'always' }
    ],

    // --- TALLERES ---
    'workshop-category': [
        { key: 'name', label: 'headers.category', type: 'text', responsive: 'always' },
        { key: 'enabled', label: 'Habilitado', type: 'boolean', responsive: 'always' }
    ],
    'workshop': [
        { key: 'name', label: 'Taller', type: 'text', responsive: 'always' },
        { key: 'country.name', label: 'headers.country', type: 'text', responsive: 'md' },
        { key: 'city.name', label: 'headers.city', type: 'text', responsive: 'md' },
        { key: 'phone', label: 'headers.phone', type: 'text', responsive: 'md' },
        { key: 'enabled', label: 'Visible', type: 'boolean', responsive: 'always' }
    ],
    'publication': [
        { key: 'title', label: 'headers.title', type: 'text', responsive: 'always' },
        { key: 'workshop.name', label: 'Taller', type: 'text', responsive: 'md' },
        { key: 'enabled', label: 'Activo', type: 'boolean', responsive: 'always' }
    ],

    // --- FORO ---
    'forum-post': [
        { key: 'title', label: 'headers.title', type: 'text', responsive: 'always' },
        { key: 'user.email', label: 'headers.author', type: 'text', responsive: 'md' },
        { key: 'enabled', label: 'headers.status', type: 'boolean', responsive: 'always' }
    ],

    // --- SOPORTE ---
    'support-assignment': [
        { key: 'user.email', label: 'Soporte', type: 'text', responsive: 'always' },
        { key: 'country.name', label: 'headers.country', type: 'text', responsive: 'md' },
        { key: 'city.name', label: 'headers.city', type: 'text', responsive: 'md' }
    ],

    // --- OPERACIONES ---
    'appointment': [
        { key: 'dateTime', label: 'headers.date', type: 'date', responsive: 'always' },
        { key: 'client.firstName', label: 'headers.client', type: 'text', responsive: 'always' },
        { key: 'workshop.name', label: 'Taller', type: 'text', responsive: 'md' },
        { key: 'status', label: 'headers.status', type: 'badge', responsive: 'always' }
    ],
    'work': [
        { key: 'publicId', label: 'headers.sku', type: 'text', responsive: 'always' },
        { key: 'title', label: 'headers.title', type: 'text', responsive: 'always' },
        { key: 'client.firstName', label: 'headers.client', type: 'text', responsive: 'md' },
        { key: 'status', label: 'headers.status', type: 'badge', responsive: 'always' }
    ],
    'part': [
        { key: 'sku', label: 'headers.sku', type: 'text', responsive: 'always' },
        { key: 'name', label: 'Nombre', type: 'text', responsive: 'always' },
        { key: 'price', label: 'headers.price', type: 'currency', responsive: 'always' },
        { key: 'quantity', label: 'headers.quantity', type: 'text', responsive: 'always' }
    ]
};