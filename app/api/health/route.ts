import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/health — Health check endpoint for monitoring.
 * Returns DB connectivity status, uptime, and basic stats.
 */
export async function GET() {
  const startTime = Date.now();
  let dbStatus = "disconnected";
  let dbLatencyMs = 0;
  let stats = null;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = "connected";

    // Gather basic stats
    const [leadCount, conversationCount, messageCount, propertyCount] =
      await Promise.all([
        prisma.lead.count(),
        prisma.conversation.count(),
        prisma.message.count(),
        prisma.property.count(),
      ]);

    stats = {
      leads: leadCount,
      conversations: conversationCount,
      messages: messageCount,
      properties: propertyCount,
    };
  } catch (error) {
    console.error("Health check DB error:", error);
    dbStatus = "error";
  }

  const totalLatencyMs = Date.now() - startTime;

  return NextResponse.json({
    status: dbStatus === "connected" ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    stats,
    responseTimeMs: totalLatencyMs,
  });
}
