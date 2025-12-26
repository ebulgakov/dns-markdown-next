import { ReactNode } from "react";

type ErrorMessage = {
  children: ReactNode;
};

export default function ErrorMessage({ children }: ErrorMessage): ReactNode {
  return <div className="border border-red-500 bg-red-300 p-10 rounded-sm">{children}</div>;
}
