# react-window-modals

## Not a modal library. A window manager for React.

![npm](https://img.shields.io/npm/v/react-window-modals)
![bundle size](https://img.shields.io/bundlephobia/minzip/react-window-modals)
![license](https://img.shields.io/npm/l/react-window-modals)

A headless, desktop-like window management system for building complex, multi-window user interfaces in React
applications.

---

## 📦 Package Characteristics

- **Zero dependencies**
- **Tree-shakeable** (ESM)
- **No side effects** (safe for modern bundlers)
- **Lightweight** (2.9 kB min+gzip)
- **Fully typed** (TypeScript)

---

## 🎯 Use Cases

* Admin dashboards with multiple panels
* Web-based IDEs and developer tools
* Trading platforms with floating widgets
* Multi-tasking SaaS applications

---

## Why react-window-modals?

Traditional modal libraries are:

* Single-instance
* Blocking
* Designed for simple dialogs

**react-window-modals** is different:

* Multiple independent windows
* Non-blocking interactions
* Desktop-like experience inside the browser

It provides the heavy lifting (dragging, resizing, z-index, constraints) while giving you full control over UI and
styling.

---

## 🚀 Features

* **Headless Architecture** — Full control over UI and styling
* **Draggable & Resizable Windows** — Smooth interaction primitives
* **Multi-Window Support** — Manage multiple floating windows
* **Focus Management** — Automatic z-index stacking and active tracking
* **Constraint System** — Boundaries, min/max sizes, snapping
* **Persistence** — Save window state via `localStorage`
* **Responsive Initialization** — Use pixels or percentages
* **Snap System** — Snap to edges or grid
* **Auto-Sizing** — Optional dynamic sizing based on content
* **TypeScript First** — Fully typed API

---

## 🎥 Demo GIF

> SOON

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

## ⚡ Quick Start

This example creates a draggable, focusable window.

```tsx
import { useRef } from 'react';
import {
  WindowManagerProvider,
  WindowProvider,
  WindowWrapper,
  useDraggableWindow,
} from 'react-window-modals';

function WindowHeader() {
  const { onMouseDown } = useDraggableWindow();

  return (
    <div
      onMouseDown={onMouseDown}
      style={{ cursor: 'move', background: '#eee', padding: 8 }}
    >
      Drag Me
    </div>
  );
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

## 🧠 Core Concepts

Understanding these core building blocks will help you integrate the library faster:

* **WindowManagerProvider**

    * Manages global state
    * Handles z-index stacking and focus

* **WindowProvider**

    * Controls a single window instance
    * Manages position, size, visibility

* **WindowWrapper**

    * Rendering layer
    * Applies styles and layout

---

## 📦 Example: Multiple Windows

```tsx
<WindowManagerProvider>
  <WindowProvider id="win-1" initialPosition={{ x: 100, y: 100 }}>
    <WindowWrapper style={{ border: '1px solid black', background: 'white' }}>
      <WindowHeader />
      <div style={{ padding: 20 }}>Window 1</div>
    </WindowWrapper>
  </WindowProvider>

  <WindowProvider id="win-2" activateOnMouseEnter>
    <WindowWrapper style={{ border: '1px solid black', background: 'white' }}>
      <WindowHeader />
      <div style={{ padding: 20 }}>Window 2</div>
    </WindowWrapper>
  </WindowProvider>
</WindowManagerProvider>
```

---

## ⚙️ API Overview

### WindowProvider Props

#### Core

| Prop          | Type      | Description        |
|---------------|-----------|--------------------|
| `id`          | `string`  | Unique window ID   |
| `initialOpen` | `boolean` | Initial visibility |

#### Layout

| Prop              | Type                | Description      |
|-------------------|---------------------|------------------|
| `initialPosition` | `{ x, y }`          | Initial position |
| `initialSize`     | `{ width, height }` | Initial size     |

#### Behavior

| Prop                   | Type      | Description              |
|------------------------|-----------|--------------------------|
| `activateOnMouseEnter` | `boolean` | Focus on hover           |
| `constrain`            | `object`  | Bounds, snapping, limits |

#### Persistence

| Prop      | Type     | Description         |
|-----------|----------|---------------------|
| `persist` | `object` | localStorage config |

---

### WindowRef API

| Method           | Description       |
|------------------|-------------------|
| `open()`         | Open window       |
| `close()`        | Close window      |
| `toggle()`       | Toggle visibility |
| `minimize()`     | Minimize          |
| `maximize()`     | Maximize          |
| `restore()`      | Restore state     |
| `bringToFront()` | Focus window      |

---

## 🛠 Advanced Usage

### Snap to Edges

```tsx
<WindowProvider
  id="snap-win"
  constrain={{
    snap: { edges: true, gridSize: 20, threshold: 15 },
  }}
>
```

### Persistence

```tsx
<WindowProvider id="persist-win" persist={{ key: 'my-win-state' }}>
```

### Focus State

```tsx
import { useWindowState } from 'react-window-modals';

function MyComponent() {
  const { isFocused } = useWindowState();
  return <div style={{ opacity: isFocused ? 1 : 0.5 }}>...</div>;
}
```

---

## ❓ FAQ

**How do I style the window?**
Use `className`, `style`, or wrap content inside `WindowWrapper`.

**Can I use multiple windows?**
Yes, each with its own `WindowProvider`.

**Does it support touch devices?**
Yes, touch events are supported.

---

## 🤝 Contributing

Contributions are welcome.

* Open issues for bugs or feature requests
* Submit PRs with clear descriptions
* Keep changes focused and minimal

---

## 📄 License

MIT
