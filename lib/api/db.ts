import { prisma } from '@/lib/prisma';

export async function getDatabaseContents() {
  try {
    const articles = await prisma.article.findMany();
    const users = await prisma.user.findMany();
    const favorites = await prisma.favorite.findMany();

    return {
      articles,
      users,
      favorites,
      counts: {
        articles: articles.length,
        users: users.length,
        favorites: favorites.length
      }
    };
  } catch (error) {
    console.error('データベース取得エラー:', error);
    throw error;
  }
}