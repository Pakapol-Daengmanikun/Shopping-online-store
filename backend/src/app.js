import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandlers.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "online-store-backend" });
});

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
