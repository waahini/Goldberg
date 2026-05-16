# **Goldberg Nodon: Project Blueprint (V9 - Modern Luxe & Full Functionality)**

## **1. Overview**
A high-end, modern "Goldberg Machine" builder with a focus on "Pretty" aesthetics and user-centric customization. This version moves away from educational vibes to a sleek, app-like experience.

## **2. Detailed Outline & Current State**

### **Architecture & Tech Stack**
- **Physics Engine**: Matter.js.
- **UI Architecture**: Customizable Sidebar (1 or 2 columns) + Seamless Full-Page Scroll.
- **Color System**: "Modern Luxe" (Soft Neons, Deep Blurs, and High-Gloss Accents).

### **Pretty & Modern Design (예쁘고 현대적인 디자인)**
- **Aesthetic Shift**: Removed school-like colors and fonts. Using a premium "Glassmorphism" look with vibrant gradients.
- **Polished Buttons**: All buttons feature multi-layered shadows, smooth transitions, and glossy finishes.
- **Dynamic Layout**: Sidebar can toggle between **1-column (Slim)** and **2-columns (Wide)** for better object browsing.

### **Functional Upgrades (완벽한 작동)**
- **Full-Page Integration**: The site scrolls naturally to reveal the History, Comments, and Partnership sections.
- **Button Audit**: Fixed all previously broken buttons (Play, Reset, Clear, Settings, etc.).
- **Responsive Workspace**: Canvas resizes perfectly when the sidebar layout changes.

## **3. Implementation Roadmap**

### **Phase 1: Visual Style & Buttons**
- [x] **CSS Overhaul**: Replace "Golden Prime" with "Modern Luxe" variables.
- [x] **Button Redesign**: Add glossy effects and better interaction states.

### **Phase 2: Layout & Toggles**
- [x] **Sidebar Column Toggle**: Add a button to switch between 1 and 2 column grids.
- [x] **Scrolling Fix**: Change height constraints to allow natural page scrolling.

### **Phase 3: Final Functionality Check**
- [x] **Event Listener Audit**: Ensure `btn-play`, `btn-reset`, `btn-clear`, and `btn-settings` work perfectly.
- [x] **Community Sections**: Verify Disqus and Formspree are visible on scroll.
