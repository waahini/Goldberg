# **Goldberg Machine Builder: Project Blueprint (V5 - Detailed Educational Style)**

## **1. Overview**
A child-friendly, educational "Goldberg Machine" builder with high-fidelity visual design. This version focuses on "delicate" object aesthetics and a "preview-before-placement" UX to make building more intuitive for young users.

## **2. Detailed Outline & Current State**

### **Architecture & Tech Stack**
- **Physics Engine**: Matter.js.
- **UI Architecture**: Integrated Sidebar + Canvas with Ghost Preview.
- **Color System**: Soft Rainbow Palette with gradients and subtle textures.
- **Typography**: Rounded Korean fonts (Pretendard).

### **Detailed Design (섬세한 디자인)**
- **Nodon Skins**: Each physical object (Nodon) has a unique, detailed skin beyond simple shapes. This includes gradients, multi-layered SVG details, and expressive "eyes/mouth" animations.
- **Visual Effects**: Soft glows, subtle particle effects on placement, and bouncy UI transitions.

### **Functional Upgrades**
- **Placement Preview (설치 전 미리보기)**: When dragging a Nodon from the sidebar, a semi-transparent "ghost" version follows the cursor on the canvas to show exactly where it will land.
- **Pure Korean UI**: All text is localized to Korean for a seamless local experience.

## **3. Implementation Roadmap**

### **Phase 1: Visual Enhancement**
- [ ] **Nodon Skin Refinement**: Update `drawNodonSkins` in `main.js` to add more detail (shadows, highlights, unique patterns for each type).
- [ ] **UI Polish**: Ensure all border-radii are consistent and colors are vibrant yet harmonious.

### **Phase 2: Ghost Preview Logic**
- [ ] **Drag Events**: Modify `initDragAndDrop` to track mouse position and render a preview object.
- [ ] **Canvas Rendering**: Use the `wiring-layer` SVG or a separate preview layer to show the "ghost" Nodon.

### **Phase 3: Verification**
- [ ] **Visual Audit**: Do the objects look "detailed"?
- [ ] **UX Check**: Is the preview accurate and helpful?
- [ ] **Language Check**: Is every single piece of text in Korean?

