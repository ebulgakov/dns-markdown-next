import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useId } from "react";

import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";

import type { ComponentProps } from "react";

function CheckboxWithLabel({
  label,
  ...props
}: {
  label: string;
} & ComponentProps<typeof CheckboxPrimitive.Root>) {
  const id = useId();

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
