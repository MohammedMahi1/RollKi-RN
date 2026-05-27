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
  
  const [imageFailed, setImageFailed] = useState(false);

  const rawImageUri = originalimage?.source || thumbnail?.source;
  
  let finalizedImageUri = null;

  if (rawImageUri) {
    // 1. Clean up URL encoding characters first
    const decodedUrl = decodeURIComponent(rawImageUri);
    
    // 2. The Magic Fix: Strip out the protocol line and pipe it through a free global CDN proxy
    // This makes the request look like it's coming from a massive caching server instead of your test app ip
    const cleanUrl = decodedUrl.replace(/^https?:\/\//, '');
    finalizedImageUri = `https://images.weserv.nl/?url=${cleanUrl}&default=ssl:upload.wikimedia.org/wikipedia/commons/0/07/Ray_Martin_(11024225326).jpg`;
  }

  const mediaContainerHeight = cardHeight * 0.55; 
  const textContainerHeight = cardHeight * 0.45;  

  const shouldShowImage = finalizedImageUri && !imageFailed;

  return (
    <View style={{ backgroundColor: '#111111', height: cardHeight, width: screenWidth }}>
      
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
              uri: finalizedImageUri,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
              }
            }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            onError={(e) => {
              console.log(`Image asset completely blocked for: ${title}`, e.nativeEvent.error);
              setImageFailed(true);
            }}
          />
        ) : (
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }} />

    </View>
  );
};

export default ArticleCard;