require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const COGNEE_URL = process.env.COGNEE_API_URL || "http://localhost:8000";

app.use(express.json());
app.use(express.static("public"));

// Remember a coding session
app.post("/api/remember", async (req, res) => {
  try {
    const { text, dataset } = req.body;
    const response = await axios.post(`${COGNEE_URL}/remember`, {
      text,
      dataset: dataset || "sessions",
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to save memory" });
  }
});

// Recall what you were doing
app.post("/api/recall", async (req, res) => {
  try {
    const { question } = req.body;
    const response = await axios.post(`${COGNEE_URL}/recall`, {
      question,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to recall memory" });
  }
});

// Forget a dataset
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

// Fetch GitHub repo info
app.get("/api/github", async (req, res) => {
  try {
    const { url } = req.query;
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return res.status(400).json({ error: "Invalid GitHub URL" });

    const [, owner, repo] = match;
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers: { Accept: "application/vnd.github.v3+json" } },
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch repo info" });
  }
});

app.listen(PORT, () => {
  console.log(`Dev Memory Assistant running on http://localhost:${PORT}`);
});
