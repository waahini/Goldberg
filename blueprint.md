# **Goldberg Machine Builder: Project Blueprint**

## **1. Overview**
A visual, node-based "Goldberg Machine" builder inspired by Nintendo's *Game Builder Garage*. Users can place physical objects (Nodons) and connect them via logical "wires" to create complex, physics-driven chain reactions.

## **2. Detailed Outline & Current State**

### **Architecture**
- **Physics Engine**: [Matter.js](https://brm.io/matter-js/) for 2D rigid-body simulation.
- **Visuals**: Clean, vibrant, "Nintendo-like" UI with rounded corners, soft shadows, and expressive typography.
- **Component System**: Custom Web Components and SVG layers for UI/Editor.

### **Features (Current & Planned)**
- **Nodon Types (Expanded)**:
  - **Physical**: Ball, Ramp, Box, Floor, Goal, **Spring (Bouncer)**, **Treadmill (Conveyor)**, **Pendulum**, **Breakable Box**, **Balloon**.
  - **Logical**: Button, Timer, Fan (force emitter), Sensor (collision detector), Warp A/B (Portals), Magnet, **Counter (logic gate)**.
- **Editor Functions**:
  - **Drag & Drop**: Place objects from a sidebar.
  - **Wiring Mode**: Connect logic nodes (e.g., Sensor -> Fan) to trigger actions.
  - **Hover Info**: Mouse hover over *any* object (sidebar or canvas) shows a detailed manual/instruction.
  - **Connection Visualization**: Automatic visual indicators for paired objects (Warp A <-> Warp B) and logical wires.
  - **Language Support**: Multi-language (KO/EN). Default to Korean; switches to English only when selected in settings.
  - **Simulation Control**: Play, Pause, Reset, Clear.

### **Visual Design**
- **Color Palette**: Vibrant blues, yellows, and greens.
- **Nodon Aesthetics**: Each Nodon has a "living" face with eyes that track the ball, blinking animations, and expressive mouths.
- **Typography**: Friendly, rounded sans-serif.

## **3. Current Implementation Plan**

### **Phase 1: Foundation (Matter.js Setup)**
- [x] Integrate Matter.js via CDN.
- [x] Initialize the engine, renderer, and runner.
- [x] Set up the main UI layout.

### **Phase 2: Expanded Nodon System**
- [ ] Implement new Nodon types: Spring, Treadmill, Pendulum, Breakable Box, Balloon.
- [ ] Refine existing Nodon visuals (better faces, more decorators).
- [ ] Implement hover manual for all canvas objects.

### **Phase 3: Logic & Connectivity**
- [ ] Visual indicators for Portal (Warp) connections.
- [ ] Enhance wiring visibility.
- [ ] Add "Counter" Nodon for complex logic.

### **Phase 4: Global Settings & Polish**
- [x] Language toggle (Basic).
- [ ] **Fix Language Default**: Set KO as default, EN as optional.
- [ ] Add sound effects and particle effects for collisions.
- [ ] Final aesthetic polish.
