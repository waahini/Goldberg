# **Goldberg Nodon: Project Blueprint (V12 - Mechanical Evolution)**

## **1. Overview**
A professional "Goldberg Machine" builder featuring **ultra-slim, refined object designs** and a **comprehensive logic library**. V12 introduces high-impact mechanical objects, advanced logic routing, and environmental controls to maximize creative possibilities and user engagement.

## **2. Detailed Outline & Current State**

### **Architecture & Tech Stack**
- **Physics Engine**: Matter.js (tuned for high-speed collisions and force fields).
- **Visual Engine**: Advanced SVG Skinning with specific rendering paths for every object.
- **Signal System**: Event-based wiring between logic nodes (Trigger -> Action).

### **V12 Expansion: New Objects**

#### **1. Dynamic Physics & Action Objects**
- **Magnet (자석 노돈)**: Creates attraction (In-polar) or repulsion (Ex-polar) fields.
- **Trampoline (트램펄린)**: High-restitution surface for massive bounces.
- **Conveyor Belt (컨베이어 벨트)**: Moving platform that transports objects at a fixed speed.
- **Portal (워프 게이트)**: Pair-based teleportation (A -> B).
- **Cannon (대포)**: Directional launcher triggered by collision or signal.
- **Pulley (도르래)**: Linked mechanical system (one down, other up).

#### **2. Advanced Logic & Signal Routing**
- **Toggle Switch (시소형 스위치)**: Flip-flop state (ON/OFF).
- **Signal Splitter (분배기)**: 1 Input -> Multiple simultaneous Outputs.
- **Random Splitter (무작위 분배기)**: 50/50 probability path routing.
- **Delay Nodon (지연 노돈)**: Configurable timer for signal propagation.
- **Logic Counter (조건부 게이트)**: Triggers only after X collisions/signals.

#### **3. Visual & Environmental Effects**
- **Explosion/Dynamite**: Area-of-effect force pulse with particle visuals.
- **Color Gate (도색 게이트)**: Changes the visual 'skin' color of balls passing through.
- **Black Hole**: Intense gravity well that pulls and consumes objects.
- **Gravity Inverter**: Global environmental toggle (Normal <-> Reverse).
- **Windmill (풍풍이)**: Area-based directional force (wind).

### **UI & AdSense Compliance**
- **Goldberg Masterclass Button**: New header button linking to extensive educational content.
- **Extended Content Section**: In-depth explanation of Goldberg history, physics, and logic (Targeting AdSense value).
- **Affiliation Inquiry**: Dedicated contact link for partnerships (`https://formspree.io/f/mojbqkde`).

## **3. Implementation Roadmap**

### **Phase 1: UI & Content Saturation**
- [ ] **Header Update**: Add "Masterclass" button and language-aware labels.
- [ ] **Content Injection**: Write and style the "Great Goldberg Essay" section.
- [ ] **Partnership Link**: Update footer with the correct Formspree endpoint.

### **Phase 2: Physics Object Implementation**
- [ ] **Force Field Engine**: Implement Magnet and Black Hole logic in Matter.js `beforeUpdate`.
- [ ] **Surface Logic**: Implement Conveyor and Trampoline custom collision handling.
- [ ] **Action Systems**: Build Cannon and Portal teleportation logic.

### **Phase 3: Logic & Signal Refactoring**
- [ ] **Stateful Nodes**: Implement Toggle and Counter persistence.
- [ ] **Probability Engine**: Build the Random Splitter logic.
- [ ] **Visual Skins**: Create SVG rendering logic for all 15+ new objects.

### **Phase 4: Validation & Tuning**
- [ ] **Collision Testing**: Ensure high-speed objects don't clip through thin ramps.
- [ ] **UX Polish**: Optimize sidebar drag-and-drop for the expanded palette.
