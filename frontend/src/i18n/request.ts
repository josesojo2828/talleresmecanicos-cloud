import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
    // Hardcode to 'es' to follow "Elimina todo lo que tenga que ver con otros idiomas"
    // and ensure a stable build without locale segments.
    const locale = 'es';
    
    return {
        locale,
        messages: (await import(`../locales/${locale}.json`)).default
    };
});
