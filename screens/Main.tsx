import {
  View,
  ActivityIndicator,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native'; // Added navigation hook
import ArticleCard from 'components/ui/ArticleCard';
import { WikiApiResponse, WikiArticle } from 'types';
import axios from 'axios';

const fetchRandomArticlesWithThumbnails = async (limit: number = 10): Promise<WikiArticle[]> => {
  let accumulatedArticles: WikiArticle[] = [];
  let attempts = 0;
  const maxAttempts = 5;

  try {
    while (accumulatedArticles.length < limit && attempts < maxAttempts) {
      attempts++;
      const neededCount = limit - accumulatedArticles.length;

      const response = await axios.get<WikiApiResponse>('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          format: 'json',
          generator: 'random',
          grnnamespace: 0, 
          grnlimit: Math.max(neededCount * 2, 10),
          prop: 'pageimages|extracts',
          piprop: 'thumbnail',
          pithumbsize: 400, 
          exintro: 1,      
          explaintext: 1,  
          exchars: 200,    
          origin: '*',
        },
        headers: {
          'User-Agent': 'RollKi/1.0 (https://github.com/MohammedMahi1/RollKi-RN.git; mohammed.mahi012@gmail.com) Axios/React-Native'
        }
      });

      const pages = response.data.query?.pages;
      if (!pages) continue;

      const filteredBatch = Object.values(pages).filter(
        (article) => article.thumbnail && article.thumbnail.source
      );

      accumulatedArticles = [...accumulatedArticles, ...filteredBatch];
    }

    return accumulatedArticles.slice(0, limit);
  } catch (error) {
    console.error('Error fetching Wikipedia articles:', error);
    return [];
  }
};

const Main = () => {
  const navigation = useNavigation(); // Hook into screen navigation context
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [h, setH] = useState<number>(0);

  const listRef = useRef<FlashList<WikiArticle>>(null);

  // Set up listener for our custom double click tab event
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabDoubleClick' as any, () => {
      if (listRef.current && articles.length > 0) {
        // Smoothly scroll down or up directly to the first item (index 0)
        listRef.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    });

    return unsubscribe;
  }, [navigation, articles]);

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#ffffff" />
      </View>
    );
  };

  const loadArticles = useCallback(
    async (isInitial = false) => {
      if (isLoading) return;
      setIsLoading(true);

      const newArticles = await fetchRandomArticlesWithThumbnails(10);

      setArticles((prev) => (isInitial ? newArticles : [...prev, ...newArticles]));
      setIsLoading(false);
    },
    [isLoading]
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadArticles(true);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadArticles(true);
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setH(height);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }} edges={['top']}>
      <View style={{ flex: 1 }} onLayout={handleLayout}>
        {h > 0 && (
          <FlashList
            ref={listRef}
            data={articles}
            pagingEnabled
            renderItem={({ item }) => <ArticleCard item={item} cardHeight={h} />}
            keyExtractor={(item) => item.pageid.toString()}
            onEndReached={() => loadArticles(false)}
            onEndReachedThreshold={0.5} 
            ListFooterComponent={renderFooter}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Main;

const styles = StyleSheet.create({
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});