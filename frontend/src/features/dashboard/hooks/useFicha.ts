"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/utils/api/api.client';
import { useAlertStore } from '@/store/useAlertStore';

export function useFicha(slug: string, id: string) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const { addAlert } = useAlertStore();

    const fetchRecord = async () => {
        setLoading(true);
        try {
            // We expect the backend to support some 'include' or just return relations in the detail endpoint if possible
            // If not, we might need specialized endpoints, but let's try the generic one first.
            const res = await apiClient.get(`/${slug}/${id}`);
            setData(res.data?.body || res.data);
        } catch (error) {
            console.error("Error fetching record:", error);
            addAlert({
                type: 'error',
                title: 'Error de carga',
                message: 'No pudimos recuperar la información del registro.'
            });
        } finally {
            setLoading(false);
        }
    };

    const updateRecord = async (formData: any) => {
        setIsMutating(true);
        try {
            const res = await apiClient.patch(`/${slug}/${id}`, formData);
            const updated = res.data?.body || res.data;
            setData(updated);
            addAlert({
                type: 'success',
                title: 'Registro actualizado',
                message: 'Los cambios se han guardado correctamente.'
            });
            return { success: true };
        } catch (error) {
            addAlert({
                type: 'error',
                title: 'Error al actualizar',
                message: 'No se pudieron guardar los cambios.'
            });
            return { success: false };
        } finally {
            setIsMutating(false);
        }
    };

    useEffect(() => {
        if (slug && id) fetchRecord();
    }, [slug, id]);

    return { data, loading, isMutating, updateRecord, refresh: fetchRecord };
}
