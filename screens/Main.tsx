import {
  View,
  ActivityIndicator,
  Platform,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import ArticleCard from 'components/ui/ArticleCard';
import { WikiApiResponse, WikiArticle } from 'types';
import axios from 'axios';

// 1. Updated Fetch Function with recursive/looping filter logic
const fetchRandomArticlesWithThumbnails = async (limit: number = 10): Promise<WikiArticle[]> => {
  let accumulatedArticles: WikiArticle[] = [];
  let attempts = 0;
  const maxAttempts = 5; // Guard rail to prevent infinite loops if Wikipedia API drops out

  try {
    while (accumulatedArticles.length < limit && attempts < maxAttempts) {
      attempts++;
      
      // Calculate how many more we need to hit our exact limit
      const neededCount = limit - accumulatedArticles.length;

      const response = await axios.get<WikiApiResponse>('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          format: 'json',
          generator: 'random',
          grnnamespace: 0, 
          grnlimit: Math.max(neededCount * 2, 10), // Fetch slightly more than needed to optimize hit-rate
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

      // Filter out any articles that lack a thumbnail property or source URL
      const filteredBatch = Object.values(pages).filter(
        (article) => article.thumbnail && article.thumbnail.source
      );

      accumulatedArticles = [...accumulatedArticles, ...filteredBatch];
    }

    // Return exactly the amount requested (or slightly less if max attempts were hit)
    return accumulatedArticles.slice(0, limit);
  } catch (error) {
    console.error('Error fetching Wikipedia articles:', error);
    return [];
  }
};

const Main = () => {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [h, setH] = useState<number>(0);

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        {/* Changed color to white since your background is solid black (#000000) */}
        <ActivityIndicator size="small" color="#ffffff" />
      </View>
    );
  };

  // Core function to load more articles
  const loadArticles = useCallback(
    async (isInitial = false) => {
      if (isLoading) return;
      setIsLoading(true);

      // Using our new thumbnail-enforced fetcher
      const newArticles = await fetchRandomArticlesWithThumbnails(10);

      setArticles((prev) => (isInitial ? newArticles : [...prev, ...newArticles]));
      setIsLoading(false);
    },
    [isLoading]
  );

  // Pull-to-refresh implementation
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
      {/* Only render FlashList if we have calculated container height 'h'. 
        FlashList behaves unpredictably on initial layout if item size values are 0 or undefined.
      */}
      <View style={{ flex: 1 }} onLayout={handleLayout}>
        {h > 0 && (
          <FlashList
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