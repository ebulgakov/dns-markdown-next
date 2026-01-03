import type { ComponentProps } from "react";
import cn from "classnames";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "default";
};
export default function Button({ children, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "transition rounded cursor-pointer  px-2 py-1 text-white  disabled:opacity-40",
        {
          "bg-orange-400 hover:bg-orange-500": variant === "primary",
          "bg-blue-400 hover:bg-blue-500": variant === "default"
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
}
