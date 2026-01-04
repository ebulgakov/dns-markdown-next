import type { ComponentProps } from "react";
import clsx from "clsx";
import { variants, type ButtonProps } from "./variants";

export default function Button({
  children,
  variant,
  size,
  ...props
}: ComponentProps<"button"> & ButtonProps) {
  return (
    <button className={clsx(variants({ variant, size }))} {...props}>
      {children}
    </button>
  );
}
