import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/conversations — List all conversations with lead info.
 */
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        lead: {
          select: { id: true, name: true, phone: true, source: true },
        },
        _count: { select: { messages: true } },
        handoffs: {
          orderBy: { requestedAt: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ conversations, count: conversations.length });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
