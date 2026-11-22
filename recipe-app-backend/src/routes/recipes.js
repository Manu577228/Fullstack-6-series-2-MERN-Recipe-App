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
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./Users.js";
import { cacheGet, cacheSet, cacheDel } from "../config/redis.js";

const router = express.Router();

/* ------------------------------------------------------------------
 * Redis cache keys and lifetimes (seconds)
 * ------------------------------------------------------------------ */
// One list per user, because every user only ever sees their own recipes
const userListKey = (userId) => `recipes:user:${userId}`;
const recipeKey = (id) => `recipe:${id}`;
const ALL_TTL = 60;
const ONE_TTL = 300;

/* ------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------ */
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const LIMITS = {
  name: 60,
  description: 240,
  instructions: 5000,
  ingredient: 200,
  ingredients: 50,
  maxTime: 1440,
};

const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

// Only these fields can ever be written from the request body
const buildRecipeData = (body = {}) => ({
  name: String(body.name || "").trim(),
  description: String(body.description || "").trim(),
  ingredients: Array.isArray(body.ingredients)
    ? body.ingredients.map((i) => String(i).trim()).filter(Boolean)
    : [],
  instructions: String(body.instructions || "").trim(),
  imageUrl: String(body.imageUrl || "").trim(),
  cookingTime: Math.round(Number(body.cookingTime)),
});

const validateRecipeData = (data) => {
  if (!data.name) return "Recipe name is required";
  if (data.name.length > LIMITS.name)
    return `Name can be at most ${LIMITS.name} characters`;
  if (data.description.length > LIMITS.description)
    return `Description can be at most ${LIMITS.description} characters`;
  if (data.ingredients.length === 0) return "Add at least one ingredient";
  if (data.ingredients.length > LIMITS.ingredients)
    return `You can add at most ${LIMITS.ingredients} ingredients`;
  if (data.ingredients.some((i) => i.length > LIMITS.ingredient))
    return `Each ingredient can be at most ${LIMITS.ingredient} characters`;
  if (!data.instructions) return "Instructions are required";
  if (data.instructions.length > LIMITS.instructions)
    return `Instructions can be at most ${LIMITS.instructions} characters`;
  if (!data.imageUrl) return "Image URL is required";
  if (!isHttpUrl(data.imageUrl))
    return "Image URL must start with http:// or https://";
  if (
    !Number.isFinite(data.cookingTime) ||
    data.cookingTime < 1 ||
    data.cookingTime > LIMITS.maxTime
  )
    return `Cooking time must be between 1 and ${LIMITS.maxTime} minutes`;
  return null;
};

/* ------------------------------------------------------------------
 * GET /recipes
 * The logged-in user's own recipes, newest first
 * ------------------------------------------------------------------ */
router.get("/", verifyToken, async (req, res) => {
  try {
    const key = userListKey(req.userId);
    const cached = await cacheGet(key);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.status(200).json(cached);
    }

    const result = await RecipesModel.find({ userOwner: req.userId })
      .sort({ _id: -1 })
      .lean();
    await cacheSet(key, result, ALL_TTL);
    res.set("X-Cache", "MISS");
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not load your recipes" });
  }
});

/* ------------------------------------------------------------------
 * POST /recipes
 * Create a recipe (the owner comes from the token, not the body)
 * ------------------------------------------------------------------ */
