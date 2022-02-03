import React from 'react';
import {
  DMSans_400Regular, useFonts,
} from '@expo-google-fonts/dm-sans';
import {
  DMSerifDisplay_400Regular,
} from '@expo-google-fonts/dm-serif-display';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components/native';
import theme from '@src/theme';

import { Signin } from '@src/components/screens/Signin';

export default function App() {
  const [fontsLoader] = useFonts({
    DMSerifDisplay_400Regular,
    DMSans_400Regular,
  })

  if (!fontsLoader) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <Signin />
    </ThemeProvider>
  );
}