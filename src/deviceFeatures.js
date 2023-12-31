import { Platform, Alert, Linking } from 'react-native';

import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { LocalStorageHandler } from './data/localStorageHandler';

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
            console.error(`The user didn't allow Push notifications!: ${error}`);
        }
    }

    static async scheduleStartTaskNotification(taskData) {
        const isStartEnabled = await LocalStorageHandler.getStorageItem('isTaskStartNotificationsEnabled') == 'true';

        if (isStartEnabled) {
            await this.scheduleTaskNotification(
                'start' + taskData.id, 
                taskData.title, 
                'Пришло время выполнять задачу!', 
                new Date(taskData.started_at)
            );
        }
    };

    static async scheduleEndTaskNotification(taskData) {
        const isEndEnabled = await LocalStorageHandler.getStorageItem('isTaskEndNotificationsEnabled') == 'true';

        if (isEndEnabled) {
            await this.scheduleTaskNotification(
                'end' + taskData.id, 
                taskData.title, 
                'Посмотрие на результат завершенной задачи!', 
                new Date(taskData.ended_at)
            );
        }
    };

    static async cancelAllScheduledTasksNotifications(type) {
        const notifications = await Notifications.getAllScheduledNotificationsAsync();

        notifications.forEach(item => {
            if (item.identifier.includes(type)) {
                Notifications.cancelScheduledNotificationAsync(item.identifier);
            }
        });
    }

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

    static async cancelScheduledTaskNotification(id) {
        await Notifications.cancelScheduledNotificationAsync('start_' + id);
        await Notifications.cancelScheduledNotificationAsync('end_' + id);
    }
}

export class LocationService {
    static async registerForForegroundLocationPermission() {
        try {
            const foregroundResponse = await Location.requestForegroundPermissionsAsync();
    
            return foregroundResponse.status === 'granted';
        }
        catch (error) {
            console.error(`Error in obtaining permission to use geolocation: ${error}`);
    
            return false;
        }
    }
    
    static async registerForBackgroundLocationPermission() {
        try {
            const backgroundResponse = await Location.requestBackgroundPermissionsAsync();
    
            return backgroundResponse.status === 'granted';
        }
        catch (error) {
            console.error(`Error in obtaining permission to use geolocation in the background: ${error}`);
    
            return false
        }
    }
    
    static async isLocationEnabled() {
        try {
            const status = await Location.getProviderStatusAsync();
    
            return status.gpsAvailable;
        }
        catch (error) {
            console.error(`Couldn't check if geolocation is enabled: ${error}`);
    
            return false;
        }
    }

    static async getCurrentLocation(
        accuracy=Location.Accuracy.Balanced, 
        latitudeDelta=0.0035, 
        longitudeDelta=0.0035
    ) {
        try {
            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: accuracy
            });
    
            return {
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta,
            };
        }
        catch (error) {
            console.error(`Error getting the current geolocation: ${error}`);
    
            return null;
        }
    }

    static async checkLocationPermissionsAndStatus() {
        let isForegroundGranted = false;
        let isBackgroundGranted = false;
        let isLocationEnabled = false;
    
        const checkLocationEnabled = async () => {
            isLocationEnabled = await this.isLocationEnabled();
    
            if (!isLocationEnabled) {
                showLocationSettingAlert();
            } 
            else {
                await checkForegroundPermission();
            }
        };
    
        const checkForegroundPermission = async () => {
            isForegroundGranted = await this.registerForForegroundLocationPermission();
    
            if (!isForegroundGranted) {
                showForegroundPermissionAlert();
            } 
            else {
                await checkBackgroundPermission();
            }
        };
    
        const checkBackgroundPermission = async () => {
            isBackgroundGranted = await this.registerForBackgroundLocationPermission();
    
            if (!isBackgroundGranted) {
                showBackgroundPermissionAlert();
            }
        };
    
        const showLocationSettingAlert = () => {
            Alert.alert(
                'Геолокация',
                'Для полной работы приложения желательно включить геолокацию.',
                [
                    {text: 'ОК', onPress: () => {}}
                ]
            );
        }
    
        const showForegroundPermissionAlert = () => {
            Alert.alert(
                'Разрешения',
                'Для полной работы приложения желательно разрешить отслеживание геолокации.',
                [
                    { text: 'Не хочу', onPress: () => { } },
                    { text: 'Предоставить разрешение', onPress: () => Linking.openSettings() },
                ]
            );
        };
    
        const showBackgroundPermissionAlert = () => {
            Alert.alert(
                'Разрешения',
                'Для полной работы приложения желательно разрешить доступ к геолокации в любое время.',
                [
                    { text: 'Не хочу', onPress: () => { } },
                    { text: 'Предоставить разрешение', onPress: () => Linking.openSettings() },
                ]
            );
        };
    
        await checkLocationEnabled();
    
        return {
            isForegroundGranted,
            isBackgroundGranted,
            isLocationEnabled
        };
    }
}

export class MediaLibraryService {
    static async registerMediaLibraryPermissions() {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            return status !== 'granted';
        }
        catch (error) {
            console.error(`Error accessing the gallery: ${error}`);

            return false;
        }
    }

    static async pickImage() {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1
            });
    
            if (!result.canceled) {
                return result.assets[0].uri;
            }

            throw 'Отмена выбора фотографии!';
        }
        catch (error) {
            console.error(`Error getting a photo from the gallery: ${error}`);
        }
    }
}