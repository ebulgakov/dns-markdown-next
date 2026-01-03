import clsx from "clsx";

type AlertProps = {
  variant?: "success" | "error" | "info";
  children?: React.ReactNode;
};
export default function Alert({ children, variant = "success" }: AlertProps) {
  return (
    <div
      className={clsx("border  p-4 rounded-sm whitespace-pre-wrap", {
        "border-green-800 bg-green-50 text-green-800": variant === "success",
        "border-red-500 bg-red-300": variant === "error",
        "border-blue-500 bg-blue-300": variant === "info"
      })}
    >
      {children}
    </div>
  );
}
