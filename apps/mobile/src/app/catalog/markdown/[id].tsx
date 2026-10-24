import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function CatalogItemScreen() {
  const params = useLocalSearchParams<{ id?: string }>();

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Название товара"
        }}
      />
      <Text>Товар {params.id}</Text>
    </View>
  );
}
