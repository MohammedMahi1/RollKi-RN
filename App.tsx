import {DarkTheme, NavigationContainer } from '@react-navigation/native';


import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

import { Navigation } from 'navigation/index';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from 'store/store';

import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from './db';
import migrations from './db/drizzle/migrations';

export default function App() {
  useFonts({
    'CustomFont-Regular': require('./font/CourierPrime-Regular.ttf'),
    'CustomFont-Bold': require('./font/CourierPrime-Bold.ttf'),
  });
// Automatically updates the underlying SQLite tables at runtime
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Database Migration Error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer theme={DarkTheme}>
          <Navigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
