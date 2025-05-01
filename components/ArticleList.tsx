'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookMarked } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";
import { Article as ApiArticle } from "@/lib/api/types";

type Article = ApiArticle;

export const ArticleList = ({ articles }: { articles: Article[] }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {articles.map((article) => (
      <Card key={article.id} className="hover:bg-muted/50 transition-colors">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookMarked className="h-4 w-4 text-muted-foreground" />
              <CardDescription>
                {article.source} • {new Date(article.publishedAt).toLocaleString('ja-JP', { 
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric'
                })}
              </CardDescription>
            </div>
            <FavoriteButton articleId={article.id} />
          </div>
          <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <span>著者: {article.author}</span>
              {article.readingTime && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span>読了時間: {article.readingTime}分</span>
                </>
              )}
            </div>
            <span>❤️ {article.likes}</span>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
); 