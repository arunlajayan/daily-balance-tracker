interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
  disabled,
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
            error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-slate-300"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <option value="" disabled>
            Select a timezone
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.243 3.03a1.5 1.5 0 0 1 1.514 0l8.13 5.202a1.5 1.5 0 0 1-1.567 2.63l-1.014-.357a.5.5 0 0 0-.486-.048l-8.024 5.18a1.5 1.5 0 0 1-1.832-.368L1.22 6.35a1.5 1.5 0 0 1 .09-2.196l7.933-1.124Z" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
