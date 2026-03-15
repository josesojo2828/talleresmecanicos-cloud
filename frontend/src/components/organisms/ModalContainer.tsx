"use client";

import React from "react";
import { useModalStore } from "@/store/useModalStore";
import { Icon } from "@/components/atoms/Icon";
import { Typography } from "@/components/atoms/Typography";

// Registry of modal views
// In a larger app, this could be dynamic, but for now we map string IDs to components
type ModalViewProps = Record<string, unknown>;

const MODAL_VIEWS: Record<string, React.FC<ModalViewProps>> = {
    // Example modals for demo purposes
    "DEMO_MODAL": ({ message }: ModalViewProps) => (
        <div className="p-4">
            <Typography variant="P">{(message as string) || "This is a demo modal content."}</Typography>
        </div>
    ),
};

export const ModalContainer: React.FC = () => {
    const { isOpen, view, data, closeModal } = useModalStore();

    if (!isOpen || !view) return null;

    const ModalComponent = MODAL_VIEWS[view];

    return (
        <div className="modal modal-open">
            <div className="modal-box relative w-full max-w-lg">
                <button
                    onClick={closeModal}
                    className="btn btn-ghost btn-sm btn-circle absolute top-2 right-2"
                >
                    <Icon icon="close" className="h-5 w-5" />
                </button>

                {/* If we had a generic header title in data, we could show it here */}
                <div className="mt-2">
                    {ModalComponent ? (
                        <ModalComponent {...data} />
                    ) : (
                        <div className="p-6 text-error">Modal view &quot;{view}&quot; not found</div>
                    )}
                </div>
            </div>
            <div className="modal-backdrop" onClick={closeModal} />
        </div>
    );
};
