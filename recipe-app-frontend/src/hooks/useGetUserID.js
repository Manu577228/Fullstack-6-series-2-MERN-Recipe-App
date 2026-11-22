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

import { useCookies } from "react-cookie";

/* ------------------------------------------------------------------
 * Reads the user id out of the JWT payload ({ id }) that the backend
 * signs at login. Returns null if the token is missing or malformed.
 * ------------------------------------------------------------------ */
const idFromToken = (token) => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).id || null;
  } catch {
    return null;
  }
};

/* ------------------------------------------------------------------
 * useGetUserID
 * Returns the logged-in user's ID (taken from the login token, with
 * localStorage as a fallback), or null if nobody is logged in.
 * ------------------------------------------------------------------ */
export const useGetUserID = () => {
  const [cookies] = useCookies(["access_token"]);

  if (!cookies.access_token) return null;

  return (
    idFromToken(cookies.access_token) ||
    window.localStorage.getItem("userID")
  );
};