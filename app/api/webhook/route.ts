import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processLeadMessage } from "@/lib/ai-agent";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

/**
 * GET — Meta webhook verification handshake.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.warn("⚠️ Webhook verification failed — token mismatch.");
    return new NextResponse("Forbidden", { status: 403 });
  }
}

/**
 * POST — Receive inbound WhatsApp messages, process with AI, reply.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Only process WhatsApp business account events
    if (body.object !== "whatsapp_business_account") {
      return new NextResponse("Not Found", { status: 404 });
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];
    const contact = value?.contacts?.[0];

    // Ignore status updates (delivered, read, etc.) — only process actual messages
    if (!message || !contact) {
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    }

    const phoneNumber = contact.wa_id;
    const profileName = contact.profile?.name || "Unknown";
    const messageBody = message.text?.body;

    // Only handle text messages for now
    if (!messageBody) {
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    }

    // ── 1. Find or create Lead ──────────────────────────────────────────
    let lead = await prisma.lead.findUnique({
      where: { whatsappId: phoneNumber },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          whatsappId: phoneNumber,
          name: profileName,
          source: "WHATSAPP",
          phone: phoneNumber,
          rawPayload: body,
        },
      });
      console.log(`🆕 New lead created: ${profileName} (${phoneNumber})`);
    }

    // ── 2. Find active conversation or create one ───────────────────────
    let conversation = await prisma.conversation.findFirst({
      where: {
        leadId: lead.id,
        status: "ACTIVE",
      },
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

    // ── 3. Save the inbound message ─────────────────────────────────────
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: "IN",
        sender: "CLIENT",
        content: messageBody,
      },
    });

    // ── 4. Fetch conversation history for AI context ────────────────────
    const history = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
      select: {
        sender: true,
        content: true,
      },
    });

    // ── 5. Get AI response ──────────────────────────────────────────────
    let aiReply: string;
    try {
      aiReply = await processLeadMessage(history, messageBody, conversation.id);
    } catch (aiError) {
      console.error("🤖 AI Agent Error:", aiError);
      aiReply =
        "Thank you for reaching out to Al Alkeem Group! Our team will get back to you shortly. For immediate assistance, please call us at 0507443111.";
    }

    // ── 6. Save the AI response to DB ───────────────────────────────────
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: "OUT",
        sender: "BOT",
        agentType: "ASSISTANT",
        content: aiReply,
      },
    });

    // ── 7. Send reply back via WhatsApp ─────────────────────────────────
    try {
      await sendWhatsAppMessage({
        to: phoneNumber,
        body: aiReply,
      });
      console.log(`📤 Reply sent to ${phoneNumber}`);
    } catch (sendError) {
      console.error("📵 Failed to send WhatsApp reply:", sendError);
      // Message is saved to DB even if delivery fails — can retry later
    }

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook POST Error:", error);
    // Always return 200 to Meta to avoid webhook deactivation
    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  }
}
