import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ModalConfig } from './types';

interface ModalProps {
  config: ModalConfig;
  onClose: () => void;
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const DEFAULT_SIZE = { width: 300, height: 200 };

const Modal = ({ config, onClose }: ModalProps) => {
  const [position, setPosition] = useState(config.position || { x: 0, y: 0 });
  const [size, setSize] = useState<{ width: number | string; height: number | string }>(
    config.size?.width !== undefined && config.size?.height !== undefined
      ? { width: config.size.width, height: config.size.height }
      : DEFAULT_SIZE
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previousState, setPreviousState] = useState<{
    position: { x: number; y: number };
    size: { width: number | string; height: number | string };
  } | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ isDragging: boolean; startX: number; startY: number }>({
    isDragging: false,
    startX: 0,
    startY: 0,
  });
  const resizeRef = useRef<{
    isResizing: boolean;
    direction: ResizeDirection | null;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startTop: number;
    startLeft: number;
  }>({
    isResizing: false,
    direction: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startTop: 0,
    startLeft: 0,
  });
  const doubleClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);
  const isMouseDownRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;

    if (isFullscreen) {
      clickCountRef.current += 1;
      
      if (clickCountRef.current === 1) {
        doubleClickTimeoutRef.current = setTimeout(() => {
          clickCountRef.current = 0;
          if (isMouseDownRef.current) {
            setIsFullscreen(false);
            if (previousState) {
              setSize(previousState.size);
              const mouseXPercentage = e.clientX / window.innerWidth;
              const modalWidth = typeof previousState.size.width === 'number'
                ? previousState.size.width
                : parseInt(previousState.size.width);
              const newX = e.clientX - (modalWidth * mouseXPercentage);
              const newY = e.clientY - 20;
              
              setPosition({ x: newX, y: newY });
              dragRef.current = {
                isDragging: true,
                startX: e.clientX - newX,
                startY: e.clientY - newY,
              };
            }
          }
        }, 200);
      } else if (clickCountRef.current === 2) {
        clearTimeout(doubleClickTimeoutRef.current!);
        clickCountRef.current = 0;
        handleHeaderDoubleClick();
      }
    } else {
      dragRef.current = {
        isDragging: true,
        startX: e.clientX - position.x,
        startY: e.clientY - position.y,
      };
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: ResizeDirection) => {
    e.stopPropagation();
    isMouseDownRef.current = true;
    const currentWidth = typeof size.width === 'number' ? size.width : parseInt(size.width);
    const currentHeight = typeof size.height === 'number' ? size.height : parseInt(size.height);
    
    resizeRef.current = {
      isResizing: true,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: currentWidth,
      startHeight: currentHeight,
      startTop: position.y,
      startLeft: position.x,
    };
  };

  const handleHeaderDoubleClick = () => {
    if (isFullscreen) {
      setIsFullscreen(false);
      if (previousState) {
        setPosition(previousState.position);
        setSize(previousState.size);
      }
    } else {
      setPreviousState({ position, size });
      setIsFullscreen(true);
      setPosition({ x: 0, y: 0 });
      setSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      dragRef.current.isDragging = false;
      resizeRef.current.isResizing = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;
      
      if (dragRef.current.isDragging) {
        setPosition({
          x: e.clientX - dragRef.current.startX,
          y: e.clientY - dragRef.current.startY,
        });
      }
      if (resizeRef.current.isResizing && resizeRef.current.direction) {
        const dx = e.clientX - resizeRef.current.startX;
        const dy = e.clientY - resizeRef.current.startY;
        const dir = resizeRef.current.direction;

        let newWidth = resizeRef.current.startWidth;
        let newHeight = resizeRef.current.startHeight;
        let newTop = resizeRef.current.startTop;
        let newLeft = resizeRef.current.startLeft;

        // Horizontal resizing
        if (dir.includes('e')) newWidth = Math.max(200, resizeRef.current.startWidth + dx);
        if (dir.includes('w')) {
          const width = Math.max(200, resizeRef.current.startWidth - dx);
          newLeft = resizeRef.current.startLeft + (resizeRef.current.startWidth - width);
          newWidth = width;
        }

        // Vertical resizing
        if (dir.includes('s')) newHeight = Math.max(100, resizeRef.current.startHeight + dy);
        if (dir.includes('n')) {
          const height = Math.max(100, resizeRef.current.startHeight - dy);
          newTop = resizeRef.current.startTop + (resizeRef.current.startHeight - height);
          newHeight = height;
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newLeft, y: newTop });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (doubleClickTimeoutRef.current) {
        clearTimeout(doubleClickTimeoutRef.current);
      }
    };
  }, []);

  const resizeHandleStyle = (direction: ResizeDirection): React.CSSProperties => {
    const isCorner = direction.length === 2;
    const size = isCorner ? 10 : 6;
    const style: React.CSSProperties = {
      position: 'absolute',
      background: 'transparent',
      [direction.includes('n') ? 'top' : direction.includes('s') ? 'bottom' : 'top']: 0,
      [direction.includes('w') ? 'left' : direction.includes('e') ? 'right' : 'left']: 0,
      width: isCorner ? size : direction.includes('n') || direction.includes('s') ? 'calc(100% - 20px)' : size,
      height: isCorner ? size : direction.includes('e') || direction.includes('w') ? 'calc(100% - 20px)' : size,
      cursor: `${direction}-resize`,
      margin: isCorner ? 0 : direction.includes('n') || direction.includes('s') ? '0 10px' : '10px 0',
      userSelect: 'none',
      touchAction: 'none',
      zIndex: 1,
    };
    return style;
  };

  const Component = config.component;
  const HeaderComponent = config.headerContent;

  return (
    <div
      ref={modalRef}
      style={{
        position: 'fixed',
        top: isFullscreen ? 0 : position.y,
        left: isFullscreen ? 0 : position.x,
        width: size.width,
        height: size.height,
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderRadius: isFullscreen ? 0 : '4px',
        overflow: 'hidden',
      }}
    >
      <HeaderComponent
        onMouseDown={handleMouseDown}
        onDoubleClick={handleHeaderDoubleClick}
        onClose={onClose}
        isFullscreen={isFullscreen}
        dragHandleProps={{
          onMouseDown: handleMouseDown,
          onDoubleClick: handleHeaderDoubleClick,
        }}
      />
      <div style={{ height: 'calc(100% - 60px)', overflow: 'auto' }}>
        <Component {...config.props} />
      </div>
      {!isFullscreen && (
        <>
          {(['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as ResizeDirection[]).map((direction) => (
            <div
              key={direction}
              onMouseDown={(e) => handleResizeMouseDown(e, direction)}
              style={resizeHandleStyle(direction)}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Modal; 