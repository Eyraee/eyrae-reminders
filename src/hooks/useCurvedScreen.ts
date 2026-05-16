import { useWindowDimensions } from 'react-native';

// This padding ensures interactive elements (checkboxes, text inputs) 
// do not spill over into the 3D curve of the display, preventing 
// accidental touches and visual distortion.
const CURVE_SAFE_PADDING = 24; 

export const useCurvedScreen = () => {
  const { width, height } = useWindowDimensions();

  return {
    screenWidth: width,
    screenHeight: height,
    // Apply this horizontal padding to any container holding interactive content
    safeHorizontalPadding: CURVE_SAFE_PADDING,
    // The exact width available for safe content rendering
    contentWidth: width - (CURVE_SAFE_PADDING * 2),
    // Use this value (0) for absolute positioning of glass backgrounds 
    // so they wrap around the edges seamlessly
    bleedEdge: 0, 
  };
};