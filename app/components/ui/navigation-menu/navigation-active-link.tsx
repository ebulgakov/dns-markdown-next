"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavigationMenuLink } from "@/app/components/ui/navigation-menu";

import type { ReactNode } from "react";

type ActiveLinkProps = {
  onClick?: () => void;
  children: ReactNode;
  link: {
    name: string;
    url: string;
  };
};

function NavigationActiveLink({ link, children, onClick }: ActiveLinkProps): ReactNode {
  const pathname = usePathname();
  const isActive = (url: string) => {
    return pathname === url;
  };

  return (
    <NavigationMenuLink
      asChild
      data-active={isActive(link.url) ? "true" : "false"}
      onClick={onClick}
    >
      <Link href={link.url}>{children}</Link>
    </NavigationMenuLink>
  );
}

export { NavigationActiveLink };
