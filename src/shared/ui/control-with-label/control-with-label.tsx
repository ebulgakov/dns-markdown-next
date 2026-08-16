import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useId } from "react";

import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";

import type { ComponentProps } from "react";

function CheckboxWithLabel({
  label,
  id: idProp,
  ...props
}: {
  label: string;
} & ComponentProps<typeof CheckboxPrimitive.Root>) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

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
