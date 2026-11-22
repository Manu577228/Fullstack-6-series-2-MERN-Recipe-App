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

import { createClient } from "redis";

/* ------------------------------------------------------------------
 * Optional Redis cache
 * - No REDIS_URL        -> caching is simply switched off
 * - Redis goes down     -> every call quietly falls back to MongoDB
 * The API never fails because of the cache.
 * ------------------------------------------------------------------ */
let client = null;
let warned = false;

if (process.env.REDIS_URL) {
  client = createClient({
    url: process.env.REDIS_URL,
    // Fail fast instead of queueing commands while Redis is unreachable
    disableOfflineQueue: true,
  });

  client.on("error", (err) => {
    if (!warned) {
      console.warn("Redis unavailable, caching paused:", err.message);
      warned = true;
    }
  });
  client.on("ready", () => {
    warned = false;
    console.log("Redis connected");
  });

  client.connect().catch(() => {});
} else {
  console.log("REDIS_URL not set, running without a cache");
}

const ready = () => Boolean(client && client.isReady);

export const cacheGet = async (key) => {
  if (!ready()) return null;
  try {
    const raw = await client.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const cacheSet = async (key, value, ttlSeconds) => {
  if (!ready()) return;
  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch {
    /* cache is best effort */
  }
};

// Accepts any number of keys: cacheDel(a, b)
export const cacheDel = async (...keys) => {
  if (!ready() || keys.length === 0) return;
  try {
    await client.del(keys);
  } catch {
    /* cache is best effort */
  }
};