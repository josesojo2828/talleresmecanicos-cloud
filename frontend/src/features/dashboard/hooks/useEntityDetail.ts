"use client";

import { useEffect, useState, useCallback } from "react";
import apiClient from "@/utils/api/api.client";

export function useEntityDetail<T>(slug: string, id: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDetail = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/${slug}/${id}`);
            const result = response.data?.body || response.data;
            setData(result as T);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [slug, id]);

    useEffect(() => {
        if (slug && id) fetchDetail();
    }, [slug, id, fetchDetail]);

    return { data, loading, error, refresh: fetchDetail };
}