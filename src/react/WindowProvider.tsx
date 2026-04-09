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

type WindowProviderProps = {
  initialOpen?: boolean;
  initialPosition?: InitialWindowPosition;
  initialSize?: InitialWindowSize;
  constrain?: WindowConstrain;
  updateSizeWithContent?: boolean;
};

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
  } = props;

  const [isOpen, setIsOpen] = useState(!!initialOpen);
  const [position, setPosition] = useState<WindowPosition>(() => ({
    x: calcWinPercentage(
      initialPosition?.x,
      window.innerWidth,
      calcWinPercentage(constrain?.minX, window.innerWidth, 0),
    ),
    y: calcWinPercentage(
      initialPosition?.y,
      window.innerHeight,
      calcWinPercentage(constrain?.minY, window.innerHeight, 0),
    ),
  }));
  const [size, setSize] = useState<WindowSize>(() => ({
    width: calcWinPercentage(initialSize?.width, window.innerWidth),
    height: calcWinPercentage(initialSize?.height, window.innerHeight),
  }));
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);

  const changeOpen = useCallback((newValue?: boolean) => {
    if (newValue === undefined) setIsOpen((x) => !x);
    else setIsOpen(newValue);
  }, []);

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
      }}
    >
      {children}
    </WindowContext.Provider>
  );
});
