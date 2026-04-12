import { FormStructure } from './generic.form';

/**
 * Módulo de Gestión de Usuarios y Entidades Relacionadas
 * Contiene las definiciones para: User, Address, Profile, Session, Device y Notification.
 */

// --- USER ---
export const UserCreateForm: FormStructure = {
    slug: 'user',
    title: 'user.title.create',
    description: 'user.subtitle.create',
    fields: [
        { name: 'firstName', label: 'user.firstName', type: 'text', gridCols: 2, validation: { required: true } },
        { name: 'lastName', label: 'user.lastName', type: 'text', gridCols: 2, validation: { required: true } },
        { name: 'email', label: 'user.email', type: 'email', validation: { required: true, pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' } },
        { name: 'phone', label: 'user.phone', type: 'text', gridCols: 2 }
    ]
};

export const UserUpdateForm: FormStructure = {
    slug: 'user-update',
    fields: [
        { name: 'email', label: 'user.email', type: 'email' },
        { name: 'firstName', label: 'user.firstName', type: 'text', gridCols: 2 },
        { name: 'lastName', label: 'user.lastName', type: 'text', gridCols: 2 },
        {
            name: 'status', label: 'user.status', type: 'select', gridCols: 2, options: [
                { label: 'user.status.active', value: 'ACTIVE' },
                { label: 'user.status.inactive', value: 'INACTIVE' }
            ]
        },
        {
            name: 'kycLevel', label: 'user.kyc', type: 'select', gridCols: 2, options: [
                { label: 'user.kyc.none', value: 0 },
                { label: 'user.kyc.verified', value: 1 }
            ]
        },
        { name: 'twoFactorEnabled', label: 'user.2fa', type: 'switch' }
    ]
};

// --- ADDRESS ---
export const AddressCreateForm: FormStructure = {
    slug: 'address',
    fields: [
        { name: 'country', label: 'address.country', type: 'autocomplete', remote: { slug: 'COUNTRY' }, validation: { required: true } },
        { name: 'state', label: 'address.state', type: 'autocomplete', remote: { slug: 'STATE', dependsOn: 'country' }, validation: { required: true } },
        { name: 'city', label: 'address.city', type: 'autocomplete', remote: { slug: 'CITY', dependsOn: 'state' }, validation: { required: true } },
        { name: 'street', label: 'address.street', type: 'textarea', validation: { required: true } },
        { name: 'zipCode', label: 'address.zip', type: 'text', gridCols: 2 },
        { name: 'userId', label: 'address.user', type: 'autocomplete', gridCols: 2, remote: { slug: 'USER' }, validation: { required: true } }
    ]
};

// --- PROFILE ---
export const ProfileUpdateForm: FormStructure = {
    slug: 'profile',
    fields: [
        { name: 'birthDate', label: 'profile.birthDate', type: 'date', gridCols: 2 },
        { name: 'avatarUrl', label: 'profile.avatar', type: 'text', gridCols: 2 },
        { name: 'userId', label: 'profile.user', type: 'autocomplete', disabled: true }
    ]
};

// --- SESSION ---
export const SessionCreateForm: FormStructure = {
    slug: 'session',
    fields: [
        { name: 'token', label: 'session.token', type: 'text', validation: { required: true } },
        { name: 'ipAddress', label: 'session.ip', type: 'text', gridCols: 2 },
        { name: 'expiresAt', label: 'session.expiry', type: 'date', gridCols: 2, validation: { required: true } },
        { name: 'userId', label: 'session.user', type: 'autocomplete', remote: { slug: 'USER' }, validation: { required: true } }
    ]
};

// --- DEVICE ---
export const DeviceCreateForm: FormStructure = {
    slug: 'device',
    fields: [
        { name: 'deviceId', label: 'device.id', type: 'text', validation: { required: true } },
        { name: 'fcmToken', label: 'device.fcm', type: 'text' },
        { name: 'userId', label: 'device.user', type: 'autocomplete', remote: { slug: 'USER' }, validation: { required: true } }
    ]
};

// --- NOTIFICATION ---
export const NotificationCreateForm: FormStructure = {
    slug: 'notification',
    fields: [
        { name: 'userId', label: 'notification.user', type: 'autocomplete', remote: { slug: 'USER' }, validation: { required: true } },
        { name: 'title', label: 'notification.title', type: 'text', validation: { required: true, maxLength: 100 } },
        { name: 'content', label: 'notification.content', type: 'textarea', validation: { required: true } }
    ]
};
// --- PROFILE PAGE ---
export const ProfileForm: FormStructure = {
    slug: 'profile',
    title: 'nav.profile',
    fields: [
        { name: 'firstName', label: 'user.firstName', type: 'text', gridCols: 2, validation: { required: true } },
        { name: 'lastName', label: 'user.lastName', type: 'text', gridCols: 2, validation: { required: true } },
        { name: 'email', label: 'user.email', type: 'email', validation: { required: true } },
        { name: 'phone', label: 'user.phone', type: 'text', gridCols: 2 },
        { name: 'password', label: 'user.new_password', type: 'password', validation: { minLength: 8 }, placeholder: 'user.password_placeholder' }
    ]
};
