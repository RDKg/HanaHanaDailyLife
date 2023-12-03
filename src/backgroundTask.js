import { useEffect } from 'react'; 
import { Platform } from 'react-native';

import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

import { openDB, DatabaseService } from './data/databaseService';

const db = openDB('HanaHanaDailyLife.db');
const dbService = new DatabaseService(db);

export class NotificationsService {
    static async registerForPushNotifications() {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#ffffff',
            });
        }
      
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
    
            if (existingStatus  !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync()
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                throw new Error('Permission not granted!');
            }
    
            const token = (await Notifications.getExpoPushTokenAsync()).data
    
            return token;
        }
        catch (error) {
            console.log('Пользователь не разрешил Push-уведомления!');
        }
    }

    static async scheduleStartTaskNotification(taskData) {
        if (true) {
            await this.scheduleTaskNotification(
                'start_' + taskData.id, 
                taskData.title, 
                'Пришло время выполнять задачу!', 
                new Date(taskData.started_at)
            );
        }
    };

    static async scheduleEndTaskNotification(taskData) {
        if (true) {
            await this.scheduleTaskNotification(
                'end_' + taskData.id, 
                taskData.title, 
                'Посмотрие на результат завершенной задачи!', 
                new Date(taskData.ended_at)
            );
        }
    };
    
    static async scheduleTaskNotification(id, title, description, date) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: description
            },
            trigger: {
                date: date
            },
            identifier: id
        });
    } 

    static async cancelScheduleTaskNotification(id) {
        await Notifications.cancelScheduledNotificationAsync('start_' + id);
        await Notifications.cancelScheduledNotificationAsync('end_' + id);
    }
}
