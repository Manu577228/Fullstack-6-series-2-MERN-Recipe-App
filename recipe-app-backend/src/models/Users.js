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
 * User Schema
 * NOTE: this file must be named Users.js (capital U). The routes import
 * "../models/Users.js" and Linux servers are case sensitive.
 * ------------------------------------------------------------------ */
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },

  // ref matches the model name "Recipes"
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipes" }],
});

export const UserModel = mongoose.model("users", UserSchema);