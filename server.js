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

app.listen(PORT, () => {
  console.log(`Dev Memory Assistant running on http://localhost:${PORT}`);
});
