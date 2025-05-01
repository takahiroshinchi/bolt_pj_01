import { Article, ZennArticle, QiitaArticle, HackerNewsStory } from './types';
import { API_CONFIG } from './config';
import { prisma } from '@/lib/prisma';

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

async function saveArticlesToDB(articles: Article[]) {
  try {
    for (const article of articles) {
      try {
        const articleId = parseInt(article.id);
        if (isNaN(articleId)) {
          console.error(`Invalid article ID: ${article.id}`);
          continue;
        }

        await prisma.article.upsert({
          where: { id: articleId },
          update: {
            title: article.title,
            url: article.url,
            source: article.source,
            publishedAt: new Date(article.publishedAt),
            author: article.author,
            likes: article.likes,
          },
          create: {
            id: articleId,
            title: article.title,
            url: article.url,
            source: article.source,
            publishedAt: new Date(article.publishedAt),
            author: article.author,
            likes: article.likes,
          },
        });
      } catch (articleError) {
        console.error(`Error saving article ${article.id}:`, articleError);
      }
    }
  } catch (error) {
    console.error('Error in saveArticlesToDB:', error);
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
  const [zennArticles, qiitaArticles, hackerNewsArticles] = await Promise.all([
    fetchZennArticles(),
    fetchQiitaArticles(),
    fetchHackerNewsArticles(),
  ]);

  const allArticles = [...zennArticles, ...qiitaArticles, ...hackerNewsArticles];
  await saveArticlesToDB(allArticles);
  return allArticles;
}