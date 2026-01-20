import { ArrowRight } from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type MoreLinkProps = {
  icon?: LucideIcon;
  children: ReactNode;
};

function MoreLink({ children, icon }: MoreLinkProps) {
  const IconElement = icon ? icon : ArrowRight;
  return (
    <div className="mt-4 border-t border-gray-200 pt-4 text-lg font-bold text-gray-600 dark:text-gray-400">
      <IconElement className="text-accent mr-2 inline" />
      {children}
    </div>
  );
}

export { MoreLink };
