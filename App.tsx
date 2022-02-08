import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  DMSans_400Regular, useFonts,
} from '@expo-google-fonts/dm-sans';
import {
  DMSerifDisplay_400Regular,
} from '@expo-google-fonts/dm-serif-display';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components/native';
import theme from '@src/theme';
import { AuthProvider } from '@src/hooks/auth';
import { Routes } from '@src/routes';

export default function App() {
  const [fontsLoader] = useFonts({
    DMSerifDisplay_400Regular,
    DMSans_400Regular,
  })

  if (!fontsLoader) {
    return <AppLoading />
  }

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <StatusBar style="light" translucent backgroundColor="transparent"/>
        <Routes />
      </ThemeProvider>
    </AuthProvider>
  );
}