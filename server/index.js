const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const axios = require("axios");

dotenv.config();

// MySQL database setup
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}).promise();

const app = express();
app.use(cors());
app.use(express.json());

// AI email generation route using Hugging Face's FLAN-T5
app.post("/api/email/save", async (req, res) => {
  const { subject } = req.body;
  console.log(req.body);
  
  if (!subject || subject.trim() === "") {
    return res.status(400).json({ error: "Subject is required" });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        inputs: `Write a professional email about: ${subject}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const generatedText = response.data[0]?.generated_text || "Could not generate email.";

    // Save the generated email in the database
    const sql = "INSERT INTO emails (subject, email) VALUES (?, ?)";
    await pool.query(sql, [subject, generatedText]);

    // Send the generated email back in the response
    res.status(200).json({
      subject,
      email: generatedText,
    });
  } catch (error) {
    console.error("Hugging Face Error:", error.message);
    res.status(500).json({ error: "Failed to generate email." });
  }
});

// Fetch all saved emails from the database
app.get("/api/emails", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM emails ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch emails." });
  }
});

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
