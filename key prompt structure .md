# WhatsApp Lead-Gen Bot — Project Guide

Real estate lead capture → WhatsApp AI agents → CRM/Admin Panel, mapped from your workflow sketch.

---

## 1. What you're building (from your workflow)

```
Leads (Property Finder, Bayut, Instagram, Website Form)
        │
        ▼
    WhatsApp (Cloud API)
        │
        ▼
    AI Agents
        │
   ┌────┴─────────────────────────────┐
   │                                   │
①  AI Assistant                   ②  AI Agent
   - Attending / greeting             - Meeting scheduling (Admin ↔ Client)
   - Conditions:                      - If human needed → hand off to Kimberly
     • Query answering                - If Kimberly unavailable → auto-message
     • Property matching
       [database fetching]
     - Lead scoring
        │                                   │
        └────────────────┬──────────────────┘
                          ▼
                ③  Summarization / Scoring
                    - Hot / Cold / Warm
                    - Feature/data validation → Report
                          │
                          ▼
                ④  Kimberly Summarization  (future feature)
                          │
                          ▼
                    Admin Panel  (Client data)
                          │
                          ▼
                    Super Admin  (Monitoring)
```

This maps cleanly to a **multi-agent orchestration pattern**: one entry-point conversational agent, a task-routing agent, a scoring/summarization pipeline, and a human-in-the-loop escalation path — all sitting behind a WhatsApp webhook and feeding a CRM/admin dashboard.

---

## 2. Recommended stack

| Layer | Choice | Why |
|---|---|---|
| Frontend (website lead forms + Admin Panel) | **Next.js 14 (App Router) + TypeScript** | You already want Next.js; one codebase for public forms and internal dashboard |
| Backend API | **Next.js API routes / Route Handlers** for CRUD, **separate Node worker service** for the WhatsApp bot & AI orchestration | Keeps webhook processing and long-running AI calls off the Vercel request lifecycle |
| Database | **PostgreSQL** (Supabase or Neon) via **Prisma ORM** | Relational data (leads, conversations, meetings) with easy migrations |
| Queue / background jobs | **BullMQ + Redis (Upstash)** | WhatsApp messages, AI calls, and scoring must be async and retry-safe |
| WhatsApp channel | **WhatsApp Business Cloud API (Meta)** via webhook | Official, scalable, avoids ban risk of unofficial libraries |
| AI / LLM | **Claude API (Anthropic)** with tool use (function calling) | Property matching, query answering, lead scoring, summarization all map to tool-calling agents |
| Vector search (property matching) | **pgvector** extension on Postgres (or Pinecone if you outgrow it) | Semantic "find me a 2BR in Marina under 1.2M" matching |
| Calendar / meeting scheduling | **Cal.com API** or **Google Calendar API** | Handles slot-finding, invites, reminders |
| Auth (Admin Panel) | **NextAuth.js / Auth.js** with role-based access (Super Admin, Admin, Agent) | |
| Hosting | **Vercel** (Next.js) + **Railway or Render** (worker + Redis) | |
| Monitoring | **Sentry** + simple internal logs table for "By us" monitoring | |

You can start monolithic (Next.js API routes handle the webhook too) and split into a worker service only once volume needs it — see Phase 4 below.

---

## 3. Data model (core tables)

```
leads
  id, source (property_finder | bayut | instagram | website_form),
  name, phone, whatsapp_id, raw_payload, status, created_at

conversations
  id, lead_id, channel, status (active | escalated | closed), assigned_to, created_at

messages
  id, conversation_id, direction (in|out), sender (bot|agent|client),
  agent_type (assistant|agent|human), content, tool_calls_json, created_at

properties
  id, external_id, source, title, type, location, price, beds, baths,
  embedding (vector), raw_data_json

lead_scores
  id, lead_id, temperature (hot|warm|cold), score, reasoning, validated_by, created_at

meetings
  id, lead_id, conversation_id, agent_assigned, scheduled_time,
  status (proposed|confirmed|cancelled), calendar_event_id

handoffs
  id, conversation_id, requested_at, assigned_agent (e.g. Kimberly),
  status (pending|accepted|timed_out), fallback_message_sent boolean

users (admin panel)
  id, name, role (super_admin|admin|agent), email, phone

audit_logs
  id, actor, action, entity, entity_id, created_at   -- for "Monitoring [By us]"
```

---

## 4. How each block from your sketch becomes a component

### Lead ingestion
- **Website form → Next.js API route** (`/api/leads/website`) → writes to `leads`, triggers first WhatsApp message (opt-in required by WhatsApp policy — see §6).
- **Property Finder / Bayut / Instagram** → these platforms don't push leads automatically to arbitrary endpoints in most cases. Practical approaches:
  - Property Finder & Bayut: check if your account has **lead export/API/webhook access** (often available on agency plans) — poll or subscribe.
  - Instagram: use **Meta's Instagram Messaging API** (same Meta Business platform as WhatsApp) to catch DMs/comments as leads.
  - Fallback: a lightweight **email-to-lead parser** (many portals email you the lead) — a cron job reads a dedicated inbox and creates lead records.

