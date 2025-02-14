import { useContext } from 'react';
import { ModalContext } from '../components/ModalProvider';
import type { ModalContextType } from '../components/types';

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
}; 