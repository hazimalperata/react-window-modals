# Agent Documentation: react-window-modals

## Meta
- **Package**: `react-window-modals`
- **Version**: `0.1.0`
- **Language**: `TypeScript` / `React`
- **Architecture**: Headless state management with strict bounds configuration.
- **Purpose**: Exposes unstyled logic and minimal wrappers for building draggable, resizable, bound-constrained window/modal elements in React. Maintains state through a React Context provider to decouple internal mathematical logic from the physical UI implementation.

---

## Exports Map
```json
{
  "react": ["WindowProvider", "WindowWrapper"],
  "core (hooks)": ["useDraggableWindow", "useResizableWindow", "useWindowContext"],
  "types": [
    "WindowRefType", 
    "WindowPosition", 
    "WindowSize", 
    "WindowConstrain", 
    "WindowResizeDirection", 
    "WindowDirections"
  ]
}
```

---

## 1. Components

### 1.1. `WindowProvider`
**Functionally**: Manages overarching state configurations for a single, distinct window instance. Handles positioning, bounding geometry, dimensions, and drag/resize toggle statuses. Must wrap target window children.

**Props (`WindowProviderProps`)**:
| Prop | Type | Default | Overview |
|------|------|---------|-------------|
| `initialOpen` | `boolean` | `false` | Mounts window logic as active or hidden. |
| `initialPosition` | `{ x?: number\|string, y?: number\|string }` | `{ x:0, y:0 }` | Initial cartesian offsets relative to the DOM body. Strings parsed as viewport boundary percentage offsets automatically (e.g., `"%50"`). |
| `initialSize` | `{ width?: number\|string, height?: number\|string }` | `{}` | Starting container bounds. Strings map to `%` representation calculations. |
| `constrain` | `WindowConstrain` | `undefined` | Defines hard min/max limits over the viewport the modal is permitted to migrate/expand to. |
| `updateSizeWithContent` | `boolean` | `false` | Triggers recursive inner `ResizeObserver` listener. Forces height/width states to trace internal node intrinsic scaling dynamically. |

**Exposed Ref Object (`WindowRefType`)**:
```ts
{
  open: () => void;
  close: () => void;
  toggle: (newValue?: boolean) => void; // Unspecified toggles previous bool value
}
```

### 1.2. `WindowWrapper`
**Functionally**: Interprets `WindowProvider` context variables and physically paints them as `absolute` style node outputs. Needs to exist strictly under `WindowProvider` block scopes.

**Props (`WindowWrapperProps`)**:
| Prop | Type | Default | Overview |
|------|------|---------|-------------|
| `style` | `React.CSSProperties` | `{}` | Standard CSS injections. *Note*: Properties such as `transform`, `width`, `height`, `display`, and top-left origins are overridden. |

---

## 2. Core Operational Hooks

### 2.1. `useDraggableWindow()`
**Purpose**: Generates interactive logic closures for X/Y pointer movements.

**Returns**:
```ts
{
  onMouseDown: (e: React.MouseEvent) => void,
  onTouchStart: (e: React.TouchEvent) => void,
  dragging: boolean // Context global drag state flag
}
```
**AI Integration Hooking**: Bind `onMouseDown` and `onTouchStart` values specifically to UI fragments that visually act as "drag handles" (e.g., title bars).

### 2.2. `useResizableWindow(direction: WindowResizeDirection)`
**Purpose**: Formulates geometry resizing events matching user pointer actions directed toward standard rectangular edge anchors.

**Returns**:
```ts
{
  onResizeStart: (e: React.MouseEvent | React.TouchEvent) => void,
  resizing: boolean, // Global generic resize flag listener
  directionResizing: WindowResizeDirection | null // Holds which scalar edge is mutating
}
```
**AI Integration Hooking**: Needs to be called multiple times for complex bounding rect expansions. Bind events to invisible border lines (i.e. css rules: `cursor: ew-resize`, `ns-resize`, etc.).

