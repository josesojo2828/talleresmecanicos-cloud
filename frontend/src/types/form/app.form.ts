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
            remote: { slug: 'CITY', dependsOn: 'countryId' },
            validation: { required: true },
            gridCols: 2
        },
        {
            name: 'categoryIds',
            label: 'workshop.categories',
            type: 'autocomplete',
            remote: { slug: 'WORKSHOP_CATEGORY' },
            // multiple: true // Note: The generic.form.ts might need an update to support multiple in FormField
            // For now, let's keep it based on what generic.form.ts says
        },
        { name: 'enabled', label: 'workshop.enabled', type: 'switch', defaultValue: true }
    ]
};

export const ForumPostForm: FormStructure = {
    slug: 'forum-post',
    title: 'forum.post.title',
    fields: [
        { name: 'title', label: 'forum.post.title_label', type: 'text', validation: { required: true } },
        { name: 'content', label: 'forum.post.content', type: 'textarea', validation: { required: true } },
        { name: 'enabled', label: 'forum.enabled', type: 'switch', defaultValue: true }
    ]
};

export const PublicationForm: FormStructure = {
    slug: 'publication',
    title: 'publication.title',
    fields: [
        { name: 'title', label: 'publication.title_label', type: 'text', validation: { required: true } },
        { name: 'content', label: 'publication.content', type: 'textarea', validation: { required: true } },
        { name: 'enabled', label: 'publication.enabled', type: 'switch', defaultValue: true }
    ]
};
