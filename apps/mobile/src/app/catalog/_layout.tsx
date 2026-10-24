import { Stack } from "expo-router";

export default function CatalogLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Каталог" }} />
      <Stack.Screen name="markdown/[id]" options={{ title: "Карточка Товара" }} />
    </Stack>
  );
}
