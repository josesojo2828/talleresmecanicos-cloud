import { UserRole } from '@prisma/client';

export function getScopeFilter(user: any, relation?: string) {
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

        let scope = filters.length > 0 ? { OR: filters } : { id: 'none' };
        
        if (relation && scope.id !== 'none') {
            return { [relation]: scope };
        }
        
        return scope;
    }

    if (user.role === UserRole.TALLER) {
        // En consultas generales, el TALLER puede ver todo lo habilitado de otros talleres, 
        // pero solo lo propio si no está habilitado.
        return { enabled: true };
    }

    return { enabled: true };
}

