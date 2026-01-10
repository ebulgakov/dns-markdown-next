"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavigationMenuLink } from "@/app/components/ui/navigation-menu";

type ActiveLinkProps = {
  children: React.ReactNode;
  link: {
    name: string;
    url: string;
  };
};

function NavigationActiveLink({ link, children }: ActiveLinkProps): React.ReactNode {
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

export { NavigationActiveLink };
