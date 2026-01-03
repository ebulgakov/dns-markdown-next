import { ReactNode } from "react";
import clsx from "clsx";

type ErrorMessageProps = {
  className?: string;
  children: ReactNode;
};

export default function ErrorMessage({ children, className }: ErrorMessageProps): ReactNode {
  return (
    <div
      className={clsx(
        "border border-red-500 bg-red-300 p-10 rounded-sm whitespace-pre-wrap",
        className
      )}
    >
      {children}
    </div>
  );
}
