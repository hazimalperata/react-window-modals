import { useRef } from "react";
import {
  WindowProvider,
  WindowWrapper,
  type WindowRefType,
  useDraggableWindow,
  useResizableWindow,
} from "react-window-modals";

function WindowResizer() {
  const { onResizeStart } = useResizableWindow("left");

  return (
    <span
      onMouseDown={onResizeStart}
      onTouchStart={onResizeStart}
      style={{
        cursor: "w-resize",
        width: 1,
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
      }}
    />
  );
}

function WindowHeader() {
  const { onMouseDown, onTouchStart } = useDraggableWindow();

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{ cursor: "move", background: "#ccc", padding: "10px" }}
    >
      Drag Me
    </div>
  );
}

export default function App() {
  const windowRef = useRef<WindowRefType>(null);

  return (
    <div>
      <button onClick={() => windowRef.current?.open()}>Open Window</button>

      <WindowProvider
        ref={windowRef}
        initialOpen={false}
        initialPosition={{ x: "center", y: "center" }} // Support for pixels, CSS percentages ("50%"), or "center"
        initialSize={{ width: 400, height: "40%" }}
        constrain={{ minX: 0, minY: 0, maxX: "100%", maxY: "100%" }}
      >
        <WindowWrapper
          style={{
            position: "relative",
            backgroundColor: "white",
            border: "1px solid black",
          }}
        >
          <WindowHeader />
          <WindowResizer />
          <div style={{ padding: "20px" }}>
            <p>Welcome to the custom react window modal!</p>
            <button onClick={() => windowRef.current?.close()}>Close</button>
          </div>
        </WindowWrapper>
      </WindowProvider>
    </div>
  );
}
