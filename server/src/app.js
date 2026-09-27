import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import productsRouter from "./routes/products.route.js";
import errorHandler from "./core/errorHandler.js";
import ApiError from "./core/ApiError.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);

app.use((req, res, next) => {
  next(new ApiError(404, "Not Found"));
});

app.use(errorHandler);

export default app;
