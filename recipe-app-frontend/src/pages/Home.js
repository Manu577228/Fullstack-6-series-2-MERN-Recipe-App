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

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { API_URL } from "../config";
import { useLogout } from "../hooks/useLogout";

/* ------------------------------------------------------------------
 * Styles (embedded, so no separate CSS file is needed)
 * Change --hv-accent to re-colour the whole page in one place.
 * ------------------------------------------------------------------ */
const styles = `
html { scrollbar-gutter: stable; }

.hv-page,
.hv-page *,
.hv-page *::before,
.hv-page *::after,
.hv-modal-root,
.hv-modal-root *,
.hv-modal-root *::before,
.hv-modal-root *::after,
.hv-toast {
  box-sizing: border-box;
}

.hv-page,
.hv-modal-root,
.hv-toast {
  --hv-bg: #0b0d12;
  --hv-card: #11131a;
  --hv-surface: rgba(255, 255, 255, 0.05);
  --hv-border: rgba(255, 255, 255, 0.09);
  --hv-text: #eceef4;
  --hv-muted: #8b90a0;
  --hv-accent: #4f8cff;
  --hv-accent-hover: #6b9fff;
  --hv-error: #ff6b6b;
  --hv-success: #3ddc97;

  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--hv-text);
}

.hv-page {
  min-height: calc(100vh - 76px);
  min-height: calc(100dvh - 76px);
  padding: clamp(20px, 5vh, 56px) 16px 80px;
  background: var(--hv-bg);
}

.hv-shell {
  max-width: 1120px;
  margin: 0 auto;
}

@keyframes hv-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Hero */
.hv-hero {
  margin-bottom: 28px;
  animation: hv-fade 0.4s ease both;
}

.hv-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  margin-bottom: 14px;
  border-radius: 999px;
  background: var(--hv-surface);
  border: 1px solid var(--hv-border);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--hv-muted);
}

.hv-eyebrow i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--hv-accent);
}

.hv-title {
  margin: 0 0 10px;
  font-size: clamp(1.9rem, 5vw, 3rem);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.hv-title span { color: var(--hv-accent); }

.hv-sub {
  margin: 0;
  max-width: 560px;
  font-size: 1rem;
  line-height: 1.55;
  color: var(--hv-muted);
}

/* Toolbar */
.hv-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 26px;
  animation: hv-fade 0.45s ease both;
}

.hv-search {
  position: relative;
  flex: 1;
  max-width: 460px;
  display: flex;
  align-items: center;
}

.hv-search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--hv-muted);
  pointer-events: none;
  transition: color 0.2s ease;
}

.hv-search:focus-within .hv-search-icon { color: var(--hv-accent); }

.hv-search input {
  width: 100%;
  height: 48px;
  padding: 0 42px 0 42px;
  border-radius: 12px;
  border: 1px solid var(--hv-border);
  background: var(--hv-surface);
  color: var(--hv-text);
  font-family: inherit;
  font-size: 16px; /* stops iOS zoom */
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.hv-search input::placeholder { color: #5d6272; }

.hv-search input:focus {
  border-color: var(--hv-accent);
  background: rgba(79, 140, 255, 0.06);
  box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.18);
}

.hv-clear {
  position: absolute;
  right: 7px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--hv-muted);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.hv-clear:hover { color: var(--hv-text); background: rgba(255, 255, 255, 0.06); }
.hv-clear svg { width: 16px; height: 16px; }

/* Segmented tabs (2 or 3 columns, set inline) */
.hv-tabs {
  position: relative;
  display: grid;
  flex-shrink: 0;
  padding: 4px;
  border-radius: 13px;
  background: var(--hv-surface);
  border: 1px solid var(--hv-border);
}

.hv-tab-pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.1);
  transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
}

.hv-tab {
  position: relative;
  z-index: 1;
  min-width: 100px;
  padding: 10px 14px;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--hv-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.25s ease;
}

.hv-tab.is-active { color: #fff; }

.hv-tab small {
  margin-left: 6px;
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.72rem;
  font-weight: 700;
}

.hv-tab.is-active small { background: var(--hv-accent); }

/* Grid */
.hv-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

/* Card */
.hv-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20px;
  background: var(--hv-card);
  border: 1px solid var(--hv-border);
  cursor: pointer;
  outline: none;
  animation: hv-fade 0.45s ease both;
  transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.hv-card:hover,
.hv-card:focus-visible {
  border-color: rgba(79, 140, 255, 0.45);
  transform: translateY(-3px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.hv-media {
  position: relative;
  aspect-ratio: 16 / 11;
  background: #171a23;
  display: grid;
  place-items: center;
  color: #3b4050;
  overflow: hidden;
}

.hv-media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.hv-card:hover .hv-media img { transform: scale(1.05); }

.hv-media > svg { width: 44px; height: 44px; }

.hv-time {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border-radius: 999px;
  background: rgba(11, 13, 18, 0.85);
  border: 1px solid var(--hv-border);
  font-size: 0.78rem;
  font-weight: 700;
  color: #fff;
}

.hv-time svg { width: 14px; height: 14px; color: var(--hv-accent); }

/* Owner badge + quick actions on the card image */
.hv-badge {
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--hv-accent);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #fff;
}

.hv-owner {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  gap: 8px;
}

.hv-mini {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  border: 1px solid var(--hv-border);
  background: rgba(11, 13, 18, 0.85);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.hv-mini svg { width: 17px; height: 17px; }

.hv-mini:hover {
  background: var(--hv-accent);
  border-color: var(--hv-accent);
}

.hv-mini--danger:hover {
  background: var(--hv-error);
  border-color: var(--hv-error);
}

.hv-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 18px 18px 18px;
}

.hv-name {
  margin: 0 0 8px;
  font-size: 1.1rem;
  line-height: 1.3;
  font-weight: 800;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hv-snippet {
  margin: 0 0 16px;
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--hv-muted);
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hv-foot {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid var(--hv-border);
}

.hv-meta {
  font-size: 0.8rem;
  color: var(--hv-muted);
}

.hv-meta b { color: var(--hv-text); }

/* Save / Unsave button */
.hv-save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-width: 104px;
  padding: 9px 15px;
  border-radius: 11px;
  border: 1px solid transparent;
  background: var(--hv-accent);
  color: #fff;
  font-family: inherit;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease, opacity 0.2s ease;
}

.hv-save svg { width: 16px; height: 16px; }

.hv-save:hover:not(:disabled) { background: var(--hv-accent-hover); }
.hv-save:active:not(:disabled) { opacity: 0.9; }
.hv-save:disabled { cursor: default; opacity: 0.65; }

.hv-save.is-saved {
  color: var(--hv-success);
  background: rgba(61, 220, 151, 0.1);
  border-color: rgba(61, 220, 151, 0.3);
}

/* Saved turns into "Unsave" on hover (same width, so nothing shifts) */
.hv-save-off { display: none; }

.hv-save.is-saved:hover:not(:disabled) {
  color: var(--hv-error);
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.35);
}

.hv-save.is-saved:hover:not(:disabled) .hv-save-on { display: none; }
.hv-save.is-saved:hover:not(:disabled) .hv-save-off { display: inline; }

/* Skeletons */
.hv-skel {
  border-radius: 20px;
  background: var(--hv-card);
  border: 1px solid var(--hv-border);
  overflow: hidden;
}

.hv-skel-block,
.hv-skel-line {
  background: rgba(255, 255, 255, 0.04);
  animation: hv-pulse 1.4s ease-in-out infinite;
}

.hv-skel-block { aspect-ratio: 16 / 11; }
.hv-skel-body { padding: 18px; }
.hv-skel-line { height: 12px; border-radius: 6px; margin-bottom: 12px; }
.hv-skel-line.w60 { width: 60%; }
.hv-skel-line.w90 { width: 90%; }
.hv-skel-line.w40 { width: 40%; margin-bottom: 0; }

@keyframes hv-pulse {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
}

/* Empty / error state */
.hv-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 64px 20px;
  border-radius: 20px;
  background: var(--hv-card);
  border: 1px dashed var(--hv-border);
}

.hv-empty-icon {
  width: 54px;
  height: 54px;
  margin-bottom: 16px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: rgba(79, 140, 255, 0.12);
  color: var(--hv-accent);
}

.hv-empty-icon svg { width: 26px; height: 26px; }
.hv-empty h3 { margin: 0 0 6px; font-size: 1.15rem; font-weight: 800; }
.hv-empty p { margin: 0 0 18px; max-width: 380px; font-size: 0.92rem; line-height: 1.5; color: var(--hv-muted); }

.hv-btn {
  padding: 11px 20px;
  border: 0;
  border-radius: 11px;
  background: var(--hv-accent);
  color: #fff;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.25s ease;
}

.hv-btn:hover { background: var(--hv-accent-hover); }

/* Secondary + danger buttons */
.hv-ghost,
.hv-danger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  padding: 0 20px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
}

.hv-ghost svg,
.hv-danger svg { width: 17px; height: 17px; }

.hv-ghost {
  color: var(--hv-text);
  background: var(--hv-surface);
  border: 1px solid var(--hv-border);
}

.hv-ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.2);
}

.hv-danger {
  color: var(--hv-error);
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.hv-danger:hover:not(:disabled) {
  color: #fff;
  background: var(--hv-error);
  border-color: var(--hv-error);
}

.hv-ghost:disabled,
.hv-danger:disabled { opacity: 0.6; cursor: not-allowed; }

/* Modal */
.hv-modal-root {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(5, 6, 9, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: hv-fade 0.2s ease both;
}

.hv-modal-root--top { z-index: 2100; }

.hv-modal {
  position: relative;
  width: 100%;
  max-width: 760px;
  max-height: 92vh;
  max-height: 92dvh;
  overflow-y: auto;
  border-radius: 22px;
  background: var(--hv-card);
  border: 1px solid var(--hv-border);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}

.hv-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  border: 1px solid var(--hv-border);
  background: rgba(11, 13, 18, 0.85);
  color: var(--hv-text);
  cursor: pointer;
  transition: background 0.2s ease;
}

.hv-modal-close:hover { background: rgba(255, 255, 255, 0.12); }
.hv-modal-close svg { width: 18px; height: 18px; }

.hv-modal .hv-media { aspect-ratio: 16 / 8; border-radius: 0; }

.hv-modal-body { padding: 24px 26px 28px; }

.hv-modal-title {
  margin: 0 0 12px;
  font-size: clamp(1.4rem, 3.5vw, 1.9rem);
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.hv-modal-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 22px;
}

.hv-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 999px;
  background: var(--hv-surface);
  border: 1px solid var(--hv-border);
  font-size: 0.8rem;
  font-weight: 700;
}

.hv-pill svg { width: 14px; height: 14px; color: var(--hv-accent); }

.hv-section-title {
  margin: 0 0 12px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--hv-muted);
}

.hv-ings {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 26px;
  padding: 0;
  list-style: none;
}

.hv-ing {
  padding: 8px 13px;
  border-radius: 10px;
  background: var(--hv-surface);
  border: 1px solid var(--hv-border);
  font-size: 0.88rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.hv-steps {
  margin: 0 0 4px;
  padding: 0;
  list-style: none;
  counter-reset: step;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hv-steps li {
  position: relative;
  padding-left: 40px;
  font-size: 0.95rem;
  line-height: 1.65;
  color: #cfd2de;
  overflow-wrap: anywhere;
  counter-increment: step;
}

.hv-steps li::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: 1px;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(79, 140, 255, 0.14);
  color: var(--hv-accent);
  font-size: 0.78rem;
  font-weight: 800;
}

.hv-modal-actions {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--hv-border);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hv-modal-actions .hv-save {
  flex: 1 1 160px;
  height: 50px;
  border-radius: 12px;
  font-size: 0.96rem;
}

/* Delete confirmation */
.hv-confirm {
  width: 100%;
  max-width: 400px;
  padding: 28px 24px 22px;
  text-align: center;
  border-radius: 22px;
  background: var(--hv-card);
  border: 1px solid var(--hv-border);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}

.hv-confirm-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: rgba(255, 107, 107, 0.12);
  color: var(--hv-error);
}

.hv-confirm-icon svg { width: 26px; height: 26px; }
.hv-confirm h3 { margin: 0 0 8px; font-size: 1.2rem; font-weight: 800; }

.hv-confirm p {
  margin: 0 0 22px;
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--hv-muted);
  overflow-wrap: anywhere;
}

.hv-confirm p b { color: var(--hv-text); }

.hv-confirm-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* Toast */
.hv-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 3000;
  transform: translateX(-50%);
  max-width: calc(100vw - 32px);
  padding: 13px 18px;
  border-radius: 13px;
  background: #171a23;
  border: 1px solid var(--hv-border);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  animation: hv-fade 0.25s ease both;
}

.hv-toast--success { color: var(--hv-success); border-color: rgba(61, 220, 151, 0.35); }
.hv-toast--error { color: var(--hv-error); border-color: rgba(255, 107, 107, 0.35); }

/* Responsive */
@media (max-width: 980px) {
  .hv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 680px) {
  .hv-toolbar { flex-direction: column; align-items: stretch; }
  .hv-search { max-width: none; }
  .hv-tab { min-width: 0; }
}

@media (max-width: 600px) {
  .hv-page { padding: 16px 12px 64px; }
  .hv-grid { grid-template-columns: minmax(0, 1fr); gap: 18px; }
  .hv-modal-body { padding: 20px 18px 22px; }
  .hv-modal .hv-media { aspect-ratio: 16 / 10; }
}

@media (prefers-reduced-motion: reduce) {
  .hv-hero, .hv-toolbar, .hv-card, .hv-modal-root, .hv-toast,
  .hv-skel-block, .hv-skel-line { animation: none; }
  .hv-card, .hv-media img, .hv-tab-pill { transition: none; }
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

const SearchIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

const CloseIcon = () => (
  <Svg>
    <path d="M6 6l12 12M18 6L6 18" />
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

const EditIcon = () => (
  <Svg>
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
    <path d="M13.5 6.5l4 4" />
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

const BookmarkIcon = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 4h12v17l-6-4-6 4V4Z" />
  </svg>
);

const BowlIcon = () => (
  <Svg>
    <path d="M3 12h18a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8Z" />
    <path d="M8 8c0-1.5 1-1.5 1-3M12 8c0-1.5 1-1.5 1-3M16 8c0-1.5 1-1.5 1-3" />
  </Svg>
);

/* ------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------ */

/* Turns the instructions text into steps (strips "1." or "1)" prefixes) */
const toSteps = (text = "") =>
  text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:\d+[.)]|[-•*])\s*/, "").trim())
    .filter(Boolean);

/* ------------------------------------------------------------------
 * Save / Unsave button (shared by the cards and the modal)
 * ------------------------------------------------------------------ */
function SaveButton({ saved, busy, onClick }) {
  return (
    <button
      type="button"
      className={`hv-save ${saved ? "is-saved" : ""}`}
      onClick={onClick}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save recipe"}
    >
      <BookmarkIcon filled={saved} />
      {busy ? (
        saved ? "Removing..." : "Saving..."
      ) : saved ? (
        <>
          <span className="hv-save-on">Saved</span>
          <span className="hv-save-off">Unsave</span>
        </>
      ) : (
        "Save"
      )}
    </button>
  );
}

/* ------------------------------------------------------------------
 * Recipe image with a fallback
 * ------------------------------------------------------------------ */
function RecipeMedia({ recipe, children }) {
  const [broken, setBroken] = useState(false);
  const url = (recipe.imageUrl || "").trim();

  return (
    <div className="hv-media">
      {url && !broken ? (
        <img src={url} alt={recipe.name} loading="lazy" onError={() => setBroken(true)} />
      ) : (
        <ImageIcon />
      )}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------
 * Home (page)
 * ------------------------------------------------------------------ */
function Home() {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState(null);
  const [savingId, setSavingId] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const userID = useGetUserID();
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const logout = useLogout();

  const authConfig = { headers: { authorization: cookies.access_token } };
  const isOwner = (r) => Boolean(userID) && String(r.userOwner) === String(userID);

  const showToast = (type, text) => setToast({ type, text, id: Date.now() });

  /* Shows the server's message, or a friendly fallback */
  const handleError = (err, fallback) => {
    console.log(err);
    // 401 means the token is missing, invalid or expired: log out cleanly
    if (err?.response?.status === 401) {
      logout();
      return;
    }
    const data = err?.response?.data;
    if (data && typeof data === "object" && data.message) {
      showToast("error", data.message);
    } else {
      showToast("error", fallback);
    }
  };

  /* ---------- data ---------- */
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`${API_URL}/recipes`, {
        headers: { authorization: cookies.access_token },
      });
      setRecipes(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log(err);
      const status = err?.response?.status;
      if (status === 401) {
        // Token is missing or no longer valid: log out cleanly
        logout();
        return;
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [cookies.access_token, logout]);

  useEffect(() => {
    fetchRecipes();

    const fetchSavedRecipes = async () => {
      if (!userID) return;
      try {
        const res = await axios.get(
          `${API_URL}/recipes/savedRecipes/ids/${userID}`,
          authConfig
        );
        setSavedRecipes(res.data.savedRecipes || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  /* Save when not saved, unsave when saved */
  const toggleSave = async (recipe) => {
    if (!userID || !cookies.access_token) {
      navigate("/auth");
      return;
    }

    const wasSaved = isRecipeSaved(recipe._id);
    setSavingId(recipe._id);
    try {
      const res = wasSaved
        ? await axios.delete(
            `${API_URL}/recipes/saved/${recipe._id}`,
            authConfig
          )
        : await axios.put(
            `${API_URL}/recipes`,
            { recipeID: recipe._id },
            authConfig
          );
      setSavedRecipes(res.data.savedRecipes || []);
      showToast("success", wasSaved ? "Removed from saved" : "Saved to your list");
    } catch (err) {
      handleError(err, wasSaved ? "Could not unsave the recipe." : "Could not save the recipe.");
    } finally {
      setSavingId("");
    }
  };

  const deleteRecipe = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await axios.delete(
        `${API_URL}/recipes/${toDelete._id}`,
        authConfig
      );
      const deletedId = toDelete._id;
      setRecipes((prev) => prev.filter((r) => r._id !== deletedId));
      setSavedRecipes((prev) => prev.filter((id) => id !== deletedId));
      if (selected && selected._id === deletedId) setSelected(null);
      setToDelete(null);
      showToast("success", "Recipe deleted");
    } catch (err) {
      handleError(err, "Could not delete the recipe.");
    } finally {
      setDeleting(false);
    }
  };

  /* ---------- toast auto-hide ---------- */
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---------- modals: Esc to close + lock page scroll ---------- */
  useEffect(() => {
    if (!selected && !toDelete) return undefined;

    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (toDelete) {
        if (!deleting) setToDelete(null);
      } else {
        setSelected(null);
      }
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected, toDelete, deleting]);

  /* ---------- tabs + filtering ---------- */
  const savedCount = recipes.filter((r) => savedRecipes.includes(r._id)).length;

  const tabs = [
    { key: "all", label: "All", count: recipes.length },
    { key: "saved", label: "Saved", count: savedCount },
  ];
  const tabIndex = Math.max(0, tabs.findIndex((t) => t.key === tab));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      if (tab === "saved" && !savedRecipes.includes(r._id)) return false;
      if (!q) return true;
      const haystack = [r.name, r.description, ...(r.ingredients || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [recipes, savedRecipes, query, tab, userID]);

  const emptyTitle = query
    ? "No recipes match your search"
    : tab === "saved"
    ? "No saved recipes yet"
    : "You have not created a recipe yet";

  const emptyText = query
    ? "Try a different name or ingredient."
    : tab === "saved"
    ? "Tap Save on any recipe and it will show up here."
    : "Create your first recipe and it will show up here.";

  /* ---------- render ---------- */
  return (
    <main className="hv-page">
      <style>{styles}</style>

      <div className="hv-shell">
        <header className="hv-hero">
          <span className="hv-eyebrow">
            <i /> RECIPES
          </span>
          <h1 className="hv-title">
            Cook something <span>great</span> today
          </h1>
          <p className="hv-sub">
            Your private recipe book. Open a recipe to see the full
            ingredients and steps, and save your favourites for later.
          </p>
        </header>

        <div className="hv-toolbar">
          <div className="hv-search">
            <SearchIcon className="hv-search-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or ingredient"
              aria-label="Search recipes"
            />
            {query && (
              <button
                type="button"
                className="hv-clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <CloseIcon />
              </button>
            )}
          </div>

          <div
            className="hv-tabs"
            role="tablist"
            style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
          >
            <span
              className="hv-tab-pill"
              style={{
                width: `calc((100% - 8px) / ${tabs.length})`,
                transform: `translateX(${tabIndex * 100}%)`,
              }}
            />
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                className={`hv-tab ${tab === t.key ? "is-active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label} <small>{t.count}</small>
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="hv-grid" aria-busy="true">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div className="hv-skel" key={i}>
                <div className="hv-skel-block" />
                <div className="hv-skel-body">
                  <div className="hv-skel-line w60" />
                  <div className="hv-skel-line w90" />
                  <div className="hv-skel-line w40" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="hv-empty">
            <div className="hv-empty-icon">
              <BowlIcon />
            </div>
            <h3>Could not load recipes</h3>
            <p>Check your connection and try again in a moment.</p>
            <button type="button" className="hv-btn" onClick={fetchRecipes}>
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && visible.length === 0 && (
          <div className="hv-empty">
            <div className="hv-empty-icon">
              <BowlIcon />
            </div>
            <h3>{emptyTitle}</h3>
            <p>{emptyText}</p>
            {tab === "all" && !query ? (
              <button
                type="button"
                className="hv-btn"
                onClick={() => navigate("/create-recipe")}
              >
                Create a recipe
              </button>
            ) : (
              (query || tab !== "all") && (
                <button
                  type="button"
                  className="hv-btn"
                  onClick={() => {
                    setQuery("");
                    setTab("all");
                  }}
                >
                  Show all recipes
                </button>
              )
            )}
          </div>
        )}

        {/* Recipes */}
        {!loading && !error && visible.length > 0 && (
          <div className="hv-grid">
            {visible.map((recipe) => (
              <article
                key={recipe._id}
                className="hv-card"
                role="button"
                tabIndex={0}
                onClick={() => setSelected(recipe)}
                onKeyDown={(e) => {
                  // Ignore keys pressed on the buttons inside the card
                  if (e.target !== e.currentTarget) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(recipe);
                  }
                }}
              >
                <RecipeMedia recipe={recipe}>
                  {isOwner(recipe) && (
                    <>
                      <div className="hv-owner" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="hv-mini"
                          aria-label="Edit recipe"
                          title="Edit"
                          onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          className="hv-mini hv-mini--danger"
                          aria-label="Delete recipe"
                          title="Delete"
                          onClick={() => setToDelete(recipe)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </>
                  )}
                  {Number(recipe.cookingTime) > 0 && (
                    <span className="hv-time">
                      <ClockIcon />
                      {recipe.cookingTime} min
                    </span>
                  )}
                </RecipeMedia>

                <div className="hv-body">
                  <h2 className="hv-name">{recipe.name}</h2>
                  <p className="hv-snippet">
                    {recipe.description ||
                      (recipe.instructions || "").replace(/\s+/g, " ")}
                  </p>

                  <div className="hv-foot">
                    <span className="hv-meta">
                      <b>{(recipe.ingredients || []).length}</b> ingredients
                    </span>
                    <SaveButton
                      saved={isRecipeSaved(recipe._id)}
                      busy={savingId === recipe._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(recipe);
                      }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Recipe details */}
      {selected && (
        <div
          className="hv-modal-root"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.name}
        >
          <div className="hv-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hv-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <CloseIcon />
            </button>

            <RecipeMedia recipe={selected} />

            <div className="hv-modal-body">
              <h2 className="hv-modal-title">{selected.name}</h2>

              <div className="hv-modal-row">
                {Number(selected.cookingTime) > 0 && (
                  <span className="hv-pill">
                    <ClockIcon />
                    {selected.cookingTime} min
                  </span>
                )}
                <span className="hv-pill">
                  {(selected.ingredients || []).length} ingredients
                </span>
              </div>

              {selected.description && (
                <p
                  className="hv-sub"
                  style={{ marginBottom: 24, maxWidth: "none" }}
                >
                  {selected.description}
                </p>
              )}

              {(selected.ingredients || []).length > 0 && (
                <>
                  <h3 className="hv-section-title">Ingredients</h3>
                  <ul className="hv-ings">
                    {selected.ingredients.map((ing, i) => (
                      <li className="hv-ing" key={i}>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h3 className="hv-section-title">Instructions</h3>
              <ol className="hv-steps">
                {toSteps(selected.instructions).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>

              <div className="hv-modal-actions">
                <SaveButton
                  saved={isRecipeSaved(selected._id)}
                  busy={savingId === selected._id}
                  onClick={() => toggleSave(selected)}
                />
                {isOwner(selected) && (
                  <>
                    <button
                      type="button"
                      className="hv-ghost"
                      onClick={() => navigate(`/edit-recipe/${selected._id}`)}
                    >
                      <EditIcon />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="hv-danger"
                      onClick={() => setToDelete(selected)}
                    >
                      <TrashIcon />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {toDelete && (
        <div
          className="hv-modal-root hv-modal-root--top"
          onClick={() => !deleting && setToDelete(null)}
          role="alertdialog"
          aria-modal="true"
          aria-label="Delete recipe"
        >
          <div className="hv-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="hv-confirm-icon">
              <TrashIcon />
            </div>
            <h3>Delete this recipe?</h3>
            <p>
              <b>{toDelete.name}</b> will be permanently removed from your
              recipes and your saved list. This cannot be undone.
            </p>
            <div className="hv-confirm-actions">
              <button
                type="button"
                className="hv-ghost"
                onClick={() => setToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="hv-danger"
                onClick={deleteRecipe}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          key={toast.id}
          className={`hv-toast hv-toast--${toast.type}`}
          role="status"
          aria-live="polite"
        >
          {toast.text}
        </div>
      )}
    </main>
  );
}

export default Home;