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
        // Smooth native right-to-left slide transition
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true, 
        
        // FIX 2: Forces the background layer during pop transitions to stay completely black
        cardStyle: { backgroundColor: '#000000' },
        
        // FIX 1: REMOVED gestureResponseDistance: 200
        // This stops React Navigation from blocking vertical scrolling on your article lists.
      }}
    >
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="ArticleScreen" component={ArticleScreen} />
    </Stack.Navigator>
  );
}