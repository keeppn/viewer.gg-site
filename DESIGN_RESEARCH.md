# Design Research & Strategy: viewer.gg

> **Date:** November 21, 2025
> **Objective:** Redesign the viewer.gg homepage to be high-converting, premium, and workflow-centric.

---

## ?? 1. Research Summary: SaaS Design Trends 2025

We analyzed current trends for high-converting SaaS homepages, specifically in the gaming/developer niche.

### **A. Core Layout Trends**
*   **Bento Grids:** Breaking down complex features into modular, card-based layouts (like Apple/Linear). This allows for distinct "micro-stories" for each feature without overwhelming the user.
*   **Scrollytelling:** Vertical timeline flows where the user "scrolls through the product journey." This is highly effective for workflow tools like viewer.gg.
*   **Deep Dark Mode:** Pure black (#000000) is often replaced with "rich black" (#050505 or #0A0A0A) layered with radial gradients to create depth.

### **B. Typography**
*   **Oversized Headings:** H1s are short, punchy, and massive (72px+ on desktop).
*   **Contrast is King:** Subheadings use 	ext-muted-foreground (gray) to make the white headings pop.
*   **No "Orphans":** text balancing is crucial to prevent single words dropping to a new line (the user's specific complaint).

### **C. Color & Branding**
*   **Neon Accents:** The user's palette (#DAFF7C Lime, #9381FF Purple) aligns perfectly with the "Cyber/Tech" aesthetic.
*   **Button Accessibility:** High-contrast buttons are mandatory. A Neon Lime button **must** have Black text to be readable and click-worthy.

---

## ?? 2. Application to viewer.gg

Based on the research, here is the specific execution plan for the new Homepage:

### **Hero Section**
*   **Headline:** Needs to be < 10 words. *Current proposal:* "Automate Your Co-streaming."
*   **Visual:** Instead of a static image, we will use a CSS-composed "abstract dashboard" that glows.

### **The "7-Step" Workflow (Scrollytelling)**
The user specified 7 distinct steps. We will map these to a vertical connector flow:

1.  **"Easy Configure Discord Bot"**: Visual = A "Connect" toggle switching to Green.
2.  **"Create Custom Application Forms"**: Visual = A drag-and-drop UI element.
3.  **"Approve or Reject Applications"**: Visual = A "Tinder-style" or Kanban card.
4.  **"Assign Roles Automatically"**: Visual = A mock Discord notification pop-up.
5.  **"Easily Monitor Live Events"**: Visual = A grid of video thumbnails with "LIVE" badges.
6.  **"Detailed Analytics"**: Visual = A rising bar chart.
7.  **"Custom Sponsor Ready Reports"**: Visual = A "Download PDF" success state.

### **Technical Implementation**
*   **Framework:** Next.js 15 + Tailwind v4.
*   **Animation:** ramer-motion for scroll-triggered reveals (opacity/y-axis).
*   **Graphics:** We will build **CSS-only mockups** for the visuals. This ensures fast load times (no heavy images) and perfect scalability.

---

## ?? 3. Color Palette Refinement

| Role | Hex | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | #050505 | g-[#050505] | Main page background |
| **Primary** | #DAFF7C | 	ext-[#DAFF7C] | Call to Actions, Highlights |
| **Secondary** | #9381FF | 	ext-[#9381FF] | Gradients, Secondary Accents |
| **Surface** | #121212 | g-[#121212] | Cards, Modals |
| **Border** | #FFFFFF (10%) | order-white/10 | Subtle separation |

---

## ?? 4. Next Steps
1.  **Rewrite page.tsx** completely.
2.  **Implement the 7-step workflow** using the "FlowStep" component pattern.
3.  **Fix Typography** to ensure the H1 is balanced and readable.
4.  **Verify Button Contrast** (Black text on Lime).
