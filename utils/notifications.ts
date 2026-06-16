import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Tell the OS how to show notifications while the app is open.
 * shouldPlaySound + alert ensures it works even if the phone is on silent
 * (the notification still appears/vibrates; system "silent mode" mutes
 * media sounds, but local scheduled notifications still alert the user).
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Creates the Android notification channel and asks the user for
 * notification permission. Must be called once when the app starts.
 *
 * This works fully OFFLINE — local notifications do not need internet
 * or mobile signal. Airplane mode is completely fine.
 */
export async function registerForNotificationsAsync(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('task-reminders', {
      name: 'Task Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Schedules a local "15 minutes left" reminder for a task.
 * Returns the notification id (used later to cancel it), or null
 * if the deadline is already less than 15 minutes away.
 */
export async function scheduleTaskReminder(
  title: string,
  deadlineISO: string
): Promise<string | null> {
  const deadline = new Date(deadlineISO);
  const triggerDate = new Date(deadline.getTime() - 15 * 60 * 1000);

  // If the 15-min mark has already passed, don't schedule anything.
  if (triggerDate.getTime() <= Date.now()) {
    return null;
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Only 15 minutes left, Hurry up! ⏰',
      body: `Task "${title}" is due soon. Finish it now!`,
      sound: 'default',
      ...(Platform.OS === 'android' ? { channelId: 'task-reminders' } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });

  return id;
}

/**
 * Cancels a previously scheduled reminder (used when a task is
 * edited, deleted, or completed early).
 */
export async function cancelTaskReminder(notificationId?: string | null) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Notification may already have fired or been cancelled — ignore.
  }
}
