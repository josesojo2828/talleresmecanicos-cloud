import { FormStructure } from './generic.form';

// --- COUNTRY ---
export const CountryForm: FormStructure = {
    slug: 'country',
    title: 'regions.country.title',
    fields: [
        { name: 'name', label: 'country.name', type: 'text', validation: { required: true } },
        { name: 'flag', label: 'country.flag', type: 'text' },
        { name: 'language', label: 'country.language', type: 'text' },
        { name: 'timezone', label: 'country.timezone', type: 'text' },
        { name: 'latitude', label: 'country.latitude', type: 'number' },
        { name: 'longitude', label: 'country.longitude', type: 'number' },
        { name: 'primaryColor', label: 'country.primaryColor', type: 'color' },
        { name: 'secondaryColor', label: 'country.secondaryColor', type: 'color' },
        { name: 'tertiaryColor', label: 'country.tertiaryColor', type: 'color' },
        { name: 'enabled', label: 'country.enabled', type: 'switch', defaultValue: true }
    ]
};

// --- CITY ---
export const CityForm: FormStructure = {
    slug: 'city',
    title: 'regions.city.title',
    fields: [
        { name: 'name', label: 'city.name', type: 'text', validation: { required: true } },
        {
            name: 'countryId',
            label: 'city.country',
            type: 'autocomplete',
            remote: { slug: 'COUNTRY' },
            validation: { required: true }
        },
        { name: 'enabled', label: 'city.enabled', type: 'switch', defaultValue: true }
    ]
};