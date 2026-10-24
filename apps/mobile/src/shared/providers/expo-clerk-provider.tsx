import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { View, ActivityIndicator } from "react-native";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set.");
}

type ExpoClerkProviderProps = {
  children: React.ReactNode;
};

export function ExpoClerkProvider({ children }: ExpoClerkProviderProps) {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoading>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </ClerkProvider>
  );
}
