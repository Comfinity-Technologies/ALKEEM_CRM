import { processLeadMessage } from "./src/lib/ai-agent.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  const history = [
    { sender: "CLIENT", content: "I am looking for a 1 bedroom apartment" },
    { sender: "BOT", content: "We have found a 1 bedroom apartment for rent in Al Riffa, Ras Al Khaimah. The annual rent price is AED 35,000. Would you like to schedule a viewing for this property? We have viewing slots available from 9am-11am, 4pm-6pm, and 8pm-10pm." },
    { sender: "CLIENT", content: "Can you tell me more about that apartment?" }
  ];
  
  try {
    const result = await processLeadMessage(history, "Can you tell me more about that apartment?", "dummy-id");
    console.log("AI REPLY:", result);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();
