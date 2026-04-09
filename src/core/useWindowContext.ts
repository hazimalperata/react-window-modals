import { createContext, useContext } from "react";
import type { WindowPosition } from "../types/position.ts";
import type { WindowSize } from "../types/size.ts";
import type { WindowConstrain } from "../types/constrain.ts";

/**
 * Type definition for the WindowContext.
 * This context holds the global state for a single window instance, including its
 * dimensions, position, dragging/resizing status, and constraints.
 */
type WindowContextType = {
  isOpen: boolean; // Indicates if the window is currently open/visible
  setIsOpen: (isOpen: boolean) => void;
  position: WindowPosition; // Current X and Y coordinates of the window relative to the screen/container
  setPosition: (pos: WindowPosition) => void;
  size: WindowSize; // Current width and height of the window
  setSize: (size: WindowSize) => void;
  dragging: boolean; // Indicates if the window is currently being dragged
  setDragging: (dragging: boolean) => void;
  resizing: boolean; // Indicates if the window is currently being resized
  setResizing: (resizing: boolean) => void;
  constrain: WindowConstrain | undefined; // Constraints defining min/max boundaries for positioning and resizing
  updateSizeWithContent: boolean | undefined; // If true, the window size automatically adjusts to fit its children content
};

/**
 * React context used to share window state among internal hooks and components.
 * This should not be used directly outside of the library.
 */
export const WindowContext = createContext<WindowContextType | null>(null);

/**
 * Hook to access the window context. 
 * Must be used within a component wrapped by <WindowProvider>.
 */
export const useWindowContext = () => {
  const ctx = useContext(WindowContext);
  if (!ctx)
    throw new Error("useWindowContext must be used inside WindowProvider");
  return ctx;
};
