import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/test/conversation?phone=...
 * just a quick helper to fetch the latest conversation for the simulator polling
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone) return NextResponse.json({ messages: [] });

  try {
    const lead = await prisma.lead.findUnique({
      where: { whatsappId: phone },
      include: {
        conversations: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            messages: {
              orderBy: { createdAt: "asc" }
            }
          }
        }
      }
    });

    if (!lead || lead.conversations.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    // strip down to just what the simulator needs
    const messages = lead.conversations[0].messages.map(m => ({
      sender: m.sender,
      content: m.content
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
