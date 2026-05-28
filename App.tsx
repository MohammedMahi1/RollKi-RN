import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { useEffect, useMemo } from 'react';

import 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import { Tabs } from 'navigation/Tab';
import {Navigation} from 'navigation/index'
SplashScreen.preventAutoHideAsync();
export default function App() {


  useFonts({
    'CustomFont-Regular': require("./font/CourierPrime-Regular.ttf"),
    'CustomFont-Bold': require('./font/CourierPrime-Bold.ttf'),
  });

  const colorScheme = useColorScheme();
  const theme = useMemo(() => (colorScheme === 'dark' ? DarkTheme : DefaultTheme), [colorScheme]);

  return (
    <NavigationContainer theme={theme}>
      <Navigation/>
    </NavigationContainer>
  );
}
