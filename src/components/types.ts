export interface ModalConfig {
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  position?: { x: number; y: number };
  size: { width: number | string; height: number | string };
  headerContent: React.ComponentType<ModalHeaderProps>;
}

export interface ModalHeaderProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onClose: () => void;
  isFullscreen: boolean;
  dragHandleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onDoubleClick: () => void;
  };
}

export interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: (id: string) => void;
  modals: ModalConfig[];
} 