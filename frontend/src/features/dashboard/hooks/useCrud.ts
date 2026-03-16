"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/utils/api/api.client";
import { ObjectPage } from "@/types/user/dashboard";
import { ModuleColumns } from "@/types/table/app.table";

export type OrderDirection = 'asc' | 'desc';
export interface SortParam {
    field: string;
    order: OrderDirection;
}

interface GenericEntity {
    id: string | number;
    [key: string]: unknown;
}

export const useCrud = (slug: string) => {
    const { pages } = useAuthStore();
    const [config, setConfig] = useState<ObjectPage | null>(null);
    const [data, setData] = useState<GenericEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isMutating, setIsMutating] = useState<boolean>(false);

    const [orderBy, setOrderBy] = useState<SortParam[]>([]);
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [filters, setFilters] = useState<Record<string, any>>({});

    // Debounce de 400ms para evitar peticiones por cada tecla
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(handler);
    }, [search]);

    const reloadData = useCallback(async () => {
        if (!slug) return;
        try {
            setLoading(true);

            const params = {
                search: debouncedSearch || undefined,
                filters: Object.keys(filters).length > 0 ? JSON.stringify(filters) : undefined,
                orderBy: orderBy.length > 0 ? JSON.stringify(orderBy.map(s => ({ [s.field]: s.order }))) : undefined,
                take: 100,
                skip: 0
            };

            const response = await apiClient.get(`/${slug}`, { params });
            const result = response.data?.body || response.data?.data || response.data;

            // Ajustamos según la respuesta de tu persistence (getAll)
            // Si getAll devuelve { data: [], meta: {} }
            let finalData = Array.isArray(result.data)
                ? result.data
                : Array.isArray(result) ? result : [];

            // Filter out admins from the list as per requirements
            if (slug === 'user') {
                finalData = finalData.filter((u: any) => u.role !== 'ADMIN');
            }

            setData(finalData);
        } catch (error) {
            console.error(`[useCrud] Error fetching ${slug}:`, error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [slug, debouncedSearch, orderBy, filters]);

    // Cargar configuración y disparar reloadData
    useEffect(() => {
        const pageFromStore = pages.find((p) => p.slug === slug);
        const localColumns = ModuleColumns[slug] || [];

        if (pageFromStore || localColumns.length > 0) {
            setConfig({
                ...(pageFromStore || {
                    slug,
                    title: slug.toUpperCase(),
                    subtitle: `DATABASE MANAGEMENT: ${slug}`
                }),
                columns: (pageFromStore?.columns && pageFromStore.columns.length > 0)
                    ? pageFromStore.columns
                    : localColumns,
                actions: pageFromStore?.actions || [],
                actionsRows: pageFromStore?.actionsRows || []
            } as ObjectPage);
        }

        reloadData();
    }, [slug, pages, reloadData]);

    const toggleSort = (field: string) => {
        setOrderBy(prev => {
            const existing = prev.find(s => s.field === field);
            if (!existing) return [{ field, order: 'asc' }];
            if (existing.order === 'asc') return [{ field, order: 'desc' }];
            return [];
        });
    };

    const save = async (formData: Record<string, unknown>, id?: string | number): Promise<{ success: boolean; error?: Error }> => {
        try {
            setIsMutating(true);

            // 1. Clonamos la información para no mutar el estado del formulario directamente
            const body = { ...formData };

            // 2. Buscamos campos que tengan archivos (File o Blob)
            const entries = Object.entries(body);
            for (const [key, val] of entries) {
                if (val instanceof File) {
                    // Carga individual
                    const fileData = new FormData();
                    fileData.append('file', val);
                    const res = await apiClient.post(`/storage/upload`, fileData, { params: { folder: slug } });
                    body[key] = res.data.key;
                } else if (Array.isArray(val) && val.some(v => v instanceof File)) {
                    // Carga múltiple
                    const filesData = new FormData();
                    val.forEach(file => {
                        if (file instanceof File) filesData.append('files', file);
                    });
                    const res = await apiClient.post(`/storage/upload-multiple`, filesData, { params: { folder: slug } });
                    body[key] = res.data.map((r: any) => r.key);
                }
            }

            // 3. Enviamos el JSON final al endpoint del CRUD
            if (id) await apiClient.put(`/${slug}/${id}`, body);
            else await apiClient.post(`/${slug}`, body);

            await reloadData();
            return { success: true };
        } catch (error) {
            console.error(`[useCrud] Error saving ${slug}:`, error);
            return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
        } finally {
            setIsMutating(false);
        }
    };


    const remove = async (id: string | number): Promise<{ success: boolean; error?: Error }> => {
        try {
            setIsMutating(true);
            await apiClient.delete(`/${slug}/${id}`);
            await reloadData();
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error(String(error))
            };
        } finally {
            setIsMutating(false);
        }
    };

    return { config, data, loading, isMutating, save, orderBy, toggleSort, search, setSearch, remove, filters, setFilters };
};