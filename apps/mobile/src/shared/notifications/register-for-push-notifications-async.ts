import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      showBadge: false
    });
  }

  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let status = existingStatus;
  if (status !== "granted") {
    const { status: requestedStatus } = await Notifications.requestPermissionsAsync();
    status = requestedStatus;
  }

  if (status !== "granted") {
    return status;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const { data: pushToken } = await Notifications.getExpoPushTokenAsync({ projectId });
  console.log("Expo push token:", pushToken);

  return status;
}
