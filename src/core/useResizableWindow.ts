import { useWindowContext } from "./useWindowContext.ts";
import { useRef, useState } from "react";
import { calcWinPercentage } from "../utils/calcWinPercentage.ts";
import {
  WindowDirections,
  type WindowResizeDirection,
} from "../types/direction.ts";

export const useResizableWindow = (direction: WindowResizeDirection) => {
  const {
    size,
    setSize,
    position,
    setPosition,
    constrain,
    resizing,
    setResizing,
  } = useWindowContext();
  const [directionResizing, setDirectionResizing] =
    useState<WindowResizeDirection | null>(null);

  const start = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 });

  const onResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDirectionResizing(direction);
    setResizing(true);
    start.current = {
      x: clientX,
      y: clientY,
      width: size.width,
      height: size.height,
      left: position.x,
      top: position.y,
    };

    const moveHandler = (ev: MouseEvent | TouchEvent) => {
      const currX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
      const currY = "touches" in ev ? ev.touches[0].clientY : ev.clientY;

      let newWidth = start.current.width;
      let newHeight = start.current.height;
      let newLeft = start.current.left;
      let newTop = start.current.top;

      // Yatay resize
      if (direction === WindowDirections.RIGHT)
        newWidth = start.current.width + (currX - start.current.x);
      if (direction === WindowDirections.LEFT) {
        newWidth = start.current.width - (currX - start.current.x);
        newLeft = start.current.left + (currX - start.current.x);
      }

      // Dikey resize
      if (direction === WindowDirections.BOTTOM)
        newHeight = start.current.height + (currY - start.current.y);
      if (direction === WindowDirections.TOP) {
        newHeight = start.current.height - (currY - start.current.y);
        newTop = start.current.top + (currY - start.current.y);
      }

      // Constraint uygula
      if (constrain) {
        if (constrain.minX)
          newWidth = Math.max(
            newWidth,
            calcWinPercentage(constrain?.minX, window.innerWidth, -Infinity),
          );
        if (constrain.maxX)
          newWidth = Math.min(
            newWidth,
            calcWinPercentage(constrain?.maxX, window.innerWidth, Infinity),
          );
        if (constrain.minY)
          newHeight = Math.max(
            newHeight,
            calcWinPercentage(constrain?.minY, window.innerHeight, -Infinity),
          );
        if (constrain.maxY)
          newHeight = Math.min(
            newHeight,
            calcWinPercentage(constrain?.maxY, window.innerHeight, Infinity),
          );

        // Ekran dışına taşma
        if (newLeft < 0) {
          newWidth += newLeft;
          newLeft = 0;
        }
        if (newTop < 0) {
          newHeight += newTop;
          newTop = 0;
        }
        if (newLeft + newWidth > window.innerWidth)
          newWidth = window.innerWidth - newLeft;
        if (newTop + newHeight > window.innerHeight)
          newHeight = window.innerHeight - newTop;
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newLeft, y: newTop });
    };

    const stopHandler = () => {
      setResizing(false);
      setDirectionResizing(null);
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", stopHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", stopHandler);
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", stopHandler);
    window.addEventListener("touchmove", moveHandler, { passive: false });
    window.addEventListener("touchend", stopHandler);
  };

  return { onResizeStart, resizing, directionResizing };
};
