# React Headless Modal

A fully customizable, headless modal component for React with drag, resize, and fullscreen capabilities.

## Installation
bash
npm install react-window-modals
or
yarn add react-window-modals


## Features

- 🎨 Fully customizable header and content
- 🖱️ Draggable
- ↔️ Resizable from all edges and corners
- 🖥️ Fullscreen support
- 📱 Responsive
- 🎯 Zero dependencies
- 💡 TypeScript support

## Usage
tsx
import { ModalProvider, useModal, ModalHeaderProps } from 'react-window-modals';
// Create your custom header
const CustomHeader = ({ onClose, dragHandleProps, isFullscreen }: ModalHeaderProps) => (
<div>
<div {...dragHandleProps}>Drag Handle</div>
<h3>Modal Title</h3>
<button onClick={onClose}>Close</button>
</div>
);
// Use the modal
const YourComponent = () => {
const { openModal } = useModal();
const handleOpenModal = () => {
openModal({
id: 'unique-id',
component: YourModalContent,
headerContent: CustomHeader,
position: { x: 100, y: 100 },
size: { width: 400, height: 300 }
});
};
return <button onClick={handleOpenModal}>Open Modal</button>;
};
// Wrap your app with ModalProvider
const App = () => (
<ModalProvider>
<YourComponent />
</ModalProvider>
);
## MIT License
Copyright (c) 2024 Hazim Alper ATA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.