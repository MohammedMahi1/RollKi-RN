import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import { fetchBookmarksAsync, removeBookmarkAsync } from 'store/slices/bookmarksSlice';
import BookedArticle from 'components/ui/BookedArticle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const BookmarksScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.bookmark);
  const [isEditing, setIsEditing] = useState(false);

  const flashListRef = useRef<any>(null);

  const currentLang = useAppSelector((state) => state.article.lang || 'en');
  const isRtl = currentLang === 'ar';

  useEffect(() => {
    dispatch(fetchBookmarksAsync());
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabDoublePress', () => {
      if (flashListRef.current) {
        flashListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    });
    return unsubscribe;
  }, [navigation]);
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

  const nav = useNavigation<any>();
  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={{ flex: 1, }} onPress={() => setIsEditing(false)}>
        <FlashList
          ref={flashListRef} // 👈 Attach the reference hook here
          key={isRtl ? 'rtl-grid' : 'ltr-grid'}
          data={orderedItems}
          numColumns={3}
          keyExtractor={(item) => item.id}
          extraData={isEditing}
          removeClippedSubviews={true}
          contentContainerStyle={{paddingBottom:80}}
          renderItem={({ item, index }) => (
            <BookedArticle
              title={item.title}
              description={item.description}
              source={item.source}
              lang={item.lang} // 👈 Map this from database row objects to prevent fallback properties
              index={index}
              isEditing={isEditing}
              onLongPress={() => setIsEditing(true)}
              onDeletePress={() => dispatch(removeBookmarkAsync(item.id))}
              onCancelEditing={() => setIsEditing(false)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: '#888' ,alignSelf: 'center', fontSize: 16 ,alignItems:"center",justifyContent:"center"}}>
                {isRtl ? 'لا توجد مقالات محفوظة بعد.' : 'No saved bookmarks yet.'}
              </Text>
            </View>
          }
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default BookmarksScreen