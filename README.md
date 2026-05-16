# 🌌 Eyrae Reminders

A high-fidelity, fluid, glassmorphic productivity ecosystem built for creators, artists, and developers who refuse to look at boring checklists. Engineered with **React Native** and **Expo**, stylized with deep neon aesthetics, and driven by micro-interactions.

---

## ✨ Features at a Glance

### 🚀 Fluid Swipe-to-Complete

* **The Physics:** Powered by `react-native-gesture-handler` and `reanimated`. Cards smoothly slide open to reveal a glowing green checkmark.
* **The Feedback:** Snaps cleanly with a satisfying haptic thump (`expo-haptics`) as completed items effortlessly drop into the archive list.

### 🎯 Zen Focus Mode

* **The Workflow:** Tap the crosshair on any task to initiate a fullscreen, distraction-free **25-minute Pomodoro protocol**.
* **The Vibe:** Minimalist, high-contrast countdown timers leveraging a specialized system font (`fontVariant: ['tabular-nums']`) to keep ticking numbers perfectly locked in place without awkward shifting.

### ⏳ Live Event Countdowns

* **The Priority:** Got a critical launch, client commission deadline, or tournament match? Toggle the **Pin as Countdown** switch.
* **The UI:** Anchors the item directly to the absolute top of your dashboard as a massive, standalone panel featuring real-time "Days/Hours Left" calculations.

### 🏷️ Persistent Custom Tag System

* **The Engine:** Create custom tags seamlessly inside the entry drawer.
* **The Layout:** Pill-based horizontal scrolling allows you to group tasks, display bright aesthetic tags, and organize your agenda at a single glance.

---

## 🎨 The Aesthetic Palettes (Vibes)

Your workflow shouldn’t be a generic default. The entire interface shifts gracefully to adapt to your style:

| Vibe | Vibe ID | Primary Accent | Vibe Vibe |
| --- | --- | --- | --- |
| 🔮 **Midnight** | `midnight` | Velvet Purple | Deep space developer mode. |
| 🩵 **Cyber** | `cyber` | Electric Cyan | Neon grid glowing lines. |
| 🌿 **Forest** | `forest` | Matrix Green | Low-key, earthy focus zone. |
| 🌸 **Blossom** | `blossom` | Pastel Pink | High-contrast, soft aesthetic. |
| 🍵 **Mint** | `mint` | Pastel Green | Clean, icy text highlights. |
| 🍇 **Lavender** | `lavender` | Pastel Purple | Smooth, calming evening setup. |

---

## 🛠️ The Architecture (Tech Stack)

```
        ┌────────────────────────────────────────────────────────┐
        │                     React Native                       │
        │             (Cross-Platform UI Engine)                  │
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

* **State Management:** State orchestration via `Zustand`. Fast, highly lightweight reactive arrays.
* **Data Persistence:** Hard-wired directly to the physical storage engine via `@react-native-async-storage/async-storage`. If the app process is terminated, your todo cache, chosen pastel themes, and custom tag arrays remain structurally preserved.
* **Notifications:** Uses local system handles (`expo-notifications`) to silently pre-schedule alarms 1 hour before an assignment's deadline.

---

## 📁 Repository Structure

```hl
eyrae-reminders/
├── app/                  # Expo Router directory (File-based navigation)
│   ├── (tabs)/           # Core application bottom bar layout
│   │   ├── index.tsx     # Home dashboard (Countdowns, list splits)
│   │   └── settings.tsx  # Theme selections & global state controller
│   └── focus.tsx         # Fullscreen Zen focus route with scale physics
└── src/
    ├── components/
    │   └── core/
    │       ├── GlassSheet.tsx    # Bottom modal entry sheet (Android-padding fixed)
    │       ├── SwipeableCard.tsx # Reanimated gesture controller 
    │       └── NeoCard.tsx       # Translucent UI panels
    └── store/
        ├── useTaskStore.ts   # Main task store (Persisted state)
        └── useThemeStore.ts  # Theme matrix config file

```

---

## ⚡ Setup for Local Devs

If you want to clone this code and spin it up inside your terminal:

```bash
# 1. Clone the project
git clone https://github.com/Eyraee/eyrae-reminders.git

# 2. Enter directory & install packages
cd eyrae-reminders
npm install

# 3. Initialize Expo server (Clearing config cache)
npx expo start -c

```

---

### 💡 Portfolio Note

> This application runs **entirely locally**. It requests zero analytics permissions, tracking cookies, or database endpoints. It was engineered intentionally as a premium, secure tool optimized for high-performance mobile architectures.
