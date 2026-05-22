import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AppTheme {
  id: string;
  name: string;
  background: string;
  surface: string;
  surfaceHighlight: string;
  primary: string;
  text: string;
  textMuted: string;
}

export const VIBES: Record<string, AppTheme> = {
  // --- YOUR NEW AESTHETIC PALETTE ---
  mocha: {
    id: "mocha",
    name: "Mocha",
    background: "#12100E",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#eddcd2",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
  vanilla: {
    id: "vanilla",
    name: "Vanilla",
    background: "#141212",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#fff1e6",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
  sakura: {
    id: "sakura",
    name: "Sakura",
    background: "#141112",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#fde2e4",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
  flamingo: {
    id: "flamingo",
    name: "Flamingo",
    background: "#141011",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#fad2e1",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
  minty: {
    id: "minty",
    name: "Minty",
    background: "#0E1212",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#c5dedd",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
  foam: {
    id: "foam",
    name: "Sea Foam",
    background: "#0F1212",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#dbe7e4",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
  pearl: {
    id: "pearl",
    name: "Pearl",
    background: "#121212",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#f0efeb",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
  glacier: {
    id: "glacier",
    name: "Glacier",
    background: "#0F1114",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#d6e2e9",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
  sky: {
    id: "sky",
    name: "Sky",
    background: "#0D1114",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#bcd4e6",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
  denim: {
    id: "denim",
    name: "Denim",
    background: "#0B1014",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#99c1de",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },

  // --- ORIGINAL VIBES ---
  midnight: {
    id: "midnight",
    name: "Midnight",
    background: "#08080A",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#8A2BE2",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
  cyber: {
    id: "cyber",
    name: "Cyber",
    background: "#040B14",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#00E5FF",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
  forest: {
    id: "forest",
    name: "Forest",
    background: "#071009",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#2EA043",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
  magma: {
    id: "magma",
    name: "Magma",
    background: "#140505",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHighlight: "rgba(255, 255, 255, 0.1)",
    primary: "#FF4500",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.4)",
  },
};

interface ThemeStore {
  theme: AppTheme;
  setVibe: (vibeId: keyof typeof VIBES) => void;
  profileName: string;
  profilePic: string | null;
  setProfileName: (name: string) => void;
  setProfilePic: (uri: string | null) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: VIBES.sakura, // Defaulting to one of your new beautiful vibes!
      setVibe: (vibeId) => set({ theme: VIBES[vibeId] }),
      profileName: "Eyrae",
      profilePic: null,
      setProfileName: (name) => set({ profileName: name }),
      setProfilePic: (uri) => set({ profilePic: uri }),
    }),
    {
      name: "eyrae-theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
