"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { type ReactNode } from "react";
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/app/components/ui/navigation-menu";
import { cn } from "@/app/lib/utils";

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
    <NavigationMenuLink
      asChild
      className={cn([
        navigationMenuTriggerStyle(),
        isActive(link.url) && "bg-primary text-primary-foreground"
      ])}
    >
      <Link href={link.url}>{children}</Link>
    </NavigationMenuLink>
  );
}