router.post("/", verifyToken, async (req, res) => {
  try {
    const data = buildRecipeData(req.body);
    const problem = validateRecipeData(data);
    if (problem) {
      return res.status(400).json({ message: problem });
    }

    const recipe = new RecipesModel({ ...data, userOwner: req.userId });
    const result = await recipe.save();
    await cacheDel(userListKey(req.userId));
    res.status(201).json({ createdRecipe: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not create the recipe" });
  }
});

/* ------------------------------------------------------------------
 * GET /recipes/savedRecipes/ids/:userId
 * Only the ids of a user's saved recipes
 * ------------------------------------------------------------------ */
router.get("/savedRecipes/ids/:userId", verifyToken, async (req, res) => {
  try {
    if (req.params.userId !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }
    const user = await UserModel.findById(req.userId);
    res.status(200).json({ savedRecipes: user?.savedRecipes || [] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not load saved recipes" });
  }
});

/* ------------------------------------------------------------------
 * GET /recipes/savedRecipes/:userId
 * Full recipe documents a user has saved
 * ------------------------------------------------------------------ */
router.get("/savedRecipes/:userId", verifyToken, async (req, res) => {
  try {
    if (req.params.userId !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }
    const user = await UserModel.findById(req.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user?.savedRecipes || [] },
      userOwner: req.userId,
    });
    res.status(200).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not load saved recipes" });
  }
});

/* ------------------------------------------------------------------
 * PUT /recipes
 * Save a recipe to the logged-in user's list
 * Body: { recipeID }
 * ------------------------------------------------------------------ */
router.put("/", verifyToken, async (req, res) => {
  try {
    const { recipeID } = req.body;
    if (!isValidId(recipeID)) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }

    const recipe = await RecipesModel.findById(recipeID);
    if (!recipe || String(recipe.userOwner) !== req.userId) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // $addToSet means saving twice never creates a duplicate
    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      { $addToSet: { savedRecipes: recipe._id } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not save the recipe" });
  }
});

/* ------------------------------------------------------------------
 * DELETE /recipes/saved/:recipeId
 * Remove a recipe from the logged-in user's saved list (unsave)
 * ------------------------------------------------------------------ */
router.delete("/saved/:recipeId", verifyToken, async (req, res) => {
  try {
    const { recipeId } = req.params;
    if (!isValidId(recipeId)) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }

    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      { $pull: { savedRecipes: recipeId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not unsave the recipe" });
  }
});

/* ------------------------------------------------------------------
 * GET /recipes/:recipeId
 * One of your own recipes by id
 * ------------------------------------------------------------------ */
router.get("/:recipeId", verifyToken, async (req, res) => {
  try {
    if (!isValidId(req.params.recipeId)) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }
    const key = recipeKey(req.params.recipeId);
    const cached = await cacheGet(key);
    if (cached) {
      // The cache is shared, so the owner check still runs on a hit
      if (String(cached.userOwner) !== req.userId) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.set("X-Cache", "HIT");
      return res.status(200).json(cached);
    }

    const result = await RecipesModel.findById(req.params.recipeId).lean();
    // Someone else's recipe looks exactly like a missing one
    if (!result || String(result.userOwner) !== req.userId) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    await cacheSet(key, result, ONE_TTL);
    res.set("X-Cache", "MISS");
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not load the recipe" });
  }
});

/* ------------------------------------------------------------------
 * PUT /recipes/:recipeId
 * Edit a recipe (owner only)
 * ------------------------------------------------------------------ */
router.put("/:recipeId", verifyToken, async (req, res) => {
  try {
    const { recipeId } = req.params;
    if (!isValidId(recipeId)) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }

    const recipe = await RecipesModel.findById(recipeId);
    // Same answer for "missing" and "not yours", so ids cannot be probed
    if (!recipe || String(recipe.userOwner) !== req.userId) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const data = buildRecipeData(req.body);
    const problem = validateRecipeData(data);
    if (problem) {
      return res.status(400).json({ message: problem });
    }

    recipe.set(data);
    const updated = await recipe.save();
    await cacheDel(userListKey(req.userId), recipeKey(recipeId));
    res.status(200).json({ updatedRecipe: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not update the recipe" });
  }
});

/* ------------------------------------------------------------------
 * DELETE /recipes/:recipeId
 * Delete a recipe (owner only) and remove it from the saved list
 * ------------------------------------------------------------------ */
router.delete("/:recipeId", verifyToken, async (req, res) => {
  try {
    const { recipeId } = req.params;
    if (!isValidId(recipeId)) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }

    const recipe = await RecipesModel.findById(recipeId);
    if (!recipe || String(recipe.userOwner) !== req.userId) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    await RecipesModel.deleteOne({ _id: recipeId });
    await UserModel.updateMany(
      { savedRecipes: recipeId },
      { $pull: { savedRecipes: recipeId } }
    );
    await cacheDel(userListKey(req.userId), recipeKey(recipeId));

    res.status(200).json({ message: "Recipe deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not delete the recipe" });
  }
});

/* ------------------------------------------------------------------
 * Router Export
 * ------------------------------------------------------------------ */
export { router as recipesRouter };