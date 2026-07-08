/**
 * Load Test Script for Al Alkeem Backend
 * 
 * Usage:
 *   node scripts/load-test.js [baseUrl] [totalRequests] [concurrency]
 * 
 * Examples:
 *   node scripts/load-test.js                              # defaults: localhost:3000, 500 reqs, 10 concurrent
 *   node scripts/load-test.js http://localhost:3000 1000 20 # 1000 reqs, 20 concurrent
 */

const BASE_URL = process.argv[2] || "http://localhost:3000";
const TOTAL_REQUESTS = parseInt(process.argv[3] || "500", 10);
const CONCURRENCY = parseInt(process.argv[4] || "10", 10);

// Test scenarios
const TEST_MESSAGES = [
  "Hi, I'm looking for a 2BR apartment in Ajman",
  "What's the commission rate?",
  "Do you have any villas under 100,000 AED?",
  "Can I schedule a viewing?",
  "Tell me about the security deposit",
  "I want a studio in Al Rashidiya",
  "How does FEWA work?",
  "What documents do I need?",
  "I need to speak with a human please",
  "Any properties near Corniche?",
];

// Stats tracking
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  errors: {},
  latencies: [],
  startTime: 0,
  endTime: 0,
};

function randomPhone() {
  return "97150" + Math.floor(1000000 + Math.random() * 9000000);
}

function randomMessage() {
  return TEST_MESSAGES[Math.floor(Math.random() * TEST_MESSAGES.length)];
}

async function sendTestRequest(requestId) {
  const phone = randomPhone();
  const message = randomMessage();
  const start = Date.now();

  try {
    const response = await fetch(`${BASE_URL}/api/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        name: `LoadTest-${requestId}`,
        message,
      }),
    });

    const latency = Date.now() - start;
    stats.latencies.push(latency);
    stats.total++;

    if (response.ok) {
      stats.success++;
    } else {
      stats.failed++;
      const statusKey = `HTTP_${response.status}`;
      stats.errors[statusKey] = (stats.errors[statusKey] || 0) + 1;
    }

    // Progress indicator every 50 requests
    if (stats.total % 50 === 0) {
      const elapsed = ((Date.now() - stats.startTime) / 1000).toFixed(1);
      const rps = (stats.total / (Date.now() - stats.startTime) * 1000).toFixed(1);
      console.log(
        `  [${stats.total}/${TOTAL_REQUESTS}] ${elapsed}s elapsed | ` +
        `${stats.success} ok, ${stats.failed} failed | ${rps} req/s | ` +
        `avg latency: ${Math.round(avg(stats.latencies))}ms`
      );
    }
  } catch (error) {
    stats.total++;
    stats.failed++;
    const errKey = error.code || error.message || "UNKNOWN";
    stats.errors[errKey] = (stats.errors[errKey] || 0) + 1;
    stats.latencies.push(Date.now() - start);
  }
}

function avg(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function p(arr, percentile) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

async function runBatch(startIdx, count) {
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(sendTestRequest(startIdx + i));
  }
  await Promise.all(promises);
}

async function healthCheck() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  AL ALKEEM BACKEND — LOAD TEST");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Target:      ${BASE_URL}`);
  console.log(`  Requests:    ${TOTAL_REQUESTS}`);
  console.log(`  Concurrency: ${CONCURRENCY}`);
  console.log("═══════════════════════════════════════════════════════\n");

  // Pre-flight health check
  console.log("⏳ Pre-flight health check...");
  const preHealth = await healthCheck();
  if (!preHealth) {
    console.error("❌ Server is not reachable at " + BASE_URL);
    console.error("   Make sure the dev server is running: npm run dev");
    process.exit(1);
  }
  console.log(`✅ Server healthy | DB: ${preHealth.database.status} | ` +
    `${preHealth.stats?.leads || 0} leads, ${preHealth.stats?.properties || 0} properties\n`);

  // Run load test
  console.log("🚀 Starting load test...\n");
  stats.startTime = Date.now();

  let sent = 0;
  while (sent < TOTAL_REQUESTS) {
    const batchSize = Math.min(CONCURRENCY, TOTAL_REQUESTS - sent);
    await runBatch(sent, batchSize);
    sent += batchSize;
  }

  stats.endTime = Date.now();
  const totalTimeSec = (stats.endTime - stats.startTime) / 1000;

  // Post-flight health check
  console.log("\n⏳ Post-flight health check...");
  const postHealth = await healthCheck();

  // Print results
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  RESULTS");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Total Requests:  ${stats.total}`);
  console.log(`  Successful:      ${stats.success} (${((stats.success / stats.total) * 100).toFixed(1)}%)`);
  console.log(`  Failed:          ${stats.failed} (${((stats.failed / stats.total) * 100).toFixed(1)}%)`);
  console.log(`  Total Time:      ${totalTimeSec.toFixed(2)}s`);
  console.log(`  Throughput:      ${(stats.total / totalTimeSec).toFixed(1)} req/s`);
  console.log("");
  console.log("  Latency:");
  console.log(`    Min:    ${Math.min(...stats.latencies)}ms`);
  console.log(`    Avg:    ${Math.round(avg(stats.latencies))}ms`);
  console.log(`    P50:    ${p(stats.latencies, 50)}ms`);
  console.log(`    P95:    ${p(stats.latencies, 95)}ms`);
  console.log(`    P99:    ${p(stats.latencies, 99)}ms`);
  console.log(`    Max:    ${Math.max(...stats.latencies)}ms`);

  if (Object.keys(stats.errors).length > 0) {
    console.log("\n  Errors:");
    for (const [key, count] of Object.entries(stats.errors)) {
      console.log(`    ${key}: ${count}`);
    }
  }

  if (postHealth) {
    console.log(`\n  Post-test DB:    ${postHealth.database.status} (${postHealth.database.latencyMs}ms)`);
    console.log(`  Post-test Stats: ${postHealth.stats?.leads} leads, ${postHealth.stats?.messages} messages`);
  }

  console.log("═══════════════════════════════════════════════════════");

  // Exit code based on success rate
  const successRate = stats.success / stats.total;
  if (successRate < 0.95) {
    console.log("\n⚠️  WARN: Success rate below 95%. Investigate errors above.");
    process.exit(1);
  } else {
    console.log("\n✅ PASS: Backend is stable.");
    process.exit(0);
  }
}

main();
