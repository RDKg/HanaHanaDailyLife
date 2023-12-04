import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, RefreshControl, TextInput, ImageBackground, ScrollView } from 'react-native';

import * as constants from '../styles/constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { StorageHandler } from '../data/dataHandler.js';
import { openDB, DatabaseService } from '../data/databaseService.js';
import { styles } from '../styles/styles.js';
import { NotificationsService } from '../backgroundTask.js';

const db = openDB('HanaHanaDailyLife.db');
const dbService = new DatabaseService(db);

export const SettingsScreen = ({ navigation, route }) => {
    const withGoBack = route?.params?.withGoBack;
    const currentDate = new Date();

    const [username, setUsername] = useState();
    
    const [isTaskStartNotificationsEnabled, setIsTaskStartNotificationsEnabled] = useState();
    const [isTaskEndNotificationsEnabled, setIsTaskEndNotificationsEnabled] = useState();
    const [isChangeUsernameButtonPressed, setIsChangeUsernameButtonPressed] = useState();
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = async () => {
        const isStartEnabled = await StorageHandler.getStorageItem('isTaskStartNotificationsEnabled');
        const isEndEnabled = await StorageHandler.getStorageItem('isTaskEndNotificationsEnabled');
        const name = await StorageHandler.getStorageItem('username');

        return {
            isStartEnabled,
            isEndEnabled,
            name
        }
    }

    const fetchTasksNotificationsData = async () => {
        const tasksData = await dbService.getTableData(
            'task',
            [
                {field: 'started_at', comparison: '>=', value: currentDate.getTime()},
                {field: 'ended_at', comparison: '<=', value: currentDate.getTime()},
            ]
        )

        const tasksNotificationsData = tasksData._array.map(item => {
            return {
                id: item.id,
                title: item.title,
                started_at: item.started_at,
                ended_at: item.ended_at,
            }
        })

        return tasksNotificationsData;
    }
 
    const changeUsername = (value) => {
        setUsername(value);
    }

    const onRefresh = () => {
        setIsDataLoaded(false);
    };

    useEffect(() => {
        if (isDataLoaded) {
            StorageHandler.saveStorageItem('isTaskStartNotificationsEnabled', `${isTaskStartNotificationsEnabled}`);
        }

        if (isTaskStartNotificationsEnabled) {
            fetchTasksNotificationsData()
            .then(result => {
                result.forEach(item => {
                    NotificationsService.scheduleStartTaskNotification(item);
                })
            })
        }
        else {
            NotificationsService.cancelAllScheduledTasksNotifications('start');
        }
    }, [isTaskStartNotificationsEnabled]);

    useEffect(() => {
        if (isDataLoaded) {
            StorageHandler.saveStorageItem('isTaskEndNotificationsEnabled', `${isTaskEndNotificationsEnabled}`);
        }

        if (isTaskEndNotificationsEnabled) {
            fetchTasksNotificationsData()
            .then(result => {
                result.forEach(item => {
                    NotificationsService.scheduleEndTaskNotification(item);
                })
            })
        }
        else {
            NotificationsService.cancelAllScheduledTasksNotifications('end');
        }
    }, [isTaskEndNotificationsEnabled]);

    useEffect(() => {
        if (isChangeUsernameButtonPressed) {
            StorageHandler.saveStorageItem('username', username);

            setIsChangeUsernameButtonPressed(false);
        }
    }, [isChangeUsernameButtonPressed]);

    useEffect(() => {
        fetchData()
        .then(result => {
            setIsTaskStartNotificationsEnabled(result.isStartEnabled != 'false');
            setIsTaskEndNotificationsEnabled(result.isEndEnabled != 'false');
            setUsername(result.name);
            setIsDataLoaded(true);
            setIsRefreshing(false);
        });
    }, [isDataLoaded]);

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundComponent/>
            <components.GoBackButton onPress={() => navigation.goBack()} withGoBack={withGoBack}/>
            <SafeAreaView style={{gap: constants.margin, position: 'relative', flex: 1}}>   
                <ScrollView 
                    style={{height: '100%'}}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={[utils.convertColorDataToString(constants.pinkColor)]}
                        />
                    }
                >
                    <View 
                        style={{
                            ...styles.mainContainerDefault, 
                            alignItems: 'flex-start',
                            gap: constants.padding
                        }}
                    >
                        {
                            isDataLoaded && 
                            <>
                                <View 
                                    style={{
                                        ...styles.defaultBox, 
                                        ...styles.dropShadow,
                                        padding: constants.padding,
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        width: '100%',
                                    }}
                                >
                                    <View 
                                        style={{
                                            backgroundColor: utils.convertColorDataToString(constants.grayColor),
                                            borderRadius: constants.borderRadius,
                                            width: 64,
                                            height: 64
                                        }}
                                    >
                                        <ImageBackground/>
                                    </View>
                                    <components.CustomButton 
                                        title="Установить аватарку"
                                    />
                                </View>
                                <View style={{position: 'relative', width: '100%'}}>
                                    <TextInput
                                        onChangeText={(value) => changeUsername(value)}
                                        placeholder='Как к вам обращаться?'
                                        defaultValue={username}
                                        maxLength={30}
                                        style={{
                                            ...styles.inputAreaText, 
                                            ...styles.defaultBox,
                                            ...styles.dropShadow,
                                            padding: constants.padding,
                                            width: '100%'
                                        }}
                                    />
                                    <components.CustomButton
                                        title="ОК"
                                        onPress={() => setIsChangeUsernameButtonPressed(true)}
                                        style={{
                                            position: 'absolute',
                                            right: 0,
                                            height: '100%',
                                            borderTopLeftRadius: 0,
                                            borderBottomLeftRadius: 0,
                                        }}
                                    />
                                </View>
                                <View style={{width: '100%'}}>
                                    <components.ToggleBox
                                        title="Уведомление об активации задания"
                                        isChecked={isTaskStartNotificationsEnabled}
                                        onPress={() => setIsTaskStartNotificationsEnabled(!isTaskStartNotificationsEnabled)}
                                    />
                                </View>
                                <View style={{width: '100%'}}>
                                    <components.ToggleBox
                                        title="Уведомление об окончании задания"
                                        isChecked={isTaskEndNotificationsEnabled}
                                        onPress={() => setIsTaskEndNotificationsEnabled(!isTaskEndNotificationsEnabled)}
                                    />
                                </View>
                            </>
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
