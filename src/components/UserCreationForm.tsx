"use client";

import { useState, useCallback, useMemo } from "react";
import { UserPlus, CheckCircle2, XCircle } from "lucide-react";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import SubmitButton from "@/components/SubmitButton";
import { trpc } from "@/utils/trpc";

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

interface UserFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  timezone?: string;
}

export default function UserCreationForm() {
  const [formState, setFormState] = useState<UserFormState>({
    fullName: "",
    email: "",
    password: "",
    timezone: "",
  });
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      alert(`Success! Welcome ${data.email}`);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const validate = useCallback((): boolean => {
    const newErrors: UserFormErrors = {};
    const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formState.fullName.trim() || !nameRegex.test(formState.fullName.trim())) {
      newErrors.fullName = "Full name must be 2-50 characters and contain only letters, spaces, or hyphens.";
    }
    if (!formState.email.trim() || !emailRegex.test(formState.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formState.timezone) {
      newErrors.timezone = "Please select a timezone.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);

  const handleChange = useCallback(
    (field: keyof UserFormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value } = e.target;
        setFormState((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof UserFormErrors]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      },
    [errors]
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setStatus("idle");
    setStatusMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (Math.random() < 0.1) throw new Error("Network error");
      console.log(formState)
      registerMutation.mutate(formState)
      setStatus("success");
      setStatusMessage("User account created successfully! Redirecting to dashboard...");
      setFormState({ fullName: "", email: "", password: "", timezone: "" });
    } catch (err) {
      setStatus("error");
      setStatusMessage(err instanceof Error ? err.message : "Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [validate, formState, registerMutation]);

  const isFormValid = useMemo(() => {
    return (
      formState.fullName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim()) &&
      !!formState.timezone
    );
  }, [formState]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {status === "success" && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{statusMessage}</p>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{statusMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 text-black">
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
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={formState.email}
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
          value={formState.password}
          onChange={handleChange("password")}
          error={errors.password}
          placeholder="*********"
          required
          disabled={isLoading}
        />
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
      </div>

      <div className="pt-2">
        <SubmitButton isLoading={isLoading} disabled={!isFormValid}>
          <UserPlus className="w-4 h-4 mr-2" />
          Create User Account
        </SubmitButton>
      </div>
    </form>
  );
}
