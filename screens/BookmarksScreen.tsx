import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list'; 
import { useAppDispatch, useAppSelector } from 'hooks/store';
import { fetchBookmarksAsync, removeBookmarkAsync } from 'store/slices/bookmarksSlice';
import BookedArticle from 'components/ui/BookedArticle';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookmarksScreen() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.bookmark);

  useEffect(() => {
    dispatch(fetchBookmarksAsync());
  }, [dispatch]);

  if (loading && items.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  const onRefreshing = () => {
    dispatch(fetchBookmarksAsync());
  };

  // FIX: Since local state and DB are both [Oldest -> Newest], 
  // reversing it here will ALWAYS show [Newest -> Oldest] perfectly.
  const orderedItems = [...items].reverse();

  return (
    <SafeAreaView style={styles.container}>
      <FlashList
        data={orderedItems} 
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookedArticle 
            title={item.title}
            description={item.description}
            source={item.source}
            onLongPress={() => dispatch(removeBookmarkAsync(item.id))}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: '#888' }}>No saved bookmarks yet.</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={onRefreshing}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});