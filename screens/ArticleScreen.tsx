import { View, ScrollView, StyleSheet, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AXIOS } from 'api/AXIOS';
import { SafeAreaView } from 'react-native-safe-area-context';
import Span from 'components/Span';
import { Image } from 'expo-image';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ArticleScreen = ({ route }: any) => {
  // Grab both title and our passed preview thumbnail image directly
  const { title, fallbackImage } = route.params;
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
          origin: '*',
        },
      });

      const pages = res.data.query.pages;
      const pageId = Object.keys(pages)[0];
      const pageData = pages[pageId];

      // CRITICAL FIX: Add optional chaining fallback protection
      // setup to fall back on the original card image if 'original' profile is missing
      const highResImage = pageData?.original?.source || fallbackImage;

      setArticle({
        title: pageData.title,
        body: pageData.extract,
        image: highResImage,
        pageId: pageData.pageid,
      });
    } catch (error) {
      console.error('Error fetching full Wikipedia article data: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [title]);
  const nav = useNavigation()
  return (
    <SafeAreaView style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>

        <Image
          source={{
            uri: article?.image || fallbackImage,
            headers: {
              'User-Agent': 'RollKi/1.0 (contact: front-end developer; React Native)',
            },
          }}
          style={styles.heroImage}
          contentFit="cover"
          transition={200}
        />
        <Pressable
          onPress={() => nav.goBack()}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 50,
          }}>
          <ArrowLeft color="#fff" size={24} />
        </Pressable>
        <View style={styles.textContainer}>
          <Span fontWeight="bold" style={styles.titleText}>
            {article?.title || title}
          </Span>
          <Span style={styles.descriptionText}>Wikipedia Full Article</Span>

          {loading ? (
            <View style={styles.bodyLoader}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          ) : article?.body ? (
            <Span style={styles.extractText}>{article.body}</Span>
          ) : (
            <Span style={styles.extractText}>
              This article has no viewable text sections available.
            </Span>
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
  scrollContent: {
    paddingBottom: 50,
  },
  heroImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.55,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: '#1e1e1e',
  },
  textContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    fontFamily: 'CourierPrime-Regular',
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
  bodyLoader: {
    marginTop: 40,
    alignItems: 'center',
  },
});

export default ArticleScreen;
