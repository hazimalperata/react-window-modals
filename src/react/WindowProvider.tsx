import {
  forwardRef,
  type PropsWithChildren,
  useCallback,
  useImperativeHandle,
  useState,
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

/**
 * Props for the WindowProvider component.
 */
type WindowProviderProps = {
  initialOpen?: boolean; // Whether the window should be initially open
  initialPosition?: InitialWindowPosition; // The starting position to mount the window. Can be pixels or percentages.
  initialSize?: InitialWindowSize; // The starting dimensions.
  constrain?: WindowConstrain; // Area boundaries for moving and resizing
  updateSizeWithContent?: boolean; // If true, size expands based on children content instead of being fixed
  scaleMultiplier?: number; // Visual scale adjustment
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
    initialPosition,
    initialSize,
    initialOpen,
    constrain,
    updateSizeWithContent,
    scaleMultiplier = 1,
  } = props;

  const [isOpen, setIsOpen] = useState(!!initialOpen);
  
  const [size, setSize] = useState<WindowSize>(() => ({
    width: calcWinPercentage(initialSize?.width, window.innerWidth, undefined),
    height: calcWinPercentage(initialSize?.height, window.innerHeight, undefined),
  }));

  const [position, setPosition] = useState<WindowPosition>(() => ({
    x: calcWinPercentage(
      initialPosition?.x,
      window.innerWidth,
      calcWinPercentage(constrain?.minX, window.innerWidth, 0),
      calcWinPercentage(initialSize?.width, window.innerWidth, 0)
    ),
    y: calcWinPercentage(
      initialPosition?.y,
      window.innerHeight,
      calcWinPercentage(constrain?.minY, window.innerHeight, 0),
      calcWinPercentage(initialSize?.height, window.innerHeight, 0)
    ),
  }));
  
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);

  const changeOpen = useCallback((newValue?: boolean) => {
    if (newValue === undefined) setIsOpen((x) => !x);
    else setIsOpen(newValue);
  }, []);

  // Hook up external ref controls (open/close/toggle)
  useImperativeHandle(
    ref,
    () => ({
      open: () => changeOpen(true),
      close: () => changeOpen(false),
      toggle: changeOpen,
    }),
    [changeOpen],
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
        constrain,
        updateSizeWithContent,
        scaleMultiplier,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
});
