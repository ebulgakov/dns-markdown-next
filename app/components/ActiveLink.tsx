"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { type ReactNode } from "react";
import { NavigationMenuLink } from "@/app/components/ui/navigation-menu";

type ActiveLinkProps = {
  children: ReactNode;
  link: {
    name: string;
    url: string;
  };
};

export default function ActiveLink({ link, children }: ActiveLinkProps): ReactNode {
  const pathname = usePathname();
  const isActive = (url: string) => {
    return pathname === url;
  };

  return (
    <NavigationMenuLink asChild data-active={isActive(link.url) ? "true" : "false"}>
      <Link href={link.url}>{children}</Link>
    </NavigationMenuLink>
  );
}
