import { NextResponse } from "next/server";
import { checkRateLimit, getClientId } from "@/lib/rate-limiter";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware — applies rate limiting to all /api/* routes.
 */
export function middleware(request: NextRequest) {
  // Only rate-limit API routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Skip rate limiting for health checks
  if (request.nextUrl.pathname === "/api/health") {
    return NextResponse.next();
  }

  const clientId = getClientId(request);

  // Webhook gets a higher limit (Meta sends bursts)
  const isWebhook = request.nextUrl.pathname === "/api/webhook";
  const limit = checkRateLimit(clientId, {
    windowMs: 60_000,
    maxRequests: isWebhook ? 200 : 60,
  });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(limit.resetAt).toISOString(),
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Remaining", String(limit.remaining));
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
