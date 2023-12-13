import React, { useState, useEffect, Fragment } from 'react';
import { SafeAreaView, View, TouchableHighlight, ScrollView, RefreshControl } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as constants from '../constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { DatabaseHandler } from '../data/databaseHandler.js';
import { styles } from '../styles.js';
import { TaskEditorScreen } from './TaskEditorScreen.js';
import { TaskDetailsScreen } from './TaskDetailsScreen.js';

import HistorySVG from '../../assets/ico/history-ico.svg';

const Stack = createNativeStackNavigator();

const db = DatabaseHandler.openDb('HanaHanaDailyLife.db');
const dbHandler = new DatabaseHandler(db);

export const TaskTabNavigator = ({route}) => {
    const canNavigatePreviousPage = route?.params?.canNavigatePreviousPage;

    return (
        <Stack.Navigator
            initialRouteName='HomeTask'
            screenOptions={
                {
                    headerShown: false
                }
            }
        >
            <Stack.Screen name='HomeTask' component={TasksScreen} initialParams={{canNavigatePreviousPage, isReload: true}}/>
            <Stack.Screen name='TaskEditor' component={TaskEditorScreen} initialParams={{canNavigatePreviousPage: true}}/>
            <Stack.Screen name='TaskDetails' component={TaskDetailsScreen} initialParams={{canNavigatePreviousPage: true}}/>
        </Stack.Navigator>
    )
}

export const TasksScreen = ({navigation, route}) => {
    const canNavigatePreviousPage = route?.params?.canNavigatePreviousPage;
    const currentDate = new Date();
    const itemsPerPage = 10;
    
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isShowingCompleted, setIsShowingCompleted] = useState(false);

    const [requestDataCount, setRequestDataCount] = useState(itemsPerPage);
    const [data, setData] = useState();

    const fetchData = () => {
        const tasks = [];
        const condition = isShowingCompleted ? [
            {field: 'ended_at', comparison: '<=', value: currentDate.getTime()}
        ] : [
            {field: 'ended_at', comparison: '>', value: currentDate.getTime()}
        ];

        Promise.all([
            dbHandler.getTableEntries('category'),
            dbHandler.getTableEntries('activity'),
            dbHandler.getTableEntries(
                'task', 
                {orderBy: 'started_at', typeOrder: 'ASC'},
                condition,
                {limit: requestDataCount},
            )
        ])
        .then(([categoryResult, activityResult, tasksResult]) => {
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

            setData({
                categories,
                activities,
                tasks
            });
            setIsDataLoaded(true);
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

    useEffect(() => {
        onRefresh();
    }, [isShowingCompleted]);

    useEffect(() => {
        if (route?.params?.isReload) {
            onRefresh();
        }

        navigation.setParams({isReload: false})
    }, [route?.params?.isReload]);

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundImage/>
            { 
                canNavigatePreviousPage &&
                <components.NavigatePreviousScreenButton onPress={() => navigation.goBack()}/>
            }
            <TouchableHighlight 
                onPress={() => {setIsShowingCompleted(!isShowingCompleted)}}
                underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
                style={{ 
                    ...styles.defaultBox,
                    ...styles.dropShadow,
                    borderColor: isShowingCompleted ? utils.convertColorDataToString(constants.PURPLE_COLOR) : 'transparent',
                    borderWidth: 1,
                    position: 'absolute', 
                    bottom: constants.MARGIN,
                    right: constants.MARGIN,
                    padding: constants.PADDING,
                    zIndex: 9999,
                }}
            >
                <HistorySVG width={26} height={26}/>
            </TouchableHighlight>
            <SafeAreaView style={{gap: constants.MARGIN, position: 'relative', flex: 1}}>   
                <ScrollView
                    style={{height: '100%'}}
                    scrollEventThrottle={250}
                    onMomentumScrollEnd={handleScroll}
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
                            onPress={() => navigation.navigate('TaskEditor', {canNavigatePreviousPage: true, prevScreenName: 'HomeTask'})}
                            AvatarComponent={constants.TASKS_AVATARS.addTaskAvatar}
                            title={'Добавить новый план'}
                        />
                        {
                            data?.tasks &&
                            <components.TasksButtons
                                currentScreenName='HomeTask'
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