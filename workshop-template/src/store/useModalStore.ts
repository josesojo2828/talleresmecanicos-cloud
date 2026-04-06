import { create } from 'zustand';

interface ModalState {
    isOpen: boolean;
    view: string | null; // Identifier for which modal component to render
    data: any | null; // Data to pass to the modal
    openModal: (view: string, data?: any) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    view: null,
    data: null,
    openModal: (view, data = null) => set({ isOpen: true, view, data }),
    closeModal: () => set({ isOpen: false, view: null, data: null }),
}));
