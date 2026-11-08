import { cn } from "@/lib/utils";
import { controlClass } from "./field";

interface InputProps {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  autoComplete?: string;
}

export function Input({ id, name, type = "text", placeholder, required, error, autoComplete }: InputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      aria-invalid={error ? true : undefined}
      className={cn(controlClass, "h-12 px-4")}
    />
  );
}
