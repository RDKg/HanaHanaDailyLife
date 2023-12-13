import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

export class BackgroundTaskManager {
    static defineBackgroundTask(taskName, taskExecutor) {
        try {
            TaskManager.defineTask(taskName, async () => taskExecutor);
        }
        catch (error) {
            console.error(`Background task define error: ${error}`);
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
            console.error('The task cannot be created because it has not been defined yet!');

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
            console.error(`Error creating a background task: ${error}`);
        }
    }

    static async unregisterBackgroundTask(taskName) {
        try {
            return BackgroundFetch.unregisterTaskAsync(taskName);
        }
        catch (error) {
            console.error(`Background task cancellation error: ${error}`);
        }
    }
}