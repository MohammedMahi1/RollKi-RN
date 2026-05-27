import { View, ActivityIndicator, useWindowDimensions, StatusBar, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import ArticleCard from 'components/ui/ArticleCard';
import { AXIOS } from 'api/AXIOS';

const Main = () => {
  const [articles, setArticles] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cardHeight, setCardHeight] = useState(0); // Holds the exact layout height
  // Function to fetch a batch of random articles
  const fetchRandomArticles = async (count = 5) => {
    if (loadingMore) return;
    setLoadingMore(true);

    try {
      const newArticles: any = [];

      // Wikipedia's random API gives 1 article per request, so we call it a few times in parallel
      const requests = Array.from({ length: count }, () => AXIOS.get('page/random/summary'));
      const responses = await Promise.all(requests);

      responses.forEach((res) => {
        if (res.data && res.data.title) {
          newArticles.push(res.data);
        }
      });

      setArticles((prev) => [...prev, ...newArticles]);
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
    } finally {
      setLoadingMore(false);
    }
  };
  const onRefresh = () => {
    setArticles([]);
    fetchRandomArticles(5);
  }
  // Load initial articles when app opens
  useEffect(() => {
    fetchRandomArticles(5);
  }, []);
const { height: windowHeight } = useWindowDimensions();
  const statusBarHeight = StatusBar.currentHeight || 0;
  const androidNavOffset = Platform.OS === 'android' ? 48 : 0;
  
  return (
<SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }} edges={['top']}>
      <View 
        style={{ flex: 1 }} 
        onLayout={(event) => {
          // This captures the literal remaining pixel space available for your cards
          const { height } = event.nativeEvent.layout;
          setCardHeight(height);
        }}
      >
        {cardHeight > 0 && (
          <FlashList
            onRefresh={onRefresh}
            data={articles}
            keyExtractor={(item, index) => item.pageid?.toString() || index.toString()}
            renderItem={({ item }) => (
              <ArticleCard item={item} cardHeight={cardHeight} />
            )}
            pagingEnabled={true}
            showsVerticalScrollIndicator={false}
            onEndReached={() => fetchRandomArticles(3)}
            onEndReachedThreshold={0.5}
            // Use overrideItemLayout so FlashList knows exactly how big each item is without estimatedItemSize
            overrideItemLayout={(layout) => {
              layout.size = cardHeight;
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Main;
