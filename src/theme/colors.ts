// Define the shape of the app's aesthetic theme
export interface AppTheme {
  background: string;
  surface: string;         // Used for Glassmorphic cards
  surfaceHighlight: string; // Lighter borders to create the "glass edge" effect
  primary: string;         // The accent color for glowing elements/active states
  text: string;
  textMuted: string;
}

// The default dark aesthetic
export const midnightTheme: AppTheme = {
  background: '#08080A', // Deep, immersive almost-black
  surface: 'rgba(255, 255, 255, 0.04)', // Highly transparent for background blur
  surfaceHighlight: 'rgba(255, 255, 255, 0.1)', // Subtle top/left border highlight
  primary: '#8A2BE2', // Deep neon purple glow
  text: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.4)',
};

// Generative engine foundation: 
// Later, we can hook this up to extract colors from a user's wallpaper,
// but for now, it shifts the palette based on the "vibe" of the task.
export const generateThemeFromVibe = (vibe: 'focused' | 'calm' | 'energetic'): AppTheme => {
  switch (vibe) {
    case 'focused':
      return {
        ...midnightTheme,
        primary: '#00D2FF', // Cyber blue for high focus
      };
    case 'calm':
      return {
        ...midnightTheme,
        background: '#0A0C10',
        primary: '#329e46', // Soft neon green
      };
    case 'energetic':
      return {
        ...midnightTheme,
        background: '#120A0A',
        primary: '#FF4500', // Neon orange
      };
    default:
      return midnightTheme;
  }
};