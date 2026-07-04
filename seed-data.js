/**
 * seed-data.js — populates Lemon with realistic demo sessions for the hackathon demo.
 *
 * WHERE TO PUT IT: drop this in your server-node/ folder (same level as your
 * server.js), next to node_modules so `require("axios")` resolves.
 *
 * HOW TO RUN:
 *   1. Make sure Ollama is running:      ollama serve
 *   2. Make sure Cognee (FastAPI) is up: uvicorn main:app --reload --port 8000
 *   3. Make sure Express is up:          node server.js
 *   4. In a new terminal, from server-node/:
 *        node seed-data.js
 *
 * It hits your existing POST /api/remember endpoint, so no backend changes
 * are needed. Runs sequentially (not parallel) so Cognee/Ollama don't choke
 * on concurrent embedding requests.
 */

const axios = require("axios");

const BASE_URL = "http://localhost:3000";

const sessions = [
  {
    dataset: "auth-service",
    text: "Implemented JWT refresh token rotation. Access tokens now expire in 15 minutes, refresh tokens in 7 days. Added a blacklist check on logout to prevent reuse of revoked tokens.",
  },
  {
    dataset: "auth-service",
    text: "Fixed a race condition where two simultaneous refresh requests could both succeed and issue duplicate tokens. Added a mutex lock keyed by user ID around the refresh handler.",
  },
  {
    dataset: "bug-fixes",
    text: "Bug: dashboard analytics chart crashed when a user had zero logged sessions. Root cause was a division by zero in the average-per-day calculation. Added a guard clause.",
  },
  {
    dataset: "bug-fixes",
    text: "Bug: /api/logs was returning stale data due to an in-memory cache that never invalidated after new sessions were remembered. Added cache invalidation on every POST /api/remember call.",
  },
  {
    dataset: "dashboard-ui",
    text: "Built the Analytics page with three charts: sessions per day, bug count trend, and most active projects. Used vanilla JS with a lightweight canvas-based renderer to avoid extra dependencies.",
  },
  {
    dataset: "dashboard-ui",
    text: "Added sortable columns to the Project Logs table. Clicking a header toggles ascending/descending sort on name, type, date, status, or contributor count.",
  },
  {
    dataset: "cognee-integration",
    text: "Wired up Cognee 1.2.2 with Ollama as the local embedding and inference backend. Using nomic-embed-text for embeddings and llama3.2 for the /recall endpoint's natural language answers.",
  },
  {
    dataset: "cognee-integration",
    text: "Ran into a timeout issue when Cognee tried to build the knowledge graph over a large batch of logs at once. Switched to remembering sessions one at a time instead of batch importing.",
  },
  {
    dataset: "bug-fixes",
    text: "Bug: GitHub repo info fetch was failing for private repos with a 404 instead of a clear error message. Updated the /api/github route to catch 404s and return a friendly 'repo not found or private' message.",
  },
  {
    dataset: "dashboard-ui",
    text: "Redesigned the Overview page to show four stat boxes: total projects, active sessions, bugs logged, and AI prompts used. Pulled all values live from /api/logs instead of hardcoded placeholders.",
  },
  {
    dataset: "auth-service",
    text: "Added rate limiting to the login endpoint — max 5 attempts per 15 minutes per IP, using an in-memory store for now since this is a hackathon build.",
  },
  {
    dataset: "performance",
    text: "Noticed the Logs page was slow to render with 200+ entries. Added pagination showing 25 rows at a time instead of rendering the full table on load.",
  },
  {
    dataset: "performance",
    text: "Profiled the /api/recall endpoint and found most of the latency was in Ollama's embedding step. Cached embeddings for repeated queries within the same session to cut response time roughly in half.",
  },
  {
    dataset: "bug-fixes",
    text: "Bug: the 'Forget dataset' delete button on the dashboard didn't refresh the stats bar after deletion, so counts looked stale until a manual page reload. Fixed by re-fetching /api/logs after a successful delete.",
  },
  {
    dataset: "hackathon-prep",
    text: "Recorded a walkthrough of the four dashboard pages (Overview, Analytics, Logs, Bugs) for the demo video script. Need to trim the Cognee setup explanation to under 30 seconds to keep the video under 3 minutes.",
  },
];

async function seed() {
  console.log(`Seeding ${sessions.length} demo sessions into Lemon...\n`);

  let success = 0;
  let failed = 0;

  for (const [i, session] of sessions.entries()) {
    try {
      await axios.post(`${BASE_URL}/api/remember`, session);
      success++;
      console.log(
        `[${i + 1}/${sessions.length}] ✓ saved -> ${session.dataset}`,
      );
    } catch (err) {
      failed++;
      const msg = err.response?.data?.error || err.message;
      console.log(
        `[${i + 1}/${sessions.length}] ✗ failed -> ${session.dataset} (${msg})`,
      );
    }

    // Small delay so Cognee/Ollama isn't hit with back-to-back embedding requests
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  console.log(`\nDone. ${success} saved, ${failed} failed.`);
  if (failed > 0) {
    console.log(
      "If saves failed, check that server.js (port 3000), Cognee/FastAPI (port 8000), and Ollama are all running.",
    );
  }
}

seed();
