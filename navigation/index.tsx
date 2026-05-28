import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import ArticleScreen from 'screens/ArticleScreen';
import { Tabs } from './Tab';

const Stack = createStackNavigator();

export function Navigation() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        // Enforces the smooth native right-to-left slide transition across iOS and Android
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true, 
        gestureResponseDistance:200
      }}
    >
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="ArticleScreen" component={ArticleScreen} />
    </Stack.Navigator>
  );
}