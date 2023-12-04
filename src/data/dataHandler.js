import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageHandler {
    static async getStorageItem(key) {
        try {
            const value = await AsyncStorage.getItem(key);
    
            return value;
        }
        catch (error) {
            console.error(`Ошибка получения данных из локального хранилища: ${error}`);
        }
    
        return null;
    }
    
    static async removeStorageItem(key) {
        try {
            await AsyncStorage.removeItem(key);
    
            return true;
        }
        catch (error) {
            console.error(`Ошибка удаления данных из локального хранилища: ${error}`);
        }
    
        return false;
    }
    
    static async saveStorageItem (key, item) {
        try {
            await AsyncStorage.setItem(key, item);
    
            return true;
        }
        catch (error) {
            console.error(`Ошибка сохранения данных в локальное хранилище: ${error}`);
        }
    
        return false;
    }
    
    static async saveStorageItemIfNotExists(key, item) {
        const value = await this.getStorageItem(key);
    
        if (value === null) {
            await this.saveStorageItem(key, item);
        }
    }
}

StorageHandler.saveStorageItemIfNotExists('isTaskStartNotificationsEnabled', 'true');
StorageHandler.saveStorageItemIfNotExists('isTaskEndNotificationsEnabled', 'true');
StorageHandler.saveStorageItemIfNotExists('username', 'Ваш профиль');