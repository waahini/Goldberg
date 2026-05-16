# **Goldberg Nodon: Project Blueprint (V6 - Unique & Vibrant Style)**

## **1. Overview**
A playful and high-quality "Goldberg Machine" builder. This version focuses on individual character for each "Nodon" (object), a cohesive "Hyper-Yellow" design system, and a bug-free building experience.

## **2. Detailed Outline & Current State**

### **Architecture & Tech Stack**
- **Physics Engine**: Matter.js.
- **UI Architecture**: Integrated Sidebar + Canvas with robust character rendering.
- **Color System**: Hyper-Yellow Palette (Vibrant yellows, ambers, and warm blacks).
- **Naming**: Unified branding as "골드버그 노돈" (Goldberg Nodon).

### **Unique Character Design (개성 있는 디자인)**
- **Distinct Personas**: Each Nodon type has a different facial expression and visual style (e.g., the ball is energetic, the ramp is cool, the sensor is alert).
- **High-Fidelity Icons**: Sidebar buttons feature detailed representations of the actual objects instead of generic boxes.
- **Visual Stability**: Fixed rendering issues where objects would disappear upon placement.

### **Functional Upgrades**
- **Hyper-Yellow UI**: A more intense and cheerful yellow-centric theme.
- **Enhanced Drag-Preview**: Clearer ghost preview during placement.
- **Character Rendering Engine**: A dedicated JS module for drawing detailed, unique SVG skins for each physics body.

## **3. Implementation Roadmap**

### **Phase 1: Branding & Palette**
- [ ] **Naming Overhaul**: Change all instances of "Honey Golden" to "Goldberg Nodon".
- [ ] **Hyper-Yellow CSS**: Update variables to push for a more vibrant yellow aesthetic.

### **Phase 2: Unique Object Skins**
- [ ] **Sidebar Icon Update**: Use CSS/SVG to show real object previews in the sidebar.
- [ ] **Nodon Skin Engine**: Refactor `drawNodonSkins` to provide unique faces and decorations per type.

### **Phase 3: Bug Fixing & Stability**
- [ ] **Rendering Audit**: Fix the "disappearing images" bug by ensuring the SVG layer and Matter.js synchronization is rock-solid.
- [ ] **Cleanup**: Remove unused bilingual logic and focus on the core Korean experience.

