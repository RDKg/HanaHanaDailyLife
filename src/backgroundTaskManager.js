import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

export class BackgroundTaskManager {
    static defineBackgroundTask(taskName, taskExecutor) {
        try {
            TaskManager.defineTask(taskName, async () => taskExecutor);
        }
        catch (error) {
            console.error(`Ошибка определения фоновой задачи: ${error}`);
        }
    }

    static async registerBackgroundTask(
        taskName, 
        {
            minimumInterval=60, 
            stopOnTerminate=false, 
            startOnBoot=true,
            endTimeout=new Date().getTime() + 60*15
        }
    ) {

        if (!await TaskManager.isTaskRegisteredAsync(taskName)) {
            console.error('Задача не может быть создана, т.к. еще не определена!');

            return;
        } 

        try {
            return BackgroundFetch.registerTaskAsync(taskName, {
                minimumInterval,
                stopOnTerminate,
                startOnBoot,
                endTimeout
            });
        }
        catch (error) {
            console.error(`Ошибка создания фоновой задачи: ${error}`);
        }
    }

    static async unregisterBackgroundTask(taskName) {
        try {
            return BackgroundFetch.unregisterTaskAsync(taskName);
        }
        catch (error) {
            console.error(`Ошибка отмены фоновой задачи: ${error}`);
        }
    }
}