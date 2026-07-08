import { NextResponse } from "next/server";
import { scoreLead } from "@/lib/lead-scoring";

/**
 * POST /api/score — Score a lead by ID.
 * Body: { leadId: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: "leadId is required" },
        { status: 400 }
      );
    }

    const result = await scoreLead(leadId);

    return NextResponse.json({
      leadId,
      temperature: result.temperature,
      score: result.score,
      reasoning: result.reasoning,
    });
  } catch (error) {
    console.error("Error scoring lead:", error);
    return NextResponse.json(
      { error: "Failed to score lead" },
      { status: 500 }
    );
  }
}
