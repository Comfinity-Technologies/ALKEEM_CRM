import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/conversations/[id] — Get a full conversation with all messages.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        lead: true,
        messages: { orderBy: { createdAt: "asc" } },
        handoffs: { orderBy: { requestedAt: "desc" } },
        meetings: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
  }
}
