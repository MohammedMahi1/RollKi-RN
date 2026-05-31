import { View, ScrollView, StyleSheet, Dimensions, ActivityIndicator, Pressable, Share } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AXIOS } from 'api/AXIOS';
import { SafeAreaView } from 'react-native-safe-area-context';
import Span from 'components/Span';
import { Image } from 'expo-image';
import { ArrowLeft, Share2 } from 'lucide-react-native'; 
import { useNavigation } from '@react-navigation/native';

// Import WebBrowser module
import * as WebBrowser from 'expo-web-browser';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ArticleScreen = ({ route }: any) => {
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

  const handleOpenBrowser = async () => {
    try {
      const articleUrl = `https://en.m.wikipedia.org/wiki/${encodeURIComponent(title)}`;
      await WebBrowser.openBrowserAsync(articleUrl, {
        toolbarColor: '#000000',
        controlsColor: '#FFFFFF',
        enableBarCollapsing: true,
      });
    } catch (error) {
      console.error('Failed to load WebBrowser context surface:', error);
    }
  };

  const handleShareArticle = async () => {
    try {
      const articleUrl = `https://en.m.wikipedia.org/wiki/${encodeURIComponent(title)}`;
      await Share.share({
        message: `Check out this article on RollKi: ${title}\n\n${articleUrl}`,
        title: title,
      });
    } catch (error) {
      console.error('Error launching device share sheets: ', error);
    }
  };

  const nav = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={{ position: 'relative' }}>
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
            style={[styles.headerButton, { left: 20 }]}>
            <ArrowLeft color="#fff" size={24} />
          </Pressable>

          <Pressable
            onPress={handleShareArticle}
            style={[styles.headerButton, { right: 20 }]}>
            <Share2 color="#fff" size={22} />
          </Pressable>
        </View>

        <View style={styles.textContainer}>
          <Span fontWeight="bold" style={styles.titleText}>
            {article?.title || title}
          </Span>
          
          {/* FIX: Turn label descriptor into an interactive link element context */}
          <Pressable onPress={handleOpenBrowser} style={styles.linkWrapper} hitSlop={8}>
            <Span style={styles.descriptionText}>Wikipedia Full Article →</Span>
          </Pressable>

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
  headerButton: {
    position: 'absolute',
    top: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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
  linkWrapper: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  descriptionText: {
    color: '#A0A0A0',
    fontSize: 14,
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