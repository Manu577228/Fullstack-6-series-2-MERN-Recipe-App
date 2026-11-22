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

import mongoose from "mongoose";

/* ------------------------------------------------------------------
 * Recipe Schema
 * Length limits match the server validation and the form counters.
 * ------------------------------------------------------------------ */
const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },

    description: { type: String, default: "", trim: true, maxlength: 240 },

    ingredients: [{ type: String, required: true, trim: true, maxlength: 200 }],

    instructions: { type: String, required: true, maxlength: 5000 },

    imageUrl: { type: String, required: true, trim: true },

    // Cooking time (in minutes)
    cookingTime: { type: Number, required: true, min: 1, max: 1440 },

    // The user who owns the recipe. Indexed because every list query filters on it
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const RecipesModel = mongoose.model("Recipes", recipeSchema);