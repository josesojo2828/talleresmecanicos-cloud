"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/utils/api/api.client";

interface DashboardStats {
    stats: any;
    workshop: any;
    timeline: any[];
    recent: {
        appointments: any[];
        publications: any[];
        works: any[];
    };
}

export const useDashboardStats = () => {
    const { user } = useAuthStore();
    const [workshopStats, setWorkshopStats] = useState<DashboardStats | null>(null);
    const [clientStats, setClientStats] = useState<any>(null);
    const [adminStats, setAdminStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const reloadStats = async () => {
        if (!user) return;

        setLoading(true);
        try {
            if (user.role === 'TALLER') {
                const res = await apiClient.get('/my-workshop/dashboard-stats');
                setWorkshopStats(res.data?.body || res.data || null);
            } else if (user.role === 'ADMIN' || user.role === 'SUPPORT') {
                const res = await apiClient.get('/admin/dashboard/summary');
                setAdminStats(res.data.body);
            } else if (user.role === 'CLIENT') {
                const res = await apiClient.get('/dashboard/client-stats');
                setClientStats(res.data.body);
            }
        } catch (error) {
            console.error("[useDashboardStats] Error fetching dashboard summary:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) reloadStats();
    }, [user]);

    return {
        user,
        workshopStats,
        clientStats,
        adminStats,
        loading,
        reloadStats
    };
};
