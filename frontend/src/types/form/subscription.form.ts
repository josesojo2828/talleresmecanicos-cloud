import { FormStructure } from './generic.form';

/**
 * Módulo de Suscripciones
 * Definiciones para: SubscriptionPlan y Subscription.
 */

// --- SUBSCRIPTION PLAN ---
export const SubscriptionPlanCreateForm: FormStructure = {
    slug: 'subscription-plan',
    title: 'subscription.plan.title.create',
    description: 'subscription.plan.subtitle.create',
    fields: [
        {
            name: 'name',
            gridCols: 2,
            label: 'subscription.plan.name',
            type: 'text',
            validation: { required: true, minLength: 3 }
        },
        {
            name: 'description',
            label: 'subscription.plan.description',
            gridCols: 2,
            type: 'textarea'
        },
        // {
        //     name: 'price',
        //     label: 'subscription.plan.price',
        //     type: 'number',
        //     // gridCols: 2,
        //     validation: { required: true, min: 0 }
        // },
        // {
        //     name: 'durationDays',
        //     label: 'subscription.plan.duration',
        //     type: 'number',
        //     // gridCols: 2,
        //     placeholder: 'Ej: 30',
        //     validation: { required: true, min: 1 }
        // },
        {
            name: 'priceMonthly',
            label: 'subscription.plan.priceMonthly',
            type: 'number',
            // gridCols: 2,
            validation: { required: true, min: 0 }
        },
        {
            name: 'priceYearly',
            label: 'subscription.plan.priceYearly',
            type: 'number',
            // gridCols: 2,
            validation: { required: true, min: 0 }
        },
        {
            name: 'isActive',
            label: 'subscription.plan.isActive',
            type: 'switch',
            defaultValue: true,
            gridCols: 2
        }
    ]
};

export const SubscriptionPlanUpdateForm: FormStructure = {
    slug: 'subscription-plan-update',
    fields: [
        ...SubscriptionPlanCreateForm.fields.map(field => ({ ...field, validation: { ...field.validation, required: false } }))
    ]
};

// --- SUBSCRIPTION (La instancia de suscripción de un usuario) ---
export const SubscriptionCreateForm: FormStructure = {
    slug: 'subscription',
    title: 'subscription.title.create',
    fields: [
        {
            name: 'userId',
            label: 'subscription.user',
            type: 'autocomplete',
            remote: { slug: 'USER' },
            validation: { required: true }
        },
        {
            name: 'planId',
            label: 'subscription.plan',
            type: 'autocomplete',
            remote: { slug: 'SUBSCRIPTIONPLAN' },
            validation: { required: true }
        },
        {
            name: 'status',
            label: 'subscription.status',
            type: 'select',
            options: [
                { label: 'subscription.status.active', value: 'ACTIVE' },
                { label: 'subscription.status.pending', value: 'PENDING' },
                { label: 'subscription.status.expired', value: 'EXPIRED' },
                { label: 'subscription.status.cancelled', value: 'CANCELLED' }
            ],
            defaultValue: 'PENDING'
        },
        {
            name: 'startDate',
            label: 'subscription.startDate',
            type: 'date',
            gridCols: 2,
            validation: { required: true }
        },
        {
            name: 'endDate',
            label: 'subscription.endDate',
            type: 'date',
            gridCols: 2,
            validation: { required: true }
        },
        {
            name: 'transactionId',
            label: 'subscription.transaction',
            type: 'autocomplete',
            remote: { slug: 'TRANSACTION' }
        }
    ]
};

export const SubscriptionUpdateForm: FormStructure = {
    slug: 'subscription-update',
    fields: [
        {
            name: 'status',
            label: 'subscription.status',
            type: 'select',
            options: [
                { label: 'subscription.status.active', value: 'ACTIVE' },
                { label: 'subscription.status.expired', value: 'EXPIRED' },
                { label: 'subscription.status.cancelled', value: 'CANCELLED' }
            ]
        },
        { name: 'startDate', label: 'subscription.startDate', type: 'date', gridCols: 2 },
        { name: 'endDate', label: 'subscription.endDate', type: 'date', gridCols: 2 },
        { name: 'transactionId', label: 'subscription.transaction', type: 'autocomplete', remote: { slug: 'TRANSACTION' } }
    ]
};