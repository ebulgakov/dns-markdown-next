import { ReactNode } from "react";

type ErrorMessageProps = {
  children: ReactNode;
};

export default function ErrorMessage({ children }: ErrorMessageProps): ReactNode {
  return <div className="border border-red-500 bg-red-300 p-10 rounded-sm">{children}</div>;
}
