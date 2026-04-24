import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://car-lease-loan-ai-assistant.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await res.json();

      if (data.success) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        .signup-root {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050816;
          overflow: hidden;
          position: relative;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
          animation: drift 12s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #7c3aed, #4f46e5);
          top: -130px; right: -140px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, #06b6d4, #0284c7);
          bottom: -110px; left: -120px;
          animation-delay: -5s;
        }
        .orb-3 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, #ec4899, #a21caf);
          top: 45%; left: 55%;
          animation-delay: -9s;
          opacity: 0.22;
        }
        @keyframes drift {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(35px, 25px) scale(1.07); }
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .glass-signup-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 430px;
          margin: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          padding: 2.75rem 2.5rem;
          backdrop-filter: blur(32px) saturate(150%);
          -webkit-backdrop-filter: blur(32px) saturate(150%);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 32px 80px rgba(0,0,0,0.55),
            0 0 60px rgba(124, 58, 237, 0.12);
          animation: cardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .glass-signup-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          border-radius: 100%;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(124, 58, 237, 0.18);
          border: 1px solid rgba(124, 58, 237, 0.35);
          border-radius: 999px;
          padding: 4px 14px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #c4b5fd;
          text-transform: uppercase;
          margin-bottom: 1.2rem;
        }
        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #7c3aed;
          box-shadow: 0 0 6px #7c3aed;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.7); }
        }

        .signup-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 0.35rem;
        }
        .signup-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.42);
          font-weight: 400;
          margin-bottom: 2rem;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          margin-bottom: 1.75rem;
        }

        .input-group { margin-bottom: 1.1rem; }

        .input-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.55rem;
          transition: color 0.2s;
        }
        .input-label.active { color: #c4b5fd; }

        .input-wrapper { position: relative; }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.25);
          transition: color 0.2s;
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .input-icon.active { color: #7c3aed; }

        .glass-field {
          width: 100%;
          padding: 13px 14px 13px 42px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          -webkit-text-fill-color: #fff;
        }
        .glass-field::placeholder { color: rgba(255,255,255,0.2); }
        .glass-field:focus {
          border-color: rgba(124, 58, 237, 0.7);
          background: rgba(124, 58, 237, 0.08);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15), 0 4px 20px rgba(0,0,0,0.2);
        }
        .glass-field:-webkit-autofill,
        .glass-field:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px rgba(30,20,60,0.95) inset, 0 0 0 3px rgba(124,58,237,0.2);
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff;
        }

        .eye-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .eye-toggle:hover { color: rgba(255,255,255,0.65); }

        .submit-btn {
          width: 100%;
          margin-top: 1.6rem;
          padding: 14px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #fff;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4f46e5 100%);
          position: relative;
          overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.2s;
          box-shadow: 0 4px 24px rgba(124,58,237,0.4), 0 1px 0 rgba(255,255,255,0.15) inset;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transition: left 0.5s ease;
        }
        .submit-btn:hover:not(:disabled)::before { left: 100%; }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(124,58,237,0.55);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .signup-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.35);
        }
        .signup-footer a {
          color: #c4b5fd;
          font-weight: 600;
          text-decoration: none;
          position: relative;
        }
        .signup-footer a::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 1px;
          background: #c4b5fd;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .signup-footer a:hover::after { transform: scaleX(1); }
      `}</style>

      <div className="signup-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />

        <div className="glass-signup-card">
          <div>
            <span className="badge-pill">
              <span className="badge-dot" />
              New Account
            </span>
          </div>

          <h2 className="signup-title">Create account</h2>
          <p className="signup-subtitle">Join us — it only takes a moment</p>

          <div className="divider" />

          <form onSubmit={handleRegister}>
            {/* Name */}
            <div className="input-group">
              <label className={`input-label ${focused.name ? "active" : ""}`}>
                Full Name
              </label>
              <div className="input-wrapper">
                <span className={`input-icon ${focused.name ? "active" : ""}`}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="glass-field"
                  onFocus={() => setFocused((f) => ({ ...f, name: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, name: false }))}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div className="input-group">
              <label className={`input-label ${focused.email ? "active" : ""}`}>
                Email Address
              </label>
              <div className="input-wrapper">
                <span className={`input-icon ${focused.email ? "active" : ""}`}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="glass-field"
                  onFocus={() => setFocused((f) => ({ ...f, email: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, email: false }))}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label
                className={`input-label ${focused.password ? "active" : ""}`}
              >
                Password
              </label>
              <div className="input-wrapper">
                <span
                  className={`input-icon ${focused.password ? "active" : ""}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="glass-field"
                  style={{ paddingRight: "42px" }}
                  onFocus={() => setFocused((f) => ({ ...f, password: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, password: false }))}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? (
                <>
                  <svg
                    className="spin"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      d="M21 12a9 9 0 1 1-6.219-8.56"
                      strokeLinecap="round"
                    />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="signup-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
