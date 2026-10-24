jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        eas: {
          projectId: "test-project-id"
        }
      }
    }
  }
}));

jest.mock("expo-notifications", () => ({
  AndroidImportance: {
    DEFAULT: 3
  },
  getPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn()
}));

describe("registerForPushNotificationsAsync", () => {
  const loadRegisterForPushNotificationsAsync = ({
    isDevice = true,
    os = "ios"
  }: {
    isDevice?: boolean;
    os?: string;
  } = {}) => {
    jest.resetModules();
    jest.doMock("expo-device", () => ({ isDevice }));

    const { Platform } = require("react-native");
    Object.defineProperty(Platform, "OS", {
      value: os,
      configurable: true
    });

    return {
      registerForPushNotificationsAsync: require("../register-for-push-notifications-async").registerForPushNotificationsAsync,
      Notifications: require("expo-notifications")
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets the default Android notification channel before registering", async () => {
    const { registerForPushNotificationsAsync, Notifications } = loadRegisterForPushNotificationsAsync({
      os: "android"
    });

    Notifications.getPermissionsAsync.mockResolvedValue({ status: "granted" });
    Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: "ExponentPushToken[android]" });

    const result = await registerForPushNotificationsAsync();

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      showBadge: false
    });
    expect(result).toBe("granted");
    expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalledWith({ projectId: "test-project-id" });
  });

  it("returns null when running on a simulator", async () => {
    const { registerForPushNotificationsAsync, Notifications } = loadRegisterForPushNotificationsAsync({
      isDevice: false
    });

    await expect(registerForPushNotificationsAsync()).resolves.toBeNull();
    expect(Notifications.getPermissionsAsync).not.toHaveBeenCalled();
    expect(Notifications.getExpoPushTokenAsync).not.toHaveBeenCalled();
  });

  it("returns the denied status when permission is not granted", async () => {
    const { registerForPushNotificationsAsync, Notifications } = loadRegisterForPushNotificationsAsync();

    Notifications.getPermissionsAsync.mockResolvedValue({ status: "denied" });
    Notifications.requestPermissionsAsync.mockResolvedValue({ status: "denied" });

    await expect(registerForPushNotificationsAsync()).resolves.toBe("denied");
    expect(Notifications.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(Notifications.getExpoPushTokenAsync).not.toHaveBeenCalled();
  });

  it("logs the Expo push token and returns granted status", async () => {
    const { registerForPushNotificationsAsync, Notifications } = loadRegisterForPushNotificationsAsync();
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);

    Notifications.getPermissionsAsync.mockResolvedValue({ status: "granted" });
    Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: "ExponentPushToken[ios]" });

    await expect(registerForPushNotificationsAsync()).resolves.toBe("granted");

    expect(logSpy).toHaveBeenCalledWith("Expo push token:", "ExponentPushToken[ios]");
    expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalledWith({ projectId: "test-project-id" });

    logSpy.mockRestore();
  });
});
