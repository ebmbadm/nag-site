import { cn } from "@/lib/utils";
import { controlClass } from "./field";

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
      className={cn(controlClass, "resize-y px-4 py-3")}
    />
  );
}
