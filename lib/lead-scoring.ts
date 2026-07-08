import { prisma } from "./prisma";

type Temperature = "HOT" | "WARM" | "COLD";

interface ScoreResult {
  temperature: Temperature;
  score: number;
  reasoning: string;
}

/**
 * Scores a lead based on conversation signals.
 * Rules:
 * - HOT: wants to book viewing, asked about specific properties, mentioned budget, ready to move
 * - WARM: asked general questions, exploring options, hasn't committed
 * - COLD: one-word replies, no engagement, just browsing
 */
export async function scoreLead(leadId: string): Promise<ScoreResult> {
  // Get all messages from this lead's conversations
  const conversations = await prisma.conversation.findMany({
    where: { leadId },
    include: {
      messages: {
        where: { sender: "CLIENT" },
        orderBy: { createdAt: "asc" },
      },
      handoffs: true,
    },
  });

  const allClientMessages = conversations.flatMap((c) => c.messages);
  const totalMessages = allClientMessages.length;
  const hasHandoff = conversations.some((c) => c.handoffs.length > 0);
  const hasEscalated = conversations.some((c) => c.status === "ESCALATED");

  // Combine all client messages into one string for keyword analysis
  const fullText = allClientMessages.map((m) => m.content).join(" ").toLowerCase();

  // Keyword scoring
  const hotKeywords = ["book", "viewing", "visit", "schedule", "move in", "ready", "interested", "take it", "when can", "available"];
  const warmKeywords = ["budget", "looking", "how much", "price", "details", "tell me", "options", "area", "bedroom", "bathroom"];
  const coldKeywords = ["ok", "thanks", "bye", "no", "not interested", "later", "maybe"];

  let hotHits = hotKeywords.filter((kw) => fullText.includes(kw)).length;
  let warmHits = warmKeywords.filter((kw) => fullText.includes(kw)).length;
  let coldHits = coldKeywords.filter((kw) => fullText.includes(kw)).length;

  // Compute score (0–100)
  let score = 30; // baseline
  score += hotHits * 12;
  score += warmHits * 5;
  score -= coldHits * 8;
  score += Math.min(totalMessages * 3, 20); // engagement bonus, capped at 20
  if (hasHandoff || hasEscalated) score += 15; // escalation = high intent

  score = Math.max(0, Math.min(100, score)); // clamp 0-100

  // Determine temperature
  let temperature: Temperature;
  let reasoning: string;

  if (score >= 65) {
    temperature = "HOT";
    reasoning = `Lead scored ${score}/100. High-intent signals: ${hotHits} hot keywords, ${totalMessages} messages exchanged${hasHandoff ? ", requested human handoff" : ""}.`;
  } else if (score >= 35) {
    temperature = "WARM";
    reasoning = `Lead scored ${score}/100. Moderate engagement: ${warmHits} exploratory keywords, ${totalMessages} messages exchanged.`;
  } else {
    temperature = "COLD";
    reasoning = `Lead scored ${score}/100. Low engagement: ${totalMessages} messages, ${coldHits} disengagement signals detected.`;
  }

  // Save the score to the database
  await prisma.leadSummary.create({
    data: {
      leadId,
      temperature,
      score,
      reasoning,
      reportData: {
        totalMessages,
        hotHits,
        warmHits,
        coldHits,
        hasHandoff,
        hasEscalated,
        analyzedAt: new Date().toISOString(),
      },
    },
  });

  return { temperature, score, reasoning };
}
