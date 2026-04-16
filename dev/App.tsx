import { useRef } from "react";
import {
  useDraggableWindow,
  useResizableWindow,
  WindowProvider,
  type WindowRefType,
  WindowWrapper,
} from "../src";
import { WindowManagerProvider } from "../src/react/WindowManagerProvider.tsx";
import { useWindowContext } from "../src/core/useWindowContext.ts";
// import {
//   WindowProvider,
//   WindowWrapper,
//   type WindowRefType,
//   useDraggableWindow,
//   useResizableWindow,
// } from "react-window-modals";

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
  const { isActive } = useWindowContext();

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        cursor: "move",
        background: isActive ? "red" : "#ccc",
        padding: "10px",
      }}
    >
      Drag Me, {isActive && "Active Now!"}
    </div>
  );
}

export default function App() {
  const windowRef = useRef<WindowRefType>(null);
  const windowRef2 = useRef<WindowRefType>(null);

  return (
    <div>
      <button onClick={() => windowRef.current?.open()}>Open Window 1</button>
      <button onClick={() => windowRef2.current?.open()}>Open Window 2</button>
      <button onClick={() => windowRef.current?.bringToFront()}>
        Bring Front 1
      </button>
      <button onClick={() => windowRef2.current?.bringToFront()}>
        Bring Front 2
      </button>
      <WindowManagerProvider>
        <WindowProvider
          id="modal"
          ref={windowRef}
          initialOpen={false}
          initialPosition={{ x: "center", y: "center" }} // Support for pixels, CSS percentages ("50%"), or "center"
          initialSize={{ width: 400, height: 300 }}
          constrain={{ minX: 0, minY: 0, maxX: "100%", maxY: "100%" }}
          // scaleMultiplier={0.5}
        >
          <WindowWrapper
            style={{
              // position: "relative",
              backgroundColor: "white",
              border: "1px solid black",
            }}
          >
            <WindowHeader />
            <WindowResizer />
            <div style={{ padding: "20px" }}>
              <p>Welcome to the custom react window modal! 1</p>
              <button onClick={() => windowRef.current?.close()}>Close</button>
            </div>
          </WindowWrapper>
        </WindowProvider>
        <WindowProvider
          id="modal2"
          activateOnMouseEnter
          ref={windowRef2}
          initialOpen={false}
          initialPosition={{ x: "center", y: "center" }} // Support for pixels, CSS percentages ("50%"), or "center"
          initialSize={{ width: 400, height: 300 }}
          constrain={{
            minX: 0,
            minY: 0,
            maxX: "100%",
            maxY: "100%",
            snap: {
              edges: true,
              gridSize: 120,
              threshold: 10,
            },
          }}

          // scaleMultiplier={0.5}
        >
          <WindowWrapper
            style={{
              // position: "relative",
              backgroundColor: "white",
              border: "10px solid black",
            }}
          >
            <WindowHeader />
            <WindowResizer />
            <div style={{ padding: "20px" }}>
              <p>Welcome to the custom react window modal! 2</p>
              <button onClick={() => windowRef2.current?.close()}>Close</button>
            </div>
          </WindowWrapper>
        </WindowProvider>
      </WindowManagerProvider>
    </div>
  );
}
