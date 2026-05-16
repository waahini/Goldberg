# **Goldberg Nodon: Project Blueprint (V11 - High-Fidelity Distinction)**

## **1. Overview**
A professional "Goldberg Machine" builder featuring **ultra-slim, refined object designs** and a **comprehensive logic library**. This version focuses on visual clarity and mechanical diversity.

## **2. Detailed Outline & Current State**

### **Architecture & Tech Stack**
- **Physics Engine**: Matter.js (tuned for high-speed collisions).
- **Visual Engine**: Advanced SVG Skinning with specific rendering paths for every object.

### **Refined Visuals (정교하고 날렵한 디자인)**
- **Slim Profile**: Reduced visual "thickness" for a more modern, technical look.
- **Unique Identities**:
    - **Physical**: Every object has a distinct shape and texture (Ball is a sphere, Ramp is a sleek rail, Hammer is an actual mallet).
    - **Logic**: Every gate and sensor has its own iconic design (AND is a D-gate, NOT is a triangle, Sensor is a lens).
- **Vibrant & Varied Colors**: No more "all yellow" or "similar colors"—every type is color-coded.

### **Logic Expansion (논리 노돈 대폭 추가)**
- **New Gates**: Added OR gate, XOR gate, and Signal Splitters.
- **Enhanced Interactions**: Logic nodes can control multiple boosters and timers simultaneously.

### **Functional Upgrades**
- **Angle Control**: 360-degree rotation for all objects.
- **Bilingual Content**: Fully translated rich content (Birth Diary, Manual).
- **Sidebar Efficiency**: 1 or 2 column toggle with live high-fidelity previews.

## **3. Implementation Roadmap**

### **Phase 1: Visual Rearchitecture**
- [ ] **Slim Stroke Logic**: Update CSS and JS to use thinner, more precise borders.
- [ ] **Unique Path Engine**: Rewrite `renderPremiumSkin` with individual drawing logic for *every* node type.

### **Phase 2: Logic Library Growth**
- [ ] **HTML Palette Update**: Add 5+ new logic nodes to the sidebar.
- [ ] **JS Logic Implementation**: Add switch cases and event handling for new gates.

### **Phase 3: Final Polishing**
- [ ] **Sidebar Icon Matching**: Synchronize sidebar previews with the new unique skins.
- [ ] **Performance Audit**: Ensure the detailed SVG layer remains smooth during simulations.
