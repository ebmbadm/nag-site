interface InputProps {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
}

export function Input({ id, name, type = "text", placeholder, required, error }: InputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      aria-invalid={error ? true : undefined}
      className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 text-sm text-text placeholder:text-text-faint focus:border-border-strong focus:outline-none aria-invalid:border-accent"
    />
  );
}
