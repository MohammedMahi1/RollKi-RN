import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Pressable,
  Share,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import Span from 'components/Span';
import { Image } from 'expo-image';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import { addBookmarkAsync, removeBookmarkByTitleAsync } from 'store/slices/bookmarksSlice';
import DoublePressable from 'components/DoublePressable';
import * as WebBrowser from 'expo-web-browser';

import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { AXIOS } from 'api/AXIOS';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ArticleScreen = ({ route }: any) => {
  const { title, fallbackImage, fallbackExtract, articleLang } = route.params;
  const dispatch = useAppDispatch();
  const nav = useNavigation();

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const globalLang = useAppSelector((state) => state.article.lang || 'ar');
  const activeLang = articleLang || globalLang; 
  const isRtl = activeLang === 'ar';

  const savedItems = useAppSelector((state) => state.bookmark.items || []);
  const isBookmarked = savedItems.some((bookmark) => bookmark.title === title && bookmark.lang === activeLang);

  const animScale = useSharedValue(0);
  const animOpacity = useSharedValue(0);

  const fetchData = async () => {
    try {
      setLoading(true);

      const normalizedTitle = title ? title.trim().replace(/\s+/g, '_') : '';

      const res = await AXIOS.get("/w/api.php", {
        lang: activeLang,
        params: {
          action: 'query',
          prop: 'extracts|pageimages',
          exlimit: '1',
          exintro: true, 
          piprop: 'original',
          explaintext: true,
          titles: normalizedTitle,
          format: 'json',
          origin: '*',
        }
      });

      const pages = res.data?.query?.pages;
      if (!pages) throw new Error("No payload found on this language server cluster.");

      const pageId = Object.keys(pages)[0];
      const pageData = pages[pageId];

      // If page ID is negative, Wikipedia returned a missing page result (-1)
      if (parseInt(pageId) < 0) {
        setArticle({
          title: title,
          body: fallbackExtract || null,
          image: fallbackImage,
          pageId: null,
        });
        return;
      }

      const highResImage = pageData?.original?.source || fallbackImage;

      setArticle({
        title: pageData.title,
        body: pageData.extract || fallbackExtract, 
        image: highResImage,
        pageId: pageData.pageid,
      });

    } catch (error) {
      console.error('Error target-fetching content from language engine: ', error);
      setArticle({
        title,
        body: fallbackExtract || null,
        image: fallbackImage,
        pageId: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [title, activeLang]); 

  const handleOpenBrowser = async () => {
    try {
      const articleUrl = `https://${activeLang}.m.wikipedia.org/wiki/${encodeURIComponent(title)}`;
      await WebBrowser.openBrowserAsync(articleUrl, {
        toolbarColor: '#000000',
        controlsColor: '#FFFFFF',
        enableBarCollapsing: true,
      });
    } catch (error) {
      console.error('Failed to load WebBrowser surface context:', error);
    }
  };

  const handleShareArticle = async () => {
    try {
      const articleUrl = `https://${activeLang}.m.wikipedia.org/wiki/${encodeURIComponent(title)}`;
      await Share.share({
        message: `Check out this article on RollKi: ${title}\n\n${articleUrl}`,
        title: title,
      });
    } catch (error) {
      console.error('Error launching native device share sheets: ', error);
    }
  };

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      dispatch(removeBookmarkByTitleAsync(title));
    } else {
      dispatch(
        addBookmarkAsync({
          title,
          description: article?.body || fallbackExtract || 'No preview available', 
          source: article?.image || fallbackImage || 'https://via.placeholder.com/150',
          lang: activeLang,
        })
      );
    }
  };

  const animationFinished = () => {
    setIsAnimating(false);
  };

  const handleDoublePress = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (!isBookmarked) {
      handleToggleBookmark();
    }

    animScale.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(1, { duration: 100 }),
      withTiming(140 / 170, { duration: 150 }),
      withDelay(500, withTiming(130 / 170, { duration: 200 }))
    );

    animOpacity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(1, { duration: 100 }),
      withTiming(1, { duration: 150 }),
      withDelay(
        500,
        withTiming(0, { duration: 200 }, () => {
          runOnJS(animationFinished)();
        })
      )
    );
  };

  const animatedBookmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animScale.value }],
      opacity: animOpacity.value,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <DoublePressable
          onDoublePress={handleDoublePress}
          disabled={isAnimating}
          style={styles.imageWrapper}>
          <Image
            source={{
              uri: article?.image || fallbackImage,
            }}
            style={styles.heroImage}
            contentFit="cover"
            transition={200}
          />

          <AnimatedReanimated.View style={[styles.centerOverlay, animatedBookmarkStyle]}>
            <Bookmark size={170} color="#c5c5c5" strokeWidth={0.1} fill="#ffffff" />
          </AnimatedReanimated.View>

          <Pressable onPress={() => nav.goBack()} style={[styles.headerButton, { left: 20 }]}>
            <ArrowLeft color="#fff" size={24} />
          </Pressable>

          <Pressable onPress={handleShareArticle} style={[styles.headerButton, { right: 20 }]}>
            <Share2 color="#fff" size={22} />
          </Pressable>
        </DoublePressable>

        <View style={[styles.textContainer, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
          <Span
            fontWeight="bold"
            style={[styles.titleText, { textAlign: isRtl ? 'right' : 'left' }]}>
            {article?.title || title}
          </Span>

          <Pressable onPress={handleOpenBrowser} style={styles.linkWrapper} hitSlop={8}>
            <Span style={styles.descriptionText}>
              {isRtl ? '← المقالة الكاملة في ويكيبيديا' : 'Wikipedia Full Article →'}
            </Span>
          </Pressable>

          {loading ? (
            <View style={styles.bodyLoader}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          ) : article?.body ? (
            <Span style={[styles.extractText, { textAlign: isRtl ? 'right' : 'left' }]}>
              {article.body}
            </Span>
          ) : (
            <Span style={[styles.extractText, { textAlign: isRtl ? 'right' : 'left' }]}>
              {isRtl
                ? 'لا توجد أقسام نصية قابلة للعرض في هذه المقالة.'
                : 'This article has no viewable text sections available.'}
            </Span>
          )}
        </View>
      </ScrollView>

      <Pressable
        onPress={handleToggleBookmark}
        style={[styles.floatingBookmarkBtn, isRtl ? { left: 24 } : { right: 24 }]}
        hitSlop={12}>
        <Bookmark size={26} color="#ffffff" fill={isBookmarked ? '#ffffff' : 'transparent'} />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollContent: { paddingBottom: 110 },
  imageWrapper: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.55,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: '#1e1e1e',
  },
  centerOverlay: { position: 'absolute', justifyContent: 'center', alignItems: 'center', zIndex: 5 },
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
  textContainer: { paddingHorizontal: 24, paddingTop: 24 },
  titleText: { color: '#FFFFFF', fontSize: 30, marginBottom: 6, letterSpacing: 0.5 },
  linkWrapper: { marginBottom: 24 },
  descriptionText: { color: '#A0A0A0', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.2 },
  extractText: { color: '#E0E0E0', fontSize: 16, lineHeight: 26 },
  bodyLoader: { marginTop: 40, alignItems: 'center' },
  floatingBookmarkBtn: {
    position: 'absolute',
    bottom: 36,
    width: 64,
    height: 64,
    backgroundColor: 'rgba(34, 34, 34, 0.95)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 99,
  },
});

export default ArticleScreen;