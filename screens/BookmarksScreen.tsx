import { StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import BookedArticle, { BookedArticleType } from 'components/ui/BookedArticle';
import { useAppSelector } from 'hooks/store';

// Example Mock Data matching your layout specifications 
// const data: BookedArticleType[] = [
//   { title: "Article numdfvd", description: "this is description of", img: "https://picsum.photos/400/600?random=1" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=2" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=3" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=4" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=5" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=6" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=1" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=2" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=3" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=4" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=5" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=6" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=1" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=2" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=3" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=4" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=5" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=6" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=1" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=2" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=3" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=4" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=5" },
//   { title: "Article num", description: "this is description of", img: "https://picsum.photos/400/600?random=6" },
// ];

const BookmarksScreen = () => {

  const data = useAppSelector((s)=>s.bookmark)
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlashList
        data={data}
        numColumns={3} // Native high performance multi-column calculation
        renderItem={({ item }) => (
          <BookedArticle 
            description={item.description}
            img={item.source}
            title={item.title}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 100, // Provides extra space to scroll past the floating bottom tab bar cleanly
  },
});

export default BookmarksScreen;