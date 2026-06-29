async function rememberSession() {
  const text = document.getElementById("sessionText").value;
  const dataset = document.getElementById("datasetName").value || "sessions";
  const status = document.getElementById("rememberStatus");

  if (!text.trim()) {
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
      body: JSON.stringify({ text, dataset }),
    });
    const data = await res.json();
    status.textContent = "✅ Saved to memory!";
    status.style.color = "#4caf50";
    document.getElementById("sessionText").value = "";
  } catch (err) {
    status.textContent = "❌ Failed to save. Is Cognee server running?";
    status.style.color = "#ff6b6b";
  }
}

async function recallMemory() {
  const question = document.getElementById("question").value;
  const results = document.getElementById("recallResults");

  if (!question.trim()) {
    results.textContent = "Please type a question first.";
    return;
  }

  results.textContent = "Searching memory...";

  try {
    const res = await fetch("/api/recall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      results.innerHTML = data.results.map((r) => `<p>• ${r}</p>`).join("");
    } else {
      results.textContent = "No memories found for that query.";
    }
  } catch (err) {
    results.textContent = "❌ Failed to recall. Is Cognee server running?";
  }
}
