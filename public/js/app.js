// Lemon Dashboard — connects to your existing Node.js backend (port 3000)

const analyzeBtn = document.getElementById("analyzeBtn");
const repoInput = document.getElementById("repoInput");

analyzeBtn.addEventListener("click", analyzeProject);
repoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") analyzeProject();
});

async function analyzeProject() {
  console.log("Analyze clicked");
  const repoUrl = repoInput.value.trim();
  console.log("Input value:", repoUrl);
  if (!repoUrl) {
    console.log("Empty input, stopping");
    return;
  }

  const projectName = repoUrl.split("/").filter(Boolean).pop() || "project";
  document.getElementById("projectName").textContent = projectName;
  document.getElementById("launchDate").textContent = "Loading...";

  try {
    console.log("Sending fetch request...");
    const res = await fetch("/api/recall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: `Summarize everything about ${projectName}`,
      }),
    });
    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);
    renderResults(projectName, data.results || []);
  } catch (err) {
    console.error("Fetch failed:", err);
    document.getElementById("launchDate").textContent =
      "Could not reach memory server";
  }
}
function renderResults(projectName, results) {
  document.getElementById("launchDate").textContent = `Project: ${projectName}`;
  document.getElementById("lastBuild").textContent =
    `Memories found: ${results.length}`;

  document.getElementById("statCommits").textContent = results.length;
  document.getElementById("statBugs").textContent = results.filter((r) =>
    /bug|fix/i.test(r),
  ).length;
  document.getElementById("statModules").textContent = new Set(
    results.flatMap((r) => r.match(/[\w-]+\.(js|py|html|css|json)/gi) || []),
  ).size;
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
      <span><span class="bug-id">#${(i + 1).toString().padStart(3, "0")}</span>${truncate(r, 60)}</span>
      <span class="bug-tag fixed">Logged</span>
    </div>
  `,
    )
    .join("");

  renderTimeline(results);
}

function renderTimeline(results) {
  const container = document.getElementById("timelinePoints");
  const points = results.slice(0, 4);
  container.innerHTML = points
    .map(
      (p) => `
    <div class="timeline-point"><strong>•</strong>${truncate(p, 50)}</div>
  `,
    )
    .join("");
}

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) + "..." : str;
}
