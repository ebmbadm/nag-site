import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * primary — the one red action per screen. secondary — outlined.
 * quiet — on surface. link — underlined text.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent font-medium no-underline select-none transition-quick active:translate-y-px disabled:cursor-not-allowed disabled:border-transparent disabled:bg-surface disabled:text-ink-3 aria-disabled:cursor-not-allowed aria-disabled:bg-surface aria-disabled:text-ink-3",
  {
    variants: {
      variant: {
        primary: "bg-accent text-on-accent hover:bg-accent-hover hover:text-on-accent",
        secondary: "border-line-control bg-transparent text-ink hover:bg-surface hover:text-ink",
        quiet: "bg-surface text-ink hover:border-line-control hover:text-ink",
        link: "h-auto border-0 p-0 text-ink underline hover:text-danger",
      },
      size: {
        lg: "h-12 px-6 text-site-body",
        md: "h-10 px-4 text-site-small",
        sm: "h-8 px-3 text-site-caption",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "secondary", size: "lg" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
