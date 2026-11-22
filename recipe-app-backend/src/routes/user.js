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

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

// Read at request time, so dotenv has always run before this is used
const secret = () => process.env.JWT_SECRET;
const TOKEN_LIFETIME = "7d"; // keep in sync with the cookie maxAge in Auth.js

/* ------------------------------------------------------------------
 * POST /auth/register
 * ------------------------------------------------------------------ */
router.post("/register", async (req, res) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    if (username.length < 3 || username.length > 40) {
      return res
        .status(400)
        .json({ message: "Username must be 3 to 40 characters" });
    }
    // bcrypt only uses the first 72 bytes, so longer passwords are rejected
    if (password.length < 6 || password.length > 72) {
      return res
        .status(400)
        .json({ message: "Password must be 6 to 72 characters" });
    }

    const user = await UserModel.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    // Two people registering the same name at the same moment
    if (err && err.code === 11000) {
      return res.status(400).json({ message: "Username already exists" });
    }
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

/* ------------------------------------------------------------------
 * POST /auth/login
 * ------------------------------------------------------------------ */
router.post("/login", async (req, res) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, secret(), {
      expiresIn: TOKEN_LIFETIME,
    });
    res.json({ token, userID: user._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export { router as userRouter };

/* ------------------------------------------------------------------
 * Middleware: verifyToken
 * Checks the Authorization header and attaches the logged-in
 * user's id to the request as req.userId.
 * A missing, invalid or expired token is always 401, which the
 * frontend treats as "log the user out". 403 is only used for
 * "you are logged in but this is not yours".
 * ------------------------------------------------------------------ */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Please log in to continue" });
  }

  // Works with a bare token and with "Bearer <token>"
  const token = authHeader.replace(/^Bearer\s+/i, "");

  jwt.verify(token, secret(), { algorithms: ["HS256"] }, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Your session expired. Please log in again." });
    }
    req.userId = String(decoded.id);
    next();
  });
};