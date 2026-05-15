# **Goldberg Machine Builder: Project Blueprint (V2 - AdSense & Design Polish)**

## **1. Overview**
A visual, node-based "Goldberg Machine" builder inspired by Nintendo's *Game Builder Garage*. This version is optimized for Google AdSense approval through high-quality, substantial content and a "쌈뽕한" (cool/trendy) aesthetic. Users can build complex chain reactions with an expanded library of Nodons in a flexible, mobile-responsive environment.

## **2. Detailed Outline & Current State**

### **Architecture & Tech Stack**
- **Physics Engine**: Matter.js (2D simulation).
- **UI Architecture**: Vanilla JS with ES Modules, CSS Grid/Flexbox, and Lucide Icons.
- **Rendering**: HTML5 Canvas (Physics) + SVG Overlay (Logic/Wires).

### **New "쌈뽕한" (Cool/Awesome) Design System**
- **Vibrant Palette**: Using `oklch` colors for more vibrancy and modern gradients.
- **Glassmorphism**: UI panels with backdrop-blur and subtle borders.
- **Micro-interactions**: Hover effects, springy animations, and toast notifications.
- **Typography**: Playful yet readable Korean fonts (e.g., 'Jua' or 'Do Hyeon' via Google Fonts).

### **Expanded Content for AdSense (High Substance)**
- **Nodon Encyclopedia (Expanded)**: 15+ detailed entries with 200+ words each, including technical specs and "Fun Facts".
- **Physics Lab 2.0**: Articles on "Centripetal Force", "Friction vs. Air Resistance", and "The Law of Conservation of Energy".
- **Goldberg Masterclass**: A blog-style section with "Building Tips" and "History of Goldberg Machines".
- **Legal Compliance**: Robust Privacy Policy, Terms of Service, and About pages.

### **Functional Upgrades**
- **Toggleable Workspace**: Sidebar can be hidden to maximize building area.
- **New Nodon Library**:
  - **Seesaw (시소)**: Lever-based physics object.
  - **Pendulum (진공추)**: Swinging object for momentum transfer.
  - **Domino (도미노)**: Sequential collision object.
  - **Accelerator (가속기)**: Logic-triggered velocity booster.
  - **Hammer (망치)**: High-mass swinging trigger.

## **3. Implementation Roadmap**

### **Phase 1: Layout & UX Overhaul**
- [ ] **Toggleable Sidebar**: Add a "Hide/Show" button for the Nodon palette.
- [ ] **Responsive Canvas**: Ensure the canvas resizes dynamically without breaking simulation coordinates.
- [ ] **Modern Header**: Redesign with a sleek, floating look.

### **Phase 2: Content Injection (AdSense Focus)**
- [ ] **Expand Encyclopedia**: Write deep-dive content for new and existing Nodons.
- [ ] **Add "History of Goldberg" Section**: Add 500+ words of unique historical context.
- [ ] **Add "Engineering Principles" Section**: Connect simulation features to real-world engineering.

### **Phase 3: Logic & Node Expansion**
- [ ] **Implement New Bodies**: Add `seesaw`, `pendulum`, etc., to `main.js`.
- [ ] **Refine Wiring Logic**: Ensure new logical nodes (Accelerator) work seamlessly.

### **Phase 4: Aesthetic Polish**
- [ ] **CSS Modernization**: Apply gradients, shadows, and better transitions.
- [ ] **Sound Effects (Optional/Visual feedback)**: Add visual "pops" and "sparkles" for successful goal reaches.
- [ ] **AdSense Validation**: Check ad-to-content ratio and placement.

