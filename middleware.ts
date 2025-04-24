import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  // 認証が不要なパスを指定
  publicRoutes: [
    "/",
    "/pricing",
    // 静的ファイル
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
  ],
  // webhookなどの認証をスキップするパス
  ignoredRoutes: [
    "/api/webhook",
  ],
  afterAuth(auth, req) {
    // 保護されたルートのパターン
    const protectedPathRegex = /^\/(liked_items|settings|profile|dashboard)/;

    // 未認証ユーザーが保護されたルートにアクセスしようとした場合
    if (!auth.userId && protectedPathRegex.test(req.nextUrl.pathname)) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return Response.redirect(signInUrl);
    }
  }
});

// 認証ミドルウェアを適用するパスを指定
export const config = {
  matcher: [
    // すべてのルートをマッチ（以下を除く）
    // - _next/static (静的ファイル)
    // - _next/image (画像最適化API)
    // - favicon.ico (ブラウザーアイコン)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};