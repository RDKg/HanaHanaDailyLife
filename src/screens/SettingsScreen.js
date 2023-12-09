import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, RefreshControl, TextInput, ImageBackground, ScrollView, TouchableHighlight, Text } from 'react-native';

import * as constants from '../constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { LocalStorageHandler } from '../data/localStorageHandler.js';
import { DatabaseHandler } from '../data/dbHandler.js';
import { styles } from '../styles.js';
import { NotificationsService } from '../deviceFeatures.js';

const db = DatabaseHandler.openDb('HanaHanaDailyLife.db');
const dbService = new DatabaseHandler(db);

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
        const isStartEnabled = await LocalStorageHandler.getStorageItem('isTaskStartNotificationsEnabled');
        const isEndEnabled = await LocalStorageHandler.getStorageItem('isTaskEndNotificationsEnabled');
        const name = await LocalStorageHandler.getStorageItem('username');

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
            LocalStorageHandler.saveStorageItem('isTaskStartNotificationsEnabled', `${isTaskStartNotificationsEnabled}`);
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
            LocalStorageHandler.saveStorageItem('isTaskEndNotificationsEnabled', `${isTaskEndNotificationsEnabled}`);
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
            LocalStorageHandler.saveStorageItem('username', username);

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
            <components.BackgroundImage/>
            { 
                withGoBack &&
                <components.NavigatePreviousScreenButton onPress={() => navigation.goBack()}/>
            }
            <SafeAreaView style={{gap: constants.MARGIN, position: 'relative', flex: 1}}>   
                <ScrollView 
                    style={{height: '100%'}}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={[utils.convertColorDataToString(constants.PINK_COLOR)]}
                        />
                    }
                >
                    <View 
                        style={{
                            ...styles.mainContainerDefault, 
                            alignItems: 'flex-start',
                            gap: constants.PADDING
                        }}
                    >
                        {
                            isDataLoaded && 
                            <>
                                <View 
                                    style={{
                                        ...styles.defaultBox, 
                                        ...styles.dropShadow,
                                        padding: constants.PADDING,
                                        gap: constants.PADDING,
                                        width: '100%',
                                    }}
                                >
                                    <View 
                                        style={{
                                            backgroundColor: utils.convertColorDataToString(constants.GRAY_COLOR),
                                            borderRadius: constants.BORDER_RADIUS,
                                            width: '100%',
                                            aspectRatio: 1,
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <ImageBackground/>
                                        <TouchableHighlight
                                            onPress={() => {}}
                                            underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
                                            style={{ 
                                                backgroundColor: utils.convertColorDataToString(constants.BLACK_COLOR),
                                                height: 50,
                                                width: '100%',
                                                position: 'absolute',
                                                bottom: 0,
                                                opacity: 0.2,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text style={styles.hintText}>ИЗМЕНИТЬ ФОТОГРАФИЮ</Text>
                                        </TouchableHighlight>
                                    </View>
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
                                            padding: constants.PADDING,
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
