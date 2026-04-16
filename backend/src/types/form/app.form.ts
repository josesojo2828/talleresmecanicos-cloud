import { FormStructure } from './generic.form';

export const WorkshopCategoryForm: FormStructure = {
    slug: 'workshop-category',
    title: 'workshop.category.title',
    fields: [
        { name: 'name', label: 'workshop.category.name', type: 'text', validation: { required: true } },
        { name: 'description', label: 'workshop.category.description', type: 'textarea' },
        { name: 'enabled', label: 'workshop.enabled', type: 'switch', defaultValue: true }
    ]
};

export const WorkshopForm: FormStructure = {
    slug: 'workshop',
    title: 'workshop.title',
    fields: [
        { name: 'name', label: 'workshop.name', type: 'text', validation: { required: true } },
        { name: 'description', label: 'workshop.description', type: 'textarea' },
        { name: 'logoUrl', label: 'workshop.logo', type: 'image' },
        { name: 'address', label: 'workshop.address', type: 'text', validation: { required: true } },
        {
            name: 'userId',
            label: 'workshop.owner',
            type: 'autocomplete',
            remote: { slug: 'USER' },
            validation: { required: true }
        },
        { name: 'phone', label: 'workshop.phone', type: 'text', gridCols: 2 },
        { name: 'whatsapp', label: 'workshop.whatsapp', type: 'text', gridCols: 2 },
        { name: 'website', label: 'workshop.website', type: 'text' },

        { name: 'openingHours', label: 'workshop.openingHours', type: 'text' },
        {
            name: 'countryId',
            label: 'workshop.country',
            type: 'autocomplete',
            remote: { slug: 'COUNTRY' },
            validation: { required: true },
            gridCols: 2
        },
        {
            name: 'cityId',
            label: 'workshop.city',
            type: 'autocomplete',
            remote: { slug: 'CITY' },
            validation: { required: true },
            gridCols: 2
        },
        {
            name: 'categoryIds',
            label: 'workshop.categories',
            type: 'autocomplete',
            remote: { slug: 'WORKSHOP_CATEGORY' },
            multiple: true
        },
        { name: 'enabled', label: 'workshop.enabled', type: 'switch', defaultValue: false }
    ]
};

export const ForumPostForm: FormStructure = {
    slug: 'forum-post',
    title: 'forum.post.title',
    fields: [
        { name: 'title', label: 'forum.post.title_label', type: 'text', validation: { required: true } },
        { name: 'content', label: 'forum.post.content', type: 'textarea', validation: { required: true } },
        {
            name: 'categoryIds',
            label: 'forum.post.categories',
            type: 'autocomplete',
            remote: { slug: 'workshop-category' },
            multiple: true
        },
        { name: 'enabled', label: 'forum.enabled', type: 'switch', defaultValue: false }
    ]
};

export const PublicationForm: FormStructure = {
    slug: 'publication',
    title: 'publication.title',
    fields: [
        { name: 'title', label: 'publication.title_label', type: 'text', validation: { required: true } },
        { name: 'content', label: 'publication.content', type: 'textarea', validation: { required: true } },
        { name: 'images', label: 'publication.images', type: 'image', multiple: true, validation: { max: 3 } },
        {
            name: 'categoryIds',
            label: 'publication.categories',
            type: 'autocomplete',
            remote: { slug: 'workshop-category' },
            multiple: true
        },
        { name: 'enabled', label: 'publication.enabled', type: 'switch', defaultValue: false }
    ]
};

export const VehicleForm: FormStructure = {
    slug: 'vehicle',
    title: 'vehicle.title',
    fields: [
        { name: 'brand', label: 'headers.brand', type: 'text', validation: { required: true }, gridCols: 2 },
        { name: 'model', label: 'headers.model', type: 'text', validation: { required: true }, gridCols: 2 },
        { name: 'year', label: 'headers.year', type: 'number', gridCols: 2 },
        { name: 'licensePlate', label: 'headers.licensePlate', type: 'text', gridCols: 2 },
        { name: 'lastOilChange', label: 'vehicle.lastOilChange', type: 'date' }
    ]
};

