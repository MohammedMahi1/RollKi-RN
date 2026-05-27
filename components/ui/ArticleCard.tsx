import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import { ArticleType } from 'types';
import Span from 'components/Span';
import {Bookmark, Compass, Heart}from "lucide-react-native"
// {
//   "title": "Axolotl",
//   "description": "Species of amphibian",
//   "extract": "The axolotl is a paedomorphic salamander closely related to the tiger salamander...",
//   "thumbnail": {
//     "source": "https://upload.wikimedia.org/.../axolotl.jpg",
//     "width": 320,
//     "height": 240
//   },
//   "content_urls": {
//     "mobile": { "page": "https://en.m.wikipedia.org/wiki/Axolotl" }
//   }
// }
const SideTip = ()=>{
    return (
        <View style={{
            position: 'absolute',
            bottom: 60,
            right: 24,
            backgroundColor: '#00000058',
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 12,
            gap: 16,
        }}>
            <Pressable> 
              <Heart size={28} color={"#ffffff"}/>
            </Pressable>
            <Pressable> 
              <Bookmark size={28} color={"#ffffff"}/>
            </Pressable>
            <Pressable> 
              <Compass size={28} color={"#ffffff"}/>
            </Pressable>
        </View>
    )
}
type ArticleCardProps = {} & ArticleType;
const ArticleCard = ({
  content_urls,
  description,
  extract,
  title,
  thumbnail,
}: ArticleCardProps) => {
  return (
    <View style={{ backgroundColor: '#000000', flex: 1, width: '100%' }}>
      <View
        style={{
          backgroundColor: '#1a1a1a',
          width: '100%',
          height: '60%',
          alignSelf: 'center',
          justifyContent: 'center',
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          overflow: 'hidden',
        }}>
        <Image
          source={{ uri: thumbnail.source }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <SideTip />
      </View>
      <View style={{ padding: 24,}}>
        <Span style={{ fontSize: 34}} fontWeight='bold'>{title}</Span>
        <Span style={{ fontSize: 24}}>{description}</Span>
        <Span style={{ fontSize: 14 }}>{extract}</Span>
      </View>
    </View>
  );
};

export default ArticleCard;
