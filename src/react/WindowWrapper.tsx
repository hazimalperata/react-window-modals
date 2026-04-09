import { useWindowContext } from "../core/useWindowContext.ts";
import { type PropsWithChildren, useEffect, useRef } from "react";

type WindowWrapperProps = {
  style?: React.CSSProperties;
};

export function WindowWrapper(props: PropsWithChildren<WindowWrapperProps>) {
  const { children, style } = props;

  const { isOpen, position, size, setSize, updateSizeWithContent, resizing } =
    useWindowContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // İçeriğe göre boyut güncelleme
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
      style={{
        display: isOpen ? "block" : "none",
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: "transform",
        height: size.height,
        width: size.width,
        ...style,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
