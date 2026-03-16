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
        { name: 'images', label: 'workshop.images', type: 'image', multiple: true, validation: { max: 5 } },
        { name: 'address', label: 'workshop.address', type: 'text', validation: { required: true } },
        { name: 'phone', label: 'workshop.phone', type: 'text', gridCols: 2 },
        { name: 'whatsapp', label: 'workshop.whatsapp', type: 'text', gridCols: 2 },
        { name: 'website', label: 'workshop.website', type: 'text' },
        { name: 'latitude', label: 'workshop.latitude', type: 'number', gridCols: 2 },
        { name: 'longitude', label: 'workshop.longitude', type: 'number', gridCols: 2 },
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
    title: 'Mi Vehículo',
    fields: [
        { name: 'brand', label: 'Marca', type: 'text', validation: { required: true }, gridCols: 2 },
        { name: 'model', label: 'Modelo', type: 'text', validation: { required: true }, gridCols: 2 },
        { name: 'year', label: 'Año', type: 'number', gridCols: 2 },
        { name: 'licensePlate', label: 'Placa', type: 'text', gridCols: 2 },
        { name: 'lastOilChange', label: 'Último cambio de aceite', type: 'date' }
    ]
};

export const ServiceRequestForm: FormStructure = {
    slug: 'service-request',
    title: 'Solicitud de Servicio',
    fields: [
        { name: 'title', label: 'Título', type: 'text', validation: { required: true } },
        { name: 'description', label: 'Descripción del problema', type: 'textarea', validation: { required: true } },
        { name: 'images', label: 'Fotos', type: 'image', multiple: true, validation: { max: 5 } },
        {
            name: 'vehicleId',
            label: 'Vehículo',
            type: 'autocomplete',
            remote: { slug: 'VEHICLE' },
            validation: { required: true }
        },
        { name: 'isSOS', label: 'Es emergencia (SOS)', type: 'switch', defaultValue: false },
        { name: 'latitude', label: 'Latitud', type: 'hidden' },
        { name: 'longitude', label: 'Longitud', type: 'hidden' }
    ]
};

