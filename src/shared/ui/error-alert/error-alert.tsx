import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";

type ErrorAlertProps = {
  title: string;
  message?: string;
  className?: string;
};

function ErrorAlert({ title, message, className }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export { ErrorAlert };