### ① AI Assistant (Tier 1 — "Attending")
- First responder. System prompt defines it as a real-estate assistant for your brand.
- Implemented as a **Claude tool-use agent** with tools:
  - `search_properties(criteria)` → queries Postgres/pgvector
  - `answer_faq(question)` → RAG over your FAQ/knowledge base
  - `score_lead(conversation)` → writes to `lead_scores`
- Runs on every inbound WhatsApp message until the conversation is escalated.

### ② AI Agent (Tier 2 — scheduling & handoff)
- Triggered once intent = "wants to book a viewing / speak to someone" or lead score crosses a threshold.
- Tools:
  - `propose_meeting_slots(agent_calendar)` → Cal.com/Google Calendar API
  - `confirm_meeting(slot)` → writes `meetings`, sends calendar invite
  - `request_human_handoff(reason)` → creates `handoffs` row, notifies Kimberly (WhatsApp/Slack/SMS)
- **Handoff logic**: if Kimberly doesn't acknowledge within N minutes (e.g. 5–10), the worker's scheduled job automatically sends the client a fallback message ("Our agent will reach out shortly") and flags it in the Admin Panel — exactly the "if not available → throws a msg" branch in your sketch.

### ③ Summarization / Scoring
- Runs after each conversation session (or on a schedule) via a background job.
- Produces: Hot/Cold/Warm classification + a structured report (budget, location, timeline, urgency).
- "Feature/data validation" = a rules + LLM check that flags incomplete or inconsistent lead data before it's marked reportable.

### ④ Kimberly Summarization (flag as future feature)
- Build the pipeline so summaries are agent-agnostic now (`summaries` table keyed by conversation), so a "per-human-agent" summarization view is just a filtered dashboard later — don't hardcode Tier 3 to skip this.

### Admin Panel / Super Admin
- Admin Panel: view/search leads, conversation history, scores, meetings, manually override AI decisions, reassign handoffs.
- Super Admin: everything above + system-level monitoring — message volume, AI error rates, response latency, escalation SLAs (the "Monitoring [By us]" note maps to an internal ops dashboard, not client-facing).

---

## 5. WhatsApp Cloud API essentials (read before building)

1. **Business verification** with Meta is required for production sending limits.
2. You **cannot freely message a lead first** unless within a 24-hour session window or using a **pre-approved template message**. Your first outbound touch to a new lead (from a website form, for example) must be a Meta-approved template ("Hi {{name}}, thanks for your interest in {{property}}...").
3. Webhook: Meta POSTs inbound messages to your endpoint — this is what your Next.js/worker service listens on.
4. Use the official **Cloud API**, not a browser-automation library (e.g. Baileys/whatsapp-web.js) for anything client-facing — those risk number bans and don't scale.

---

## 6. Suggested build phases

**Phase 1 — Foundations (1–2 weeks)**
- Next.js project scaffold, Postgres + Prisma schema, WhatsApp Cloud API app + webhook verified, basic inbound/outbound echo bot working.

**Phase 2 — AI Assistant (Tier 1) (1–2 weeks)**
- Claude tool-use agent wired to `messages` table, property search tool against a seeded `properties` table, FAQ RAG, basic lead scoring stub.

**Phase 3 — Lead ingestion (1 week)**
- Website form → API route → WhatsApp opt-in template flow.
- Portal integrations (Property Finder/Bayut API or email-parser) + Instagram Messaging API.

**Phase 4 — AI Agent (Tier 2): scheduling & handoff (1–2 weeks)**
- Calendar integration, meeting proposal/confirmation flow, Kimberly handoff + timeout fallback logic. Move bot processing to a worker service + queue if not already.

**Phase 5 — Summarization/Scoring (Tier 3) (1 week)**
- Post-conversation scoring job, Hot/Cold/Warm logic, report generation.

**Phase 6 — Admin Panel + Super Admin (2 weeks)**
- Auth + roles, leads/conversations views, manual override tools, monitoring dashboard, audit logs.

**Phase 7 — Hardening**
- Retry/error handling for WhatsApp API failures, rate limiting, Sentry, load test the webhook, template message approvals with Meta.

---

## 7. Key environment variables you'll need

```
DATABASE_URL=
REDIS_URL=
ANTHROPIC_API_KEY=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
CALENDAR_API_KEY=            # Cal.com or Google
NEXTAUTH_SECRET=
PROPERTY_FINDER_API_KEY=     # if agency API access available
BAYUT_API_KEY=                # if available
INSTAGRAM_ACCESS_TOKEN=
```

---

## 8. Suggested repo structure

```
/apps
  /web           → Next.js app (public site, lead forms, Admin Panel)
  /worker        → Node service: WhatsApp webhook, AI agents, queue jobs
/packages
  /db            → Prisma schema + client (shared)
  /ai-agents     → Claude tool definitions, prompts, orchestration logic
  /integrations  → WhatsApp, Calendar, Property Finder/Bayut/Instagram clients
```

---

## Next steps

Tell me which phase you want to start with and I can generate the actual scaffolding — e.g. the Prisma schema, the WhatsApp webhook handler, or the Claude tool-use agent code for the AI Assistant.
