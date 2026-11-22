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

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { API_URL } from "../config";
import { useLogout } from "../hooks/useLogout";

/* ------------------------------------------------------------------
 * Styles (embedded, so no separate CSS file is needed)
 * Change --cr-accent to re-colour the whole page in one place.
 * ------------------------------------------------------------------ */
const styles = `
html { scrollbar-gutter: stable; }

.cr-page,
.cr-page *,
.cr-page *::before,
.cr-page *::after {
  box-sizing: border-box;
}

.cr-page {
  --cr-bg: #0b0d12;
  --cr-card: #11131a;
  --cr-surface: rgba(255, 255, 255, 0.05);
  --cr-border: rgba(255, 255, 255, 0.09);
  --cr-text: #eceef4;
  --cr-muted: #8b90a0;
  --cr-accent: #4f8cff;
  --cr-accent-hover: #6b9fff;
  --cr-error: #ff6b6b;
  --cr-success: #3ddc97;

  min-height: calc(100vh - 76px);
  min-height: calc(100dvh - 76px);
  padding: clamp(20px, 5vh, 56px) 16px 72px;
  background: var(--cr-bg);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--cr-text);
}

.cr-shell {
  max-width: 1120px;
  margin: 0 auto;
}

/* Header */
.cr-head {
  margin-bottom: 26px;
  animation: cr-fade 0.4s ease both;
}

.cr-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  margin-bottom: 14px;
  border-radius: 999px;
  background: var(--cr-surface);
  border: 1px solid var(--cr-border);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--cr-muted);
}

.cr-eyebrow i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cr-accent);
}

.cr-title {
  margin: 0 0 8px;
  font-size: clamp(1.7rem, 4vw, 2.4rem);
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.cr-title span { color: var(--cr-accent); }

.cr-sub {
  margin: 0;
  max-width: 560px;
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--cr-muted);
}

@keyframes cr-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Layout */
.cr-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  align-items: start;
}

.cr-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  animation: cr-fade 0.45s ease both;
}

/* Section cards */
.cr-card {
  padding: 24px 24px 26px;
  border-radius: 20px;
  background: var(--cr-card);
  border: 1px solid var(--cr-border);
}

.cr-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.cr-step {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: rgba(79, 140, 255, 0.14);
  color: var(--cr-accent);
  font-size: 0.85rem;
  font-weight: 800;
}

.cr-card-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.cr-card-hint {
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: var(--cr-muted);
}

/* Fields */
.cr-field + .cr-field { margin-top: 18px; }

.cr-label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
}

.cr-field label,
.cr-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--cr-muted);
}

.cr-count {
  font-size: 0.74rem;
  color: #5d6272;
}

.cr-input,
.cr-textarea {
  width: 100%;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid var(--cr-border);
  background: var(--cr-surface);
  color: var(--cr-text);
  font-family: inherit;
  font-size: 16px; /* stops iOS zoom */
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.cr-input { height: 48px; }

.cr-textarea {
  padding: 13px 14px;
  min-height: 120px;
  line-height: 1.55;
  resize: vertical;
}

.cr-input::placeholder,
.cr-textarea::placeholder { color: #5d6272; }

.cr-input:focus,
.cr-textarea:focus {
  border-color: var(--cr-accent);
  background: rgba(79, 140, 255, 0.06);
  box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.18);
}

/* Ingredients */
.cr-ing-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cr-ing-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cr-ing-num {
  width: 26px;
  flex-shrink: 0;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #5d6272;
}

.cr-icon-btn {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
  border: 1px solid var(--cr-border);
  background: var(--cr-surface);
  color: var(--cr-muted);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.cr-icon-btn:hover:not(:disabled) {
  color: var(--cr-error);
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
}

.cr-icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.cr-icon-btn svg { width: 18px; height: 18px; }

.cr-add {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 11px 16px;
  border-radius: 11px;
  border: 1px dashed rgba(79, 140, 255, 0.5);
  background: rgba(79, 140, 255, 0.07);
  color: var(--cr-accent);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.cr-add:hover {
  background: rgba(79, 140, 255, 0.14);
  border-color: var(--cr-accent);
}

.cr-add svg { width: 17px; height: 17px; }

/* Time stepper */
.cr-time {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cr-step-btn {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 12px;
  border: 1px solid var(--cr-border);
  background: var(--cr-surface);
  color: var(--cr-text);
  font-family: inherit;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.cr-step-btn:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.2);
}

.cr-time-input {
  position: relative;
  flex: 1;
}

.cr-time-input .cr-input {
  padding-right: 60px;
  text-align: center;
  font-weight: 700;
  -moz-appearance: textfield;
}

.cr-time-input .cr-input::-webkit-outer-spin-button,
.cr-time-input .cr-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.cr-unit {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--cr-muted);
  pointer-events: none;
}

.cr-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.cr-chip {
  padding: 7px 13px;
  border-radius: 999px;
  border: 1px solid var(--cr-border);
  background: var(--cr-surface);
  color: var(--cr-muted);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.cr-chip:hover { color: var(--cr-text); border-color: rgba(255, 255, 255, 0.2); }

.cr-chip.is-on {
  color: #fff;
  background: var(--cr-accent);
  border-color: var(--cr-accent);
}

/* Message slot (fixed height, so nothing jumps) */
.cr-slot {
  min-height: 46px;
  display: flex;
  align-items: stretch;
}

.cr-msg {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border-radius: 11px;
  font-size: 0.88rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.3;
}

.cr-msg--error {
  color: var(--cr-error);
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.28);
}

.cr-msg--success {
  color: var(--cr-success);
  background: rgba(61, 220, 151, 0.1);
  border: 1px solid rgba(61, 220, 151, 0.28);
}

/* Actions */
.cr-actions {
  display: flex;
  gap: 12px;
}

.cr-submit {
  flex: 1;
  height: 54px;
  border: 0;
  border-radius: 14px;
  background: var(--cr-accent);
  color: #fff;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.25s ease, opacity 0.2s ease;
}

.cr-submit:hover:not(:disabled) { background: var(--cr-accent-hover); }
.cr-submit:active:not(:disabled) { opacity: 0.9; }
.cr-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.cr-submit.is-done { background: var(--cr-success); color: #06281a; opacity: 1; }

.cr-cancel {
  height: 54px;
  padding: 0 24px;
  border-radius: 14px;
  border: 1px solid var(--cr-border);
  background: var(--cr-surface);
  color: var(--cr-text);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.cr-cancel:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.2);
}

.cr-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

/* Loading / error panel (edit mode) */
.cr-state {
  max-width: 440px;
  margin: clamp(30px, 10vh, 100px) auto 0;
  padding: 40px 28px 32px;
  text-align: center;
  border-radius: 22px;
  background: var(--cr-card);
  border: 1px solid var(--cr-border);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}

.cr-state h2 { margin: 0 0 8px; font-size: 1.25rem; font-weight: 800; }
.cr-state p { margin: 0 0 22px; font-size: 0.93rem; line-height: 1.55; color: var(--cr-muted); }
.cr-state .cr-submit { width: 100%; flex: none; }

.cr-spinner {
  width: 34px;
  height: 34px;
  margin: 0 auto 16px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.12);
  border-top-color: var(--cr-accent);
  animation: cr-spin 0.8s linear infinite;
}

@keyframes cr-spin { to { transform: rotate(360deg); } }

/* Live preview */
.cr-aside {
  position: sticky;
  top: 100px;
  animation: cr-fade 0.5s ease both;
}

.cr-aside-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 4px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cr-muted);
}

.cr-aside-label i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cr-success);
}

.cr-preview {
  overflow: hidden;
  border-radius: 20px;
  background: var(--cr-card);
  border: 1px solid var(--cr-border);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}

.cr-pv-media {
  position: relative;
  aspect-ratio: 16 / 10;
  background: #171a23;
  display: grid;
  place-items: center;
  color: #3b4050;
}

.cr-pv-media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cr-pv-media svg { width: 44px; height: 44px; }

.cr-pv-time {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border-radius: 999px;
  background: rgba(11, 13, 18, 0.85);
  border: 1px solid var(--cr-border);
  font-size: 0.78rem;
  font-weight: 700;
  color: #fff;
}

.cr-pv-time svg { width: 14px; height: 14px; color: var(--cr-accent); }

.cr-pv-body { padding: 18px 18px 20px; }

.cr-pv-name {
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}

.cr-pv-name.is-empty,
.cr-pv-desc.is-empty { color: #5d6272; }

.cr-pv-desc {
  margin: 0 0 14px;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--cr-muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
}

.cr-pv-ings {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 28px;
}

.cr-pv-ing {
  max-width: 100%;
  padding: 5px 10px;
  border-radius: 8px;
  background: var(--cr-surface);
  border: 1px solid var(--cr-border);
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--cr-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cr-pv-more { color: var(--cr-accent); border-color: rgba(79, 140, 255, 0.3); }

.cr-pv-foot {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--cr-border);
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: var(--cr-muted);
}

.cr-pv-foot b { color: var(--cr-text); }

/* Responsive */
@media (max-width: 980px) {
  .cr-grid { grid-template-columns: minmax(0, 1fr); }
  .cr-aside { position: static; order: -1; }
  .cr-pv-media { aspect-ratio: 16 / 8; }
}

@media (max-width: 560px) {
  .cr-page { padding: 16px 12px 56px; }
  .cr-card { padding: 20px 16px 22px; border-radius: 18px; }
  .cr-ing-num { display: none; }
  .cr-cancel { padding: 0 18px; }
}

@media (prefers-reduced-motion: reduce) {
  .cr-head, .cr-form, .cr-aside { animation: none; }
  .cr-spinner { animation-duration: 1.6s; }
}
`;

