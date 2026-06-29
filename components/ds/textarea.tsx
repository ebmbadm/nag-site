interface TextareaProps {
  id: string;
  name: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
}

export function Textarea({ id, name, rows = 4, placeholder, required, error }: TextareaProps) {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      required={required}
      aria-invalid={error ? true : undefined}
      className="w-full rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-border-strong focus:outline-none aria-invalid:border-accent"
    />
  );
}
