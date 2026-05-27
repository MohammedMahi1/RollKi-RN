import { View, Image, Pressable, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import Span from 'components/Span';
import { Bookmark, Compass, Heart } from "lucide-react-native";
import { useNavigation } from '@react-navigation/native';

// 1. Explicit Typing Contract
interface WikiArticle {
  pageid: number;
  ns: number;
  title: string;
  index: number;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  extract?: string;
}

interface ArticleCardProps {
  item: WikiArticle;
  cardHeight: number;
}

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
  );
};

const ArticleCard = ({ item, cardHeight }: ArticleCardProps) => {

  const nav = useNavigation<any>();

  const { width: screenWidth } = useWindowDimensions();
  const { title, extract, thumbnail } = item;
  

  // Updated image fallback pipeline to match WikiArticle properties
  const rawImageUri = thumbnail?.source;
  const sanitizedImageUri = rawImageUri ? decodeURIComponent(rawImageUri) : null;

  const mediaContainerHeight = cardHeight * 0.55; 
  const textContainerHeight = cardHeight * 0.45;  
  
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
          <Image
            source={{ 
              uri: sanitizedImageUri,
              headers: {
                'User-Agent': 'RollKi/1.0 (contact: front-end developer; React Native)',
              }
            }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            onError={(e) => {
              console.log(`Image failed to load for: ${title}`, e.nativeEvent.error);
            }}
          />
        <SideTip />
      </View>

      {/* 2. CONTENT WINDOW */}
      <Pressable 
        onPress={() => {
          nav.navigate("ArticleScreen", {
            title: title
          });
        }}
        style={{ 
          paddingHorizontal: 24, 
          paddingTop: 24,
          paddingBottom: 24, 
          height: textContainerHeight, 
          justifyContent: 'flex-start',
          gap: 6
        }}
      >
        <Span 
          style={{ fontSize: 30, color: '#FFFFFF', lineHeight: 36 }} 
          fontWeight='bold' 
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Span>
        
        {/* Note: Wikipedia API "extract" usually serves as both description and extract preview */}
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
          {extract || 'No preview available for this article.'}
        </Span>
      </Pressable>
    </View>
  );
};

export default ArticleCard;