import { useState, type PropsWithChildren } from "react";
import { WindowManagerContext } from "../core/useWindowManager";

export const WindowManagerProvider = ({ children }: PropsWithChildren) => {
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [zIndexMap, setZIndexMap] = useState<Record<string, number>>({});

  const bringToFront = (id: string) => {
    setActiveWindowId(id);
    setZIndexMap((prev) => {
      const values = Object.values(prev);
      const maxZ = values.length > 0 ? Math.max(...values) : 0;
      return { ...prev, [id]: maxZ + 1 };
    });
  };

  return (
    <WindowManagerContext.Provider
      value={{ activeWindowId, setActiveWindowId, bringToFront, zIndexMap }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};
