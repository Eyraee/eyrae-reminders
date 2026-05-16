import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
  midnight: {
    id: 'midnight', name: 'Midnight',
    background: '#08080A', surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.1)', primary: '#8A2BE2', 
    text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.4)',
  },
  cyber: {
    id: 'cyber', name: 'Cyber',
    background: '#040B14', surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.1)', primary: '#00E5FF', 
    text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.4)',
  },
  forest: {
    id: 'forest', name: 'Forest',
    background: '#071009', surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.1)', primary: '#2EA043', 
    text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.4)',
  },
  magma: {
    id: 'magma', name: 'Magma',
    background: '#140505', surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.1)', primary: '#FF4500', 
    text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.4)',
  },
  blossom: {
    id: 'blossom', name: 'Blossom',
    background: '#120D10', surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.1)', primary: '#FFB7B2', // Pastel Pink
    text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.4)',
  },
  mint: {
    id: 'mint', name: 'Mint',
    background: '#0D1210', surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.1)', primary: '#B5EAD7', // Pastel Green
    text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.4)',
  },
  lavender: {
    id: 'lavender', name: 'Lavender',
    background: '#0F0E14', surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.1)', primary: '#C7CEEA', // Pastel Purple
    text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.4)',
  },
  breeze: {
    id: 'breeze', name: 'Breeze',
    background: '#0C1114', surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.1)', primary: '#B5D8EB', // Pastel Blue
    text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.4)',
  },
  peach: {
    id: 'peach', name: 'Peach',
    background: '#14100C', surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.1)', primary: '#FFDAC1', // Pastel Orange
    text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.4)',
  },
  moonlight: {
    id: 'moonlight', name: 'Moonlight',
    background: '#14140C', surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.1)', primary: '#FFF5BA', // Pastel Yellow
    text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.4)',
  }
};

interface ThemeStore {
  theme: AppTheme;
  setVibe: (vibeId: keyof typeof VIBES) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: VIBES.midnight, 
      setVibe: (vibeId) => set({ theme: VIBES[vibeId] }),
    }),
    {
      name: 'eyrae-theme-storage', 
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);