import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Span from 'components/Span';

export type BookedArticleType = {
  title: string;
  description: string;
  img: string;
};

const BookedArticle = ({ title, description, img }: BookedArticleType) => {
  return (
    <View style={styles.cardContainer}>
      {/* Article Background Image */}
      <Image
        source={{ uri: img }}
        style={styles.imageBackground}
        contentFit="cover"
        transition={200}
      />

      {/* Dark Gradient Overlay: Transparent on top, solid black on bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.4)', 'rgb(0, 0, 0)']}
        locations={[0,0.4, 0.86]}
        style={styles.gradientOverlay}
      />

      {/* Text Content Window */}
      <View style={styles.textContainer}>
        <Span 
          fontWeight="bold" 
          style={styles.titleText} 
          numberOfLines={1} 
          ellipsizeMode="tail"
        >
          {title}
        </Span>
        <Span 
          style={styles.descriptionText} 
          numberOfLines={1} 
          ellipsizeMode="tail"
        >
          {description}
        </Span>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: 220,
    margin: 2, 
    backgroundColor: '#1e1e1e',
    overflow: 'hidden',
    position: 'relative',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor:"#ffffff"
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
  },
  descriptionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    lineHeight: 14,
  },
});

export default BookedArticle;