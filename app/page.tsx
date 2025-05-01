import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Clock, Filter, Github, Twitter } from "lucide-react";
import Link from "next/link";
import { fetchAllArticles, fetchZennArticles, fetchQiitaArticles, fetchHackerNewsArticles } from "@/lib/api/articles";
import { ArticleList } from "@/components/ArticleList";
import { SignInButton } from "@/components/auth/SignInButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { auth } from "@clerk/nextjs";

async function getArticles(source?: string) {
  switch (source) {
    case 'zenn':
      return fetchZennArticles();
    case 'qiita':
      return fetchQiitaArticles();
    case 'hackernews':
      return fetchHackerNewsArticles();
    default:
      return fetchAllArticles();
  }
}

export default async function Home() {
  const { userId } = auth();
  const [allArticles, zennArticles, qiitaArticles, hackerNewsArticles] = await Promise.all([
    getArticles(),
    getArticles('zenn'),
    getArticles('qiita'),
    getArticles('hackernews'),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xl font-bold">キャッチアップ.com</span>
          </div>
          <nav className="ml-6 hidden md:flex">
            <Button variant="ghost" className="text-sm">
              <Clock className="mr-2 h-4 w-4" />
              最新記事
            </Button>
            <Button variant="ghost" className="text-sm">
              <Filter className="mr-2 h-4 w-4" />
              カテゴリー
            </Button>
          </nav>
          <div className="ml-auto">
            {userId ? <SignOutButton /> : <SignInButton />}
          </div>
        </div>
      </header>

      <main className="flex-1 bg-background">
        <div className="container px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">技術トレンドをキャッチアップ</h1>
            <p className="mt-2 text-muted-foreground">
              Zenn、Qiita、Hacker Newsの最新技術記事をまとめてチェックできます
            </p>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">すべて</TabsTrigger>
                <TabsTrigger value="zenn">Zenn</TabsTrigger>
                <TabsTrigger value="qiita">Qiita</TabsTrigger>
                <TabsTrigger value="hackernews">Hacker News</TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Clock className="mr-2 h-4 w-4" />
                  新着順
                </Button>
              </div>
            </div>
            
            <TabsContent value="all">
              <ArticleList articles={allArticles} />
            </TabsContent>
            
            <TabsContent value="zenn">
              <ArticleList articles={zennArticles} />
            </TabsContent>

            <TabsContent value="qiita">
              <ArticleList articles={qiitaArticles} />
            </TabsContent>

            <TabsContent value="hackernews">
              <ArticleList articles={hackerNewsArticles} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-6 md:px-0">
            <TrendingUp className="h-6 w-6" />
            <div className="flex flex-col items-center gap-2 md:flex-row md:gap-6">
              <Link href="/" className="text-sm hover:underline">
                ホーム
              </Link>
              <Link href="/pricing" className="text-sm hover:underline">
                料金プラン
              </Link>
              <a href="#" className="text-sm hover:underline">
                GitHub
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" target="_blank" rel="noreferrer">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}