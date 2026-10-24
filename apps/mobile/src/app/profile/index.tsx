import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { View, Text } from "react-native";

export default function ProfileScreen() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Redirect href="/profile/sign-in" />;
  }

  return (
    <View>
      <Text>Профиль{` isSignedIn: ${isSignedIn}, isLoaded: ${isLoaded}`}</Text>
    </View>
  );
}
