# **Goldberg Machine Builder: Project Blueprint (V4 - Educational Rainbow Style)**

## **1. Overview**
A child-friendly, educational "Goldberg Machine" builder. This version transitions from the "Honey Golden" professional look to a vibrant, rounded, and playful "Educational Rainbow" design. It emphasizes ease of use, tactile feedback, and bilingual support (Korean/English).

## **2. Detailed Outline & Current State**

### **Architecture & Tech Stack**
- **Physics Engine**: Matter.js.
- **UI Architecture**: Integrated Sidebar + Canvas.
- **Color System**: Vibrant primary colors (Yellow, Blue, Green, Pink) with soft gradients.
- **Typography**: Rounded, friendly fonts (Pretendard with rounded settings or similar).
- **Internationalization**: Dual-language support (KO/EN) with a toggle.

### **Child-Friendly Design (A동 교육 느낌)**
- **Ultra-Rounded**: All buttons, cards, and panels have large border-radii (20px+).
- **Playful Palette**: Bright, energetic colors that appeal to children.
- **Tactile Feedback**: Larger hit areas, bouncy hover effects, and clear visual cues.
- **Side Workbench**: A functional sidebar where users can drag Nodons directly onto the canvas.

### **Functional Upgrades**
- **Language Switcher**: A prominent toggle to switch between Korean and English.
- **Drag & Drop Fix**: Implementation of the missing `initDragAndDrop` logic to enable node placement.
- **Visual Polish**: Animated transitions and "soft" shadows for a premium toy-like feel.

## **3. Implementation Roadmap**

### **Phase 1: Logic & Language**
- [x] **Language Toggle**: Add UI for switching languages.
- [x] **Drag & Drop Implementation**: Fix the missing `initDragAndDrop` method in `main.js`.
- [x] **Translation Completion**: Ensure all UI strings are localized.

### **Phase 2: Visual Overhaul (Rounded & Playful)**
- [ ] **Global Rounding**: Apply `border-radius: 2rem` to all major components.
- [ ] **Color Update**: Transition from pure yellow to a multi-colored educational palette.
- [ ] **Soft UI**: Use softer shadows and subtle textures for a "toy" feel.

### **Phase 3: Verification**
- [ ] **Accessibility**: Ensure the UI is easy for children to navigate.
- [ ] **Functionality**: Verify nodes can be dragged from the sidebar and placed accurately.
- [ ] **Bilingual Check**: Confirm all text switches correctly between KO and EN.

