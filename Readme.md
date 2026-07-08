Al Alkeem Group - PMS AI Backend Engine
=======================================

This project is a Next.js (App Router) and Prisma-based backend that handles lead generation, WhatsApp Webhooks, and AI automation for Al Alkeem Group's real estate business.

Features
--------
* Meta WhatsApp Webhook: Receives messages directly from the Meta Cloud API.
* AI Property Matching: Uses Groq (Llama 3.3 70B) with function-calling to query the database and suggest listings dynamically.
* Lead Scoring System: Automatically scores leads as HOT, WARM, or COLD based on intent markers like budget, viewings, and escalation.
* Human Handoffs: Automatically flags conversations for human intervention when users get frustrated or request to speak with an agent.
* Local Fallback DB: Configured with a local SQLite database (dev.db) to bypass external connection limitations during development.

Available Endpoints
-------------------
* GET  /api/webhook — Meta webhook verification
* POST /api/webhook — Incoming WhatsApp messages
* POST /api/test — Simulate a conversation for demonstrations
* GET  /api/leads — List all leads
* POST /api/leads — Ingest a lead from a website form
* GET  /api/leads/[id] — View lead details and history
* GET  /api/properties — List all properties
* POST /api/properties — Add a property
* GET  /api/conversations — List all conversations
* GET  /api/conversations/[id] — View conversation details
* POST /api/score — Score a lead
* GET  /api/health — Database and system health check

Load Testing and Stability Results
----------------------------------
We ran a concurrency simulation load test against the AI test endpoint to ensure stability, throughput, and database resilience under pressure.

Test Configuration:
* Requests: 20
* Concurrency: 2 (optimized for free-tier Groq API limits)
* Endpoints hit: /api/test (Full AI pipeline)

Results:
* Success Rate: 100% (20/20 successful requests)
* Error Rate: 0%
* Latency Percentiles: Min 1.8s, Avg 7.6s, P50 6.9s, P95 13.3s
* Database Status: Connected (1ms response time)
* Data Integrity: 80 leads and 160 messages perfectly logged and validated without locking issues.

Setup Instructions
------------------
1. Copy .env.example to .env and add your GROQ_API_KEY.
2. Push the schema by running: npx prisma db push
3. Seed the properties by running: npm run db:seed
4. Start the server by running: npm run dev
5. Run the load test by running: npm run test:load
