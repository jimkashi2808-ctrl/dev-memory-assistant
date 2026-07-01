const analyzeBtn = document.getElementById("analyzeBtn");
const repoInput = document.getElementById("repoInput");

analyzeBtn.addEventListener("click", analyzeProject);
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

  // If GitHub URL — fetch real repo data
  if (isGithubUrl) {
    try {
      const ghRes = await fetch(`/api/github?url=${encodeURIComponent(input)}`);
      const ghData = await ghRes.json();
      if (!ghData.error) {
        document.getElementById("projectName").textContent =
          ghData.full_name || projectName;
        document.getElementById("launchDate").textContent =
          `⭐ ${ghData.stargazers_count} stars`;
        document.getElementById("lastBuild").textContent =
          `📅 ${new Date(ghData.pushed_at).toLocaleDateString()}`;
        document.querySelector(".project-head p").textContent =
          ghData.description || "No description";

        // Update stats with real GitHub data
        document.getElementById("statCommits").textContent =
          ghData.open_issues_count || 0;
        document.getElementById("statModules").textContent =
          ghData.forks_count || 0;
      }
    } catch (err) {
      console.error("GitHub fetch failed:", err);
    }
  }

  // Always query memory regardless of URL type
  try {
    const res = await fetch("/api/recall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: `Summarize everything about ${projectName}`,
      }),
    });
    const data = await res.json();
    renderResults(projectName, data.results || []);
  } catch (err) {
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
      '<div class="bug-row empty">No memory found for this project yet</div>';
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
