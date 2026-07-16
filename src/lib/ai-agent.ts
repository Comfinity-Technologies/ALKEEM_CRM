import Groq from "groq-sdk";
import type { ChatCompletionTool, ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { prisma } from "./prisma";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export function getSystemPrompt(leadName: string) {
  return `You are the exclusive AI Property Consultant for Al Alkeem Group, a premium real estate agency. 
Your role is to act as a highly professional, polite, and sophisticated property advisor.

CONVERSATIONAL & QUALIFYING APPROACH:
- Tone: Extremely professional, sophisticated, polite, and accommodating. Use elegant language but remain concise. 
- Personalization: Always address the client warmly by their name, "${leadName}", especially when greeting them or summarizing their needs. Do not use their name in every single message, but use it thoughtfully to make them feel valued.
- Keep your responses under 2-3 short sentences. Do not overwhelm the client.
- CRITICAL PACING RULE: You must ONLY ask ONE short question at a time to keep the conversation flowing smoothly. Wait for their answer before asking the next question.
- Seamless Qualification: Naturally weave questions into the conversation to uncover:
  1. Property type (Apartment, Villa, Studio)
  2. Budget range
  3. Preferred location or community
  4. Number of bedrooms
  5. Move-in timeline
- Once you have gathered 2 or 3 of these details, confidently use the \`searchProperties\` tool to find premium matches for them.

PROPERTY MATCHING & PRESENTATION:
- CRITICAL: Never invent properties. ALWAYS use the \`searchProperties\` tool to fetch real, exclusive listings from our database.
- Present properties elegantly. For example: "I have found a stunning property that perfectly matches your criteria: [Title] in [Location] for [Price] AED."
- If the client shows interest, politely offer to schedule a private viewing. Mention available slots (e.g., 9 AM - 11 AM, 4 PM - 6 PM).

SYSTEM INSTRUCTIONS (DO NOT VIOLATE):
- DO NOT output raw function tags like <function>...</function> in your text response. Only use the standard JSON tool calling mechanism.
- Do NOT use tools to re-fetch properties you already mentioned if the user asks a follow-up question. Just answer based on context.`;
}

// Tool definitions for Groq function calling
const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "searchProperties",
      description:
        "Search for real estate properties based on criteria such as type, location, min/max price, beds, and baths. Use this whenever a client asks about available properties.",
      parameters: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description: "Property type (e.g. Apartment, Villa, Studio, Commercial)",
          },
          location: {
            type: "string",
            description: "Location or community name (e.g. Al Rashidiya, Corniche Ajman)",
          },
          minPrice: {
            type: "number",
            description: "Minimum annual rent price in AED",
          },
          maxPrice: {
            type: "number",
            description: "Maximum annual rent price in AED",
          },
          beds: {
            type: "string",
            description: "Number of bedrooms (e.g. '1', '2', 'studio')",
          },
          baths: {
            type: "string",
            description: "Number of bathrooms (e.g. '1', '2')",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "requestHumanHandoff",
      description:
        "Flag the conversation for a human agent handoff when the client explicitly requests to speak with a person, gets frustrated, or has complex requirements.",
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "The reason why a human handoff is requested.",
          },
        },
        required: ["reason"],
      },
    },
  },
];

// ── Tool Implementations ────────────────────────────────────────────

async function searchPropertiesFromDb(args: any) {
  const { type, location, minPrice, maxPrice, beds, baths } = args;

  const whereClause: any = {};
  if (type) whereClause.type = { contains: type, mode: "insensitive" };
  if (location) whereClause.location = { contains: location, mode: "insensitive" };
  if (beds !== undefined) whereClause.beds = Number(beds);
  if (baths !== undefined) whereClause.baths = Number(baths);

  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.price = {};
    if (minPrice !== undefined) whereClause.price.gte = Number(minPrice);
    if (maxPrice !== undefined) whereClause.price.lte = Number(maxPrice);
  }

  try {
    const properties = await prisma.property.findMany({
      where: whereClause,
      take: 5,
    });
    return JSON.stringify({ properties });
  } catch (error) {
    console.error("Error searching properties:", error);
    return JSON.stringify({ error: "Failed to query properties database." });
  }
}

async function requestHumanHandoffInDb(args: any, conversationId: string) {
  const { reason } = args;
  try {
    await prisma.$transaction([
      prisma.conversation.update({
        where: { id: conversationId },
        data: { status: "ESCALATED" },
      }),
      prisma.handoff.create({
        data: {
          conversationId,
          assignedAgent: "Kimberly",
          status: "PENDING",
        },
      }),
    ]);
    return JSON.stringify({
      success: true,
      message: "Human handoff request logged. Agent Kimberly has been notified.",
    });
  } catch (error) {
    console.error("Error creating handoff:", error);
    return JSON.stringify({ error: "Failed to initiate human handoff." });
  }
}

