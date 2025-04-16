export const API_CONFIG = {
  ZENN: {
    BASE_URL: 'https://zenn.dev/api/articles',
    ARTICLE_BASE_URL: 'https://zenn.dev/articles',
  },
  QIITA: {
    BASE_URL: 'https://qiita.com/api/v2/items',
    TOKEN: process.env.NEXT_PUBLIC_QIITA_TOKEN?.trim(),
    getHeaders: () => ({
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_QIITA_TOKEN?.trim()}`,
      'Content-Type': 'application/json'
    })
  },
  HACKER_NEWS: {
    BASE_URL: 'https://hacker-news.firebaseio.com/v0',
    TOP_STORIES: '/topstories.json',
    ITEM: (id: number) => `/item/${id}.json`,
  },
} as const;