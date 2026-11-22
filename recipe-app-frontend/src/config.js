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

/* ------------------------------------------------------------------
 * Backend address. Set REACT_APP_API_URL when you build for production
 * (Create React App only exposes variables that start with REACT_APP_).
 * ------------------------------------------------------------------ */

const DEFAULT_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://manu-recipe-api.onrender.com"
    : "http://localhost:3001";

export const API_URL = (
  process.env.REACT_APP_API_URL || DEFAULT_API_URL
).replace(/\/$/, "");