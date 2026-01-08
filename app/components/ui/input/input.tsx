import * as React from "react";

import { cn } from "@/app/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input  w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium " +
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      inputSize: {
        sm: "h-8 px-2 py-1 text-sm",
        md: "h-9 px-3 py-1 text-base",
        lg: "h-11 px-4 py-2 text-lg"
      }
    },
    defaultVariants: {
      inputSize: "md"
    }
  }
);

function Input({
  className,
  type,
  inputSize, // 'size' is a reserved prop name for input elements
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ inputSize, className }))}
      {...props}
    />
  );
}

export { Input };
