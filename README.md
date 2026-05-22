# 🌌 Wisp 2.0

*Your local-first, aesthetic second brain.*

Wisp is the evolution of a productivity ecosystem. It began as **Eyrae Reminders**—a high-fidelity, glassmorphic checklist built for creators who were tired of boring, generic interfaces.

After months of deep-work engineering, it has transformed into **Wisp**: a professional-grade OS for your tasks, code, and commissions. Designed for developers and digital artists, Wisp brings your workflow into a fluid, distraction-free environment that lives entirely on your device. Your data stays with you—100% private, 100% performant.

We finally have an official icon to the app too:

<img width="325" height="325" alt="wizard" src="https://github.com/user-attachments/assets/67cfa355-7661-4608-bf9c-dbf99a84103f" />

What does our icon says: The imperfection we hold in our life but still we use our magic wand and live the life! 

---

## 🚀 The Evolution: From V1 to Wisp

In V1, we mastered the **Physics of Productivity**—fluid swipe-to-complete gestures, haptic feedback, and distraction-free Pomodoro focus sessions.

In **Wisp 2.0**, we’ve supercharged the engine for "Second Brain" utility:

* **Markdown Workspace:** Don't just list tasks—write them. Full Markdown support lets you format code snippets, checklists, and documentation directly inside your tasks.
* **Hourly Scoping Engine:** Every task now features an integrated live stopwatch. Perfect for tracking freelance billable hours or mapping out your server-side maintenance.
* **Global Knowledge Search:** A lightning-fast search engine that queries tasks, code, and custom tags across your entire local database.
* **Identity & Aesthetics:** Upload your own custom character art as your avatar, set your display name, and choose from 14+ curated pastel themes to match your mood.
* **Data Sovereignty:** Your data, your rules. The new JSON Import/Export engine lets you back up your entire Wisp state to a file and port it between devices whenever you want.

---

## 🎨 The Aesthetic Palettes (Vibes)

Why settle for a default interface? Wisp adapts to your creative style with a massive grid of soft-glow themes, including our new 2026 palette: *Mocha, Vanilla, Sakura, Flamingo, Minty, Sea Foam, Pearl, Glacier, Sky, and Denim.*

---

## 🛠️ The Architecture

```
        ┌────────────────────────────────────────────────────────┐
        │                     React Native                       │
        │             (Cross-Platform UI Engine)                 │
        └───────────────────────────┬────────────────────────────┘
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │                        Zustand                         │
        │              (Global State Management)                 │
        └───────────────────────────┬────────────────────────────┘
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │                   Zustand/Persist                      │
        │         (Auto-Syncs State To Hard Drive)               │
        └───────────────────────────┬────────────────────────────┘
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │                 AsyncStorage Engine                    │
        │       (Local Phone Data: 100% Zero-Cloud Loss)         │
        └────────────────────────────────────────────────────────┘

```

* **State Orchestration:** Lightning-fast reactive state via `Zustand`.
* **Data Integrity:** Fully encrypted-ready local storage via `AsyncStorage` + `JSON Backup/Restore`.
* **UI/UX:** Physics-driven interactions powered by `Reanimated 3` and `Gesture Handler`.
* **Content:** Rich-text rendering powered by `react-native-markdown-display`.

---

## 📁 Repository Structure

```hl
wisp/
├── app/                  # Expo Router (File-based navigation)
│   ├── (tabs)/           # Dashboard, Settings, Data Management
│   └── focus.tsx         # Fullscreen Zen Pomodoro Protocol
├── assets/               # Custom animations & Wizard iconography
└── src/
    ├── components/
    │   └── core/         # Glassmorphic UI components & Markdown Engine
    └── store/
        ├── useTaskStore.ts   # Task logic & Time Tracker engine
        └── useThemeStore.ts  # Theme matrix & Profile config

```

---

## ⚡ Quick Start

```bash
# 1. Clone the project
git clone https://github.com/Eyraee/wisp.git

# 2. Enter directory & install packages
cd wisp
npm install

# 3. Initialize Expo server (Clearing config cache)
npx expo start -c

```

---

## 💡 Portfolio Note

> Wisp runs **entirely locally**. It requests zero analytics permissions, tracking cookies, or database endpoints. It was engineered intentionally as a premium, secure tool optimized for high-performance mobile architectures.

---
