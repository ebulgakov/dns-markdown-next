import { cva, type VariantProps } from "class-variance-authority";

export const variants = cva(
  ["transition", "rounded", "cursor-pointer", "px-2", "py-1", "text-white", "disabled:opacity-40"],
  {
    variants: {
      variant: {
        primary: ["bg-orange-400", "hover:bg-orange-500"],
        default: ["bg-blue-400", "hover:bg-blue-500"]
      },
      size: {
        small: ["text-sm", "px-2", "py-1"],
        medium: ["text-base", "px-4", "py-2"],
        large: ["text-lg", "px-6", "py-3"]
      }
    },
    defaultVariants: {
      variant: "default",
      size: "medium"
    }
  }
);
export type ButtonProps = VariantProps<typeof variants>;
