import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { prisma } from "./prisma";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const SYSTEM_PROMPT = `
You are the official AI Assistant for Al Alkeem Group. Your name is Al Alkeem Group Assistant.
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
If a client specifically requests a human, gets frustrated, or has complex requirements outside your knowledge base, flag the conversation for a human handoff. 
The handoff WhatsApp number is ${process.env.HANDOFF_WHATSAPP_NUMBER || "0507443111"}.

TONE & BEHAVIOR:
- Be polite, professional, and concise.
- DO NOT invent rules or properties not explicitly provided to you in your knowledge base.
- Structure your responses to be easily readable on WhatsApp.
`;

// Helper: Standard DB search for properties based on LLM parameters
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
    return { properties };
  } catch (error) {
    console.error("Error searching properties:", error);
    return { error: "Failed to query properties database." };
  }
}

// Helper: Mark conversation escalated and log handoff
async function requestHumanHandoffInDb(args: any, conversationId: string) {
  const { reason } = args;
  try {
    await prisma.$transaction([
      prisma.conversation.update({
        where: { id: conversationId },
        data: { status: "ESCALATED" }
      }),
      prisma.handoff.create({
        data: {
          conversationId,
          assignedAgent: "Kimberly",
          status: "PENDING",
        }
      })
    ]);
    return { 
      success: true, 
      message: "Human handoff request successfully logged. Agent Kimberly has been flagged." 
    };
  } catch (error) {
    console.error("Error creating handoff:", error);
    return { error: "Failed to initiate human handoff." };
  }
}

export async function processLeadMessage(conversationHistory: any[], newMessage: string, conversationId: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  // Register the functions Gemini can call
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    tools: [
      {
        functionDeclarations: [
          {
            name: "searchProperties",
            description: "Search for real estate properties based on criteria such as type, location, min/max price, beds, and baths.",
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                type: { type: SchemaType.STRING, description: "Property type (e.g. Apartment, Villa, Studio, Commercial)" },
                location: { type: SchemaType.STRING, description: "Location or community name (e.g. Al Rashidiya, Corniche Ajman)" },
                minPrice: { type: SchemaType.NUMBER, description: "Minimum annual rent price in AED" },
                maxPrice: { type: SchemaType.NUMBER, description: "Maximum annual rent price in AED" },
                beds: { type: SchemaType.INTEGER, description: "Number of bedrooms" },
                baths: { type: SchemaType.INTEGER, description: "Number of bathrooms" },
              },
            },
          },
          {
            name: "requestHumanHandoff",
            description: "Flag the conversation for a human agent handoff when the client requests it or has complex demands.",
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                reason: { type: SchemaType.STRING, description: "The reason why a human handoff is requested." }
              },
              required: ["reason"]
            }
          }
        ]
      }
    ]
  });

  // Convert the conversation history into Gemini's expected format
  const chatHistory = conversationHistory.map((msg) => ({
    role: msg.sender === "CLIENT" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: chatHistory,
  });

  let result = await chat.sendMessage(newMessage);

  // Loop as long as the model wants to call functions
  let functionCalls = result.response.functionCalls();
  while (functionCalls && functionCalls.length > 0) {
    const functionResponses: any[] = [];

    for (const call of functionCalls) {
      const { name, args } = call;
      let functionResult;

      console.log(`🤖 Gemini calls function: ${name}`, args);

      if (name === "searchProperties") {
        functionResult = await searchPropertiesFromDb(args);
      } else if (name === "requestHumanHandoff") {
        functionResult = await requestHumanHandoffInDb(args, conversationId);
      }

      functionResponses.push({
        response: { name, content: functionResult },
      });
    }

    // Send function responses back to get the final text response (or next function call)
    result = await chat.sendMessage(functionResponses);
    functionCalls = result.response.functionCalls();
  }

  const responseText = result.response.text();
  return responseText;
}
