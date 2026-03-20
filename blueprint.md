# **Goldberg Machine Builder: Project Blueprint**

## **1. Overview**
A visual, node-based "Goldberg Machine" builder inspired by Nintendo's *Game Builder Garage*. Users can place physical objects (Nodons) and connect them via logical "wires" to create complex, physics-driven chain reactions.

## **2. Detailed Outline & Current State**

### **Architecture**
- **Physics Engine**: [Matter.js](https://brm.io/matter-js/) for 2D rigid-body simulation.
- **Visuals**: Clean, vibrant, "Nintendo-like" UI with rounded corners, soft shadows, and expressive typography.
- **Component System**: Custom Web Components for the UI and the editor.

### **Features (Current & Planned)**
- **Nodon Types**:
  - **Physical**: Ball, Ramp, Floor, Wall, Box.
  - **Logical**: Button (trigger), Timer, Fan (force emitter), Sensor (collision detector).
- **Editor Functions**:
  - **Drag & Drop**: Place objects from a sidebar.
  - **Wiring Mode**: Connect logic nodes (e.g., Sensor -> Fan) to trigger actions.
  - **Simulation Control**: Play, Pause, Reset, Clear.
  - **Persistence**: Save/Load designs to `localStorage`.

### **Visual Design**
- **Color Palette**: Vibrant blues, yellows, and greens.
- **Typography**: Friendly, rounded sans-serif (e.g., 'Segoe UI', 'Roboto').
- **Interactivity**: Smooth animations for placing and connecting nodes.

## **3. Current Implementation Plan**

### **Phase 1: Foundation (Matter.js Setup)**
- [x] Integrate Matter.js via CDN.
- [x] Initialize the engine, renderer, and runner within a `<goldberg-canvas>` Web Component.
- [x] Set up the main UI layout (Sidebar + Canvas + Controls).

### **Phase 2: Nodon System & Editor**
- [ ] Create the `Nodon` base class and specific implementations (Ball, Ramp).
- [ ] Implement drag-and-drop placement on the canvas.
- [ ] Add "Edit Mode" (modify properties, rotation) and "Play Mode" (run physics).

### **Phase 3: Logic & Wiring**
- [ ] Implement "Logic Nodes" (Buttons, Sensors).
- [ ] Create a visual "Wire" system to connect triggers to actions.
- [ ] Implement specific logic-physical interactions (e.g., Sensor triggers Fan force).

### **Phase 4: Polish & Persistence**
- [ ] Add animations and visual feedback for collisions and triggers.
- [ ] Implement "Save/Load" functionality.
- [ ] Add sound effects (optional) and final aesthetic adjustments.
