import React from 'react';
import { ModalProvider, useModal } from './lib';
import { ModalHeaderProps } from './components/types';

const TestComponent = () => {
  return <div>Test Modal Content</div>;
};

const CustomHeader = ({ onClose, dragHandleProps, isFullscreen }: ModalHeaderProps) => (
  <div style={{
    padding: '12px',
    background: '#f5f5f5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <div 
      {...dragHandleProps}
      style={{
        cursor: 'move',
        userSelect: 'none',
        padding: '4px',
        marginRight: '8px'
      }}
    >
      ⋮⋮
    </div>
    <h3 style={{ margin: 0, flex: 1 }}>Custom Header</h3>
    <button 
      onClick={onClose}
      style={{
        padding: '4px 8px',
        border: 'none',
        background: '#e0e0e0',
        cursor: 'pointer',
        borderRadius: '4px'
      }}
    >
      Close
    </button>
  </div>
);

const DemoComponent = () => {
  const { openModal } = useModal();

  const handleOpenModal = () => {
    openModal({
      id: 'test-modal',
      component: TestComponent,
      position: { x: 100, y: 100 },
      size: { width: 300, height: 200 },
      headerContent: CustomHeader
    });
  };

  return (
    <button onClick={handleOpenModal}>
      Open Modal
    </button>
  );
};

function App() {
  return (
    <ModalProvider>
      <div style={{ padding: 20 }}>
        <h1>Modal Demo</h1>
        <DemoComponent />
      </div>
    </ModalProvider>
  );
}

export default App; 