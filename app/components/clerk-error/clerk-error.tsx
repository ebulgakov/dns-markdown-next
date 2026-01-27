import { ClerkFailed } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

function ClerkError() {
  const t = useTranslations("errors");
  return (
    <ClerkFailed>
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>{t("clerk_auth_title")}</AlertTitle>
        <AlertDescription>{t("clerk_auth_description")}</AlertDescription>
      </Alert>
    </ClerkFailed>
  );
}

export { ClerkError };
