import { View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from "@shopify/flash-list"
import ArticleCard from 'components/ui/ArticleCard'
import { AXIOS } from 'api/AXIOS'

const Main = () => {
  const [articles, setArticles] = useState([])
  const [loadingMore, setLoadingMore] = useState(false)

  // Function to fetch a batch of random articles
  const fetchRandomArticles = async (count = 5) => {
    if (loadingMore) return
    setLoadingMore(true)

    try {
      const newArticles:any = []
      
      // Wikipedia's random API gives 1 article per request, so we call it a few times in parallel
      const requests = Array.from({ length: count }, () => AXIOS.get('page/random/summary'))
      const responses = await Promise.all(requests)
      
      responses.forEach(res => {
        if (res.data && res.data.title) {
          newArticles.push(res.data)
        }
      })

      setArticles(prev => [...prev, ...newArticles])
    } catch (error) {
      console.error("Error fetching Wikipedia data:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  // Load initial articles when app opens
  useEffect(() => {
    fetchRandomArticles(5)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <FlashList
        data={articles}
        keyExtractor={(item, index) => item.pageid?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={{ height: '100%', width: '100%' }}>
            <ArticleCard
              content_urls={item.content_urls}
              description={item.description}
              extract={item.extract}
              title={item.title}
              thumbnail={item.thumbnail}
            />
          </View>
        )}
        // TikTok mechanics
        pagingEnabled={true} // Snaps to individual cards
        showsVerticalScrollIndicator={false}
        
        // Infinite Scroll mechanics
        onEndReached={() => fetchRandomArticles(3)} // Fetch 3 more when close to bottom
        onEndReachedThreshold={0.5} // Trigger when 50% through the last card
        
        // Loading indicator at the very bottom
        ListFooterComponent={() => (
          loadingMore ? <ActivityIndicator size="small" color="#FFFFFF" style={{ padding: 20 }} /> : null
        )}
      />
    </SafeAreaView>
  )
}

export default Main