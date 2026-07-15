import { processLeadMessage } from "./src/lib/ai-agent.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  const history = [
    { sender: "CLIENT", content: "I am looking for a 1 bedroom apartment" }
  ];
  
  try {
    const result = await processLeadMessage(history, "I am looking for a 1 bedroom apartment", "dummy-id");
    console.log("AI REPLY:", result);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();
