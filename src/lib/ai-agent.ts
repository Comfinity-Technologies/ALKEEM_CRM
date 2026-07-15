import Groq from "groq-sdk";
import type { ChatCompletionTool, ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { prisma } from "./prisma";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export const SYSTEM_PROMPT = `You are the official AI Assistant for Al Alkeem Group. Your name is Al Alkeem Group Assistant.
Your primary role is to attend to leads, answer queries, match properties, and schedule viewings.

STRICT BUSINESS RULES:
1. Commission: We charge exactly 5% of the rent amount.
2. Security Deposit: Exactly AED 3,000 or 10% of the rent amount (whichever is higher).
3. Cheques: We require exactly 4 cheques for payment.
4. FEWA (Electricity & Water): If asked, explain that it depends on the contract:
   - Internal Contract (Real Estate Contract): FEWA is under our name.
   - Municipality Contract: Contract and FEWA are under the tenant's name.
5. Required Documents: Valid ID/Passport, Mobile number, Email Address, and Trade License (If needed).

VIEWING SLOTS:
We only offer the following viewing slots: 9am-11am, 4pm-6pm, 8pm-10pm. 
Offer these slots if a lead shows high interest (hot lead) and wants to book a viewing.

HUMAN HANDOFF:
If a client specifically requests a human, gets frustrated, or has complex requirements outside your knowledge base, flag the conversation for a human handoff using the requestHumanHandoff tool.
The handoff WhatsApp number is 0507443111.

TONE & BEHAVIOR:
- Be polite, professional, and concise.
- DO NOT invent rules or properties not explicitly provided to you in your knowledge base.
- Structure your responses to be easily readable on WhatsApp (short paragraphs, bullet points).
- When a client asks about properties, ALWAYS use the searchProperties tool to find real listings from the database. Never make up property details.
- CRITICAL: Do NOT attempt to use tools to re-fetch information you already stated in the conversation history. If the user asks a follow-up question about a property you just mentioned, just answer based on the context in the history!`;

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
            type: "integer",
            description: "Number of bedrooms",
          },
          baths: {
            type: "integer",
            description: "Number of bathrooms",
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

// ── Main Entry Point ────────────────────────────────────────────────

export async function processLeadMessage(
  conversationHistory: any[],
  newMessage: string,
  conversationId: string
) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set in environment variables.");
  }

  // Convert DB history to OpenAI-compatible message format
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...conversationHistory.map((msg) => ({
      role: (msg.sender === "CLIENT" ? "user" : "assistant") as "user" | "assistant",
      content: msg.content,
    })),
  ];

  // Initial completion request
  let response = await groq.chat.completions.create({
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
    response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      tools,
      tool_choice: "auto",
      max_tokens: 1024,
    });

    choice = response.choices[0];
  }

  return choice.message.content || "I apologize, I was unable to generate a response. Please try again.";
}
