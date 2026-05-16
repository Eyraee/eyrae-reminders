import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { DynamicText } from '../src/components/core/DynamicText';

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <DynamicText variant="h2">Oops! 404</DynamicText>
      <Link href="/" style={{ marginTop: 20 }}>
        <DynamicText color="primary">Go back home</DynamicText>
      </Link>
    </View>
  );
}