import type { ButtonHTMLAttributes } from "react";
import cn from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
};
export default function Button({ children, isActive, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "transition rounded cursor-pointer bg-blue-400 px-2 py-1 text-white hover:bg-blue-400 disabled:opacity-40",
        {
          "bg-orange-400": isActive
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
}
