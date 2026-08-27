"use client";

import { useState, useCallback, useMemo } from "react";
import { UserPlus, CheckCircle2, XCircle } from "lucide-react";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import SubmitButton from "@/components/SubmitButton";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";

const TIMEZONES = [
  { value: "America/New_York (UTC-5)", label: "America/New_York (UTC-5)" },
  { value: "America/Chicago (UTC-6)", label: "America/Chicago (UTC-6)" },
  { value: "America/Denver (UTC-7)", label: "America/Denver (UTC-7)" },
  { value: "America/Los_Angeles (UTC-8)", label: "America/Los_Angeles (UTC-8)" },
  { value: "Europe/London (UTC+0)", label: "Europe/London (UTC+0)" },
  { value: "Europe/Berlin (UTC+1)", label: "Europe/Berlin (UTC+1)" },
  { value: "Asia/Tokyo (UTC+9)", label: "Asia/Tokyo (UTC+9)" },
];

interface UserFormState {
  fullName: string;
  email: string;
  password: string;
  timezone: string;
}

interface UserLoginState {
  email: string;
  password: string;
}

enum FormState {
  Register,
  LogIn
}

interface UserFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  timezone?: string;
}

export default function UserAuthForm() {
  const [currentForm, setCurrentForm] = useState<FormState>(FormState.Register);
  const [formState, setFormState] = useState<UserFormState>({ fullName: "", email: "", password: "", timezone: "" });
  const [loginState, setLoginState] = useState<UserLoginState>({ email: "", password: "" });
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

    const router = useRouter();

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      alert(`Success! Welcome ${data.email}`);
      setStatusMessage("User account created successfully! Redirecting to dashboard...");
    },
    onError: (error) => {
      setStatus("error");
      setStatusMessage(error.message || "Failed to create user. Please try again.");
    }
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // 1. Store tokens securely
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // 2. Set in tRPC context or HTTP-only cookies
      setFormState({ fullName: "", email: "", password: "", timezone: "" });
      setLoginState({ email: "", password: "" });
      setStatus("success");
      setStatusMessage("Login successful! Redirecting...");

      // 3. Redirect after delay
      setTimeout(() => router.push("/dashboard"), 1500);
    },
    onError: (error) => {
      setStatus("error");
      setStatusMessage(error.message || "Login failed. Please try again.");
    }
  });

  const validate = useCallback((): boolean => {
    const newErrors: UserFormErrors = {};
    const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /.{8,}/; // Min 8 characters
    const activeState = currentForm === FormState.Register ? formState : loginState;

    if (currentForm === FormState.Register) {
      if (!formState.fullName.trim() || !nameRegex.test(formState.fullName.trim())) {
        newErrors.fullName = "Full name must be 2-50 characters and contain only letters, spaces, or hyphens.";
      }
      if (!formState.timezone) {
        newErrors.timezone = "Please select a timezone.";
      }
    }

    if (!activeState.email.trim() || !emailRegex.test(activeState.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!activeState.password.trim() || !passwordRegex.test(activeState.password.trim())) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentForm, formState, loginState]);

  const handleChange = useCallback(
    (field: keyof UserFormState | keyof UserLoginState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value } = e.target;
        const isError = errors[field as keyof UserFormErrors];

        if (currentForm === FormState.Register) {
          setFormState((prev) => ({ ...prev, [field]: value }));
          if (isError) setErrors((prev) => ({ ...prev, [field]: undefined }));
        } else {
          setLoginState((prev) => ({ ...prev, [field]: value }));
          if (isError) setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      },
    [currentForm, errors]
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setStatus("idle");
    setStatusMessage("");

    try {
      // Simulated network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (Math.random() < 0.1) throw new Error("Network error");

      const payload = currentForm === FormState.Register ? formState : loginState;
      if (currentForm === FormState.Register) {
        await registerMutation.mutateAsync(formState);
      } else {
        await loginMutation.mutateAsync(payload);
      }

      setStatus("success");
      setStatusMessage(currentForm === FormState.Register
        ? "User account created successfully! Redirecting to dashboard..."
        : "Login successful! Redirecting...");

      if (currentForm === FormState.Register) {
        setFormState({ fullName: "", email: "", password: "", timezone: "" });
      } else {
        setLoginState({ email: "", password: "" });
      }
    } catch (err) {
      setStatus("error");
      setStatusMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [validate, formState, loginState, registerMutation, loginMutation, currentForm]);

  const isFormValid = useMemo(() => {
    const activeState = currentForm === FormState.Register ? formState : loginState;
    const baseValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(activeState.email.trim()) &&
      activeState.password.trim().length >= 8;

    if (currentForm === FormState.Register) {
      return baseValid &&
        formState.fullName.trim().length >= 2 &&
        !!formState.timezone;
    }
    return baseValid;
  }, [currentForm, formState, loginState]);

  const switchForm = () => {
    setCurrentForm(prev => prev === FormState.Register ? FormState.LogIn : FormState.Register);
    setErrors({});
    setStatus("idle");
    setStatusMessage("");
  };

  return (
    <div className="mt-2">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {status === "success" && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700" role="alert" aria-live="polite">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{statusMessage}</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert" aria-live="polite">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{statusMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 text-black">
          {currentForm === FormState.Register && (
            <InputField
              label="Full Name"
              name="fullName"
              type="text"
              value={formState.fullName}
              onChange={handleChange("fullName")}
              error={errors.fullName}
              placeholder="e.g., Alex Rivera"
              required
              disabled={isLoading}
            />
          )}
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={currentForm === FormState.Register ? formState.email : loginState.email}
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
            value={currentForm === FormState.Register ? formState.password : loginState.password}
            onChange={handleChange("password")}
            error={errors.password}
            placeholder="*********"
            required
            disabled={isLoading}
          />
          {currentForm === FormState.Register && (
            <SelectField
              label="Timezone"
              name="timezone"
              value={formState.timezone}
              onChange={handleChange("timezone")}
              options={TIMEZONES}
              error={errors.timezone}
              required
              disabled={isLoading}
            />
          )}
        </div>

        <div className="pt-2">
          <SubmitButton isLoading={isLoading} disabled={!isFormValid}>
            <UserPlus className="w-4 h-4 mr-2" />
            {currentForm === FormState.LogIn ? "Log In" : "Create User Account"}
          </SubmitButton>
        </div>
      </form>

      <div className="mt-6 ml-0">
        <button
          onClick={switchForm}
          className="max-w-md text-white p-3 bg-black rounded-lg shadow-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          {currentForm === FormState.LogIn ? "Create User Account" : "Log In"}
        </button>
      </div>
    </div>
  );
}
