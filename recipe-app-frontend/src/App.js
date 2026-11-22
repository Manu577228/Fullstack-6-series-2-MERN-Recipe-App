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

import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import { useCookies } from "react-cookie";
import "./App.css";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CreateRecipe from "./pages/CreateRecipe";
import Navbar from "./components/Navbar";

/* ------------------------------------------------------------------
 * Scrolls to the top whenever the page (route) changes
 * ------------------------------------------------------------------ */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ------------------------------------------------------------------
 * Route guards
 * RequireAuth : only for logged-in users, otherwise go to /auth
 * GuestOnly   : only for logged-out users, otherwise go home
 * ------------------------------------------------------------------ */
function RequireAuth({ children }) {
  const [cookies] = useCookies(["access_token"]);
  return cookies.access_token ? children : <Navigate to="/auth" replace />;
}

function GuestOnly({ children }) {
  const [cookies] = useCookies(["access_token"]);
  return cookies.access_token ? <Navigate to="/" replace /> : children;
}

/* ------------------------------------------------------------------
 * 404 page (same design system as the rest of the app)
 * ------------------------------------------------------------------ */
const notFoundStyles = `
.nf-page {
  min-height: calc(100vh - 76px);
  min-height: calc(100dvh - 76px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(40px, 16vh, 160px) 16px 48px;
  background: #0b0d12;
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #eceef4;
  text-align: center;
}

.nf-card {
  width: 100%;
  max-width: 440px;
  padding: 40px 28px 34px;
  border-radius: 22px;
  background: #11131a;
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}

.nf-code {
  margin: 0 0 8px;
  font-size: clamp(3.4rem, 14vw, 5rem);
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #4f8cff;
}

.nf-title {
  margin: 0 0 8px;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.nf-text {
  margin: 0 0 24px;
  font-size: 0.95rem;
  line-height: 1.55;
  color: #8b90a0;
}

.nf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 24px;
  border-radius: 12px;
  background: #4f8cff;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.25s ease;
}

.nf-btn:hover { background: #6b9fff; color: #fff; }
`;

function NotFound() {
  return (
    <main className="nf-page">
      <style>{notFoundStyles}</style>
      <section className="nf-card">
        <h1 className="nf-code">404</h1>
        <h2 className="nf-title">Page not found</h2>
        <p className="nf-text">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="nf-btn">
          Back to home
        </Link>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------
 * App
 * ------------------------------------------------------------------ */
function App() {
  return (
    <div className="App" style={{ textAlign: "left" }}>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/auth"
            element={
              <GuestOnly>
                <Auth />
              </GuestOnly>
            }
          />
          <Route
            path="/create-recipe"
            element={
              <RequireAuth>
                <CreateRecipe key="create" />
              </RequireAuth>
            }
          />
          <Route
            path="/edit-recipe/:recipeId"
            element={
              <RequireAuth>
                <CreateRecipe key="edit" />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;