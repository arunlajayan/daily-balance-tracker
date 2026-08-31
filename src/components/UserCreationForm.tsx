"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LogIn, UserPlus, XCircle } from "lucide-react";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import SubmitButton from "@/components/SubmitButton";
import { trpc } from "@/utils/trpc";

// Values are IANA names — what your backend should store. Offsets live in labels only.
const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (UTC-5) — New York" },
  { value: "America/Chicago", label: "Central Time (UTC-6) — Chicago" },
  { value: "America/Denver", label: "Mountain Time (UTC-7) — Denver" },
  { value: "America/Los_Angeles", label: "Pacific Time (UTC-8) — Los Angeles" },
  { value: "Europe/London", label: "Greenwich Mean Time (UTC+0) — London" },
  { value: "Europe/Berlin", label: "Central European Time (UTC+1) — Berlin" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (UTC+9) — Tokyo" },
];

interface RegisterFormState {
  fullName: string;
  email: string;
  password: string;
  timezone: string;
}

interface LoginFormState {
  email: string;
  password: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  timezone?: string;
}

const EMPTY_REGISTER: RegisterFormState = { fullName: "", email: "", password: "", timezone: "" };
const EMPTY_LOGIN: LoginFormState = { email: "", password: "" };

enum FormMode {
  Login,
  Register,
}

// Single source of truth for validation — used by both submit-time checks and (optionally) live checks.
const isValidName = (v: string) => /^[a-zA-Z\s'-]{2,50}$/.test(v.trim());
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPassword = (v: string) => v.length >= 8;

export default function UserAuthForm() {
  const router = useRouter();

  const [mode, setMode] = useState<FormMode>(FormMode.Login);
  const [registerForm, setRegisterForm] = useState<RegisterFormState>(EMPTY_REGISTER);
  const [loginForm, setLoginForm] = useState<LoginFormState>(EMPTY_LOGIN);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Redirect timer with cleanup so it never fires after unmount.
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    },
    []
  );
  const scheduleRedirect = useCallback(
    (path: string) => {
      redirectTimer.current = setTimeout(() => router.push(path), 1200);
    },
    [router]
  );

  // Status is handled in exactly ONE place: the mutation callbacks.
  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      setStatus("success");
      setStatusMessage("Account created! Redirecting to your dashboard…");
      setRegisterForm(EMPTY_REGISTER);
      scheduleRedirect("/dashboard");
    },
    onError: (error) => {
      setStatus("error");
      setStatusMessage(error.message || "Failed to create account. Please try again.");
    },
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      // Tokens must be set by the server as httpOnly cookies.
      // Never persist tokens in localStorage — any XSS can steal them.
      setStatus("success");
      setStatusMessage("Welcome back! Redirecting…");
      setLoginForm(EMPTY_LOGIN);
      scheduleRedirect("/dashboard");
    },
    onError: (error) => {
      setStatus("error");
      setStatusMessage(error.message || "Login failed. Please check your credentials.");
    },
  });

  const isLoading = registerMutation.isPending || loginMutation.isPending;
  const isRegister = mode === FormMode.Register;

  const validate = useCallback((): boolean => {
    const next: FormErrors = {};
    const active = isRegister ? registerForm : loginForm;

    if (isRegister) {
      if (!isValidName(registerForm.fullName)) {
        next.fullName = "Full name must be 2–50 characters: letters, spaces, hyphens only.";
      }
      if (!registerForm.timezone) {
        next.timezone = "Please select a timezone.";
      }
    }
    if (!isValidEmail(active.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!isValidPassword(active.password)) {
      next.password = "Password must be at least 8 characters.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [isRegister, registerForm, loginForm]);

  const handleChange = useCallback(
    (field: keyof FormErrors) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value } = e.target;
        if (isRegister) {
          setRegisterForm((prev) => ({ ...prev, [field]: value }));
        } else {
          setLoginForm((prev) => ({ ...prev, [field]: value }));
        }
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
      },
    [isRegister]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading || !validate()) return;

      setStatus("idle");
      setStatusMessage("");

      if (isRegister) {
        registerMutation.mutate(registerForm);
      } else {
        loginMutation.mutate(loginForm);
      }
    },
    [isLoading, validate, isRegister, registerForm, loginForm, registerMutation, loginMutation]
  );

  const switchMode = useCallback((next: FormMode) => {
    setMode(next);
    setErrors({});
    setStatus("idle");
    setStatusMessage("");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black text-white mb-4">
              {isRegister ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isRegister
                ? "Sign up to get started in seconds."
                : "Log in to continue to your dashboard."}
            </p>
          </div>

          {/* Mode tabs — replaces the old full-width switch button */}
          <div className="flex p-1 mb-6 bg-gray-100 rounded-lg" role="tablist">
            {[
              { label: "Log In", value: FormMode.Login },
              { label: "Create Account", value: FormMode.Register },
            ].map((tab) => (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={mode === tab.value}
                onClick={() => switchMode(tab.value)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                  mode === tab.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status banners */}
          {status === "success" && (
            <div
              className="flex items-center gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700"
              role="alert"
              aria-live="polite"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{statusMessage}</p>
            </div>
          )}
          {status === "error" && (
            <div
              className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700"
              role="alert"
              aria-live="polite"
            >
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{statusMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/*
              Fields are hidden (display:none), not unmounted.
              The grid height never changes, so the card can't shrink when switching modes —
              and user input is preserved when toggling back and forth.
            */}
            <div className="grid grid-cols-1 gap-5 text-black content-start">
              <div className={isRegister ? "contents" : "hidden"} aria-hidden={!isRegister}>
                <InputField
                  label="Full Name"
                  name="fullName"
                  type="text"
                  value={registerForm.fullName}
                  onChange={handleChange("fullName")}
                  error={isRegister ? errors.fullName : undefined}
                  placeholder="e.g., Alex Rivera"
                  required
                  disabled={isLoading}
                />
              </div>

              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={isRegister ? registerForm.email : loginForm.email}
                onChange={handleChange("email")}
                error={errors.email}
                placeholder="e.g., alex@example.com"
                required
                disabled={isLoading}
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                value={isRegister ? registerForm.password : loginForm.password}
                onChange={handleChange("password")}
                error={errors.password}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />

              <div className={isRegister ? "contents" : "hidden"} aria-hidden={!isRegister}>
                <SelectField
                  label="Timezone"
                  name="timezone"
                  value={registerForm.timezone}
                  onChange={handleChange("timezone")}
                  options={TIMEZONES}
                  error={isRegister ? errors.timezone : undefined}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {!isRegister && (
              <div className="flex justify-end mt-3">
                {/* Point this at your real reset route */}
                <a
                  href="/forgot-password"
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <div className="pt-6">
              {/*
                Button stays enabled so clicking submit reveals validation errors.
                If your SubmitButton requires a `disabled` prop, pass disabled={isLoading}.
              */}
              <SubmitButton isLoading={isLoading}>
                {isRegister ? (
                  <UserPlus className="w-4 h-4 mr-2" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                {isRegister ? "Create Account" : "Log In"}
              </SubmitButton>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
