import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list'; 
import { useAppDispatch, useAppSelector } from 'hooks/store';
import { fetchBookmarksAsync, removeBookmarkAsync } from 'store/slices/bookmarksSlice';
import BookedArticle from 'components/ui/BookedArticle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

export default function BookmarksScreen() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.bookmark);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchBookmarksAsync());
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setIsEditing(false);
      };
    }, [])
  );

  if (loading && items.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  const orderedItems = [...items].reverse();

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={{ flex: 1 }} onPress={() => setIsEditing(false)}>
        <FlashList
          data={orderedItems} 
          numColumns={3}
          keyExtractor={(item) => item.id}
          extraData={isEditing} 
          removeClippedSubviews={true} // FIX: Forces the native bridge to ignore off-screen items completely
          renderItem={({ item, index }) => (
            <BookedArticle 
              title={item.title}
              description={item.description}
              source={item.source}
              index={index} 
              isEditing={isEditing}
              onLongPress={() => setIsEditing(true)}
              onDeletePress={() => dispatch(removeBookmarkAsync(item.id))}
              onCancelEditing={() => setIsEditing(false)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: '#888' }}>No saved bookmarks yet.</Text>
            </View>
          }
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});