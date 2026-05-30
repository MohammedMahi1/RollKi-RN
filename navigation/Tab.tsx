import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Bookmark, GalleryVerticalEnd } from 'lucide-react-native';
import Main from 'screens/Main';
import BookmarksScreen from 'screens/BookmarksScreen';

const Tab = createMaterialTopTabNavigator();

export function MyTabBar({ state, descriptors, navigation }: any) {
  const { buildHref } = useLinkBuilder();
  const { width: screenWidth } = useWindowDimensions();
  const [lastTap, setLastTap] = useState<{ [key: string]: number }>({});

  return (
    <View style={[styles.container, { left: (screenWidth - styles.container.width) / 2 }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const now = Date.now();
          const DOUBLE_PRESS_DELAY = 300;

          if (isFocused) {
            const prevTapTime = lastTap[route.name] || 0;

            if (now - prevTapTime < DOUBLE_PRESS_DELAY) {
              navigation.emit({
                type: 'tabDoubleClick',
                target: route.key,
              });
              setLastTap({ ...lastTap, [route.name]: 0 });
            } else {
              setLastTap({ ...lastTap, [route.name]: now });
            }
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const renderIcon = (focused: boolean) => {
          const iconSize = 26;
          const iconColor = focused ? '#ffffff' : '#666666';
          const iconFill = focused ? '#ffffff' : 'transparent';
          switch (route.name.toLowerCase()) {
            case 'main':
              return (
                <GalleryVerticalEnd
                  size={iconSize}
                  color={iconColor}
                  fill={iconFill}
                />
              );
            case 'bookmarks':
              return (
                <Bookmark
                  size={iconSize}
                  color={iconColor}
                  fill={iconFill}
                />
              );
            default:
              return (
                <GalleryVerticalEnd
                  size={iconSize}
                  color={iconColor}
                  fill={iconFill}
                />
              );
          }
        };

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            hitSlop={10}>
            {renderIcon(isFocused)}
          </PlatformPressable>
        );
      })}
    </View>
  );
}

export function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        lazy: true,
      }}
      tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen name="Main" component={Main} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 36,
    width: 180,
    height: 64,
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
    borderRadius: 100,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    zIndex: 99,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});