### 2.3. `useWindowContext()`
**Purpose**: Read access logic to all modal state attributes. Avoid using direct modifier functions unless custom math sequences outside `useDraggableWindow` boundary limits are required.

**Context Representation**:
```ts
type WindowContextType = {
  isOpen: boolean; setIsOpen: (val: boolean) => void;
  position: WindowPosition; setPosition: (val: WindowPosition) => void;
  size: WindowSize; setSize: (val: WindowSize) => void;
  dragging: boolean; setDragging: (val: boolean) => void;
  resizing: boolean; setResizing: (val: boolean) => void;
  constrain?: WindowConstrain;
  updateSizeWithContent?: boolean;
}
```

---

## 3. Library Types

### 3.1 `WindowConstrain`
Dictates bounding box collision lines. Values default to exact numeric pixel layouts unless formatted with a leading `%` to simulate standard viewport mappings.
```ts
type WindowConstrainValue = number | `%${number}`;

export type WindowConstrain = {
  minX?: WindowConstrainValue;
  minY?: WindowConstrainValue;
  maxX?: WindowConstrainValue;
  maxY?: WindowConstrainValue;
};
```

### 3.2 `WindowResizeDirection`
Edge anchors utilized for coordinate math in `useResizableWindow()`.
```ts
export enum WindowDirections {
  TOP = "top",
  RIGHT = "right",
  BOTTOM = "bottom",
  LEFT = "left",
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right",
}
export type WindowResizeDirection = WindowDirections;
```

---

## 4. Automation & Agentic Deployment Pattern

```tsx
import React, { useRef } from "react";
import { 
  WindowProvider, 
  WindowWrapper, 
  WindowRefType, 
  WindowDirections 
} from "react-window-modals";
import { useDraggableWindow } from "react-window-modals/core/useDraggableWindow";
import { useResizableWindow } from "react-window-modals/core/useResizableWindow";

// Snippet: Hook implementations inside nested children.
const DraggableHeader = () => {
  const { onMouseDown, onTouchStart } = useDraggableWindow();
  return (
     <div 
       onMouseDown={onMouseDown} 
       onTouchStart={onTouchStart} 
       className="w-full h-[40px] cursor-move bg-slate-900 text-white select-none shadow-md"
     >
       <h2>Window Handler</h2>
     </div>
  );
};

const ResizableBorder = ({ direction, className }: { direction: WindowDirections, className: string }) => {
  const { onResizeStart } = useResizableWindow(direction);
  return (
     <div 
       onMouseDown={onResizeStart} 
       onTouchStart={onResizeStart} 
       className={`absolute ${className}`} 
     />
  );
};

// Snippet: Core parent structure and ref hook configuration
export const ControllerNode = () => {
  const winRef = useRef<WindowRefType>(null);
  
  return (
    <>
      <button onClick={() => winRef.current?.toggle()}>Activate Model</button>
      
      <WindowProvider 
        ref={winRef} 
        initialOpen={false}
        constrain={{ minX: 0, maxX: "%100", minY: 0, maxY: "%100" }} // Window isolated strictly to screen
        initialSize={{ width: 450, height: 350 }}
        initialPosition={{ x: "%20", y: "%20" }} // Center approximate layout offsets
      >
        <WindowWrapper style={{ border: '2px solid #ccc', backgroundColor: '#fff', position: 'relative' }}>
          <DraggableHeader />
          <div className="p-4" style={{ height: 'calc(100% - 40px)', overflow: 'auto' }}>
            <p>Target UI Canvas Body Context</p>
          </div>

          {/* Binding Resize Hooks to Edges */}
          <ResizableBorder direction={WindowDirections.RIGHT} className="right-0 top-0 w-2 h-full cursor-e-resize" />
          <ResizableBorder direction={WindowDirections.BOTTOM} className="left-0 bottom-0 w-full h-2 cursor-s-resize" />
        </WindowWrapper>
      </WindowProvider>
    </>
  );
};
```
