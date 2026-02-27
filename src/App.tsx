import React, { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { TradePage } from "./pages/TradePage";
import { useAuthStore } from "./store/authStore";
import { LoginModal } from "./components/LoginModal";

type Tab = "home" | "trade";

const App: React.FC = () => {
  const [tab, setTab] = useState<Tab>("home");
  const [showLogin, setShowLogin] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [tradeAsset, setTradeAsset] = useState<string | null>(null);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleNav = (target: Tab) => {
    setTab(target);
  };

  const handleTradeAsset = (code: string) => {
    setTradeAsset(code);
    setTab("trade");
  };

  const handleShowToast = (message: string) => {
    setToast(message);
    window.clearTimeout((handleShowToast as any)._t);
    (handleShowToast as any)._t = window.setTimeout(() => setToast(null), 2600);
  };

  const initials =
    user?.email
      ?.split("@")[0]
      ?.split(/[.\-_]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "CB";

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand">
            <div className="brand-logo">₿</div>
            <div className="brand-text">
              <div className="brand-title">CBB Crypto Trade</div>
              <div className="brand-subtitle">Central Bank of Bahrain · Sandbox</div>
            </div>
          </div>

          <nav className="nav" aria-label="Primary navigation">
            <button
              type="button"
              className={`nav-button${tab === "home" ? " active" : ""}`}
              onClick={() => handleNav("home")}
            >
              <span className="dot" /> Home
            </button>
            <button
              type="button"
              className={`nav-button${tab === "trade" ? " active" : ""}`}
              onClick={() => handleNav("trade")}
            >
              <span className="dot" /> Trade
            </button>
          </nav>

          <div className="spacer" />

          <div className="user-section">
            <span className="badge">Local demo · No real funds</span>
            {user ? (
              <>
                <div className="user-pill">
                  <div className="user-avatar">{initials}</div>
                  <span>{user.email}</span>
                </div>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => logout()}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                className="button button-primary"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="app-main-inner">
          <section className="hero-row">
            <div className="hero-card">
              <div className="hero-title">Markets overview</div>
              <div className="hero-subtitle">
                Monitor live crypto prices and quickly route into trade tickets. Built
                with React, TypeScript, React Query, and Zustand.
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-label">Environment</div>
                  <div className="hero-stat-value">CBB Assessment Sandbox</div>
                </div>
                <div>
                  <div className="hero-stat-label">Pricing source</div>
                  <div className="hero-stat-value">exchangerate.host · crypto</div>
                </div>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-title">Trading workspace</div>
              <div className="hero-subtitle">
                Swap between crypto amount and USD notional instantly. Authentication
                is handled locally only.
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-label">Status</div>
                  <div className="hero-stat-value">
                    {user ? "Signed in" : "Guest · read-only"}
                  </div>
                </div>
                <div>
                  <div className="hero-stat-label">Access</div>
                  <div className="hero-stat-value">Trade page gated</div>
                </div>
              </div>
            </div>
          </section>

          {tab === "home" ? (
            <HomePage
              onTradeAsset={handleTradeAsset}
              onShowToast={handleShowToast}
            />
          ) : (
            <TradePage
              initialAssetCode={tradeAsset}
              onRequireLogin={() => setShowLogin(true)}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <span>
          Educational demo only. Not a live trading platform and{" "}
          <span className="highlight">
            not affiliated with the Central Bank of Bahrain
          </span>
          .
        </span>
        <span>© {new Date().getFullYear()} Crypto Trading App Assessment</span>
      </footer>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoggedIn={() => setShowLogin(false)}
        />
      )}

      {toast && (
        <div className="toast">
          <span className="toast-pill" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

export default App;

