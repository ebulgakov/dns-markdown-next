import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function CatalogScreen() {
  return (
    <View>
      <Text>Каталог</Text>
      <Link href="/catalog/markdown/123456">Explore</Link>
    </View>
  );
}
