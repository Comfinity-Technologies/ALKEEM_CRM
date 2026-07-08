import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processLeadMessage } from "@/lib/ai-agent";

/**
 * POST /api/test — Simulate a WhatsApp conversation without Meta.
 * 
 * This endpoint lets you test the full AI pipeline from Postman or the browser.
 * 
 * Body: { phone: string, name?: string, message: string }
 * 
 * Returns the AI's response along with the conversation and lead IDs.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, name, message } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { error: "phone and message are required" },
        { status: 400 }
      );
    }

    // 1. Find or create lead
    let lead = await prisma.lead.findUnique({
      where: { whatsappId: phone },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          whatsappId: phone,
          name: name || "Test User",
          source: "WHATSAPP",
          phone,
        },
      });
    }

    // 2. Find or create active conversation
    let conversation = await prisma.conversation.findFirst({
      where: { leadId: lead.id, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          leadId: lead.id,
          channel: "whatsapp",
          status: "ACTIVE",
        },
      });
    }

    // 3. Save inbound message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: "IN",
        sender: "CLIENT",
        content: message,
      },
    });

    // 4. Fetch conversation history
    const history = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
      select: { sender: true, content: true },
    });

    // 5. Get AI response
    let aiReply: string;
    try {
      aiReply = await processLeadMessage(history, message, conversation.id);
    } catch (aiError) {
      console.error("AI Error:", aiError);
      aiReply =
        "Thank you for reaching out to Al Alkeem Group! Our team will get back to you shortly. For immediate assistance, please call us at 0507443111.";
    }

    // 6. Save AI response
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: "OUT",
        sender: "BOT",
        agentType: "ASSISTANT",
        content: aiReply,
      },
    });

    return NextResponse.json({
      leadId: lead.id,
      conversationId: conversation.id,
      userMessage: message,
      aiReply,
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json(
      { error: "Test failed", details: String(error) },
      { status: 500 }
    );
  }
}
