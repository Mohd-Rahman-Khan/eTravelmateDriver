import PushNotificationIOS from "@react-native-community/push-notification-ios";
import React, { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import PushNotification from "react-native-push-notification";
import actions from "../redux/actions";
// import NavigationServices from '../navigation/NavigationServices';
// import navigationStrings from '../navigation/navigationStrings';

const ForegroundHandler = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { notification, messageId } = remoteMessage;

      if (remoteMessage?.data) {
        actions.getBoardEmpDetail(remoteMessage);
      }
      if (
        notification?.title?.toUpperCase().trim() === "NEW DEVICE" ||
        notification?.title?.toUpperCase().trim() === "DEACTIVATE ACCOUNT"
      ) {
        actions.logout();
      }

      if (remoteMessage?.notification?.title === "Trip Assign") {
        actions.newRideAssign(remoteMessage?.notification?.title);
      }
      if (remoteMessage?.notification?.title === "Trip Start") {
        actions.newRideAssign(remoteMessage?.notification?.title);
      }
      if (remoteMessage?.notification?.title === "Trip Details") {
        actions.newRideAssign(remoteMessage?.notification?.body);
      }
      if (Platform.OS == "ios") {
        PushNotificationIOS.addNotificationRequest({
          id: messageId,
          body: notification.body,
          title: notification.title,
          sound: "default",
        });
      } else {
        PushNotification.createChannel(
          {
            channelId: "mychannel", // (required)
            channelName: "My channel", // (required)
            vibrate: true,
          },
          (created) => {
            PushNotification.localNotification({
              channelId: "mychannel",
              autoCancel: true,
              // bigText: notification.body,
              // subText: 'Notification',
              title: notification?.title,
              message: notification?.body,
              vibrate: true,
              vibration: 300,
              playSound: true,
              soundName: "default",
              ignoreInForeground: false,
              importance: "high",
              invokeApp: true,
              allowWhileIdle: true,
              priority: "high",
              visibility: "public",
              // ba\:true
            });
          }
        );
      }
    });
    return unsubscribe;
  }, []);

  return null;
};

export default ForegroundHandler;
