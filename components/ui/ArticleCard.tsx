import { View, Image, Pressable, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import { ArticleType } from 'types';
import Span from 'components/Span';
import { Bookmark, Compass, Heart } from "lucide-react-native"

const SideTip = () => {
  return (
    <View style={{
      position: 'absolute',
      bottom: 24, 
      right: 24,
      backgroundColor: 'rgba(0,0,0,0.75)', 
      borderRadius: 24,
      paddingHorizontal: 12,
      paddingVertical: 18,
      gap: 24,
    }}>
      <Pressable hitSlop={12}> 
        <Heart size={26} color={"#ffffff"}/>
      </Pressable>
      <Pressable hitSlop={12}> 
        <Bookmark size={26} color={"#ffffff"}/>
      </Pressable>
      <Pressable hitSlop={12}> 
        <Compass size={26} color={"#ffffff"}/>
      </Pressable>
    </View>
  )
}

interface ArticleCardProps {
  item: ArticleType;
  cardHeight: number;
}

const ArticleCard = ({ item, cardHeight }: ArticleCardProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const { title, description, extract, thumbnail, originalimage } = item;
  
  // Track if the native image loading fails dynamically
  const [imageFailed, setImageFailed] = useState(false);

  const rawImageUri = originalimage?.source || thumbnail?.source;
  const sanitizedImageUri = rawImageUri ? decodeURIComponent(rawImageUri) : null;

  const mediaContainerHeight = cardHeight * 0.55; 
  const textContainerHeight = cardHeight * 0.45;  

  // Determine if we have a viable image asset to display
  const shouldShowImage = sanitizedImageUri && !imageFailed;

  return (
    <View style={{ backgroundColor: '#000000', height: cardHeight, width: screenWidth }}>
      
      {/* 1. MEDIA WINDOW */}
      <View
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
        {shouldShowImage ? (
          <Image
            source={{ 
              uri: sanitizedImageUri,
              // The Secret Sauce: Passes common mobile headers so Wikipedia processes the image stream
              headers: {
                'User-Agent': 'ScrolliaMobileApp/1.0 (contact: front-end developer; React Native)',
                'Accept': 'image/jpeg,image/png,image/*;q=0.8'
              }
            }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            onError={(e) => {
              console.log(`Image failed to load for: ${title}`, e.nativeEvent.error);
              setImageFailed(true);
            }}
          />
        ) : (
          /* Premium UI empty-state placeholder layout if image fails completely */
          <View style={{ alignItems: 'center', gap: 12 }}>
            <Compass size={48} color="rgba(255,255,255,0.15)" />
            <Span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, letterSpacing: 1 }}>
              NO MEDIA AVAILABLE
            </Span>
          </View>
        )}
        <SideTip />
      </View>

      {/* 2. CONTENT WINDOW */}
      <View style={{ 
        paddingHorizontal: 24, 
        paddingTop: 24,
        paddingBottom: 24, 
        height: textContainerHeight, 
        justifyContent: 'flex-start',
        gap: 6
      }}>
        <Span 
          style={{ fontSize: 30, color: '#FFFFFF', lineHeight: 36 }} 
          fontWeight='bold' 
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Span>
        
        {description ? (
          <Span 
            style={{ fontSize: 15, color: 'rgba(255, 255, 255, 0.4)', lineHeight: 20 }} 
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {description}
          </Span>
        ) : null}
        
        <Span 
          style={{ 
            fontSize: 14, 
            color: 'rgba(255, 255, 255, 0.75)', 
            lineHeight: 21,
            marginTop: 4
          }}
          numberOfLines={5} 
          ellipsizeMode="tail"
        >
          {extract}
        </Span>
      </View>

      {/* 3. ABSOLUTE SNAP LINE */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      }} />

    </View>
  );
};

export default ArticleCard;