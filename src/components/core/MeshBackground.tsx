import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

export const MeshBackground = () => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <View 
      style={[
        StyleSheet.absoluteFill, 
        { backgroundColor: theme.background }
      ]} 
    />
  );
};