import { WindowProvider } from "../src/react/WindowProvider.tsx";
import { WindowWrapper } from "../src/react/WindowWrapper.tsx";
import { useEffect, useRef } from "react";
import type { WindowRefType } from "../src/types/ref.ts";
import { useDraggableWindow } from "../src/core/useDraggableWindow.ts";
import { useResizableWindow } from "../src/core/useResizableWindow.ts";
import { WindowDirections } from "../src/types/direction.ts";

const DraggableArea = () => {
  const { onMouseDown, onTouchStart, dragging } = useDraggableWindow();

  useEffect(() => {
    if (dragging) {
      document.body.style.cursor = "grabbing";
    } else {
      document.body.style.cursor = "";
    }
  }, [dragging]);

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{ backgroundColor: dragging ? "red" : "blue" }}
    >
      Suruklemelik alan
    </div>
  );
};

const ResizableArea = () => {
  const { onResizeStart, resizing, directionResizing } = useResizableWindow(
    WindowDirections.LEFT,
  );

  return (
    <div
      onMouseDown={onResizeStart}
      onTouchStart={onResizeStart}
      style={{ backgroundColor: resizing ? "red" : "blue" }}
    >
      Suruklemelik alan
    </div>
  );
};

const ResizableArea2 = () => {
  const { onResizeStart, resizing, directionResizing } = useResizableWindow(
    WindowDirections.RIGHT,
  );

  return (
    <div
      onMouseDown={onResizeStart}
      onTouchStart={onResizeStart}
      style={{
        backgroundColor:
          directionResizing === WindowDirections.RIGHT ? "red" : "blue",
      }}
    >
      Suruklemelik alan
    </div>
  );
};

const WindowInside = () => {
  return (
    <div style={{ backgroundColor: "red" }}>
      <DraggableArea />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ResizableArea />
        <ResizableArea2 />
      </div>
      <div>Selam, pencerenin icinden yaziyorum</div>
    </div>
  );
};

const App = () => {
  const windowRef = useRef<WindowRefType>(null);

  return (
    <>
      <WindowProvider
        initialOpen
        updateSizeWithContent
        ref={windowRef}
        constrain={{
          minX: 0,
          minY: 0,
          maxX: window.innerWidth,
          maxY: window.innerHeight,
        }}
      >
        <WindowWrapper>
          <WindowInside />
        </WindowWrapper>
      </WindowProvider>
      <div>Selam?</div>
      <button onClick={() => windowRef.current?.toggle()}>
        Bas ve acilsin
      </button>
    </>
  );
};

export default App;
