import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";

// 1. NextAuth middleware for frontend UI protection
const authMiddleware = withAuth({
  pages: {
    signIn: "/login",
  },
});

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 2. If it's an API route, apply the backend rate limiter (skip NextAuth)
  if (path.startsWith("/api")) {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const limitResult = checkRateLimit(ip);
    
    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limitResult.limit.toString(),
            "X-RateLimit-Remaining": limitResult.remaining.toString(),
            "X-RateLimit-Reset": limitResult.resetTime.toString(),
          },
        }
      );
    }
    return NextResponse.next();
  }

  // 3. Otherwise, pass the request to the NextAuth middleware
  return (authMiddleware as any)(req);
}

// 4. Run the middleware on everything except static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login).*)"],
};
