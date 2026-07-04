// ── Analyze button ──────────────────────────────────────────
const analyzeBtn = document.getElementById("analyzeBtn");
const repoInput = document.getElementById("repoInput");

if (analyzeBtn) analyzeBtn.addEventListener("click", analyzeProject);
if (repoInput)
  repoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") analyzeProject();
  });

async function analyzeProject() {
  const input = repoInput.value.trim();
  if (!input) return;

  const isGithubUrl = input.includes("github.com");
  const projectName = input.split("/").filter(Boolean).pop() || "project";

  document.getElementById("projectName").textContent = projectName;
  document.getElementById("launchDate").textContent = "Loading...";
  document.getElementById("lastBuild").textContent = "...";
  document.querySelector(".project-head p").textContent =
    "Fetching project data...";

  // Fetch real GitHub data
  if (isGithubUrl) {
    try {
      const ghRes = await fetch(`/api/github?url=${encodeURIComponent(input)}`);
      const ghData = await ghRes.json();
      console.log("GitHub data:", ghData);
      if (!ghData.error) {
        document.getElementById("projectName").textContent =
          ghData.full_name || projectName;
        document.getElementById("launchDate").textContent =
          `⭐ ${ghData.stargazers_count} stars`;
        document.getElementById("lastBuild").textContent =
          `📅 ${new Date(ghData.pushed_at).toLocaleDateString()}`;
        document.querySelector(".project-head p").textContent =
          ghData.description || "No description provided";
        document.getElementById("statCommits").textContent =
          ghData.open_issues_count || 0;
        document.getElementById("statModules").textContent =
          ghData.forks_count || 0;
      }
    } catch (err) {
      console.error("GitHub fetch failed:", err);
      document.getElementById("launchDate").textContent = "GitHub fetch failed";
    }
  }

  // Always query Cognee memory
  try {
    const res = await fetch("/api/recall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: `Summarize everything about ${projectName}`,
      }),
    });
    const data = await res.json();
    console.log("Memory results:", data);
    renderResults(projectName, data.results || []);
  } catch (err) {
    console.error("Memory recall failed:", err);
    document.getElementById("launchDate").textContent =
      "Could not reach memory server";
  }
}

function renderResults(projectName, results) {
  document.getElementById("statBugs").textContent = results.filter((r) =>
    /bug|fix|error/i.test(r),
  ).length;
  document.getElementById("statPrompts").textContent = results.filter((r) =>
    /prompt|gpt|claude|ai/i.test(r),
  ).length;

  const bugList = document.getElementById("bugList");
  if (results.length === 0) {
    bugList.innerHTML =
      '<div class="bug-row empty">No memory found — log a session first</div>';
    return;
  }

  bugList.innerHTML = results
    .slice(0, 8)
    .map(
      (r, i) => `
    <div class="bug-row">
      <span><span class="bug-id">#${(i + 1).toString().padStart(3, "0")}</span>${truncate(cleanResult(r), 55)}</span>
      <span class="bug-tag fixed">Logged</span>
    </div>
  `,
    )
    .join("");

  renderTimeline(results);
}

function renderTimeline(results) {
  const container = document.getElementById("timelinePoints");
  if (!container) return;
  container.innerHTML = results
    .slice(0, 4)
    .map(
      (p) => `
    <div class="timeline-point"><strong>•</strong> ${truncate(cleanResult(p), 45)}</div>
  `,
    )
    .join("");
}

function cleanResult(str) {
  return str.replace(/[{}'"\[\]]/g, "").trim();
}

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) + "..." : str;
}

// ── Save Session ─────────────────────────────────────────────
async function saveSession() {
  const text = document.getElementById("sessionText").value.trim();
  const project =
    document.getElementById("sessionProject").value.trim() || "lemon";
  const status = document.getElementById("saveStatus");

  if (!text) {
    status.textContent = "Please write something about your session first.";
    status.style.color = "#ff6b6b";
    return;
  }

  status.textContent = "Saving to memory...";
  status.style.color = "#888";

  try {
    const res = await fetch("/api/remember", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, dataset: project, type: "session" }),
    });
    const data = await res.json();
    console.log("Save result:", data);
    status.textContent = "✅ Saved to memory!";
    status.style.color = "#4ade80";
    document.getElementById("sessionText").value = "";
    setTimeout(() => (status.textContent = ""), 3000);
  } catch (err) {
    status.textContent = "❌ Could not reach memory server.";
    status.style.color = "#ff6b6b";
  }
}

// ── Timeline Chart ────────────────────────────────────────────
function initTimelineChart() {
  const ctx = document.getElementById("timelineChart");
  if (!ctx) return;
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jun 15", "Jun 22", "Jun 29", "Jul 1", "Jul 3", "Jul 5"],
      datasets: [
        {
          label: "Activity",
          data: [10, 25, 60, 85, 70, 95],
          borderColor: "#f4b942",
          backgroundColor: "rgba(244,185,66,0.08)",
          borderWidth: 2.5,
          pointBackgroundColor: "#f4b942",
          pointRadius: 5,
          pointHoverRadius: 8,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      animation: { duration: 2000, easing: "easeInOutQuart" },
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: "#1f2940" },
          ticks: { color: "#7c89a8", font: { size: 11 } },
        },
        y: {
          grid: { color: "#1f2940" },
          ticks: { color: "#7c89a8", font: { size: 11 } },
          beginAtZero: true,
        },
      },
    },
  });
}

// ── Auth ──────────────────────────────────────────────────────
function checkSavedUser() {
  const saved = localStorage.getItem("lemonUser");
  const loginBtn = document.getElementById("loginBtn");
  if (saved && loginBtn) {
    loginBtn.textContent = saved;
    loginBtn.classList.add("logged-in");
  }
}

// ── Page Load ─────────────────────────────────────────────────
window.addEventListener("load", () => {
  initTimelineChart();
  checkSavedUser();

  // Generate hero particles
  const container = document.getElementById("heroParticles");
  if (container) {
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = Math.random() * 8 + 6 + "s";
      p.style.animationDelay = Math.random() * 8 + "s";
      p.style.width = p.style.height = Math.random() * 3 + 1 + "px";
      container.appendChild(p);
    }
  }
});
async function loadRecentSessions() {
  const list = document.getElementById("sessionsList");
  list.style.display = list.style.display === "none" ? "block" : "none";
  if (list.style.display === "none") return;

  try {
    const res = await fetch("/api/logs");
    const data = await res.json();
    if (data.logs.length === 0) {
      list.innerHTML =
        '<div style="color:var(--text-dim);font-size:0.8rem;padding:0.5rem">No sessions logged yet</div>';
      return;
    }
    list.innerHTML = data.logs
      .map(
        (l) => `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;background:#0d1322;border-radius:8px;padding:0.6rem;margin-bottom:0.4rem;gap:0.5rem">
        <div style="font-size:0.78rem;color:var(--text-muted);flex:1">[${l.dataset}] ${l.text.substring(0, 60)}...</div>
        <button onclick="deleteSession(${l.id})" style="background:#ff444422;border:1px solid #ff444444;color:#ff4444;border-radius:6px;padding:0.2rem 0.5rem;font-size:0.72rem;cursor:pointer;flex-shrink:0">Delete</button>
      </div>
    `,
      )
      .join("");
  } catch {
    list.innerHTML =
      '<div style="color:#ff6b6b;font-size:0.8rem">Could not load sessions</div>';
  }
}

async function deleteSession(id) {
  try {
    const res = await fetch(`/api/delete/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.status === "deleted") loadRecentSessions();
  } catch {
    alert("Could not delete session");
  }
}
