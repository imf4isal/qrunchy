import express from "express";
import pool from "../config/database.mjs";

const router = express.Router();

// test server
router.get("/", (req, res) => {
  res.json({ message: "Hello from Qrunchy API!" });
});

router.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "success",
      message: "db connection has been successfully established.",
      time: result.rows[0].now,
    });
  } catch (error: any) {
    console.log("DB connection error:", error);
    res.status(500).json({
      status: "error",
      message: "DB connection has been failed.",
      error: error.message,
    });
  }
});

export default router;
