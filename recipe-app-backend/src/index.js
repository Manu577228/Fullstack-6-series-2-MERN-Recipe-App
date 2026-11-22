/*
 ============================================================================================

 #   #   ###   #   #  #   #
 ## ##  #   #  ##  #  #   #
 # # #  #####  # # #  #   #
 #   #  #   #  #  ##  #   #
 #   #  #   #  #   #   ### 

 ####   #   #   ###   ####    ###   ####   #   #   ###     ###
 #   #  #   #  #   #  #   #  #   #  #   #  #   #  #   #     # 
 ####   #####  #####  ####   #####  #   #  # # #  #####     # 
 #   #  #   #  #   #  #  #   #   #  #   #  ## ##  #   #  #  # 
 ####   #   #  #   #  #   #  #   #  ####   #   #  #   #   ##  

 --------------------------------------------------------------------------------------------
  YouTube : @code-with-Bharadwaj
  GitHub  : github.com/Manu577228
 ============================================================================================
*/

// dotenv must be the first import so every later module can read process.env
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { userRouter } from "./routes/Users.js";
import { recipesRouter } from "./routes/recipes.js";

/* ------------------------------------------------------------------
 * Config (all secrets come from the environment, never from the code)
 * ------------------------------------------------------------------ */
const { MONGO_URI, JWT_SECRET } = process.env;
const PORT = process.env.PORT || 3001;

if (!MONGO_URI || !JWT_SECRET) {
  console.error("Missing MONGO_URI or JWT_SECRET. Copy .env.example to .env and fill them in.");
  process.exit(1);
}

// Comma separated list, e.g. https://my-app.netlify.app
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

const app = express();

// Needed behind a host's proxy (Render, Railway, Heroku...) so rate limiting sees real IPs
app.set("trust proxy", 1);

/* ------------------------------------------------------------------
 * Middleware
 * ------------------------------------------------------------------ */
app.use(helmet());
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
app.use(express.json({ limit: "100kb" }));

// Slows down password guessing on login and register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

/* ------------------------------------------------------------------
 * Routes
 * ------------------------------------------------------------------ */
app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/auth", authLimiter, userRouter);
app.use("/recipes", recipesRouter);

app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Catches things like malformed JSON bodies
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.log(err);
  res
    .status(status)
    .json({ message: status >= 500 ? "Something went wrong" : "Invalid request" });
});

/* ------------------------------------------------------------------
 * Start: connect to the database first, then accept requests
 * ------------------------------------------------------------------ */
const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error("Could not connect to MongoDB:", err.message);
    process.exit(1);
  }
};

start();