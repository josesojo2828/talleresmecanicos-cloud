/**
 * Dirección del ordenamiento
 */
export type OrderDirection = 'asc' | 'desc';

/**
 * Estructura para ordenar por cualquier campo del modelo T
 */
export interface SortParam<T> {
    field: keyof T;
    order: OrderDirection;
}

/**
 * Operadores permitidos para filtros específicos
 */
export type FilterOperator =
    | 'eq'    // Equal
    | 'neq'   // Not equal
    | 'gt'    // Greater than
    | 'gte'   // Greater than or equal
    | 'lt'    // Less than
    | 'lte'   // Less than or equal
    | 'like'  // Partial match
    | 'in';   // In array

/**
 * Define un valor de filtro que puede ser un valor directo o un objeto con operador
 */
export type FilterValue<V> = V | { [K in FilterOperator]?: V | V[] };

/**
 * Filtros específicos basados en las propiedades del modelo T
 */
export type AdvancedFilters<T> = {
    [P in keyof T]?: FilterValue<T[P]>;
};

export interface QueryOptions<T, E> {
    skip?: number;
    take?: number;
    search?: string;
    orderBy?: SortParam<T>[];
    // Ahora los filtros están tipados según el modelo
    filters?: E;
}
