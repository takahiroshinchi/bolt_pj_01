import { Article, ZennArticle, QiitaArticle, HackerNewsStory } from './types';
import { API_CONFIG } from './config';

async function fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    throw error;
  }
}

export async function fetchZennArticles(): Promise<Article[]> {
  try {
    const data: any = await fetchWithErrorHandling(API_CONFIG.ZENN.BASE_URL);
    
    return data.articles.map((article: ZennArticle) => ({
      id: article.id.toString(),
      title: article.title,
      url: `https://zenn.dev/${article.user.username}/articles/${article.slug}`,
      publishedAt: article.published_at,
      author: article.user.name,
      likes: article.liked_count,
      readingTime: article.reading_time,
      source: 'zenn' as const,
    }));
  } catch (error) {
    console.error('Error fetching Zenn articles:', error);
    return [];
  }
}

export async function fetchQiitaArticles(): Promise<Article[]> {
  // Skip Qiita API call if token is not properly configured
  if (!API_CONFIG.QIITA.TOKEN || API_CONFIG.QIITA.TOKEN === 'your_qiita_token_here') {
    console.warn('Qiita API token not configured. Skipping Qiita articles fetch.');
    return [];
  }

  try {
    const data = await fetchWithErrorHandling<QiitaArticle[]>(
      API_CONFIG.QIITA.BASE_URL,
      {
        headers: API_CONFIG.QIITA.getHeaders(),
      }
    );
    
    return data.map((article) => ({
      id: article.id,
      title: article.title,
      url: article.url,
      publishedAt: article.created_at,
      author: article.user.name,
      likes: article.likes_count,
      source: 'qiita' as const,
    }));
  } catch (error) {
    console.error('Error fetching Qiita articles:', error);
    return [];
  }
}

export async function fetchHackerNewsArticles(): Promise<Article[]> {
  try {
    const { BASE_URL, TOP_STORIES, ITEM } = API_CONFIG.HACKER_NEWS;
    
    // 最新の30件のストーリーIDを取得
    const storyIds = await fetchWithErrorHandling<number[]>(`${BASE_URL}${TOP_STORIES}`);
    const topStoryIds = storyIds.slice(0, 30);
    
    // 各ストーリーの詳細を並列で取得
    const stories = await Promise.all(
      topStoryIds.map(id => 
        fetchWithErrorHandling<HackerNewsStory>(`${BASE_URL}${ITEM(id)}`)
      )
    );
    
    return stories
      .filter(story => story.url) // URLがないストーリーを除外
      .map(story => ({
        id: story.id.toString(),
        title: story.title,
        url: story.url,
        publishedAt: new Date(story.time * 1000).toISOString(),
        author: story.by,
        likes: story.score,
        source: 'hackernews' as const,
      }));
  } catch (error) {
    console.error('Error fetching Hacker News articles:', error);
    return [];
  }
}

export async function fetchAllArticles(): Promise<Article[]> {
  try {
    const [zennArticles, qiitaArticles, hackerNewsArticles] = await Promise.all([
      fetchZennArticles(),
      fetchQiitaArticles(),
      fetchHackerNewsArticles(),
    ]);

    return [...zennArticles, ...qiitaArticles, ...hackerNewsArticles]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
}