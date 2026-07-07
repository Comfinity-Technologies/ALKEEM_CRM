import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse("Forbidden", { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verify this is a message from WhatsApp API
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];
      const contact = value?.contacts?.[0];

      if (message && contact) {
        const phoneNumber = contact.wa_id;
        const messageBody = message.text?.body || "";

        if (messageBody) {
          // 1. Find or create the Lead
          let lead = await prisma.lead.findUnique({
            where: { whatsappId: phoneNumber },
          });

          if (!lead) {
            lead = await prisma.lead.create({
              data: {
                whatsappId: phoneNumber,
                name: contact.profile?.name || "Unknown",
                source: "WHATSAPP",
                phone: phoneNumber,
                rawPayload: body,
              },
            });
          }

          // 2. Find active conversation or create new
          let conversation = await prisma.conversation.findFirst({
            where: { 
              leadId: lead.id,
              status: "ACTIVE"
            },
            orderBy: { createdAt: "desc" }
          });

          if (!conversation) {
            conversation = await prisma.conversation.create({
              data: {
                leadId: lead.id,
                channel: "whatsapp",
                status: "ACTIVE"
              }
            });
          }

          // 3. Save the incoming message
          await prisma.message.create({
            data: {
              conversationId: conversation.id,
              direction: "IN",
              sender: "CLIENT",
              content: messageBody,
            },
          });

          // Trigger AI Agent processing asynchronously here...
          // e.g. await enqueueAiJob({ conversationId: conversation.id, message: messageBody });
        }
      }
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    } else {
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("Webhook POST Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
