import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};
export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="transition rounded cursor-pointer bg-blue-400 px-2 py-1 text-white hover:bg-blue-400 disabled:bg-orange-400"
      {...props}
    >
      {children}
    </button>
  );
}
