import { createContext, useContext } from "react";

type WindowManagerContextType = {
  activeWindowId: string | null;
  setActiveWindowId: (id: string | null) => void;
  bringToFront: (id: string) => void;
  zIndexMap: Record<string, number>;
};

export const WindowManagerContext =
  createContext<WindowManagerContextType | null>(null);

export const useWindowManager = () => {
  const ctx = useContext(WindowManagerContext);
  if (!ctx)
    throw new Error(
      "useWindowManager must be used inside WindowManagerProvider",
    );
  return ctx;
};
