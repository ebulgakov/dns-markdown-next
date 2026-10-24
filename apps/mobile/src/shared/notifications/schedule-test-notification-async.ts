import * as Notifications from "expo-notifications";

export async function scheduleTestNotificationAsync() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Push Notification",
      body: "This is a test notification"
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5
    }
  });
}
