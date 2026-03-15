import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { useAlertStore } from '@/store/useAlertStore';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const { token, language } = useAuthStore.getState();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        if (language) config.headers['Accept-Language'] = language;
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => {
        const { method } = response.config;
        const { addAlert } = useAlertStore.getState();

        const methodsToNotify = ['post', 'put', 'patch', 'delete'];

        if (method && methodsToNotify.includes(method.toLowerCase())) {
            const message = response.data?.message;
            if (message && message !== "events.success.default") {
                addAlert(message, 'success');
            }
        }
        return response;
    },
    (error) => {
        const { addAlert } = useAlertStore.getState();
        const { logout } = useAuthStore.getState();
        const config = error.config;

        if (error.response?.status === 401) {
            addAlert("Sesión expirada", 'error');
            logout();
        } else {
            // SILENCIAR alertas en GET para evitar errores acumulados en búsqueda
            if (config?.method?.toLowerCase() !== 'get') {
                const errorMessage = error.response?.data?.message || "common.error.generic";
                addAlert(errorMessage, 'error');
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;