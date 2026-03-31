import { UserRole } from '@prisma/client';

export function getScopeFilter(user: any) {
    if (!user) return { enabled: true };

    if (user.role === UserRole.ADMIN) {
        return {};
    }

    if (user.role === UserRole.SUPPORT) {
        const assignments = user.assignments || [];
        if (assignments.length === 0) return { id: 'none' };

        const countryIds = assignments
            .filter(a => a.countryId && !a.cityId)
            .map(a => a.countryId);
        
        const cityIds = assignments
            .filter(a => a.cityId)
            .map(a => a.cityId);

        const filters: any[] = [];
        if (countryIds.length > 0) {
            filters.push({ countryId: { in: countryIds } });
        }
        if (cityIds.length > 0) {
            filters.push({ cityId: { in: cityIds } });
        }

        return filters.length > 0 ? { OR: filters } : { id: 'none' };
    }

    if (user.role === UserRole.TALLER) {
        // En consultas generales, el TALLER puede ver todo lo habilitado.
        // El filtrado por userId se maneja específicamente en controladores privados (ej: MyWorkshop)
        return { enabled: true };
    }

    if (user.role === 'PUBLIC') {
        return { enabled: true };
    }

    return {};
}
