export const typography = {
  size: {
    h1: 36,     // Massive, for daily greetings
    h2: 24,     // Section headers
    body: 16,   // Standard task text
    caption: 13,// Timestamps and small metadata
  },
  weight: {
    light: '300',
    regular: '400',
    semibold: '600',
    bold: '800',
  } as const,
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 1.2, // Great for uppercase captions
  }
};