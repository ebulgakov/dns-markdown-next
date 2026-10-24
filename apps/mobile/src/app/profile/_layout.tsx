import { Stack } from "expo-router";

import { SignOut } from "@/features/sign-out";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Профиль",
          headerRight: () => <SignOut />
        }}
      />
      <Stack.Screen name="sign-in" options={{ title: "Вход" }} />
      <Stack.Screen name="sign-up" options={{ title: "Регистрация" }} />
    </Stack>
  );
}
