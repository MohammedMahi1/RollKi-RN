import { View, Text, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AXIOS } from 'api/AXIOS';
import { SafeAreaView } from 'react-native-safe-area-context';
import Span from 'components/Span';
import { Image } from 'expo-image';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ArticleScreen = ({ route }: any) => {
  const { title } = route.params;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await AXIOS.get('/w/api.php', {
        params: {
          action: 'query',
          prop: 'extracts|pageimages',
          exlimit: '1',
          piprop: 'original', 
          explaintext: true,
          titles: title,
          format: 'json',
          origin: '*'
        }
      });

      const pages = res.data.query.pages;
      const pageId = Object.keys(pages)[0];
      const pageData = pages[pageId];
      console.log("===");
      console.log(pageData.original.source);
      console.log("===");
      
      setArticle({
        title: pageData.title,
        body: pageData.extract,
        image: pageData.original.source
      });
    } catch (error) {
      console.error("Error fetching full Wikipedia article data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [title]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }
  const rawImageUri = article.image;
  const sanitizedImageUri = rawImageUri ? decodeURIComponent(rawImageUri) : null;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          <Image
            source={{ 
              uri: sanitizedImageUri as string,
              headers: {
                'User-Agent': 'RollKi/1.0 (contact: front-end developer; React Native)',
              }
            }}
            style={styles.heroImage}
            contentFit="cover"
          />
        <View style={styles.textContainer}>
          <Span fontWeight='bold' style={styles.titleText}>{article?.title}</Span>
          <Span style={styles.descriptionText}>Wikipedia Full Article</Span>
          
          {article?.body ? (
            <Span style={styles.extractText}>{article.body}</Span>
          ) : (
            <Span style={styles.extractText}>This article has no viewable text sections available.</Span>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  heroImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.55,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor:"#1e1e1e"
  },
  placeholderImage: {
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    fontFamily:"CourierPrime-Regular"
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 30,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  descriptionText: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  extractText: {
    color: '#E0E0E0',
    fontSize: 16,
    lineHeight: 26,
    },
  loadingText: {
    color: '#A0A0A0',
    marginTop: 12,
    fontSize: 14,
  },
});

export default ArticleScreen;