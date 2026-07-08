import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/leads — List all leads with their latest score.
 */
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        leadSummaries: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        conversations: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            status: true,
            _count: { select: { messages: true } },
          },
        },
      },
    });

    return NextResponse.json({ leads, count: leads.length });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

/**
 * POST /api/leads — Ingest a new lead from a website form.
 * Body: { name, phone, email?, source?, message? }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, source, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "name and phone are required" },
        { status: 400 }
      );
    }

    // Check if lead already exists by phone
    let lead = await prisma.lead.findFirst({
      where: { phone },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          name,
          phone,
          whatsappId: phone,
          source: source || "WEBSITE_FORM",
          rawPayload: { email, message },
        },
      });
    }

    // Create a conversation and initial message if provided
    if (message) {
      const conversation = await prisma.conversation.create({
        data: {
          leadId: lead.id,
          channel: "website",
          status: "ACTIVE",
        },
      });

      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          direction: "IN",
          sender: "CLIENT",
          content: message,
        },
      });
    }

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
