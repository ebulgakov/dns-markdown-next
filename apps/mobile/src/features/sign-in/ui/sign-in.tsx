import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { Button, Text, TextField } from "@/shared/ui";

function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = async () => {
    const { error } = await signIn.password({ emailAddress, password });

    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize();
      router.replace("/profile");
    }
  };

  return (
    <View className="flex-1 justify-center gap-3 p-6">
      <Text variant="title1" className="mb-4 font-bold">
        Авторизация
      </Text>
      <TextField
        value={emailAddress}
        onChangeText={setEmailAddress}
        label="Email"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
      />
      {errors?.fields?.identifier && (
        <Text variant="footnote" className="text-destructive">
          {errors.fields.identifier.message}
        </Text>
      )}
      <TextField
        value={password}
        onChangeText={setPassword}
        label="Пароль"
        placeholder="Пароль"
        secureTextEntry
        textContentType="password"
        autoComplete="password"
      />
      {errors?.fields?.password && (
        <Text variant="footnote" className="text-destructive">
          {errors.fields.password.message}
        </Text>
      )}
      <Button onPress={onSignIn} disabled={fetchStatus === "fetching"} className="mt-2">
        <Text>Войти</Text>
      </Button>
      <Link href="/profile/sign-up" className="mt-2 text-center text-primary">
        Нет аккаунта? Зарегистрироваться
      </Link>
    </View>
  );
}

export { SignIn };
