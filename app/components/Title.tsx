import { ReactNode, createElement } from "react";
import clsx from "clsx";

type TitleProps = {
  children?: ReactNode;
  variant?: "h2" | "h3";
};
export default function Title({ children, variant = "h2" }: TitleProps) {
  return createElement(
    variant,
    {
      className: clsx({
        "text-3xl mt-10 mb-5": variant === "h2",
        "text-2xl mt-8 mb-2": variant === "h3"
      })
    },
    children
  );
}
