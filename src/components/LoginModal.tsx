import React, { useState, FormEvent } from "react";
import { useAuthStore } from "../store/authStore";

interface LoginModalProps {
  onClose: () => void;
  onLoggedIn?: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoggedIn }) => {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.trim().length < 4) {
      setError("Password should be at least 4 characters.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      login(email.trim());
      setSubmitting(false);
      onLoggedIn?.();
      onClose();
    }, 400);
  };

  const shortEmail =
    email.trim().length > 24 ? `${email.trim().slice(0, 21)}…` : email.trim();

  return (
    <div className="login-modal-backdrop" onClick={onClose}>
      <div
        className="login-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-header">
          <div>
            <div className="modal-title">Sign in to Trade</div>
            <div className="modal-subtitle">
              Local-only authentication. No real funds.{" "}
              <span style={{ color: "#22c55e" }}>CBB sandbox</span>.
            </div>
          </div>
          <button className="close-button" type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <div className="field-label-row">
              <label className="field-label" htmlFor="login-email">
                Email
              </label>
            </div>
            <input
              id="login-email"
              className="field-input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <div className="field-label-row">
              <label className="field-label" htmlFor="login-password">
                Password
              </label>
            </div>
            <input
              id="login-password"
              className="field-input"
              type="password"
              placeholder="Enter any password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-text">{error}</div>}

          <div className="modal-footer">
            <div className="auth-disclaimer">
              Signed in as: <span>{shortEmail || "guest@local"}</span>
            </div>
            <button
              type="submit"
              className="button button-primary"
              disabled={submitting}
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

