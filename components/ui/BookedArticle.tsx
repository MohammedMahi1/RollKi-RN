import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import React, { useEffect } from 'react';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Span from 'components/Span';
import { useNavigation } from '@react-navigation/native';

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  runOnJS 
} from 'react-native-reanimated';

export type BookedArticleType = {
  title: string;
  description: string | null;
  source: string | null;
  lang: string; 
  index: number;
  isEditing: boolean;
  onLongPress: () => void;
  onDeletePress: () => void;
  onCancelEditing: () => void;
};

const BookedArticle = ({ 
  title, 
  description, 
  source, 
  lang,
  index,
  isEditing, 
  onLongPress, 
  onDeletePress,
  onCancelEditing
}: BookedArticleType) => {
  const nav = useNavigation<any>();
  const { width: screenWidth } = useWindowDimensions();

  const isRtl = lang === 'ar'; 

  const exitScale = useSharedValue(1);
  const exitOpacity = useSharedValue(1);

  useEffect(() => {
    if (isEditing) {
      exitScale.value = withTiming(0.94, { duration: 200 });
    } else {
      exitScale.value = withTiming(1, { duration: 150 });
    }
  }, [isEditing]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: exitOpacity.value,
      transform: [
        { scale: exitScale.value }
      ],
    };
  });

  const handleItemDelete = () => {
    exitOpacity.value = withTiming(0, { duration: 200 });
    exitScale.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onDeletePress)(); 
      }
    });
  };

  const handleCardPress = () => {
    if (isEditing) {
      onCancelEditing(); 
    } else {
      nav.navigate("ArticleScreen", { 
        title, 
        fallbackImage: source,
        fallbackExtract: description, 
        articleLang: lang            
      });
    }
  };

  const itemWidth = (screenWidth - 12) / 3;

  return (
    <Animated.View style={[styles.wrapper, { width: itemWidth }, animatedStyle]}>
      <Pressable 
        style={styles.cardContainer} 
        onLongPress={onLongPress} 
        onPress={handleCardPress}
        delayLongPress={400}
      >
        <Image
          source={{ uri: source as string }}
          style={styles.imageBackground}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.4)', 'rgb(0, 0, 0)']}
          locations={[0, 0.4, 0.86]}
          style={styles.gradientOverlay}
        />

        <View style={[styles.textContainer, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
          <Span 
            fontWeight="bold" 
            style={[styles.titleText, { textAlign: isRtl ? 'right' : 'left' }]} 
            numberOfLines={1}
          >
            {title}
          </Span>
          <Span 
            style={[styles.descriptionText, { textAlign: isRtl ? 'right' : 'left' }]} 
            numberOfLines={1}
          >
            {description || (isRtl ? 'لا توجد معاينة متاحة.' : 'No preview available.')}
          </Span>
        </View>
      </Pressable>

      {isEditing && (
        <Pressable 
          style={styles.deleteBadge} 
          onPress={handleItemDelete} 
          hitSlop={15}
        >
          <View style={styles.minusLine} />
        </Pressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 220,
    position: 'relative',
    padding: 3,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#5b5b5b',
    borderRadius: 4,
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '65%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 12,
    left: 10,
    right: 10,
    gap: 2,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
    width: '100%',
  },
  descriptionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    lineHeight: 14,
    width: '100%',
  },
  deleteBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  minusLine: {
    width: 12,
    height: 2.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.25,
  },
});

export default BookedArticle;