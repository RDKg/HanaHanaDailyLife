import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, Text, View, RefreshControl, ImageBackground, ScrollView, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as constants from '../constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { LocalStorageHandler } from '../data/localStorageHandler.js';
import { DatabaseHandler } from '../data/dbHandler.js';
import { styles } from '../styles.js';

import { TaskDetailsScreen, TaskEditorScreen } from './TasksScreen.js';

const Stack = createNativeStackNavigator();

const db = DatabaseHandler.openDb('HanaHanaDailyLife.db');
const dbService = new DatabaseHandler(db);

export const ProfileTabNavigator = ({ route }) => {
    const canNavigatePreviousPage = route?.params?.canNavigatePreviousPage;

    return (
        <Stack.Navigator
            initialRouteName='HomeProfile'
            screenOptions={
                {
                    headerShown: false
                }
            }
        >
            <Stack.Screen name='HomeProfile' component={ProfileScreen} initialParams={{canNavigatePreviousPage, isReload: true}}/>
            <Stack.Screen name='TaskEditor' component={TaskEditorScreen}/>
            <Stack.Screen name='TaskDetails' component={TaskDetailsScreen}/>
        </Stack.Navigator>
    )
}

export const ProfileScreen = ({ navigation, route }) => {
    const canNavigatePreviousPage = route?.params?.canNavigatePreviousPage;
    const currentDate = new Date();
    const itemsPerPage = 10;
    
    const [username, setUsername] = useState();
    const [avatar, setAvatar] = useState();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [requestDataCount, setRequestDataCount] = useState(itemsPerPage);
    const [data, setData] = useState();

    const [title, setTitle] = useState('У вас нет ниодной активной задачи! :(')

    useEffect(() => {
        if (route?.params?.isReload) {
            onRefresh();
        }

        navigation.setParams({isReload: false})
    }, [route?.params?.isReload]);

    const fetchData = () => {
        const tasks = [];
        
        Promise.all([
            dbService.getTableData('category'),
            dbService.getTableData('activity'),
            dbService.getTableData(
                'task', 
                {orderBy: 'started_at', typeOrder: 'ASC'},
                [
                    {field: 'started_at', comparison: '<=', value: currentDate.getTime(), logicalOperator: 'AND'},
                    {field: 'ended_at', comparison: '>=', value: currentDate.getTime()}
                ]
            ),
            LocalStorageHandler.getStorageItem('username'),
            LocalStorageHandler.getStorageItem('avatar')
        ])
        .then(([
            categoryResult, 
            activityResult, 
            tasksResult, 
            usernameResult, 
            avatarResult
        ]) => {
            const categories = categoryResult._array.map(item => ({
                key: item.id,
                value: item.title,
                avatar: item.avatar
            }));
            const activities = activityResult._array.map(item => ({
                category_id: item.category_id,
                key: item.id,
                value: item.title
            }))
            tasksResult._array.forEach((item) => {
                const date = new Date(item.started_at);
                const formattedDate = utils.convertDateToStringFormat(date, {isHour: false, isMinute: false});
                const data = {
                    title: formattedDate,
                    data: [{
                        ...item,
                        avatar: categoryResult._array[item.category_id].avatar,
                        started_at: item.started_at,
                        ended_at: item.ended_at
                    }]
                };
                
                const existingItemIndex = tasks.findIndex((findIndex) => findIndex.title == formattedDate);

                if (existingItemIndex !== -1) {
                    tasks[existingItemIndex].data.push(data.data[0])
                } 
                else {
                    tasks.push(data);
                }
            });

            if (tasksResult._array.length === 0) {
                setTitle('У вас нет ниодной активной задачи! :(');
            }
            else if (tasksResult._array.length === 1) {
                setTitle('У вас есть одна активная задача! :)');
            }
            else {
                setTitle(`У вас ${tasksResult._array.length} активных задач! :#`);
            }

            setData({
                categories,
                activities,
                tasks
            });
            setIsDataLoaded(true);
            setUsername(usernameResult);
            setAvatar(avatarResult);
        });
    };

    const onRefresh = () => {
        setIsDataLoaded(false);
        fetchData();
        setRequestDataCount(itemsPerPage);
        setIsRefreshing(false);
    };

    const handleScroll = (event) => {
        const { nativeEvent } = event;
        const offsetY = nativeEvent.contentOffset.y;
        const contentHeight = nativeEvent.contentSize.height;
        const scrollViewHeight = nativeEvent.layoutMeasurement.height;

        if (offsetY + scrollViewHeight >= contentHeight && isDataLoaded) {
            setIsDataLoaded(false); 
            setRequestDataCount(prevState => (prevState + itemsPerPage));
            fetchData();
        }
    };

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundImageProfile/>
            { 
                canNavigatePreviousPage &&
                <components.NavigatePreviousScreenButton onPress={() => navigation.goBack()}/>
            }
            <SafeAreaView style={{gap: constants.MARGIN, position: 'relative', flex: 1}}>
                <View style={{...styles.mainContainerDefault}}>
                    <View style={{gap: constants.MARGIN, width: '100%'}}>
                        <View style={{
                            ...styles.defaultBox,
                            ...styles.dropShadow,
                            height: 50,
                            position: 'relative',
                            alignItems: 'center',
                        }}>
                            <ImageBackground source={require('../../assets/img/flower.png')} style={{
                                position: 'absolute',
                                width: 39.25,
                                height: 37.4,
                                left: -7,
                                bottom: -9,
                                transform: [{rotate: '30deg'}]
                            }}/>
                            <ImageBackground source={require('../../assets/img/flower.png')} style={{
                                position: 'absolute',
                                width: 24.89,
                                height: 23.72,
                                right: 107,
                                top: -10,
                                transform: [{rotate: '30deg'}]
                            }}/>
                            <ImageBackground source={require('../../assets/img/flower.png')} style={{
                                position: 'absolute',
                                width: 18.27,
                                height: 17.41,
                                right: -1,
                                bottom: -2,
                                transform: [{rotate: '30deg'}]
                            }}/>
                            <Text style={{...styles.defaultTextSentences, fontSize: 16}}>{username}</Text>
                        </View>
                    </View>
                    <View 
                        width={64} 
                        height={64} 
                        style={{
                            backgroundColor: utils.convertColorDataToString(constants.WHITE_COLOR),
                            borderRadius: constants.BORDER_RADIUS,
                            overflow: 'hidden'
                        }}
                    >
                        <Image source={{uri: avatar}} style={{aspectRatio: 1}}/>
                    </View>
                    <Text style={{
                            ...styles.screenTitleText,
                            width: '80%',
                            textAlign: 'center',
                            paddingTop: constants.PADDING*2
                        }}
                    >{title}</Text>
                </View>
                <ScrollView
                    style={{height: '100%', width: '100%'}}
                    scrollEventThrottle={250}
                    onScroll={handleScroll}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={[utils.convertColorDataToString(constants.PINK_COLOR)]}
                        />
                    }
                >
                    <View style={{...styles.mainContainerDefault}}>
                        <components.TaskButton
                            onPress={() => navigation.navigate('TaskEditor', {canNavigatePreviousPage: true, prevScreenName: 'HomeProfile'})}
                            AvatarComponent={constants.TASKS_AVATARS.addTaskAvatar}
                            title={'Добавить новый план'}
                        />
                        {
                            data?.tasks &&
                            <components.TasksButtons
                                currentScreenName='HomeProfile'
                                data={data?.tasks}
                                navigation={navigation}
                            />
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
