import React, { useRef, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Bookmark, EllipsisVertical, GalleryVerticalEnd, Languages, Check } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from 'store/slices/articleSlice';
import Main from 'screens/Main';
import BookmarksScreen from 'screens/BookmarksScreen';
import { DropMenu } from 'components/ui/DropMenu';
import { db } from 'db';
import { bookmarksTable } from 'db/schema';
import ClearCacheModal from 'components/ui/ClearCacheModal';

const Tab = createMaterialTopTabNavigator();

export function MyTabBar({ state, descriptors, navigation }: any) {
  const { buildHref } = useLinkBuilder();
  const { width: screenWidth } = useWindowDimensions();
  const dispatch = useDispatch();
  
  const currentLang = useSelector((state: any) => state.article.lang);
  
  const lastPressRef = useRef<{ [key: string]: number }>({});

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  return (
    <View style={styles.absoluteWrapper}>
      {/* LANGUAGE SELECTION DROPDOWN */}
      <DropMenu>
        <DropMenu.Trigger style={[styles.btnTab, { left: 24 }]}>
          <Languages color="#ffffff" size={22} />
        </DropMenu.Trigger>
        <DropMenu.Content>
          <DropMenu.Header title="Change Language" />
          <DropMenu.Divider />
          <DropMenu.Item 
            label="العربية" 
            onPress={() => dispatch(setLanguage('ar'))}
            icon={currentLang === 'ar' ? <Check size={16} color="#00FF66" /> : <View style={{ width: 16 }} />}
          />
          <DropMenu.Item 
            label="English" 
            onPress={() => dispatch(setLanguage('en'))}
            icon={currentLang === 'en' ? <Check size={16} color="#00FF66" /> : <View style={{ width: 16 }} />}
          />
          <DropMenu.Item 
            label="Français" 
            onPress={() => dispatch(setLanguage('fr'))}
            icon={currentLang === 'fr' ? <Check size={16} color="#00FF66" /> : <View style={{ width: 16 }} />}
          />
        </DropMenu.Content>
      </DropMenu>

      {/* CENTER NAVIGATION TAB CAPSULE */}
      <View style={[styles.container, { left: (screenWidth - 180) / 2 }]}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const now = Date.now();
            const LAST_PRESS_TIME = lastPressRef.current[route.key] || 0;
            
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (isFocused) { 
              if (now - LAST_PRESS_TIME < 300) {
                navigation.emit({
                  type: 'tabDoublePress',
                  target: route.key,
                });
              }
              lastPressRef.current[route.key] = now;
            } else {
              if (!event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
              lastPressRef.current[route.key] = now;
            }
          };

          const renderIcon = (focused: boolean) => {
            const iconSize = 24;
            const iconColor = focused ? '#ffffff' : '#666666';
            const iconFill = focused ? '#ffffff' : 'transparent';
            
            return route.name.toLowerCase() === 'bookmarks'
              ? <Bookmark size={iconSize} color={iconColor} fill={iconFill} />
              : <GalleryVerticalEnd size={iconSize} color={iconColor} fill={iconFill} />;
          };

          return (
            <PlatformPressable
              key={route.key}
              href={buildHref(route.name, route.params)}
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabButton}
              hitSlop={10}
            >
              {renderIcon(isFocused)}
            </PlatformPressable>
          );
        })}
      </View>
        {/* OPTIONS DROPDOWN */}
      <DropMenu>
        <DropMenu.Trigger style={[styles.btnTab, { right: 24 }]}>
          <EllipsisVertical color="#ffffff" size={22} />
        </DropMenu.Trigger>
        <DropMenu.Content>
          <DropMenu.Header title="Options" />
          <DropMenu.Divider />
          <DropMenu.Item label="Settings" onPress={() => console.log('Settings Tapped')} /> 
          <DropMenu.Item label="Clear Cache" onPress={() => setIsConfirmVisible(true)} />
        </DropMenu.Content>
      </DropMenu>
 
      <ClearCacheModal
        visible={isConfirmVisible}
        onClose={() => setIsConfirmVisible(false)}
        onConfirm={async () => {
          try {
            await db.delete(bookmarksTable)
            console.log('Cache cleanly wiped out from local storage.');
          } catch (error) {
            console.error('Error clearing cache:', error);
          }
        }}
      />
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
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen name="Main" component={Main} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  absoluteWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'transparent',
  },
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
  btnTab: {
    position: 'absolute',
    bottom: 36,
    width: 64,
    height: 64,
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
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