import { View, Pressable, useWindowDimensions, Animated, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Span from 'components/Span';
import { Bookmark, Compass, Share2 } from "lucide-react-native"; 
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import { addBookmarkAsync, removeBookmarkByTitleAsync } from 'store/slices/bookmarksSlice';
import DoublePressable from 'components/DoublePressable';

import AnimatedReanimated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withTiming, 
  withDelay,
  runOnJS
} from 'react-native-reanimated';

interface WikiArticle {
  pageid: number;
  ns: number;
  title: string;
  index: number;
  thumbnail?: { source: string; width: number; height: number; };
  extract?: string;
}

interface ArticleCardProps {
  item: WikiArticle;
  cardHeight: number;
  index: number;
  scrollY: Animated.Value;
}

interface SideTipProps {
  isBookmarked: boolean;
  onToggle: () => void;
}

const SideTip = ({ isBookmarked, onToggle }: SideTipProps) => {
  return (
    <View style={styles.sideTipContainer}>
      <Pressable hitSlop={12}><Share2 size={26} color={"#ffffff"}/></Pressable>
      <Pressable hitSlop={12} onPress={onToggle}> 
        <Bookmark size={26} color={"#ffffff"} fill={isBookmarked ? "#ffffff" : "transparent"}/>
      </Pressable>
      <Pressable hitSlop={12}><Compass size={26} color={"#ffffff"}/></Pressable>
    </View>
  );
};

const ArticleCard = ({ item, cardHeight, index, scrollY }: ArticleCardProps) => {
  const dispatch = useAppDispatch();
  const nav = useNavigation<any>();
  const { width: screenWidth } = useWindowDimensions();
  const { title, extract, thumbnail, pageid } = item;

  const savedItems = useAppSelector((state) => state.bookmark.items || []);
  const isBookmarked = savedItems.some((bookmark) => bookmark.title === title);

  // Interaction Lock State
  const [isAnimating, setIsAnimating] = useState(false);

  // Reanimated Shared Values
  const animScale = useSharedValue(0);
  const animOpacity = useSharedValue(0);

  const rawImageUri = thumbnail?.source;
  const sanitizedImageUri = rawImageUri ? decodeURIComponent(rawImageUri) : null;
  const mediaContainerHeight = cardHeight * 0.55; 
  const textContainerHeight = cardHeight * 0.45;  

  const opacity = scrollY.interpolate({
    inputRange: [(index - 1) * cardHeight, index * cardHeight, (index + 1) * cardHeight],
    outputRange: [1, 1, 0], 
    extrapolate: 'clamp',
  });

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      dispatch(removeBookmarkByTitleAsync(title));
    } else {
      dispatch(addBookmarkAsync({
        title,
        description: extract || 'No preview available',
        source: sanitizedImageUri || 'https://via.placeholder.com/150',
      }));
    }
  };

  const animationFinished = () => {
    setIsAnimating(false);
  };

  const handleDoublePress = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    if (!isBookmarked) {
      handleToggleBookmark();
    }

    // Exact Figma Sequence Timing Frame Pipelines
    animScale.value = withSequence(
      withTiming(1, { duration: 150 }),                       // Frame 2: Grow straight to Max Size (170)
      withTiming(1, { duration: 100 }),                       // Frame 3: Retain Max Size hold
      withTiming(140 / 170, { duration: 150 }),               // Frame 4: Snap smaller to 140
      withDelay(500, withTiming(130 / 170, { duration: 200 })) // Frame 5: After 500ms delay, settle to 130 and end
    );

    animOpacity.value = withSequence(
      withTiming(1, { duration: 150 }),                       // Frame 2: Full Opacity target
      withTiming(1, { duration: 100 }),                       // Frame 3: Stay Solid
      withTiming(1, { duration: 150 }),                       // Frame 4: Stay Solid
      withDelay(500, withTiming(0, { duration: 200 }, () => {
        runOnJS(animationFinished)();                         // Frame 5: Fade to 0, unlock gesture
      }))
    );
  };

  const animatedBookmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animScale.value }],
      opacity: animOpacity.value,
    };
  });

  return (
    <Animated.View style={{ backgroundColor: '#000000', height: cardHeight, width: screenWidth, opacity }}>
      <DoublePressable
        onDoublePress={handleDoublePress}
        disabled={isAnimating} // Lock the gesture handler completely during execution
        style={{
          backgroundColor: '#161616',
          width: '100%',
          height: mediaContainerHeight,
          borderBottomRightRadius: 24,
          borderBottomLeftRadius: 24,
          overflow: 'hidden',
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Image
            source={{ uri: sanitizedImageUri as string, headers: { 'User-Agent': 'RollKi/1.0 (contact: front-end developer; React Native)' } }}
            key={pageid}
            recyclingKey={pageid.toString()}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            onError={(e:any) => console.log(`Image failed to load for: ${title}`, e.nativeEvent.error)}
          />

        {/* FIGMA PRECISE GEOMETRY OVERLAY */}
        <AnimatedReanimated.View style={[styles.centerOverlay, animatedBookmarkStyle]}>
          <Bookmark size={170} color="#ffffff" fill="#ffffff" />
        </AnimatedReanimated.View>

        <SideTip isBookmarked={isBookmarked} onToggle={handleToggleBookmark} />
      </DoublePressable>

      <Pressable 
        onPress={() => nav.navigate("ArticleScreen", { title, fallbackImage: sanitizedImageUri })}
        style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24, height: textContainerHeight, justifyContent: 'flex-start', gap: 6 }}
      >
        <Span style={{ fontSize: 30, color: '#FFFFFF', lineHeight: 36 }} fontWeight='bold' numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Span>
        <Span style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.75)', lineHeight: 21, marginTop: 4 }} numberOfLines={40} ellipsizeMode="tail">
          {extract || 'No preview available for this article.'}
        </Span>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sideTipContainer: {
    position: 'absolute',
    bottom: 24, 
    right: 24,
    backgroundColor: 'rgba(0,0,0,0.75)', 
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 18,
    gap: 24,
    zIndex: 10,
  },
  centerOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }
});

export default ArticleCard;