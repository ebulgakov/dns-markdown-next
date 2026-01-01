import { ReactNode } from "react";
import cn from "classnames";

type ErrorMessageProps = {
  className?: string;
  children: ReactNode;
};

export default function ErrorMessage({ children, className }: ErrorMessageProps): ReactNode {
  return (
    <div
      className={cn(
        "border border-red-500 bg-red-300 p-10 rounded-sm whitespace-pre-wrap",
        className
      )}
    >
      {children}
    </div>
  );
}
