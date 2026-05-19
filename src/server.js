import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { nanoid } from "nanoid";
import { z } from "zod";

import { getPrediction } from "./aiClient.js";
import {
  deletePredictionById,
  getPredictionById,
  getPredictions,
  initStore,
  savePrediction
} from "./store.js";

const app = express();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";

app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL === "*" ? true : FRONTEND_URL
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

const fieldOptions = {
  hypertension: [
    { label: "No", value: 0 },
    { label: "Yes", value: 1 }
  ],
  heart_disease: [
    { label: "No", value: 0 },
    { label: "Yes", value: 1 }
  ],
  ever_married: ["Yes", "No"],
  work_type: ["children", "Govt_job", "Never_worked", "Private", "Self-employed"],
  smoking_status: ["formerly smoked", "never smoked", "smokes", "Unknown"]
};

const predictionSchema = z.object({
  age: z.coerce.number().min(0).max(120),
  hypertension: z.coerce.number().int().min(0).max(1),
  heart_disease: z.coerce.number().int().min(0).max(1),
  ever_married: z.enum(["Yes", "No"]),
  work_type: z.enum(["children", "Govt_job", "Never_worked", "Private", "Self-employed"]),
  avg_glucose_level: z.coerce.number().min(0).max(400),
  bmi: z.coerce.number().min(5).max(100),
  smoking_status: z.enum(["formerly smoked", "never smoked", "smokes", "Unknown"])
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StrokeSense backend API is running.",
    endpoints: {
      health: "GET /api/health",
      fields: "GET /api/fields",
      predict: "POST /api/predict",
      predictionHistory: "GET /api/predictions"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "StrokeSense Backend",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/fields", (req, res) => {
  res.json({
    success: true,
    data: fieldOptions
  });
});

app.post("/api/predict", async (req, res) => {
  const parsed = predictionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed. Please check the submitted fields.",
      errors: parsed.error.flatten().fieldErrors
    });
  }

  const input = parsed.data;
  const predictionResult = await getPrediction(input);

  const record = {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    input,
    prediction: predictionResult.prediction,
    modelSource: predictionResult.modelSource,
    modelVersion: predictionResult.modelVersion
  };

  await savePrediction(record);

  return res.status(201).json({
    success: true,
    message: "Prediction created successfully.",
    data: record
  });
});

app.get("/api/predictions", async (req, res) => {
  const limit = Number(req.query.limit || 50);
  const safeLimit = Number.isNaN(limit) ? 50 : Math.min(Math.max(limit, 1), 100);

  const predictions = await getPredictions(safeLimit);

  res.json({
    success: true,
    count: predictions.length,
    data: predictions
  });
});

app.get("/api/predictions/:id", async (req, res) => {
  const prediction = await getPredictionById(req.params.id);

  if (!prediction) {
    return res.status(404).json({
      success: false,
      message: "Prediction not found."
    });
  }

  return res.json({
    success: true,
    data: prediction
  });
});

app.delete("/api/predictions/:id", async (req, res) => {
  const deleted = await deletePredictionById(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Prediction not found."
    });
  }

  return res.json({
    success: true,
    message: "Prediction deleted successfully."
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error."
  });
});

await initStore();

app.listen(PORT, () => {
  console.log(`StrokeSense backend running on http://localhost:${PORT}`);
});