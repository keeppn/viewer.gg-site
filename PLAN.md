# viewer.gg Master Plan & Technical Documentation

> **Version:** 1.1.0
> **Last Updated:** November 21, 2025
> **Status:** Active Development

---

## ?? Part 1: Business Strategy & Product Vision

### 1.1 The Mission
**viewer.gg** is the ultimate "Co-streaming Operating System" for Tournament Organizers (TOs). We replace the chaotic "Google Forms + Spreadsheet + Manual Discord Roles" workflow with a unified, semi-automated platform that professionalizes the entire experience.

### 1.2 The Problem: "Spreadsheet Hell"
Currently, running a co-streaming program looks like this:
1.  **Create Google Form**: "Please paste your Twitch link."
2.  **Manual Review**: TO opens a spreadsheet with 500 rows. Checks every link manually.
3.  **Manual Discord Work**: TO has to find the user in Discord, right-click, assign role. Repeat 500 times.
4.  **Zero Visibility**: Once the tournament starts, the TO has no idea who is actually live, if they are using the correct title, or what their viewership is without opening 50 tabs.

### 1.3 The Solution: Streamlined Control
viewer.gg automates the *execution*, not the *decision*.
1.  **Custom Forms**: TO builds a branded application form.
2.  **Centralized Queue**: Applications appear in a dashboard. TO reviews them (Approve/Reject).
3.  **Automated Execution**: **The moment a TO clicks "Approve"**, our bot:
    *   Automatically assigns the specific Discord role.
    *   Sends a customized DM with assets/keys.
4.  **Live Command Center**: A dashboard showing exactly who is live *right now*, their viewer count, and stream title/category compliance.
5.  **Analytics**: Aggregated post-event reports (Total Hours Watched, Reach by Language).

### 1.4 Target Audience
*   **Tier 1 (Leagues):** VCT, CDL, BLAST - Need white-labeling and deep analytics.
*   **Tier 2 (Community Cups):** Solary, Karmine Corp, smaller TOs - Need to save time on manual admin work.
*   **Tier 3 (Publishers):** Managing creator drops/access.

### 1.5 Brand Identity
*   **Vibe**: "Gamer Premium" meets "Productivity Tool". sleek, fast, intuitive.
*   **Primary Color**: #DAFF7C (Neon Lime) - Used for primary actions, success states, key highlights.
*   **Secondary Color**: #9381FF (Soft Purple) - Used for gradients, secondary elements.
*   **Accent Color**: #FF9350 (Vibrant Orange) - Used for alerts, "Live" indicators, notifications.
*   **Background**: Deep gradients and noise textures, never pure black (#000000).

---

## ?? Part 2: Feature Ecosystem

### 2.1 The Application Portal (Frontend)
*   **Form Builder**: Drag-and-drop interface. "Add Question" (Text, Multiple Choice, Twitch Link, Discord ID).
*   **Public Landing Page**: iewer.gg/apply/[tournament-slug]. Branded with the TO's logo and colors.

### 2.2 The Command Center (Dashboard)
*   **Application Queue**:
    *   List view of all applicants.
    *   Filters: "Pending", "Approved", "Rejected".
    *   Quick Actions: Approve/Reject buttons.
*   **Settings**:
    *   **Discord Integration**: "Select Server", "Select Role for Approved Streamers".
    *   **DM Templates**: "Customize the message sent upon approval."

### 2.3 The Automation Engine (Discord Bot)
*   **Trigger**: Listens for status changes in the database (e.g., status: 'APPROVED').
*   **Action**:
    *   Fetches Discord User ID.
    *   Calls Discord API -> guild.members.addRole().
    *   Calls Discord API -> user.send().

### 2.4 Live Monitoring & Analytics
*   **Live Matrix**: Grid of active streams.
    *   Red Border = Non-compliant (Wrong game/title).
    *   Green Border = All good.
*   **Stats**:
    *   Real-time: "Current Co-stream Viewers: 15,402".
    *   Post-Event: "Top Languages: French (40%), Spanish (30%)".

---

## ??? Part 3: Technical Architecture

### 3.1 Tech Stack
*   **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Framer Motion.
*   **Backend**: Supabase (PostgreSQL, Auth, Realtime).
*   **Bot**: Discord.js (Node.js separate process).
*   **Hosting**: Vercel (Web), Railway/VPS (Bot).

### 3.2 Data Flow
1.  **User Applies**: Data saved to pplications table in Supabase.
2.  **TO Approves**: Update pplications row -> status = 'approved'.
3.  **Supabase Realtime**: Triggers event UPDATE on pplications.
4.  **Bot Service**: Receives event -> Executes Discord Role Assignment.
5.  **Feedback**: Bot updates pplications row -> discord_role_assigned = true.

---

## ?? Part 4: Roadmap

### Phase 1: Foundation (Completed)
*   [x] Project Initialization.
*   [x] Marketing Website Structure.

### Phase 2: Visual & Content Overhaul (Current)
*   [ ] **Rebranding**: Apply #DAFF7C, #9381FF, #FF9350 palette.
*   [ ] **Content Update**: Rewrite Homepage to explain "The Flow" clearly.
*   [ ] **UX Polish**: Add glassmorphism, gradients, and better transitions.

### Phase 3: The Dashboard Core (Next)
*   [ ] Auth & Onboarding.
*   [ ] Form Builder.
*   [ ] Application Queue.

### Phase 4: The Automation
*   [ ] Discord Bot logic connection.
*   [ ] Live Polling Service (Twitch API).
