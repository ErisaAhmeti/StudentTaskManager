
import * as Notifications from 'expo-notifications';

export const scheduleTaskReminder = async (task) => {
  try {
    const trigger = new Date(task.deadline);
    trigger.setHours(9, 0, 0); // Set reminder for 9 AM on deadline day

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📅 Task Deadline Reminder',
        body: `${task.title} for ${task.course} is due today!`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        categoryIdentifier: 'TASK_REMINDER', // Kategori për njoftimet
      },
      trigger,
    });

    console.log('Notification scheduled with ID:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
};

export const requestNotificationPermission = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Failed to request notification permissions:', error);
    return false;
  }
};

export const cancelScheduledNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Notification canceled:', notificationId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
};