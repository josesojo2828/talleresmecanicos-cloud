import { create } from 'zustand';
import { toast } from 'sonner';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Alert {
    id: string;
    message: string;
    type: AlertType;
    duration?: number;
}

interface AlertState {
    alerts: Alert[];
    addAlert: (message: string, type?: AlertType, duration?: number) => void;
    removeAlert: (id: string) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    alerts: [],
    addAlert: (message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substring(7);
        
        // Disparar toast de Sonner
        if (type === 'success') toast.success(message, { duration });
        else if (type === 'error') toast.error(message, { duration });
        else if (type === 'warning') toast.warning(message, { duration });
        else toast.info(message, { duration });

        set((state) => ({
            alerts: [...state.alerts, { id, message, type, duration }],
        }));

        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    alerts: state.alerts.filter((alert) => alert.id !== id),
                }));
            }, duration);
        }
    },
    removeAlert: (id) =>
        set((state) => ({
            alerts: state.alerts.filter((alert) => alert.id !== id),
        })),
}));
