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

import { useCallback } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------
 * useLogout
 * One place that clears the login (cookie + saved id) and sends the
 * user to the login page. Used by the navbar and by every page that
 * gets a 401 from the server (expired or invalid token).
 * ------------------------------------------------------------------ */
export const useLogout = () => {
  const [, , removeCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  return useCallback(() => {
    removeCookie("access_token", { path: "/" });
    window.localStorage.removeItem("userID");
    navigate("/auth");
  }, [removeCookie, navigate]);
};