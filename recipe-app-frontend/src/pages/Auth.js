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

import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

/* ------------------------------------------------------------------
 * Styles (embedded, so no separate CSS file is needed)
 * Change --au-accent to re-colour the whole page in one place.
 * ------------------------------------------------------------------ */
const styles = `
/* Stops the page from jumping sideways when a scrollbar appears */
html { scrollbar-gutter: stable; }

.au-page,
.au-page *,
.au-page *::before,
.au-page *::after {
  box-sizing: border-box;
}

.au-page {
  --au-bg: #0b0d12;
  --au-card: #11131a;
  --au-surface: rgba(255, 255, 255, 0.05);
  --au-border: rgba(255, 255, 255, 0.09);
  --au-text: #eceef4;
  --au-muted: #8b90a0;
  --au-accent: #4f8cff;
  --au-accent-hover: #6b9fff;
  --au-error: #ff6b6b;
  --au-success: #3ddc97;

  /* Card is anchored to the top, so it never moves when content changes */
  min-height: calc(100vh - 76px);
  min-height: calc(100dvh - 76px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(24px, 9vh, 96px) 16px 48px;
  background: var(--au-bg);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--au-text);
}

.au-card {
  width: 100%;
  max-width: 420px;
  padding: 32px 28px 28px;
  border-radius: 22px;
  background: var(--au-card);
  border: 1px solid var(--au-border);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  animation: au-fade 0.4s ease both;
}

@keyframes au-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Header: fixed height so the title/subtitle swap never changes the layout */
.au-head {
  text-align: center;
  margin-bottom: 24px;
}

.au-head-logo {
  width: 46px;
  height: 46px;
  margin: 0 auto 16px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: #fff;
  background: var(--au-accent);
}

.au-head-logo svg { width: 26px; height: 26px; }

.au-head-text { min-height: 72px; }

.au-title {
  margin: 0 0 6px;
  font-size: 1.6rem;
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.au-sub {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.45;
  color: var(--au-muted);
}

/* Segmented switch */
.au-tabs {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  margin-bottom: 20px;
  border-radius: 13px;
  background: var(--au-surface);
  border: 1px solid var(--au-border);
}

.au-tab-pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc(50% - 4px);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.1);
  transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
}

.au-tab-pill.is-register { transform: translateX(100%); }

.au-tab {
  position: relative;
  z-index: 1;
  padding: 10px 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--au-muted);
  cursor: pointer;
  transition: color 0.25s ease;
}

.au-tab.is-active { color: #fff; }

/* Form (opacity-only animation, no movement) */
.au-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  animation: au-fade 0.3s ease both;
}

/* Reserved message slot: same height whether a message shows or not */
.au-slot {
  min-height: 46px;
  display: flex;
  align-items: stretch;
}

.au-slot .au-msg { width: 100%; }

.au-field label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--au-muted);
}

.au-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.au-input-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--au-muted);
  pointer-events: none;
  transition: color 0.2s ease;
}

.au-input {
  width: 100%;
  height: 48px;
  padding: 0 44px 0 42px;
  border-radius: 12px;
  border: 1px solid var(--au-border);
  background: var(--au-surface);
  color: var(--au-text);
  font-family: inherit;
  font-size: 16px; /* 16px stops iOS from zooming in and shifting the page */
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.au-input::placeholder { color: #5d6272; }

.au-input:focus {
  border-color: var(--au-accent);
  background: rgba(79, 140, 255, 0.06);
  box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.18);
}

.au-input-wrap:focus-within .au-input-icon { color: var(--au-accent); }

.au-eye {
  position: absolute;
  right: 7px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--au-muted);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.au-eye:hover { color: var(--au-text); background: rgba(255, 255, 255, 0.06); }
.au-eye svg { width: 18px; height: 18px; }

/* Messages */
.au-msg {
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

.au-msg--error {
  color: var(--au-error);
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.28);
}

.au-msg--success {
  color: var(--au-success);
  background: rgba(61, 220, 151, 0.1);
  border: 1px solid rgba(61, 220, 151, 0.28);
}

/* Submit */
.au-submit {
  height: 50px;
  margin-top: 2px;
  border: 0;
  border-radius: 12px;
  background: var(--au-accent);
  color: #fff;
  font-family: inherit;
  font-size: 0.98rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.25s ease, opacity 0.2s ease;
}

.au-submit:hover:not(:disabled) { background: var(--au-accent-hover); }
.au-submit:active:not(:disabled) { opacity: 0.9; }
.au-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.au-foot {
  margin: 20px 0 0;
  min-height: 22px;
  text-align: center;
  font-size: 0.88rem;
  color: var(--au-muted);
}

.au-link {
  padding: 0;
  border: 0;
  background: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: 700;
  color: var(--au-accent);
  cursor: pointer;
}

.au-link:hover { color: var(--au-accent-hover); text-decoration: underline; }

/* Responsive */
@media (max-width: 480px) {
  .au-page { padding: 20px 14px 40px; }
  .au-card { padding: 26px 18px 22px; border-radius: 18px; }
  .au-title { font-size: 1.4rem; }
  .au-head-text { min-height: 68px; }
}

@media (max-height: 640px) {
  .au-page { padding-top: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .au-card, .au-form, .au-tab-pill { animation: none; transition: none; }
}
`;

