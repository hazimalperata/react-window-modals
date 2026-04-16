# react-window-modals

A flexible, customizable, and lightweight headless React library for creating draggable, resizable, and context-managed window modals. Perfect for building desktop-like experiences on the web.

---

## 🚀 Features

- **Headless Architecture**: You bring the UI, we handle the complex math (dragging, resizing, constraints).
- **Draggable & Resizable**: Intuitive interaction hooks.
- **Constraint System**: Keep windows within specific boundaries (pixels or percentages).
- **Focus Management**: Built-in `z-index` stacking and active window tracking.
- **Persistence**: Built-in `localStorage` support to save window state across reloads.
- **Responsive**: Initialize with pixels or screen percentages.
- **Snap**: Snap windows to screen edges or grid points.
- **Auto-Sizing**: Optional `updateSizeWithContent` to grow based on children.
- **TypeScript**: First-class support with strict typings.

---

## 📦 Installation

```bash
npm install react-window-modals
# or
yarn add react-window-modals
# or
pnpm add react-window-modals
```

---

## 📖 Quick Start

To use `react-window-modals`, you need to wrap your windows in a `WindowManagerProvider` (for z-index management) and each window in a `WindowProvider`.

```tsx
import { useRef } from 'react';
import {
  WindowManagerProvider,
  WindowProvider,
  WindowWrapper,
  WindowRefType,
  useDraggableWindow,
} from 'react-window-modals';

function WindowHeader() {
  const { onMouseDown } = useDraggableWindow();
  return <div onMouseDown={onMouseDown} style={{ cursor: 'move', background: '#eee' }}>Drag Me</div>;
}

export default function App() {
  return (
    <WindowManagerProvider>
      <WindowProvider id="win-1" initialPosition={{ x: 100, y: 100 }}>
        <WindowWrapper style={{ border: '1px solid black', background: 'white' }}>
          <WindowHeader />
          <div style={{ padding: 20 }}>Hello World!</div>
        </WindowWrapper>
      </WindowProvider>
    </WindowManagerProvider>
  );
}
```

---

## ⚙️ API Reference

### `WindowProvider` Props

| Prop                   | Type                | Description                                  |
|:-----------------------|:--------------------|:---------------------------------------------|
| `id`                   | `string`            | **Required.** Unique ID for the window.      |
| `initialOpen`          | `boolean`           | Initial visibility.                          |
| `initialPosition`      | `{ x, y }`          | Initial position (pixels or %).              |
| `initialSize`          | `{ width, height }` | Initial size (pixels or %).                  |
| `constrain`            | `object`            | Boundaries, min/max size, and snap settings. |
| `persist`              | `object`            | `localStorage` key for state persistence.    |
| `className`            | `string`            | Custom class for the wrapper.                |
| `style`                | `object`            | Custom style for the wrapper.                |
| `activateOnMouseEnter` | `boolean`           | Bring to front on hover.                     |

### `WindowRefType` (via `useRef`)

| Method           | Description              |
|:-----------------|:-------------------------|
| `open()`         | Opens the window.        |
| `close()`        | Closes the window.       |
| `toggle()`       | Toggles visibility.      |
| `minimize()`     | Minimizes the window.    |
| `maximize()`     | Maximizes the window.    |
| `restore()`      | Restores from max/min.   |
| `bringToFront()` | Manually bring to front. |

---

## 🛠 Advanced Usage

### 1. Snap to Edges
```tsx
<WindowProvider
  id="snap-win"
  constrain={{
    snap: { edges: true, gridSize: 20, threshold: 15 }
  }}
>
  {/* ... */}
</WindowProvider>
```

### 2. Persistence
```tsx
<WindowProvider id="persist-win" persist={{ key: 'my-win-state' }}>
  {/* State will be saved to localStorage */}
</WindowProvider>
```

### 3. Focus & Active State
The library automatically manages `z-index`. You can check if a window is active using `useWindowState`:

```tsx
import { useWindowState } from 'react-window-modals';

function MyComponent() {
  const { isFocused } = useWindowState();
  return <div style={{ opacity: isFocused ? 1 : 0.5 }}>...</div>;
}
```

---

## 💡 FAQ

**Q: How do I style the window?**
A: Use the `className` or `style` props on the `WindowProvider`, or wrap the content inside `WindowWrapper` with your own CSS.

**Q: Can I have multiple windows?**
A: Yes, wrap each window in its own `WindowProvider` with a unique `id` and ensure they are all inside a single `WindowManagerProvider`.

**Q: Does it support touch devices?**
A: Yes, the library includes touch event listeners for dragging and resizing.

---

**License**: MIT
