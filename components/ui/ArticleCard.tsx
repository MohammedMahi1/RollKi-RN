import { View, Pressable, useWindowDimensions, Animated } from 'react-native';
import React from 'react';
import Span from 'components/Span';
import { Bookmark, Compass, Heart } from "lucide-react-native";
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useAppDispatch } from 'hooks/store';
import { bookmarkSet } from 'store/slices/bookmarksSlice';

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
  index: number;
  scrollY: Animated.Value;
}


interface SideTipProps {
title:string;
description:string;
source:string
}
const SideTip = ({title,description,source}:SideTipProps) => {
  const dispatch = useAppDispatch()
  const handleBookmark = (e:SideTipProps)=>{
    dispatch(bookmarkSet(e))
  }
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
      <Pressable hitSlop={12} onPress={()=>handleBookmark({
        description,
        source,
        title
      })}> 
        <Bookmark size={26} color={"#ffffff"}/>
      </Pressable>
      <Pressable hitSlop={12}> 
        <Compass size={26} color={"#ffffff"}/>
      </Pressable>
    </View>
  );
};

const ArticleCard = ({ item, cardHeight, index, scrollY }: ArticleCardProps) => {
  const nav = useNavigation<any>();
  const { width: screenWidth } = useWindowDimensions();
  const { title, extract, thumbnail, pageid } = item;

  const rawImageUri = thumbnail?.source;
  const sanitizedImageUri = rawImageUri ? decodeURIComponent(rawImageUri) : null;

  const mediaContainerHeight = cardHeight * 0.55; 
  const textContainerHeight = cardHeight * 0.45;  

  const inputRange = [
    (index - 1) * cardHeight, 
    index * cardHeight,       
    (index + 1) * cardHeight,
  ];
  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 0], 
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={{ 
        backgroundColor: '#000000', 
        height: cardHeight, 
        width: screenWidth,
        opacity: opacity,
      }}
    >
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
              uri: sanitizedImageUri as string,
              headers: {
                'User-Agent': 'RollKi/1.0 (contact: front-end developer; React Native)',
              }
            }}
            key={pageid}
            recyclingKey={pageid.toString()}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            onError={(e:any) => {
              console.log(`Image failed to load for: ${title}`, e.nativeEvent.error);
            }}
          />
        <SideTip 
        description={extract ?? ""}
        title={title}
        source={sanitizedImageUri?? ""}
        />
      </View>

{/* 2. CONTENT WINDOW */}
<Pressable 
  onPress={() => {
    nav.navigate("ArticleScreen", {
      title: title,
      fallbackImage: sanitizedImageUri // Pass the working image URI down
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
    </Animated.View>
  );
};

export default ArticleCard;