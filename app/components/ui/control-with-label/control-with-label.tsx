import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";

import type { ComponentProps } from "react";

const getUniqueId = (prefix = "id") => {
  const randomPart = Math.random().toString(36).substring(2, 8);
  const timePart = Date.now().toString(36);
  const suffix = `${randomPart}-${timePart}`;
  return `${prefix}-${suffix}`;
};

function CheckboxWithLabel({
  label,
  ...props
}: {
  label: string;
} & ComponentProps<typeof CheckboxPrimitive.Root>) {
  const id = getUniqueId("checkbox");

  return (
    <div>
      <div className="flex items-center gap-3">
        <Checkbox id={id} {...props} />
        <Label htmlFor={id}>{label}</Label>
      </div>
    </div>
  );
}
export { CheckboxWithLabel };