/* ------------------------------------------------------------------
 * Small inline icons
 * ------------------------------------------------------------------ */
const Svg = ({ children, className }) => (
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
    {children}
  </svg>
);

const UserIcon = () => (
  <Svg className="au-input-icon">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </Svg>
);

const LockIcon = () => (
  <Svg className="au-input-icon">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);

const EyeIcon = () => (
  <Svg>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

const EyeOffIcon = () => (
  <Svg>
    <path d="M3 3l18 18" />
    <path d="M10.6 6.1A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4" />
    <path d="M6.6 6.6A17.4 17.4 0 0 0 2 12s3.6 7 10 7a10.7 10.7 0 0 0 4.3-.9" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </Svg>
);

/* ------------------------------------------------------------------
 * Reusable fields
 * ------------------------------------------------------------------ */
function TextField({ id, label, value, onChange, placeholder, autoComplete }) {
  return (
    <div className="au-field">
      <label htmlFor={id}>{label}</label>
      <div className="au-input-wrap">
        <UserIcon />
        <input
          id={id}
          type="text"
          className="au-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
        />
      </div>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="au-field">
      <label htmlFor={id}>{label}</label>
      <div className="au-input-wrap">
        <LockIcon />
        <input
          id={id}
          type={show ? "text" : "password"}
          className="au-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          className="au-eye"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Auth (page)
 * ------------------------------------------------------------------ */
function Auth() {
  const [mode, setMode] = useState("login");
  const [notice, setNotice] = useState("");

  const goLogin = (message = "") => {
    setNotice(message);
    setMode("login");
  };

  const goRegister = () => {
    setNotice("");
    setMode("register");
  };

  return (
    <main className="au-page">
      <style>{styles}</style>

      <section className="au-card">
        <div className="au-head">
          <div className="au-head-logo">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 13a6 6 0 1 1 12 0v1H6v-1Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M5 18h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 5V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="au-head-text">
            <h1 className="au-title">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="au-sub">
              {mode === "login"
                ? "Log in to save your recipes."
                : "Join in seconds and start cooking."}
            </p>
          </div>
        </div>

        <div className="au-tabs" role="tablist">
          <span className={`au-tab-pill ${mode === "register" ? "is-register" : ""}`} />
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={`au-tab ${mode === "login" ? "is-active" : ""}`}
            onClick={() => goLogin()}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={`au-tab ${mode === "register" ? "is-active" : ""}`}
            onClick={goRegister}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <Login notice={notice} />
        ) : (
          <Register onRegistered={goLogin} />
        )}

        <p className="au-foot">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button
            type="button"
            className="au-link"
            onClick={() => (mode === "login" ? goRegister() : goLogin())}
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------
 * Login
 * ------------------------------------------------------------------ */
function Login({ notice }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      // Save the id first so it is ready when the cookie triggers a re-render
      window.localStorage.setItem("userID", res.data.userID);
      // Cookie lifetime matches the 7 day token lifetime set on the server
      setCookies("access_token", res.data.token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      navigate("/");
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="au-form" onSubmit={onSubmit}>
      <div className="au-slot" aria-live="polite">
        {errorMessage ? (
          <div className="au-msg au-msg--error">{errorMessage}</div>
        ) : notice ? (
          <div className="au-msg au-msg--success">{notice}</div>
        ) : null}
      </div>

      <TextField
        id="login-username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        autoComplete="username"
      />
      <PasswordField
        id="login-password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        autoComplete="current-password"
      />

      <button type="submit" className="au-submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------
 * Register
 * ------------------------------------------------------------------ */
function Register({ onRegistered }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
      });
      onRegistered("Registration completed! Login now.");
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="au-form" onSubmit={onSubmit}>
      <div className="au-slot" aria-live="polite">
        {errorMessage && <div className="au-msg au-msg--error">{errorMessage}</div>}
      </div>

      <TextField
        id="register-username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your full name, e.g. Manu Bharadwaj"
        autoComplete="username"
      />
      <PasswordField
        id="register-password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password (min 6 characters)"
        autoComplete="new-password"
      />

      <button type="submit" className="au-submit" disabled={loading}>
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}

export default Auth;