export const ServiceRequestForm: FormStructure = {
    slug: 'service-request',
    title: 'service_request.title',
    fields: [
        { name: 'title', label: 'headers.title', type: 'text', validation: { required: true } },
        { name: 'description', label: 'headers.description', type: 'textarea', validation: { required: true } },
        { name: 'images', label: 'headers.images', type: 'image', multiple: true, validation: { max: 5 } },
        {
            name: 'vehicleId',
            label: 'vehicle.title',
            type: 'autocomplete',
            remote: { slug: 'VEHICLE' },
            validation: { required: true }
        },
        { name: 'isSOS', label: 'headers.sos', type: 'switch', defaultValue: false },
        { name: 'latitude', label: 'workshop.latitude', type: 'hidden' },
        { name: 'longitude', label: 'workshop.longitude', type: 'hidden' }
    ]
};

export const AppointmentForm: FormStructure = {
    slug: 'appointment',
    title: 'appointment.title',
    fields: [
        { 
            name: 'workshopId', 
            label: 'appointment.workshop', 
            type: 'autocomplete', 
            remote: { slug: 'WORKSHOP' }, 
            validation: { required: true } 
        },
        { name: 'dateTime', label: 'appointment.dateTime', type: 'date', validation: { required: true } },
        { name: 'description', label: 'appointment.description', type: 'textarea' },
        { 
            name: 'status', 
            label: 'appointment.status', 
            type: 'select', 
            options: [
                { label: 'status.pending', value: 'PENDING' },
                { label: 'status.accepted', value: 'ACCEPTED' },
                { label: 'status.rejected', value: 'REJECTED' },
                { label: 'status.completed', value: 'COMPLETED' },
                { label: 'status.cancelled', value: 'CANCELLED' }
            ],
            defaultValue: 'PENDING'
        }
    ]
};

export const WorkForm: FormStructure = {
    slug: 'work',
    title: 'work.title',
    fields: [
        { name: 'title', label: 'headers.title', type: 'text', validation: { required: true }, gridCols: 2 },
        { 
            name: 'clientId', 
            label: 'work.client_registered', 
            type: 'autocomplete', 
            remote: { slug: 'USER' },
            validation: { required: false },
            gridCols: 2
        },
        { name: 'vehicleLicensePlate', label: 'headers.licensePlate', type: 'text', validation: { required: true }, gridCols: 2 },
        { 
            name: 'status', 
            label: 'work.status', 
            type: 'select', 
            options: [
                { label: 'status.open', value: 'OPEN' },
                { label: 'status.in_progress', value: 'IN_PROGRESS' },
                { label: 'status.completed', value: 'COMPLETED' },
                { label: 'status.delivered', value: 'DELIVERED' }
            ],
            defaultValue: 'OPEN',
            gridCols: 2
        },
        { name: 'description', label: 'work.description', type: 'textarea' },
        { name: 'images', label: 'work.images', type: 'image', multiple: true, validation: { max: 10 } }
    ]
};

export const PartForm: FormStructure = {
    slug: 'part',
    title: 'inventory.title',
    fields: [
        { name: 'name', label: 'headers.name', type: 'text', validation: { required: true } },
        { name: 'sku', label: 'headers.sku', type: 'text', gridCols: 2 },
        { name: 'price', label: 'headers.price', type: 'number', gridCols: 2 },
        { name: 'quantity', label: 'headers.quantity', type: 'number', validation: { required: true }, defaultValue: 0 },
        { 
            name: 'categoryId', 
            label: 'headers.category', 
            type: 'autocomplete', 
            remote: { slug: 'PART_CATEGORY' } 
        },
        { name: 'description', label: 'headers.description', type: 'textarea' }
    ]
};

export const PartCategoryForm: FormStructure = {
    slug: 'part-category',
    title: 'inventory.category.title',
    fields: [
        { name: 'name', label: 'headers.name', type: 'text', validation: { required: true } },
        { name: 'description', label: 'headers.description', type: 'textarea' }
    ]
};

