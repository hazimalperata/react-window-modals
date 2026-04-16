import {
  forwardRef,
  type PropsWithChildren,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
  useMemo,
} from "react";
import type {
  InitialWindowPosition,
  WindowPosition,
} from "../types/position.ts";
import { WindowContext } from "../core/useWindowContext.ts";
import { calcWinPercentage } from "../utils/calcWinPercentage.ts";
import type { InitialWindowSize, WindowSize } from "../types/size.ts";
import type { WindowRefType } from "../types/ref.ts";
import type { WindowConstrain } from "../types/constrain.ts";
import { useWindowManager } from "../core/useWindowManager.ts";

/**
 * Props for the WindowProvider component.
 */
type WindowProviderProps = {
  id: string;
  initialOpen?: boolean;
  initialPosition?: InitialWindowPosition;
  initialSize?: InitialWindowSize;
  constrain?: WindowConstrain;
  updateSizeWithContent?: boolean;
  scaleMultiplier?: number;
  onPositionChange?: (position: WindowPosition) => void;
  onSizeChange?: (size: WindowSize) => void;
  persist?: {
    key: string;
    storage?: Storage;
  };
  className?: string;
  style?: React.CSSProperties;
  activateOnMouseEnter?: boolean;
};

/**
 * The core Provider that acts as a boundary for a single window instance.
 * It manages the local state (position, size, visibility, interactions) and
 * exposes an API via ref for external control.
 */
export const WindowProvider = forwardRef<
  WindowRefType,
  PropsWithChildren<WindowProviderProps>
>(function WindowProvider(props, ref) {
  const {
    children,
    id,
    initialPosition,
    initialSize,
    initialOpen,
    constrain,
    updateSizeWithContent,
    scaleMultiplier = 1,
    persist,
    onPositionChange,
    onSizeChange,
    className,
    style,
    activateOnMouseEnter = false,
  } = props;

  const { activeWindowId, bringToFront, zIndexMap } = useWindowManager();

  const [isOpen, setIsOpen] = useState(() => {
    if (persist) {
      const saved = (persist.storage || localStorage).getItem(
        `${persist.key}-open`,
      );
      return saved ? JSON.parse(saved) : !!initialOpen;
    }
    return !!initialOpen;
  });

  const [size, setSize] = useState<WindowSize>(() => {
    if (persist) {
      const saved = (persist.storage || localStorage).getItem(
        `${persist.key}-size`,
      );
      if (saved) return JSON.parse(saved);
    }
    return {
      width: calcWinPercentage(
        initialSize?.width,
        window.innerWidth,
        undefined,
      ),
      height: calcWinPercentage(
        initialSize?.height,
        window.innerHeight,
        undefined,
      ),
    };
  });

  const [position, setPosition] = useState<WindowPosition>(() => {
    if (persist) {
      const saved = (persist.storage || localStorage).getItem(
        `${persist.key}-pos`,
      );
      if (saved) return JSON.parse(saved);
    }
    return {
      x: calcWinPercentage(
        initialPosition?.x,
        window.innerWidth,
        calcWinPercentage(constrain?.minX, window.innerWidth, 0),
        calcWinPercentage(initialSize?.width, window.innerWidth, 0),
      ),
      y: calcWinPercentage(
        initialPosition?.y,
        window.innerHeight,
        calcWinPercentage(constrain?.minY, window.innerHeight, 0),
        calcWinPercentage(initialSize?.height, window.innerHeight, 0),
      ),
    };
  });

  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [prevSize, setPrevSize] = useState<WindowSize>(size);
  const [prevPosition, setPrevPosition] = useState<WindowPosition>(position);
  const [zIndex, setZIndex] = useState(0);

  const isActive = useMemo(() => {
    return id === activeWindowId;
  }, [activeWindowId, id]);

  const changeOpen = useCallback((newValue?: boolean) => {
    if (newValue === undefined) setIsOpen((x: boolean) => !x);
    else setIsOpen(newValue);
  }, []);

  const minimize = useCallback(() => {
    setIsMinimized(true);
    setIsMaximized(false);
  }, []);

  const maximize = useCallback(() => {
    setPrevSize(size);
    setPrevPosition(position);
    setSize({ width: window.innerWidth, height: window.innerHeight });
    setPosition({ x: 0, y: 0 });
    setIsMaximized(true);
    setIsMinimized(false);
  }, [size, position, setSize, setPosition]);

  const restore = useCallback(() => {
    if (isMaximized) {
      setSize(prevSize);
      setPosition(prevPosition);
    }
    setIsMinimized(false);
    setIsMaximized(false);
  }, [isMaximized, prevSize, prevPosition, setSize, setPosition]);

  useEffect(() => {
    if (persist) {
      const storage = persist.storage || localStorage;
      storage.setItem(`${persist.key}-open`, JSON.stringify(isOpen));
      storage.setItem(`${persist.key}-size`, JSON.stringify(size));
      storage.setItem(`${persist.key}-pos`, JSON.stringify(position));
    }
  }, [isOpen, size, position, persist]);
  useEffect(() => {
    onPositionChange?.(position);
  }, [position, onPositionChange]);

  useEffect(() => {
    onSizeChange?.(size);
  }, [size, onSizeChange]);

  useEffect(() => {
    if (zIndexMap[id] !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setZIndex(zIndexMap[id]);
    }
  }, [zIndexMap, id]);

  // Hook up external ref controls (open/close/toggle)
  useImperativeHandle(
    ref,
    () => ({
      open: () => changeOpen(true),
      close: () => changeOpen(false),
      toggle: changeOpen,
      minimize,
      maximize,
      restore,
      bringToFront: () => bringToFront(id),
    }),
    [changeOpen, minimize, maximize, restore, bringToFront, id],
  );

  return (
    <WindowContext.Provider
      value={{
        isOpen,
        setIsOpen,
        position,
        setPosition,
        dragging,
        setDragging,
        size,
        setSize,
        resizing,
        setResizing,
        isMinimized,
        setIsMinimized,
        isMaximized,
        setIsMaximized,
        isFocused,
        setIsFocused,
        zIndex,
        setZIndex,
        id,
        activateOnMouseEnter,
        constrain,
        updateSizeWithContent,
        scaleMultiplier,
        className,
        style,
        isActive,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
});
