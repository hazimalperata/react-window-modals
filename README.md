# react-window-modals

A flexible, customizable, and lightweight React library for creating draggable, resizable, and context-managed window modals. Perfect for building desktop-like experiences on the web.

## Features

- **Draggable & Resizable**: Full support for intuitive drag and resize operations.
- **Constraints Handling**: Keep windows confined within specified boundaries (pixels or percentages).
- **Responsive Sizing**: Initialize windows with specific pixel sizes or screen percentages (`"50%"` etc).
- **Auto-Content Sizing**: Optional `updateSizeWithContent` property allowing a window to grow based on its children's dimensions.
- **Hooks & Context**: Headless logic exported as hooks (`useDraggableWindow`, `useResizableWindow`) to let you build your own UI.
- **TypeScript**: First-class TS support with strict typings.

## Installation

```bash
npm install react-window-modals
```
or
```bash
yarn add react-window-modals
```
or
```bash
pnpm add react-window-modals
```

## Basic Usage

The library operates fundamentally using a `<WindowProvider>` to establish the state, and `<WindowWrapper>` to physically render the movable/resizable box. You add your own visual UI (borders, headers, resize handles) inside the Wrapper.

```tsx
import { useRef } from 'react';
import {
  WindowProvider,
  WindowWrapper,
  WindowRefType,
  useDraggableWindow, // A custom header component that implements drag using the exposed hook
} from 'react-window-modals';

function WindowHeader() {
  const { onMouseDown, onTouchStart } = useDraggableWindow();
  
  return (
    <div 
      onMouseDown={onMouseDown} 
      onTouchStart={onTouchStart}
      style={{ cursor: 'move', background: '#ccc', padding: '10px' }}
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
        <WindowWrapper style={{ backgroundColor: 'white', border: '1px solid black' }}>
          <WindowHeader />
          <div style={{ padding: '20px' }}>
            <p>Welcome to the custom react window modal!</p>
            <button onClick={() => windowRef.current?.close()}>Close</button>
          </div>
        </WindowWrapper>
      </WindowProvider>
    </div>
  );
}
```

## Advanced Usage & Edge Cases

### 1. Resizing Setup with `useResizableWindow`
To enable resizing, you need to use the `useResizableWindow` hook and bind it to visual "handles" on the edges or corners of your window.

```tsx
import { WindowDirections, useResizableWindow } from 'react-window-modals';

// A reusable resize border component
function ResizeHandle({ direction, className }) {
  const { onResizeStart } = useResizableWindow(direction);
  return (
    <div
      onMouseDown={onResizeStart}
      onTouchStart={onResizeStart}
      className={className}
      style={{ position: 'absolute' }}
    />
  );
}

// Inside your WindowWrapper:
<WindowWrapper style={{ position: 'relative', border: '1px solid black' }}>
  {/* Right Border for resizing Width */}
  <ResizeHandle 
    direction={WindowDirections.RIGHT} 
    className="resize-right" 
    style={{ right: 0, top: 0, width: '10px', height: '100%', cursor: 'e-resize' }} 
  />
  
  {/* Bottom Border for resizing Height */}
  <ResizeHandle 
    direction={WindowDirections.BOTTOM} 
    className="resize-bottom" 
    style={{ left: 0, bottom: 0, width: '100%', height: '10px', cursor: 's-resize' }} 
  />
  
  <div>Window Content</div>
</WindowWrapper>
```

### 2. Auto-Sizing to Content (`updateSizeWithContent`)
If you want the modal to automatically grow as its content changes without manually setting dimensions, you can use `updateSizeWithContent`.

```tsx
<WindowProvider
  initialOpen={true}
  initialPosition={{ x: "center", y: "center" }} // You can parse offsets easily
  updateSizeWithContent={true} // Automatically track the intrinsic heights of children
>
  <WindowWrapper style={{ backgroundColor: 'white' }}>
    <div style={{ padding: '20px' }}>
      <h3>Dynamic Content Box</h3>
      <p>If you add more text or nodes here dynamically, the window boundary will expand perfectly to fit the content via ResizeObserver tracking.</p>
    </div>
  </WindowWrapper>
</WindowProvider>
```

## Advanced Customization (Hooks)

`react-window-modals` provides hooks to build custom window interactions. These hooks *must* be called from a component rendered inside `<WindowProvider>`.

- `useDraggableWindow()`: Returns `{ onMouseDown, onTouchStart, dragging }`. Attach the handlers to a header/handle element.
- `useResizableWindow(direction)`: Supply a direction (`TOP`, `BOTTOM`, `LEFT`, `RIGHT`) to receive `{ onResizeStart, resizing, directionResizing }`. Attach to a resize handler border or corner.
- `useWindowContext()`: Provides all window states directly if you want full manual control over X/Y `position` and `size`.

## Props & Types

### WindowProvider Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialOpen` | `boolean` | `false` | Should the window be rendered visible initially? |
| `initialPosition` | `{ x, y }` | `{ x:0, y:0 }` | Initial coords. Supports numbers, percentages (e.g. `"50%"` or `"%50"`), or `"center"`. |
| `initialSize` | `{ width, height }` | `{ width: 0, height: 0 }` | Initial size. Supports numbers or percentages. |
| `constrain` | `WindowConstrain` | `undefined` | Boundaries (`minX`, `minY`, `maxX`, `maxY`). Values can be numeric (pixels) or string percentages (e.g., `"100%"`). |
| `updateSizeWithContent` | `boolean` | `false` | Will automatically size to the boundaries of the internal React children, based on `ResizeObserver`. |
| `scaleMultiplier` | `number` | `1` | Adjusts layout pointer calculations if the window exists inside a parent container modified by CSS `transform: scale(x)`. |

### WindowRefType
Retrieve control methods by passing a `ref` to `<WindowProvider>`:
- `open()`: Opens the window.
- `close()`: Closes the window.
- `toggle(newValue?: boolean)`: Toggles state, optionally forced.

## Development & Contribution

1. **Clone repo**: `git clone <repository_url>`
2. **Install deps**: `npm install`
3. **Build**: `npm run build`
4. **Dev Server**: Standard React development via Vite (if configured) or testing directly in your examples folder.

Feel free to open an issue or submit a pull request if you want to add a feature or fix a bug. 

**Tips for contributors:**
- Ensure window state hooks run strictly inside `<WindowProvider>`.
- The `calcWinPercentage` util evaluates positioning offsets gracefully mapping strings (`"50%"`) to pixel math on the fly. Don't bypass it.

---

**License**: MIT
