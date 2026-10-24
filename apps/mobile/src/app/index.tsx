import AntDesign from "@expo/vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  registerForPushNotificationsAsync,
  scheduleTestNotificationAsync
} from "@/shared/notifications";
import { Text } from "@/shared/ui/text";
import { LinearGradient } from "expo-linear-gradient";
import { Search } from "@/features/search";

export default function HomeScreen() {
  const onToggleButton = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const onRequestPermission = async () => {
    const result = await registerForPushNotificationsAsync();

    if (result === "granted") {
      await scheduleTestNotificationAsync();
    }
  };

  return (
    <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} style={styles.container}>
      <SafeAreaView>
        <View>
          <Search />
          <AntDesign name="aim" size={24} color="black" />
          <Text color="primary" className="font-mono">
            Welcome to&nbsp;Expo!
          </Text>
          <Text color="primary" className="font-sans">
            Welcome to&nbsp;Expo!
          </Text>
          <Text color="primary" className="font-sans-medium">
            Welcome to&nbsp;Expo!
          </Text>
          <Text color="primary" className="font-sans-semibold">
            Welcome to&nbsp;Expo!
          </Text>
          <Text color="primary" className="font-sans-bold">
            Welcome to&nbsp;Expo!
          </Text>
          <Link href="/catalog">Explore</Link>
        </View>

        <TouchableOpacity onPress={onRequestPermission} className="bg-blue-200 rounded mb-2">
          <Text className="text-blue-700 text-4xl">Request Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onToggleButton} className="bg-teal-200 text-red-500">
          <Text>Toggle with Haptics</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row"
  }
});
