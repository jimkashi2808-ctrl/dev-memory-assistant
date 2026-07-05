require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const COGNEE_URL = process.env.COGNEE_API_URL || "http://localhost:8000";

app.use(express.json());
app.use(express.static("public"));

app.post("/api/remember", async (req, res) => {
  try {
    const { text, dataset, type, tags } = req.body;
    const response = await axios.post(`${COGNEE_URL}/remember`, {
      text,
      dataset: dataset || "sessions",
      type: type || "session",
      tags: tags || [],
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to save memory" });
  }
});

app.post("/api/recall", async (req, res) => {
  try {
    const { question } = req.body;
    const response = await axios.post(`${COGNEE_URL}/recall`, { question });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to recall memory" });
  }
});

app.get("/api/logs", async (req, res) => {
  try {
    const response = await axios.get(`${COGNEE_URL}/logs`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

app.get("/dashboard/:userId", (req, res) => {
  const userId = req.params.userId;

  res.json({
    success: true,
    data: dashboardData[userId],
  });
});

app.post("/api/search", async (req, res) => {
  try {
    const { query } = req.body;
    const response = await axios.post(`${COGNEE_URL}/recall`, {
      question: query,
    });
    const logs = await axios.get(`${COGNEE_URL}/logs`);
    const filtered = logs.data.logs.filter(
      (l) =>
        l.text.toLowerCase().includes(query.toLowerCase()) ||
        l.dataset.toLowerCase().includes(query.toLowerCase()),
    );
    res.json({ results: response.data.results || [], logs: filtered });
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

app.delete("/api/forget/:dataset", async (req, res) => {
  try {
    const response = await axios.delete(
      `${COGNEE_URL}/forget/${req.params.dataset}`,
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to forget dataset" });
  }
});

app.get("/api/github", async (req, res) => {
  try {
    const { url } = req.query;
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return res.status(400).json({ error: "Invalid GitHub URL" });
    const [, owner, repo] = match;
    const repoName = repo.replace(/\.git$/, "");
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Lemon-App",
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    console.error("GitHub API error:", error.message);
    res.status(500).json({ error: "Failed to fetch repo info" });
  }
});
app.delete("/api/delete/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${COGNEE_URL}/delete/${req.params.id}`,
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete session" });
  }
});
app.delete("/api/delete/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const response = await axios.delete(`${COGNEE_URL}/delete/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ error: "Failed to delete session" });
  }
});
app.listen(PORT, () => {
  console.log(`Dev Memory Assistant running on http://localhost:${PORT}`);
});
