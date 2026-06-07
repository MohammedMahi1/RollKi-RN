import { View, ActivityIndicator, LayoutChangeEvent, StyleSheet, Animated } from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import ArticleCard from 'components/ui/ArticleCard';
import { WikiArticle } from 'types';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import { articleAsyncThunk } from 'store/asyncThunk/articleAsyncThunk';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);
const Main = ({ navigation }: any) => {
  const listRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabDoublePress', () => {
      if (listRef.current) {
        // If it's a FlatList or ScrollView:
        listRef.current.scrollToOffset ? 
          listRef.current.scrollToOffset({ offset: 0, animated: true }) : 
          listRef.current.scrollTo({ y: 0, animated: true });
      }
    });

    return unsubscribe;
  }, [navigation]);
  const dispatch = useAppDispatch();

  const { data, loading: isReduxLoading } = useAppSelector((s) => s.article);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [h, setH] = useState<number>(0);

  const scrollY = useRef(new Animated.Value(0)).current;

  const getApiParams = (limit: number) => ({
    action: 'query',
    format: 'json',
    generator: 'random',
    grnnamespace: 0,
    grnlimit: limit,
    prop: 'pageimages|extracts',
    piprop: 'thumbnail',
    pithumbsize: 400,
    exintro: 1,
    explaintext: 1,
    exchars: 200,
    origin: '*',
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabDoubleClick' as any, () => {
      if (listRef.current && data && data.length > 0) {
        listRef.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    });
    return unsubscribe;
  }, [navigation, data]);

  useEffect(() => {
    dispatch(articleAsyncThunk(getApiParams(10),{signal: undefined} as any));
  }, [dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(articleAsyncThunk({ ...getApiParams(10), isRefresh: true }));
    setIsRefreshing(false);
  };

  const loadMoreArticles = useCallback(() => {
    if (isReduxLoading || isRefreshing) return;
    // Standard fetch: appends data normally without setting the clear flag
    dispatch(articleAsyncThunk(getApiParams(10)));
  }, [isReduxLoading, isRefreshing, dispatch]);
  const renderFooter = () => {
    if (!isReduxLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#ffffff" />
      </View>
    );
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setH(height);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }} edges={['top']}>
      <View style={{ flex: 1 }} onLayout={handleLayout}>
        {h > 0 && (
          <AnimatedFlashList
            ref={listRef}
            data={data || []}
            pagingEnabled
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: true,
            })}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <ArticleCard
                item={item as WikiArticle}
                cardHeight={h}
                index={index}
                scrollY={scrollY}
              />
            )}
            keyExtractor={(item: any, idx) => item.pageid?.toString() || idx.toString()}
            onEndReached={loadMoreArticles}
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