// ── Safe Groq Wrapper ──────────────────────────────────────────────
async function safeGroqChat(options: any) {
  try {
    return await groq.chat.completions.create(options);
  } catch (error: any) {
    const errStr = typeof error === 'object' ? JSON.stringify(error) + " " + error.message : String(error);
    
    if (errStr.includes("failed_generation") || errStr.includes("tool_use_failed")) {
      console.warn("⚠️ Groq parser failed. Recovering gracefully.");
      
      let failedText = "I'm searching for the best matches right now, one moment please.";
      
      // Try to extract the actual failed generation if possible
      if (error?.error?.error?.failed_generation) {
        failedText = error.error.error.failed_generation;
      } else if (error?.error?.failed_generation) {
        failedText = error.error.failed_generation;
      }
      
      return {
        choices: [
          {
            finish_reason: "stop",
            message: {
              role: "assistant",
              content: failedText,
            },
          },
        ],
      };
    }
    throw error;
  }
}

// ── Main Entry Point ────────────────────────────────────────────────

export async function processLeadMessage(
  conversationHistory: any[],
  newMessage: string,
  conversationId: string,
  leadName: string = "Client"
) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set in environment variables.");
  }

  // Convert DB history to OpenAI-compatible message format
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: getSystemPrompt(leadName) },
    ...conversationHistory.map((msg) => ({
      role: (msg.sender === "CLIENT" ? "user" : "assistant") as "user" | "assistant",
      content: msg.content,
    })),
  ];

  // Initial completion request
  let response = await safeGroqChat({
    model: "llama-3.3-70b-versatile",
    messages,
    tools,
    tool_choice: "auto",
    max_tokens: 1024,
  });

  let choice = response.choices[0];

  // Loop while the model wants to call tools
  while (choice.finish_reason === "tool_calls" && choice.message.tool_calls) {
    const toolCalls = choice.message.tool_calls;

    // Add the assistant's tool call message to context
    messages.push(choice.message as any);

    // Execute each tool call and add results
    for (const toolCall of toolCalls) {
      const { name, arguments: argsStr } = toolCall.function;
      const args = JSON.parse(argsStr);

      console.log(`🤖 Groq calls tool: ${name}`, args);

      let result: string;
      if (name === "searchProperties") {
        result = await searchPropertiesFromDb(args);
      } else if (name === "requestHumanHandoff") {
        result = await requestHumanHandoffInDb(args, conversationId);
      } else {
        result = JSON.stringify({ error: `Unknown tool: ${name}` });
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      } as any);
    }

    // Get the next response (could be another tool call or final text)
    response = await safeGroqChat({
      model: "llama-3.3-70b-versatile",
      messages,
      tools,
      tool_choice: "auto",
      max_tokens: 1024,
    });

    choice = response.choices[0];
  }

  const finalContent = choice.message.content || "I apologize, I was unable to generate a response. Please try again.";
  
  // Forcefully strip out any hallucinated <function>...</function> XML tags
  const stripped = finalContent.replace(/<function[\s\S]*?<\/function>/g, '').trim();
  
  return stripped || "I'm searching for the best matches right now, one moment please.";
}

// ── Lead Summarization Pipeline ─────────────────────────────────────

export async function generateLeadSummary(leadId: string, conversationId: string) {
  try {
    const history = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      select: { sender: true, content: true },
    });

    if (history.length < 2) return; // Not enough context to score

    const summaryPrompt = `Analyze the following real estate conversation.
    
Based on the client's responses, score their readiness (0-100) and assign a temperature (HOT, WARM, COLD).
- HOT: Ready to book viewing, high budget, immediate timeline.
- WARM: Interested but still exploring, timeline > 1 month.
- COLD: Unresponsive, budget too low, or just browsing.

Conversation:
${history.map(m => `${m.sender}: ${m.content}`).join("\n")}

Respond ONLY with valid JSON in this exact format:
{
  "temperature": "HOT" | "WARM" | "COLD",
  "score": 85,
  "reasoning": "A 1-2 sentence explanation of why this score was given."
}`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: summaryPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return;

    const data = JSON.parse(content);

    // Upsert the LeadSummary
    const existingSummary = await prisma.leadSummary.findFirst({
      where: { leadId },
    });

    if (existingSummary) {
      await prisma.leadSummary.update({
        where: { id: existingSummary.id },
        data: {
          temperature: data.temperature,
          score: data.score,
          reasoning: data.reasoning,
        },
      });
    } else {
      await prisma.leadSummary.create({
        data: {
          leadId,
          temperature: data.temperature,
          score: data.score,
          reasoning: data.reasoning,
        },
      });
    }
    console.log(`✅ Lead ${leadId} summarized successfully! [${data.temperature}]`);
  } catch (err) {
    console.error("❌ Failed to generate lead summary:", err);
  }
}
