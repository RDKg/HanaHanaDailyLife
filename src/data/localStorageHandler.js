import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStorageHandler {
    static async getStorageItem(key) {
        try {
            const value = await AsyncStorage.getItem(key);

            return value;
        }
        catch (error) {
            console.error(`Error retrieving data from local storage: ${error}`);
        }
    
        return null;
    }
    
    static async removeStorageItem(key) {
        try {
            await AsyncStorage.removeItem(key);
    
            return true;
        }
        catch (error) {
            console.error(`Error deleting data from local storage: ${error}`);
        }
    
        return false;
    }
    
    static async saveStorageItem (key, item) {
        try {
            await AsyncStorage.setItem(key, item);
    
            return true;
        }
        catch (error) {
            console.error(`Error saving data to local storage: ${error}`);
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

LocalStorageHandler.saveStorageItemIfNotExists('isTaskStartNotificationsEnabled', 'true');
LocalStorageHandler.saveStorageItemIfNotExists('isTaskEndNotificationsEnabled', 'true');
LocalStorageHandler.saveStorageItemIfNotExists('username', 'Ваш профиль');
LocalStorageHandler.saveStorageItemIfNotExists('avatar', '../../assets/img/default-avatar.jpg');