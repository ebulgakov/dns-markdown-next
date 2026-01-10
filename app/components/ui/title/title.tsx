import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/lib/utils";

const titleVariants = cva("block", {
  variants: {
    variant: {
      h2: "text-3xl mt-10 mb-5 font-semibold",
      h3: "text-2xl mt-8 mb-2 font-semibold"
    }
  },
  defaultVariants: {
    variant: "h2"
  }
});

function Title({
  className,
  variant,
  ...props
}: React.HTMLProps<HTMLHeadingElement> & VariantProps<typeof titleVariants>) {
  const Comp: "h2" | "h3" = variant || "h2";

  return <Comp className={cn(titleVariants({ variant, className }))} {...props} />;
}

export { Title };
