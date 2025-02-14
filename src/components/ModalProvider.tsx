import React, { createContext, useState, useCallback } from 'react';
import { ModalConfig, ModalContextType } from './types';
import Modal from './Modal';

const defaultContext: ModalContextType = {
    openModal: () => {},
    closeModal: () => {},
    modals: []
};

export const ModalContext = createContext<ModalContextType>(defaultContext);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modals, setModals] = useState<ModalConfig[]>([]);


    const openModal = useCallback((config: ModalConfig) => {
        setModals((prev) => [...prev, config]);
    }, []);

    const closeModal = useCallback((id: string) => {
        setModals((prev) => prev.filter((modal) => modal.id !== id));
    }, []);

    return (
        <>
            <ModalContext.Provider value={{ openModal, closeModal, modals }}>
                {children}
                {modals.map((modal) => (
                    <Modal
                        key={modal.id}
                        config={modal}
                        onClose={() => closeModal(modal.id)}
                    />
                ))}
            </ModalContext.Provider>
        </>
    );
}; 