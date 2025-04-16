export interface Article {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  author: string;
  likes: number;
  readingTime?: number;
  source: 'zenn' | 'qiita' | 'hackernews';
}

export interface ZennArticle {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  liked_count: number;
  reading_time: number;
  user: {
    name: string;
    username: string;
  };
}

export interface QiitaArticle {
  id: string;
  title: string;
  url: string;
  created_at: string;
  likes_count: number;
  user: {
    name: string;
  };
}

export interface HackerNewsStory {
  id: number;
  title: string;
  url: string;
  time: number;
  score: number;
  by: string;
}