/* ------------------------------------------------------------------
 * Small inline icons
 * ------------------------------------------------------------------ */
const Svg = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const PlusIcon = () => (
  <Svg>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

const TrashIcon = () => (
  <Svg>
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    <path d="M9 7V4h6v3" />
  </Svg>
);

const ClockIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

const ImageIcon = () => (
  <Svg>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M21 16l-5-5-8 8" />
  </Svg>
);

/* ------------------------------------------------------------------
 * CreateRecipe (page) - creates a recipe, or edits one when the
 * URL is /edit-recipe/:recipeId
 * ------------------------------------------------------------------ */
const TIME_PRESETS = [15, 30, 45, 60, 90];
const NAME_MAX = 60;
const DESC_MAX = 240;

const emptyRecipe = {
  name: "",
  description: "",
  ingredients: [{ id: 0, text: "" }],
  instructions: "",
  imageUrl: "",
  cookingTime: "",
};

function CreateRecipe() {
  const userID = useGetUserID();
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const logout = useLogout();
  const { recipeId } = useParams();
  const isEdit = Boolean(recipeId);

  const idRef = useRef(1);
  const newIngredient = () => ({ id: idRef.current++, text: "" });

  const [recipe, setRecipe] = useState(emptyRecipe);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [badImage, setBadImage] = useState("");
  const [loadingRecipe, setLoadingRecipe] = useState(isEdit);
  const [loadError, setLoadError] = useState("");

  /* Stop the "go home" redirect if the user leaves the page first */
  const redirectTimer = useRef(null);
  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  /* ---------- edit mode: load the recipe ---------- */
  useEffect(() => {
    if (!isEdit) return undefined;
    let alive = true;

    const load = async () => {
      setLoadingRecipe(true);
      setLoadError("");
      try {
        const res = await axios.get(
          `${API_URL}/recipes/${recipeId}`,
          { headers: { authorization: cookies.access_token } }
        );
        const r = res.data;
        if (!alive) return;

        if (!r || String(r.userOwner) !== String(userID)) {
          setLoadError("You can only edit your own recipes.");
          return;
        }

        const list = r.ingredients && r.ingredients.length ? r.ingredients : [""];
        setRecipe({
          name: r.name || "",
          description: r.description || "",
          ingredients: list.map((text) => ({ id: idRef.current++, text })),
          instructions: r.instructions || "",
          imageUrl: r.imageUrl || "",
          cookingTime: r.cookingTime ? String(r.cookingTime) : "",
        });
      } catch (error) {
        console.error(error);
        if (!alive) return;
        const status = error?.response?.status;
        if (status === 401) {
          logout();
          return;
        }
        setLoadError(
          status === 404
            ? "This recipe does not exist or is not yours."
            : "Could not load this recipe."
        );
      } finally {
        if (alive) setLoadingRecipe(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [isEdit, recipeId, userID]);

  /* ---------- handlers ---------- */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = { ...ingredients[index], text: value };
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, newIngredient()],
    });
  };

  const handleRemoveIngredient = (index) => {
    if (recipe.ingredients.length === 1) return;
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((_, i) => i !== index),
    });
  };

  const setTime = (value) => {
    const n = Math.max(0, Math.min(1440, Number(value) || 0));
    setRecipe({ ...recipe, cookingTime: n === 0 ? "" : String(n) });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const cleanIngredients = recipe.ingredients
      .map((i) => i.text.trim())
      .filter(Boolean);

    if (!cookies.access_token) {
      setErrorMessage("Please log in first.");
      return;
    }
    if (!recipe.name.trim()) {
      setErrorMessage("Give your recipe a name.");
      return;
    }
    if (cleanIngredients.length === 0) {
      setErrorMessage("Add at least one ingredient.");
      return;
    }
    if (!recipe.instructions.trim()) {
      setErrorMessage("Add the cooking instructions.");
      return;
    }
    if (!recipe.imageUrl.trim()) {
      setErrorMessage("Add an image URL for the recipe.");
      return;
    }
    if (!/^https?:\/\//i.test(recipe.imageUrl.trim())) {
      setErrorMessage("The image URL must start with http:// or https://");
      return;
    }
    const minutes = Number(recipe.cookingTime);
    if (!minutes || minutes < 1 || minutes > 1440) {
      setErrorMessage("Set the cooking time between 1 and 1440 minutes.");
      return;
    }

    const payload = {
      name: recipe.name.trim(),
      description: recipe.description.trim(),
      ingredients: cleanIngredients,
      instructions: recipe.instructions.trim(),
      imageUrl: recipe.imageUrl.trim(),
      cookingTime: Math.round(Number(recipe.cookingTime)),
    };
    const config = { headers: { authorization: cookies.access_token } };

    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`${API_URL}/recipes/${recipeId}`, payload, config);
      } else {
        await axios.post(`${API_URL}/recipes`, payload, config);
      }

      setDone(true);
      redirectTimer.current = setTimeout(() => navigate("/"), 900);
    } catch (error) {
      console.error(error);
      // 401 means the token is missing, invalid or expired: log out cleanly
      if (error?.response?.status === 401) {
        logout();
        return;
      }
      const data = error?.response?.data;
      if (data && typeof data === "object" && data.message) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage(
          isEdit
            ? "Could not save your changes. Please try again."
            : "Could not create the recipe. Please try again."
        );
      }
      setLoading(false);
    }
  };

  /* ---------- edit mode: loading and error panels ---------- */
  if (isEdit && loadingRecipe) {
    return (
      <main className="cr-page">
        <style>{styles}</style>
        <div className="cr-state" aria-busy="true">
          <div className="cr-spinner" />
          <h2>Loading recipe</h2>
          <p>Getting your recipe ready to edit...</p>
        </div>
      </main>
    );
  }

  if (isEdit && loadError) {
    return (
      <main className="cr-page">
        <style>{styles}</style>
        <div className="cr-state">
          <h2>Cannot edit this recipe</h2>
          <p>{loadError}</p>
          <button type="button" className="cr-submit" onClick={() => navigate("/")}>
            Back to home
          </button>
        </div>
      </main>
    );
  }

  /* ---------- preview data ---------- */
  const previewIngredients = recipe.ingredients
    .map((i) => i.text.trim())
    .filter(Boolean);
  const shownIngredients = previewIngredients.slice(0, 5);
  const extra = previewIngredients.length - shownIngredients.length;
  const imageUrl = recipe.imageUrl.trim();
  const showImage = imageUrl && badImage !== imageUrl;
  const timeNumber = Number(recipe.cookingTime) || 0;

  return (
    <main className="cr-page">
      <style>{styles}</style>

      <div className="cr-shell">
        <header className="cr-head">
          <span className="cr-eyebrow">
            <i /> {isEdit ? "EDIT RECIPE" : "NEW RECIPE"}
          </span>
          <h1 className="cr-title">
            {isEdit ? "Edit your " : "Create your "}
            <span>recipe</span>
          </h1>
          <p className="cr-sub">
            {isEdit
              ? "Update any detail and watch the card on the side change live. Hit save when you are happy."
              : "Fill in the details and watch the card on the side update live. Add a great photo, it makes all the difference."}
          </p>
        </header>

        <div className="cr-grid">
          {/* ---------------- Form ---------------- */}
          <form className="cr-form" onSubmit={handleSubmit} noValidate>
            {/* 1. Basics */}
            <section className="cr-card">
              <div className="cr-card-head">
                <span className="cr-step">1</span>
                <div>
                  <h2 className="cr-card-title">The basics</h2>
                  <p className="cr-card-hint">What are we cooking?</p>
                </div>
              </div>

              <div className="cr-field">
                <div className="cr-label-row">
                  <label htmlFor="name">Name</label>
                  <span className="cr-count">
                    {recipe.name.length}/{NAME_MAX}
                  </span>
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="cr-input"
                  value={recipe.name}
                  onChange={handleChange}
                  maxLength={NAME_MAX}
                  placeholder="e.g. Creamy garlic pasta"
                  autoComplete="off"
                />
              </div>

              <div className="cr-field">
                <div className="cr-label-row">
                  <label htmlFor="description">Description</label>
                  <span className="cr-count">
                    {recipe.description.length}/{DESC_MAX}
                  </span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  className="cr-textarea"
                  style={{ minHeight: 96 }}
                  value={recipe.description}
                  onChange={handleChange}
                  maxLength={DESC_MAX}
                  placeholder="A short, tasty summary of the dish"
                />
              </div>
            </section>

            {/* 2. Ingredients */}
            <section className="cr-card">
              <div className="cr-card-head">
                <span className="cr-step">2</span>
                <div>
                  <h2 className="cr-card-title">Ingredients</h2>
                  <p className="cr-card-hint">One ingredient per line.</p>
                </div>
              </div>

              <div className="cr-ing-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <div className="cr-ing-row" key={ingredient.id}>
                    <span className="cr-ing-num">{index + 1}</span>
                    <input
                      type="text"
                      name="ingredients"
                      className="cr-input"
                      value={ingredient.text}
                      onChange={(event) => handleIngredientChange(event, index)}
                      placeholder={
                        index === 0 ? "e.g. 200g spaghetti" : "Add another ingredient"
                      }
                      aria-label={`Ingredient ${index + 1}`}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className="cr-icon-btn"
                      onClick={() => handleRemoveIngredient(index)}
                      disabled={recipe.ingredients.length === 1}
                      aria-label={`Remove ingredient ${index + 1}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" className="cr-add" onClick={handleAddIngredient}>
                <PlusIcon />
                Add ingredient
              </button>
            </section>

            {/* 3. Instructions */}
            <section className="cr-card">
              <div className="cr-card-head">
                <span className="cr-step">3</span>
                <div>
                  <h2 className="cr-card-title">Instructions</h2>
                  <p className="cr-card-hint">Walk us through it, step by step.</p>
                </div>
              </div>

              <div className="cr-field">
                <label className="cr-label" htmlFor="instructions" style={{ display: "none" }}>
                  Instructions
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  className="cr-textarea"
                  style={{ minHeight: 170 }}
                  value={recipe.instructions}
                  onChange={handleChange}
                  placeholder={"1. Boil the pasta until al dente.\n2. Sauté garlic in butter.\n3. Stir in the cream and toss together."}
                />
              </div>
            </section>

            {/* 4. Photo and time */}
            <section className="cr-card">
              <div className="cr-card-head">
                <span className="cr-step">4</span>
                <div>
                  <h2 className="cr-card-title">Photo and time</h2>
                  <p className="cr-card-hint">The finishing touches.</p>
                </div>
              </div>

              <div className="cr-field">
                <div className="cr-label-row">
                  <label htmlFor="imageUrl">Image URL</label>
                </div>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  className="cr-input"
                  value={recipe.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  autoComplete="off"
                />
              </div>

              <div className="cr-field">
                <div className="cr-label-row">
                  <label htmlFor="cookingTime">Cooking time</label>
                </div>
                <div className="cr-time">
                  <button
                    type="button"
                    className="cr-step-btn"
                    onClick={() => setTime(timeNumber - 5)}
                    aria-label="Decrease by 5 minutes"
                  >
                    −
                  </button>
                  <div className="cr-time-input">
                    <input
                      type="number"
                      inputMode="numeric"
                      id="cookingTime"
                      name="cookingTime"
                      className="cr-input"
                      value={recipe.cookingTime}
                      onChange={handleChange}
                      min="0"
                      placeholder="0"
                    />
                    <span className="cr-unit">min</span>
                  </div>
                  <button
                    type="button"
                    className="cr-step-btn"
                    onClick={() => setTime(timeNumber + 5)}
                    aria-label="Increase by 5 minutes"
                  >
                    +
                  </button>
                </div>
                <div className="cr-chips">
                  {TIME_PRESETS.map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={`cr-chip ${timeNumber === t ? "is-on" : ""}`}
                      onClick={() => setTime(t)}
                    >
                      {t} min
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Message + actions */}
            <div className="cr-slot" aria-live="polite">
              {errorMessage ? (
                <div className="cr-msg cr-msg--error">{errorMessage}</div>
              ) : done ? (
                <div className="cr-msg cr-msg--success">
                  {isEdit ? "Changes saved! Taking you home..." : "Recipe created! Taking you home..."}
                </div>
              ) : null}
            </div>

            <div className="cr-actions">
              {isEdit && (
                <button
                  type="button"
                  className="cr-cancel"
                  onClick={() => navigate("/")}
                  disabled={loading || done}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className={`cr-submit ${done ? "is-done" : ""}`}
                disabled={loading || done}
              >
                {done
                  ? isEdit
                    ? "Changes saved"
                    : "Recipe created"
                  : loading
                  ? isEdit
                    ? "Saving changes..."
                    : "Creating recipe..."
                  : isEdit
                  ? "Save changes"
                  : "Create Recipe"}
              </button>
            </div>
          </form>

          {/* ---------------- Live preview ---------------- */}
          <aside className="cr-aside" aria-label="Recipe preview">
            <p className="cr-aside-label">
              <i /> Live preview
            </p>

            <article className="cr-preview">
              <div className="cr-pv-media">
                {showImage ? (
                  <img
                    key={imageUrl}
                    src={imageUrl}
                    alt=""
                    onError={() => setBadImage(imageUrl)}
                  />
                ) : (
                  <ImageIcon />
                )}
                {timeNumber > 0 && (
                  <span className="cr-pv-time">
                    <ClockIcon />
                    {timeNumber} min
                  </span>
                )}
              </div>

              <div className="cr-pv-body">
                <h3 className={`cr-pv-name ${recipe.name.trim() ? "" : "is-empty"}`}>
                  {recipe.name.trim() || "Your recipe title"}
                </h3>
                <p className={`cr-pv-desc ${recipe.description.trim() ? "" : "is-empty"}`}>
                  {recipe.description.trim() ||
                    "Your short description will show up here."}
                </p>

                <div className="cr-pv-ings">
                  {shownIngredients.length === 0 && (
                    <span className="cr-pv-ing" style={{ color: "#5d6272" }}>
                      Ingredients appear here
                    </span>
                  )}
                  {shownIngredients.map((ing, i) => (
                    <span className="cr-pv-ing" key={i}>
                      {ing}
                    </span>
                  ))}
                  {extra > 0 && <span className="cr-pv-ing cr-pv-more">+{extra} more</span>}
                </div>

                <div className="cr-pv-foot">
                  <span>
                    <b>{previewIngredients.length}</b> ingredients
                  </span>
                  <span>
                    <b>{timeNumber || "–"}</b> min
                  </span>
                </div>
              </div>
            </article>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CreateRecipe;