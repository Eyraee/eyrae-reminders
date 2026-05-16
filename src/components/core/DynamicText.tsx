import React from 'react';
import { Text, TextProps } from 'react-native';
import { midnightTheme } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface DynamicTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'body' | 'caption';
  color?: 'primary' | 'muted' | 'default';
  align?: 'left' | 'center' | 'right';
  weight?: keyof typeof typography.weight;
}

export const DynamicText = ({
  variant = 'body',
  color = 'default',
  align = 'left',
  weight,
  style,
  children,
  ...rest
}: DynamicTextProps) => {
  
  // Determine color based on prop
  const textColor = 
    color === 'primary' ? midnightTheme.primary :
    color === 'muted' ? midnightTheme.textMuted :
    midnightTheme.text;

  // Determine font weight (default to bold for headers, regular for body)
  const fontWeight = weight ? typography.weight[weight] :
    (variant === 'h1' || variant === 'h2') ? typography.weight.bold : 
    typography.weight.regular;

  return (
    <Text
      style={[
        {
          fontSize: typography.size[variant],
          color: textColor,
          textAlign: align,
          fontWeight: fontWeight,
          letterSpacing: variant === 'caption' ? typography.letterSpacing.wide : typography.letterSpacing.tight,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};