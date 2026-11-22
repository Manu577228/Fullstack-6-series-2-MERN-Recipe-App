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

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useLogout } from "../hooks/useLogout";

/* ------------------------------------------------------------------
 * Styles (embedded, so no separate CSS file is needed)
 * Change --nb-accent to re-colour the whole navbar in one place.
 * ------------------------------------------------------------------ */
const styles = `
.nb-wrap {
  --nb-bg: rgba(17, 19, 26, 0.72);
  --nb-bg-solid: rgba(17, 19, 26, 0.92);
  --nb-surface: rgba(255, 255, 255, 0.05);
  --nb-border: rgba(255, 255, 255, 0.09);
  --nb-text: #eceef4;
  --nb-muted: #8b90a0;
  --nb-accent: #4f8cff;
  --nb-accent-hover: #6b9fff;

  position: relative;
  z-index: 1000;
  padding: 14px 16px 0;
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

.nb {
  position: relative;
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 10px 16px;
  border-radius: 18px;
  background: var(--nb-bg);
  border: 1px solid var(--nb-border);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

/* Brand */
.nb-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--nb-text);
  flex-shrink: 0;
}

.nb-logo {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: #fff;
  background: var(--nb-accent);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nb-logo svg {
  width: 22px;
  height: 22px;
}

.nb-brand:hover .nb-logo {
  transform: rotate(-8deg) scale(1.08);
}

.nb-brand-text {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.nb-dot {
  color: var(--nb-accent);
}

/* Panel */
.nb-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 28px;
}

.nb-links {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 13px;
  background: var(--nb-surface);
  border: 1px solid var(--nb-border);
}

/* Sliding pill */
.nb-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.1);
  transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1),
    width 0.45s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.2s ease;
  pointer-events: none;
}

.nb-link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 9px;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--nb-muted);
  text-decoration: none;
  transition: color 0.25s ease;
}

.nb-link:hover {
  color: var(--nb-text);
}

.nb-link.active {
  color: #fff;
}

.nb-link.active .nb-icon {
  color: var(--nb-accent);
}

.nb-icon {
  width: 17px;
  height: 17px;
  transition: color 0.25s ease;
}

/* Welcome pill (login / register page, logged out) */
.nb-welcome {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  border-radius: 999px;
  background: var(--nb-surface);
  border: 1px solid var(--nb-border);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--nb-muted);
  white-space: nowrap;
}

.nb-welcome strong {
  color: var(--nb-text);
  font-weight: 800;
  letter-spacing: 0.02em;
}

.nb-welcome-dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--nb-accent);
}

.nb-welcome-dot::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--nb-accent);
  animation: nb-ping 1.8s ease-out infinite;
}

@keyframes nb-ping {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(3); opacity: 0; }
}

@media (max-width: 480px) {
  .nb-welcome { padding: 8px 13px; font-size: 0.85rem; }
  .nb-welcome-long { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .nb-welcome-dot::after { animation: none; }
}

/* Keeps the login / logout button on the right, even with no links */
.nb-actions {
  margin-left: auto;
}

/* Buttons */
.nb-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 11px;
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.2s ease, background 0.25s ease, border-color 0.25s ease;
}

.nb-btn:active {
  transform: scale(0.97);
}

.nb-btn--primary {
  color: #fff;
  background: var(--nb-accent);
}

.nb-btn--primary:hover {
  background: var(--nb-accent-hover);
  color: #fff;
  transform: translateY(-1px);
}

.nb-btn--ghost {
  color: var(--nb-text);
  background: var(--nb-surface);
  border-color: var(--nb-border);
}

.nb-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: translateY(-1px);
}

/* Burger (mobile only) */
.nb-burger {
  display: none;
  margin-left: auto;
  width: 42px;
  height: 42px;
  border-radius: 11px;
  border: 1px solid var(--nb-border);
  background: var(--nb-surface);
  cursor: pointer;
  position: relative;
}

.nb-burger span {
  position: absolute;
  left: 11px;
  right: 11px;
  height: 2px;
  border-radius: 2px;
  background: var(--nb-text);
  transition: transform 0.3s ease, top 0.3s ease;
}

.nb-burger span:nth-child(1) { top: 16px; }
.nb-burger span:nth-child(2) { top: 24px; }

.nb-burger.is-open span:nth-child(1) { top: 20px; transform: rotate(45deg); }
.nb-burger.is-open span:nth-child(2) { top: 20px; transform: rotate(-45deg); }

@media (max-width: 820px) {
  .nb-burger { display: block; }

  .nb-panel {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    right: 0;
    margin: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    padding: 14px;
    border-radius: 18px;
    background: var(--nb-bg-solid);
    border: 1px solid var(--nb-border);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
    pointer-events: none;
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  .nb-panel.is-open {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }

  .nb-links {
    flex-direction: column;
    align-items: stretch;
    background: transparent;
    border: none;
    padding: 0;
  }

  .nb-indicator { display: none; }

  .nb-link { padding: 13px 14px; }

  .nb-link.active {
    background: rgba(255, 255, 255, 0.08);
  }

  .nb-actions { margin-left: 0; }

  .nb-btn {
    justify-content: center;
    padding: 13px 18px;
  }
}
`;

