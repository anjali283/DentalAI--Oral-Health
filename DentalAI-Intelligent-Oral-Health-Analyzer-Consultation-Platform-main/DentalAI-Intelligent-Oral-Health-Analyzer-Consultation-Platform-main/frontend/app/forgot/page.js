"use client";

import { useState } from "react";
import Link from "next/link";

const STEPS = {
  EMAIL: 0,
  OTP: 1,
  RESET: 2,
  SUCCESS: 3,
};

export default function ForgotPassword() {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const simulate = (ms) => new Promise((r) => setTimeout(r, ms));

  const handleEmailSubmit = async () => {
    setError("");
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    await simulate(1200);
    setLoading(false);
    setStep(STEPS.OTP);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    setError("");
    if (otp.join("").length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setLoading(true);
    await simulate(1200);
    setLoading(false);
    setStep(STEPS.RESET);
  };

  const handleResetSubmit = async () => {
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    await simulate(1200);
    setLoading(false);
    setStep(STEPS.SUCCESS);
  };

  const progressPercent = [25, 50, 75, 100][step] || 0;

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Logo */}
        <div style={s.logo}>
          <span style={s.logoText}>DentalAI</span>
        </div>

        {/* Progress bar — only show during steps 0-2 */}
        {step < STEPS.SUCCESS && (
          <div style={s.progressWrap}>
            <div style={{ ...s.progressBar, width: `${progressPercent}%` }} />
          </div>
        )}

        {/* Step labels */}
        {step < STEPS.SUCCESS && (
          <div style={s.stepLabels}>
            {["Email", "Verify OTP", "New Password"].map((label, i) => (
              <span
                key={i}
                style={{
                  ...s.stepLabel,
                  color: i <= step ? "#0891b2" : "#94a3b8",
                  fontWeight: i === step ? 700 : 400,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* ── STEP 0: Email ── */}
        {step === STEPS.EMAIL && (
          <div style={s.body}>
            <h2 style={s.title}>Forgot Password?</h2>
            <p style={s.subtitle}>
              No worries! Enter your registered email and well send you a
              verification code.
            </p>

            <label style={s.label}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
              style={s.input}
            />

            {error && <p style={s.error}>{error}</p>}

            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }}
            >
              {loading ? <Spinner /> : "Send Verification Code"}
            </button>

            <Link href="/login" style={s.backLink}>
              ← Back to Login
            </Link>
          </div>
        )}

        {/* ── STEP 1: OTP ── */}
        {step === STEPS.OTP && (
          <div style={s.body}>
            <h2 style={s.title}>Check Your Email</h2>
            <p style={s.subtitle}>
              We sent a 6-digit code to <strong style={{ color: "#0891b2" }}>{email}</strong>.
              Enter it below.
            </p>

            <div style={s.otpRow}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  style={{
                    ...s.otpInput,
                    borderColor: digit ? "#0891b2" : "rgba(0,180,200,0.3)",
                    background: digit ? "rgba(8,145,178,0.07)" : "white",
                  }}
                />
              ))}
            </div>

            {error && <p style={s.error}>{error}</p>}

            <button
              onClick={handleOtpSubmit}
              disabled={loading}
              style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }}
            >
              {loading ? <Spinner /> : "Verify Code"}
            </button>

            <button
              onClick={() => { setOtp(["","","","","",""]); setError(""); }}
              style={s.ghost}
            >
              Resend Code
            </button>

            <button onClick={() => setStep(STEPS.EMAIL)} style={s.backLink}>
              ← Change Email
            </button>
          </div>
        )}

        {/* ── STEP 2: Reset Password ── */}
        {step === STEPS.RESET && (
          <div style={s.body}>
            <h2 style={s.title}>Set New Password</h2>
            <p style={s.subtitle}>
              Choose a strong password for your account.
            </p>

            <label style={s.label}>New Password</label>
            <div style={s.inputWrap}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={s.inputInner}
              />
              <button style={s.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <label style={{ ...s.label, marginTop: "1rem" }}>Confirm Password</label>
            <div style={s.inputWrap}>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={s.inputInner}
              />
              <button style={s.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Strength indicator */}
            {password && <StrengthBar password={password} />}

            {error && <p style={s.error}>{error}</p>}

            <button
              onClick={handleResetSubmit}
              disabled={loading}
              style={{ ...s.btn, ...(loading ? s.btnDisabled : {}), marginTop: "1.25rem" }}
            >
              {loading ? <Spinner /> : "Reset Password"}
            </button>
          </div>
        )}

        {/* ── STEP 3: Success ── */}
        {step === STEPS.SUCCESS && (
          <div style={{ ...s.body, alignItems: "center", textAlign: "center" }}>
            <div style={s.successIcon}>
              <CheckIcon />
            </div>
            <h2 style={s.title}>Password Reset!</h2>
            <p style={s.subtitle}>
              Your password has been successfully updated. You can now log in
              with your new password.
            </p>
            <Link href="/login" style={{ ...s.btn, textDecoration: "none", textAlign: "center" }}>
              Back to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Password Strength Bar ──
function StrengthBar({ password }) {
  const calc = (p) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const score = calc(password);
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e", "#0891b2"];

  return (
    <div style={{ marginTop: "0.6rem", width: "100%" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "4px",
              background: i <= score ? colors[score] : "#e2e8f0",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: "0.78rem", color: colors[score], fontWeight: 600, margin: 0 }}>
        {labels[score]}
      </p>
    </div>
  );
}

// ── Icons ──
function Spinner() {
  return (
    <span style={{
      display: "inline-block", width: 18, height: 18,
      border: "2px solid rgba(255,255,255,0.4)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      verticalAlign: "middle",
    }} />
  );
}

function Eye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── Styles ──
const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    position: "relative",
    zIndex: 1,
  },
  card: {
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(12px)",
    borderRadius: "24px",
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "440px",
    border: "1px solid rgba(0,180,200,0.2)",
    boxShadow: "0 8px 40px rgba(0,180,200,0.12)",
  },
  logo: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  logoText: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#0891b2",
    letterSpacing: "-0.5px",
  },
  progressWrap: {
    height: "4px",
    background: "rgba(0,180,200,0.15)",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "0.6rem",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #22d3ee, #0891b2)",
    borderRadius: "4px",
    transition: "width 0.4s ease",
  },
  stepLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  stepLabel: {
    fontSize: "0.75rem",
    transition: "color 0.3s",
  },
  body: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#0c4a6e",
    marginBottom: "0.4rem",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#64748b",
    marginBottom: "1.5rem",
    lineHeight: 1.6,
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "0.4rem",
  },
  input: {
    width: "100%",
    padding: "0.7rem 1rem",
    borderRadius: "10px",
    border: "1.5px solid rgba(0,180,200,0.3)",
    fontSize: "0.95rem",
    color: "#1e293b",
    outline: "none",
    marginBottom: "0.5rem",
    boxSizing: "border-box",
    background: "white",
    transition: "border 0.2s",
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid rgba(0,180,200,0.3)",
    borderRadius: "10px",
    background: "white",
    overflow: "hidden",
  },
  inputInner: {
    flex: 1,
    padding: "0.7rem 1rem",
    border: "none",
    outline: "none",
    fontSize: "0.95rem",
    color: "#1e293b",
    background: "transparent",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    padding: "0 0.75rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  otpRow: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  otpInput: {
    width: "48px",
    height: "52px",
    textAlign: "center",
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#0891b2",
    border: "1.5px solid",
    borderRadius: "10px",
    outline: "none",
    transition: "all 0.2s",
  },
  btn: {
    marginTop: "1rem",
    padding: "0.75rem",
    background: "#0891b2",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    transition: "background 0.2s",
  },
  btnDisabled: {
    background: "#7dd3eb",
    cursor: "not-allowed",
  },
  ghost: {
    marginTop: "0.6rem",
    background: "none",
    border: "none",
    color: "#0891b2",
    fontSize: "0.9rem",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: 600,
  },
  backLink: {
    marginTop: "0.75rem",
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.85rem",
    cursor: "pointer",
    background: "none",
    border: "none",
  },
  error: {
    color: "#ef4444",
    fontSize: "0.82rem",
    marginTop: "0.25rem",
    marginBottom: "0.25rem",
  },
  successIcon: {
    width: "72px",
    height: "72px",
    background: "linear-gradient(135deg, #22d3ee, #0891b2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.25rem",
  },
};