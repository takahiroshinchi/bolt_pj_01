import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  // 認証が不要なパスを指定
  publicRoutes: ["/", "/pricing"]
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};