/* ------------------------------------------------------------------
 * Small inline icons (no extra dependency needed)
 * ------------------------------------------------------------------ */
const Icon = ({ children }) => (
  <svg
    className="nb-icon"
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

const HomeIcon = () => (
  <Icon>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </Icon>
);

const PlusIcon = () => (
  <Icon>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

const LoginIcon = () => (
  <Icon>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="M10 17l5-5-5-5M15 12H3" />
  </Icon>
);

const LogoutIcon = () => (
  <Icon>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </Icon>
);

/* ------------------------------------------------------------------
 * Navbar
 * ------------------------------------------------------------------ */
function CustomNavbar() {
  const [cookies] = useCookies(["access_token"]);
  const doLogout = useLogout();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const linksRef = useRef(null);
  const isLoggedIn = Boolean(cookies.access_token);
  const onAuthPage = location.pathname === "/auth";
  const showMenu = isLoggedIn || !onAuthPage;

  /* Close the mobile menu on route change */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /* Sliding pill that follows the active link */
  const moveIndicator = () => {
    const active = linksRef.current?.querySelector(".nb-link.active");
    if (active) {
      setIndicator({
        left: active.offsetLeft,
        width: active.offsetWidth,
        opacity: 1,
      });
    } else {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useLayoutEffect(() => {
    moveIndicator();
  }, [location.pathname, isLoggedIn]);

  useEffect(() => {
    window.addEventListener("resize", moveIndicator);
    return () => window.removeEventListener("resize", moveIndicator);
  }, []);

  /* Logout */
  const logout = () => {
    setOpen(false);
    doLogout();
  };

  return (
    <header className="nb-wrap">
      <style>{styles}</style>

      <nav className="nb">
        {/* Brand */}
        <Link to="/" className="nb-brand" aria-label="MBBN Home">
          <span className="nb-logo">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 13a6 6 0 1 1 12 0v1H6v-1Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M5 18h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 5V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="nb-brand-text">
            MBBN<span className="nb-dot">.</span>
          </span>
        </Link>

        {/* Mobile toggle (nothing to open on the login page when logged out) */}
        {showMenu && (
          <button
            className={`nb-burger ${open ? "is-open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        )}

        {/* Logged-out visitors on the login page get a welcome message */}
        {!showMenu && (
          <div className="nb-welcome">
            <span className="nb-welcome-dot" aria-hidden="true" />
            <span>
              Welcome<span className="nb-welcome-long"> to </span>
              <strong className="nb-welcome-long">MBBN Recipes</strong>
            </span>
          </div>
        )}

        {/* Links + actions */}
        {showMenu && (
        <div className={`nb-panel ${open ? "is-open" : ""}`}>
          {/* Page links are only for logged-in users */}
          {isLoggedIn && (
            <div className="nb-links" ref={linksRef}>
              <span
                className="nb-indicator"
                style={{
                  transform: `translateX(${indicator.left}px)`,
                  width: indicator.width,
                  opacity: indicator.opacity,
                }}
              />
              <NavLink to="/" end className="nb-link">
                <HomeIcon />
                Home
              </NavLink>
              <NavLink to="/create-recipe" className="nb-link">
                <PlusIcon />
                Create Recipe
              </NavLink>
            </div>
          )}

          <div className="nb-actions">
            {!isLoggedIn ? (
              <Link to="/auth" className="nb-btn nb-btn--primary">
                <LoginIcon />
                Login / Register
              </Link>
            ) : (
              <button onClick={logout} className="nb-btn nb-btn--ghost">
                <LogoutIcon />
                Logout
              </button>
            )}
          </div>
        </div>
        )}
      </nav>
    </header>
  );
}

export default CustomNavbar;