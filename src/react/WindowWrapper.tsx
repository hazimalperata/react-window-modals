import { useWindowContext } from "../core/useWindowContext.ts";
import { type PropsWithChildren, useEffect, useRef } from "react";
import { useWindowManager } from "../core/useWindowManager.ts";

/**
 * Props for WindowWrapper.
 */
type WindowWrapperProps = {
  style?: React.CSSProperties; // Optional inline styles. Positioning and size will be controlled primarily by WindowContext.
};

/**
 * The Wrapper component that physically renders and translates your content.
 * It reads position, size, and visibility states from the WindowProvider to update the DOM.
 */
export function WindowWrapper(props: PropsWithChildren<WindowWrapperProps>) {
  const { children, style } = props;

  const {
    isOpen,
    position,
    size,
    setSize,
    updateSizeWithContent,
    resizing,
    zIndex,
    id,
    activateOnMouseEnter,
    className,
    style: contextStyle,
    setIsFocused,
  } = useWindowContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { bringToFront } = useWindowManager();

  // ResizeObserver to track intrinsic content size changes when `updateSizeWithContent` is enabled.
  useEffect(() => {
    if (!updateSizeWithContent || !contentRef.current || !isOpen || resizing)
      return;

    const el = contentRef.current;

    const observer = new ResizeObserver(() => {
      const nextHeight = el.scrollHeight;
      const nextWidth = el.scrollWidth;

      setSize({
        width: nextWidth,
        height: nextHeight,
      });
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [updateSizeWithContent, isOpen, setSize, resizing]);

  return (
    <div
      ref={containerRef}
      data-window-id={id}
      className={className}
      onMouseDown={() => {
        bringToFront(id);
        setIsFocused(true);
      }}
      onMouseEnter={() => {
        if (activateOnMouseEnter) bringToFront(id);
      }}
      onBlur={() => setIsFocused(false)}
      tabIndex={-1}
      style={{
        display: isOpen ? "block" : "none",
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: "transform",
        height: size.height,
        width: size.width,
        zIndex: zIndex,
        boxSizing: "border-box",
        ...contextStyle,
        ...style,
      }}
    >
      <div ref={contentRef} style={{ width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}
