# **Goldberg Nodon: Project Blueprint (V10 - Grand Scale & Rich Content)**

## **1. Overview**
A high-density, high-visibility "Goldberg Machine" builder. This version scales up the UI for maximum impact, categorizes nodes for organization, and provides extensive educational/historical content for a complete user experience.

## **2. Detailed Outline & Current State**

### **Architecture & Tech Stack**
- **Physics Engine**: Matter.js (Large-scale collision detection).
- **UI Architecture**: Expandable Sidebar (1 or 2 columns) + High-Density Content Sections.
- **Language System**: Bilingual Support (KO/EN) with a persistent toggle.

### **UI & Design (크고 화려한 디자인)**
- **Scaled-Up UI**: Larger buttons, text, and icons for clear visibility.
- **Categorized Sidebar**:
    - **물리 노돈 (Physical)**: Balls, Ramps, Boxes, Floors, Seesaw, Pendulum, etc.
    - **논리 노돈 (Logic)**: Sensors, Accelerators, Timers, Counters, Gates, etc.
- **Aesthetic**: Modern High-Gloss Gold & Carbon theme with large, readable typography.

### **Rich Content (풍부한 텍스트)**
- **골드버그의 탄생일기 (Birth of Goldberg)**: A fictional/historical narrative about the inventor.
- **정교한 설명서 (Detailed Manual)**: Step-by-step guide to building complex machines.
- **물리 법칙 백과 (Physics Encyclopedia)**: Deep dive into the science behind the sim.

### **Functional Upgrades**
- **Language Toggle**: One-click switch between Korean and English.
- **Categorized Drag-and-Drop**: Efficient item browsing.
- **Stability Fix**: Permanent solution for disappearing objects and broken interactions.

## **3. Implementation Roadmap**

### **Phase 1: Scaling & Categories**
- [ ] **CSS Scaling**: Increase `base-font-size`, `icon-size`, and `padding`.
- [ ] **Sidebar Structure**: Group items into `Physical` and `Logic` sections.

### **Phase 2: Content & Translation**
- [ ] **Text Expansion**: Write long-form content for History and Manual.
- [ ] **I18N Implementation**: Update `I18N` object and adding toggle logic.

### **Phase 3: Final Verification**
- [ ] **Visual Audit**: Is everything "big and clear"?
- [ ] **Functionality Audit**: Do all 14+ node types work?
- [ ] **Language Test**: Does switching work across all sections?
