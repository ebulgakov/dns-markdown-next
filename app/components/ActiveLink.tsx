"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { type ReactNode } from "react";

type ActiveLinkProps = {
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  href: string;
};

export default function ActiveLink({
  children,
  activeClassName,
  className,
  ...props
}: ActiveLinkProps): ReactNode {
  let actualClassName = className;
  const pathname = usePathname();
  if (pathname === props.href) {
    actualClassName += ` ${activeClassName}`;
  }
  return (
    <Link className={actualClassName} {...props}>
      {children}
    </Link>
  );
}
