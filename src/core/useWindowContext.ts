import { createContext, useContext } from "react";
import type { WindowPosition } from "../types/position.ts";
import type { WindowSize } from "../types/size.ts";
import type { WindowConstrain } from "../types/constrain.ts";

type WindowContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  position: WindowPosition;
  setPosition: (pos: WindowPosition) => void;
  size: WindowSize;
  setSize: (size: WindowSize) => void;
  dragging: boolean;
  setDragging: (dragging: boolean) => void;
  resizing: boolean;
  setResizing: (resizing: boolean) => void;
  constrain: WindowConstrain | undefined;
  updateSizeWithContent: boolean | undefined;
};

export const WindowContext = createContext<WindowContextType | null>(null);

export const useWindowContext = () => {
  const ctx = useContext(WindowContext);
  if (!ctx)
    throw new Error("useWindowContext must be used inside WindowProvider");
  return ctx;
};
