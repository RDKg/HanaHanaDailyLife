import React, { useState, useEffect, useRef, Fragment } from 'react';
import { SafeAreaView, Text, View, TouchableHighlight, ScrollView, Alert, Linking, TextInput, RefreshControl } from 'react-native';
import { Line, Svg } from 'react-native-svg';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';

import { v4 as uuidv4 } from 'uuid'; 
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

import * as constants from '../styles/constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { NotificationsService } from '../backgroundTask.js';
import { openDB, DatabaseService, Task } from '../data/databaseService.js';
import { styles } from '../styles/styles.js';

import HistorySVG from '../../assets/ico/history-ico.svg';

const Stack = createNativeStackNavigator();

const db = openDB('HanaHanaDailyLife.db');
const dbService = new DatabaseService(db);

export const TaskTabNavigator = ({route}) => {
    const withGoBack = route?.params?.withGoBack;

    return (
        <Stack.Navigator
            initialRouteName='HomeTask'
            screenOptions={
                {
                    headerShown: false
                }
            }
        >
            <Stack.Screen name='HomeTask' component={TasksScreen} initialParams={{withGoBack}}/>
            <Stack.Screen name='TaskEditor' component={TaskEditorScreen}/>
            <Stack.Screen name='TaskDetails' component={TaskDetailsScreen}/>
        </Stack.Navigator>
    )
}

export const TasksScreen = ({navigation, route}) => {
    const withGoBack = route?.params?.withGoBack;
    const currentDate = new Date();
    const itemsPerPage = 10;

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isShowingCompleted, setIsShowingCompleted] = useState(false);

    const [requestDataCount, setRequestDataCount] = useState(itemsPerPage);
    const [data, setData] = useState();
 
    useEffect(() => {
        onRefresh();
    }, [isShowingCompleted]);

    useEffect(() => {
        if (route?.params?.isReload) {
            onRefresh();
        }

        navigation.setParams({isReload: false})
    }, [route?.params?.isReload]);

    const fetchData = () => {
        const tasks = [];
        const condition = isShowingCompleted ? [
            {field: 'ended_at', comparison: '<=', value: currentDate.getTime()}
        ] : [
            {field: 'ended_at', comparison: '>', value: currentDate.getTime()}
        ];

        Promise.all([
            dbService.getTableData('category'),
            dbService.getTableData('activity'),
            dbService.getTableData(
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

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundComponent/>
            <components.GoBackButton onPress={() => navigation.goBack()} withGoBack={withGoBack}/>
            <TouchableHighlight 
                onPress={() => {setIsShowingCompleted(!isShowingCompleted)}}
                underlayColor={utils.convertColorDataToString(constants.grayColor)}
                style={{ 
                    ...styles.defaultBox,
                    ...styles.dropShadow,
                    borderColor: isShowingCompleted ? utils.convertColorDataToString(constants.purpleColor) : 'transparent',
                    borderWidth: 1,
                    position: 'absolute', 
                    bottom: constants.margin,
                    right: constants.margin,
                    padding: constants.padding,
                    zIndex: 9999,
                }}
            >
                <HistorySVG width={26} height={26}/>
            </TouchableHighlight>
            <SafeAreaView style={{gap: constants.margin, position: 'relative', flex: 1}}>   
                <ScrollView
                    style={{height: '100%'}}
                    scrollEventThrottle={250}
                    onScroll={handleScroll}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={[utils.convertColorDataToString(constants.pinkColor)]}
                        />
                    }
                >
                    <View style={{...styles.mainContainerDefault}}>
                        <components.TaskButton
                            onPress={() => navigation.navigate('TaskEditor', {withGoBack: true, prevScreenName: 'HomeTask'})}
                            AvatarComponent={constants.avatars.PlusTaskAvatar}
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

export const TaskEditorScreen = ({navigation, route}) => {
    const withGoBack = route?.params?.withGoBack;
    const prevScreenName = route.params?.prevScreenName;
    const taskData = route?.params?.data;
    const currentDate = new Date();
    const datePlusMinute = new Date(currentDate.getTime() + 60 * 1000);

    const [data, setData] = useState({});
    const [currentActivitiesData, setCurrentActivitiesData] = useState();
    const [currentCategoryData, setCurrentCategoryData] = useState();
    const [locationSettingsData, setLocationSettingsData] = useState({
        isForegroundGranted: null,
        isBackgroundGranted: null,
        isLocationEnabled: null,
    });

    const [isMapEnabled, setIsMapEnabled] = useState(false);
    const [isRouteFollowing, setIsRouteFollowing] = useState(false);

    const [showingStartDateTimePicker, setShowingStartDateTimePicker] = useState();
    const [formattedStartDateText, setFormattedStartDateText] = useState();
    const [formattedEndDateText, setFormattedEndDateText] = useState();

    const [lastSelectedLocationType, setLastSelectedLocationType] = useState('start');
    const [currentLocation, setCurrentLocation] = useState();
    const [startLocation, setStartLocation] = useState();
    const [endLocation, setEndLocation] = useState();

    const [selectedCategoryID, setSelectedCategoryID] = useState();
    const [selectedActivityID, setSelectedActivityID] = useState();
    const [selectedActivityData, setSelectedActivityData] = useState();

    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [budget, setBudget] = useState(0);

    const [startDate, setStartDate] = useState(datePlusMinute);
    const [endDate, setEndDate] = useState(datePlusMinute);

    const [validationErrors, setValidationErrors] = useState({});
    
    const addLocationMarker = (event) => {
        const { coordinate } = event.nativeEvent;

        if (lastSelectedLocationType === 'start') {
            setLastSelectedLocationType('end');
            setStartLocation(coordinate);
        }   
        else {
            setLastSelectedLocationType('start');
            setEndLocation(coordinate);
        }
    }

    const deleteLocationMarker = (event) => {
        const { coordinate } = event.nativeEvent;

        if (JSON.stringify(coordinate) === JSON.stringify(endLocation)) {
            setEndLocation(null);
            setLastSelectedLocationType('end');
        }
        else {
            setStartLocation(null);
            setLastSelectedLocationType('start');
        }
    }

    const getNewTaskData = () => {
        const result = {
            title: title || 'Без названия',
            description: description || 'Описание отсутствует',
            budget: Number.parseInt(budget),
            is_route_following: isRouteFollowing,
            is_map_enabled: isMapEnabled,
            start_latitude: startLocation?.latitude,
            start_longitude: startLocation?.longitude,
            end_latitude: endLocation?.latitude,
            end_longitude: endLocation?.longitude,
            created_at: currentDate.getTime(),
            started_at: startDate.getTime(),
            ended_at: endDate.getTime(),
            category_id: selectedCategoryID + 1 ? selectedCategoryID : null,
            activity_id: selectedActivityID + 1 ? selectedActivityID : null,
        };

        if (taskData) {
            result['id'] = taskData?.id;
        }

        return result;
    }

    const createTask = () => {
        const newTaskData = getNewTaskData();
        const taskValidation = new Task(newTaskData);

        setValidationErrors(taskValidation.errors);

        if (Object.keys(taskValidation.errors).length === 0) {
            dbService.insertData('task', newTaskData);
            NotificationsService.scheduleStartTaskNotification(newTaskData);
            NotificationsService.scheduleEndTaskNotification(newTaskData);
            navigation.navigate(prevScreenName, {isReload: true});
        }
    } 

    const changeTask = () => {
        const newTaskData = getNewTaskData();
        const taskValidation = new Task(newTaskData);

        setValidationErrors(taskValidation.errors);

        if (new Date(taskData.started_at) <= currentDate) {
            Alert.alert(
                'Ошибка',
                'Данная задача уже началась и изменить ее невозможно.',
                [
                    {
                        text: 'ОК',
                        onPress: () => {},
                    },
                ]
            );

            navigation.navigate(prevScreenName);
        }
        else if (Object.keys(taskValidation.errors).length === 0) {
            dbService.updateData('task', newTaskData);
            NotificationsService.cancelScheduleTaskNotification(newTaskData.id);
            NotificationsService.scheduleStartTaskNotification(newTaskData);
            NotificationsService.scheduleEndTaskNotification(newTaskData);
            navigation.navigate(prevScreenName, {isReload: true});
        }
    }

    const deleteTask = () => {
        Alert.alert(
            'Удалить задачу',
            'Вы уверены, что хотите удалить задачу?',
            [
                {
                    text: 'ДА',
                    onPress: () => {
                        dbService.deleteData('task', taskData.id);
                        NotificationsService.cancelScheduleTaskNotification(taskData.id);
                        navigation.navigate(prevScreenName, {isReload: true});
                    },
                },
                {
                    text: 'Я передумал',
                    onPress: () => {},
                },
            ]
        );
    }

    // Проверка включенной геолокации и разрешений на нее
    useEffect(() => {
        utils.checkLocation()
        .then(({ isBackgroundGranted, isForegroundGranted, isLocationEnabled }) => {
            setLocationSettingsData({
                isForegroundGranted,
                isBackgroundGranted,
                isLocationEnabled
            });

            if (isLocationEnabled) {
                setIsMapEnabled(true);
            }

            if (isBackgroundGranted) {
                setIsRouteFollowing(isBackgroundGranted);
            }
        });
    }, []);

    // Если были переданы данные об ивенте, то устанавливаем их
    useEffect(() => {
        if (taskData) {
            setIsMapEnabled(taskData?.is_map_enabled);
            setIsRouteFollowing(taskData?.is_route_following);
            setStartLocation(        
                taskData.start_longitude && taskData.start_latitude ?
                {
                    longitude: taskData?.start_longitude,
                    latitude: taskData?.start_latitude,
                } :
                null
            );
            setEndLocation(
                taskData.end_longitude && taskData.end_latitude ?
                {
                    longitude: taskData?.end_longitude,
                    latitude: taskData?.end_latitude,
                } :
                null
            );
            setSelectedCategoryID(taskData?.category_id);
            setSelectedActivityID(taskData?.activity_id);
            setTitle(taskData?.title);
            setDescription(taskData?.description);
            setBudget(taskData?.budget);
            setStartDate(new Date(taskData?.started_at));
            setEndDate(new Date(taskData?.ended_at));
        }
    }, []);

    // Получаем переданные данные, которые должны обновиться после получения данных из БД
    useEffect(() => {
        if (taskData && locationSettingsData.isForegroundGranted !== null) {
            setIsMapEnabled(taskData?.is_map_enabled);
        }
        if (taskData && locationSettingsData.isBackgroundGranted !== null) {
            setIsRouteFollowing(taskData.is_route_following);
        }
    }, [locationSettingsData]);

    // Получаем категории и активности из БД
    useEffect(() => {
        Promise.all([
            dbService.getTableData('category'),
            dbService.getTableData('activity')
        ])
        .then(([categoryResult, activityResult]) => {
            const categories = categoryResult._array.map(item => ({
                key: item.id-1,
                value: item.title,
            }));
            const activities = activityResult._array.map(item => ({
                category_id: item.category_id-1,
                key: item.id-1,
                value: item.title
            }));

            setData({
                categories,
                activities
            })
        });
    }, []);

    // Обновляем список активностей при изменении категории
    useEffect(() => {
        if (data.activities) {
            const activitiesData = data.activities.filter(item => item.category_id === selectedCategoryID);
            const activityData = activitiesData.find(item => item.key === selectedActivityID);
            const categoryData = data.categories.find(item => item.key === selectedCategoryID);

            setSelectedActivityData(activityData); 
            setCurrentActivitiesData(activitiesData.length !== 0 && activitiesData);
            setCurrentCategoryData(categoryData);

            if (!activityData) {
                setSelectedActivityID(null);
            }
            else {
                setSelectedActivityID(selectedActivityID); 
            }
        }
    }, [selectedCategoryID, data]);

    // Убираем компонент выбора даты и времени и показываем выбранную дату
    useEffect(() => {
        const formattedStart = utils.convertDateToStringFormat(startDate, {});
        const formattedEnd = utils.convertDateToStringFormat(endDate, {});

        setShowingStartDateTimePicker(null);
        setFormattedStartDateText(formattedStart);
        setFormattedEndDateText(formattedEnd);
    }, [endDate, startDate]); 

    // Получаем текущую геолокацию пользователя каждые 10 секунд
    useEffect(() => {
        if (locationSettingsData.isLocationEnabled && isMapEnabled) {
            const interval = setInterval(() => {
                utils.getCurrentLocation()
                .then(result => {
                    setCurrentLocation(result);
                });
            }, currentLocation ? 10000 : 0);
    
            return () => clearInterval(interval);
        }
    });

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundComponent/>
            <components.GoBackButton onPress={() => navigation.goBack()} withGoBack={withGoBack}/>
            {
                isMapEnabled && currentLocation ?
                <View
                    style={{
                        ...styles.defaultBox,
                        ...styles.dropShadow,
                        ...styles.mapContainer,
                    }}
                >
                    <Text style={{...styles.hintText, ...styles.innerMapTextTransform}}>
                        {
                            endLocation || startLocation ?
                            'Нажмите на метку для подробной информации' :
                            'Зажмите, чтобы добавить или переместить метку'
                        }
                    </Text>
                    <MapView
                        style={{width: '100%', height: '100%'}}
                        provider={PROVIDER_GOOGLE}
                        zoomControlEnabled={true}
                        showsUserLocation={true}
                        onLongPress={addLocationMarker}
                        initialRegion={{
                            latitude: currentLocation?.latitude,
                            latitudeDelta: currentLocation?.latitudeDelta,
                            longitude: currentLocation?.longitude,
                            longitudeDelta: currentLocation?.longitudeDelta,
                        }}
                    >
                        {
                            startLocation &&
                            <Marker
                                coordinate={startLocation}
                                pinColor={utils.convertColorDataToString(constants.pinkColor)}
                                title='Начальная позиция'
                                description='Нажмите на надпись чтобы удалить метку!'
                                draggable={true}
                                onCalloutPress={deleteLocationMarker}
                            />
                        }
                        {
                            endLocation &&
                            <Marker
                                coordinate={endLocation}
                                pinColor={utils.convertColorDataToString(constants.greenColor)}
                                title='Конечная позиция'
                                description='Нажмите на надпись чтобы удалить метку!'
                                centerOffset={5}
                                draggable={true}
                                onCalloutPress={deleteLocationMarker}
                            />
                        }
                    </MapView>
                </View> :
                <View style={{
                        ...styles.defaultBox,
                        ...styles.dropShadow,
                        ...styles.mapContainer,
                        height: 50
                    }}
                >
                    <Text style={styles.boxTitleText}>КАРТА ВЫКЛЮЧЕНА</Text>
                </View>
            }
            <SafeAreaView style={{gap: constants.margin, position: 'relative', flex: 1}}>
                <ScrollView> 
                    <View style={{...styles.mainContainerDefault, marginTop: constants.margin}}> 
                        {
                            data?.categories &&
                            <components.BoxToolBar 
                                title='Категория'
                                style={Object.keys(validationErrors).includes('category_id') && styles.redBorder}
                            >
                                <components.StylizedSelectList
                                    data={data.categories}
                                    setSelected={setSelectedCategoryID}
                                    defaultOption={currentCategoryData}
                                />
                            </components.BoxToolBar>
                        }
                        {
                            currentActivitiesData &&
                            <components.BoxToolBar 
                                title='Активность'
                                style={Object.keys(validationErrors).includes('activity_id') && styles.redBorder}
                            >
                                <components.StylizedSelectList
                                    data={currentActivitiesData}
                                    setSelected={setSelectedActivityID}
                                    defaultOption={selectedActivityData || currentActivitiesData[0]}
                                />
                            </components.BoxToolBar>
                        }
                        <components.BoxToolBar
                            title='Начало в'
                            style={Object.keys(validationErrors).includes('started_at') && styles.redBorder}
                        >
                            { 
                                showingStartDateTimePicker === 'start' &&
                                <components.CustomDateTimePicker
                                    currentDate={startDate}
                                    onChange={setStartDate}
                                />
                            }
                            <TouchableHighlight
                                onPress={() => {setShowingStartDateTimePicker('start')}}
                                underlayColor={utils.convertColorDataToString(constants.blackColor)}
                                style={{...styles.defaultBox, position: 'relative'}}
                            >
                                <Text style={{
                                        ...styles.selectListInputStyles,
                                        backgroundColor: utils.convertColorDataToString(constants.grayColor),
                                        color: utils.convertColorDataToString(constants.blackColor),
                                        padding: constants.padding,
                                        fontVariant: 'lining-nums'
                                    }}
                                >{formattedStartDateText}</Text>
                            </TouchableHighlight>
                        </components.BoxToolBar>
                        <components.BoxToolBar
                            title='Конец в'
                            style={Object.keys(validationErrors).includes('ended_at') && styles.redBorder}
                        >
                            {
                                showingStartDateTimePicker === 'end' &&
                                <components.CustomDateTimePicker
                                    currentDate={endDate}
                                    minimumDate={startDate}
                                    onChange={setEndDate}
                                />
                            }
                            <TouchableHighlight
                                onPress={() => {setShowingStartDateTimePicker('end')}}
                                underlayColor={utils.convertColorDataToString(constants.blackColor)}
                                style={{...styles.defaultBox, position: 'relative'}}
                            >
                                <Text style={{
                                        ...styles.selectListInputStyles,
                                        backgroundColor: utils.convertColorDataToString(constants.grayColor),
                                        color: utils.convertColorDataToString(constants.blackColor),
                                        padding: constants.padding,
                                        fontVariant: 'lining-nums'
                                    }}
                                >{formattedEndDateText}</Text>
                            </TouchableHighlight>
                        </components.BoxToolBar>
                        <TextInput
                            placeholder='Введите название...'
                            onChangeText={setTitle}
                            maxLength={30}
                            defaultValue={title}
                            style={{
                                ...styles.inputAreaText, 
                                ...styles.defaultBox,
                                ...styles.dropShadow,
                                padding: constants.padding,
                                width: '100%'
                            }}
                        />
                        <TextInput
                            multiline={true}
                            placeholder='Введите описание...'
                            onChangeText={setDescription}
                            defaultValue={description}
                            style={{
                                ...styles.inputAreaText, 
                                ...styles.defaultBox,
                                ...styles.dropShadow,
                                padding: constants.padding,
                                width: '100%',
                                height: 150
                            }}
                        />
                        <View style={{position: 'relative', width: '100%'}}>
                            <TextInput
                                inputMode='numeric'
                                placeholder='Введите бюджет...'
                                maxLength={9}
                                onChangeText={setBudget}
                                defaultValue={budget.toString()}
                                style={{
                                    ...styles.inputAreaText, 
                                    ...styles.defaultBox,
                                    ...styles.dropShadow,
                                    padding: constants.padding,
                                    width: '100%',
                                }}
                            />
                            <Text
                                style={{
                                    ...styles.inputAreaText,
                                    fontFamily: 'RalewayRegular',
                                    fontSize: 24,
                                    position: 'absolute',
                                    top: 10,
                                    right: constants.padding
                                }}
                            >₽</Text>
                        </View>   
                        <View style={{width: '100%', justifyContent: 'flex-end'}}>
                            <components.ToggleBox
                                onPress={() => {setIsMapEnabled(!isMapEnabled)}}
                                title='Использование карты'
                                isChecked={!locationSettingsData.isLocationEnabled ? false : isMapEnabled}
                                isActive={locationSettingsData.isLocationEnabled}
                            />
                        </View>
                        <View style={{width: '100%', justifyContent: 'flex-end'}}>
                            <components.ToggleBox
                                onPress={() => {setIsRouteFollowing(!isRouteFollowing)}}
                                title='Отслеживание маршрута'
                                isChecked={!locationSettingsData.isBackgroundGranted ? false : isRouteFollowing}
                                isActive={!locationSettingsData.isBackgroundGranted ? false : isMapEnabled}
                            />
                        </View>
                        <View style={{
                                width: '100%', 
                                justifyContent: 'space-between', 
                                flexDirection: 'row'
                            }}
                        >   
                            {
                                taskData ?
                                <Fragment>
                                    <components.CustomButton 
                                        title='Удалить' 
                                        onPress={deleteTask}
                                        backgroundColor={utils.convertColorDataToString(constants.pinkColor)}
                                    />
                                    <components.CustomButton 
                                        title='Изменить'
                                        onPress={changeTask}
                                    />
                                </Fragment> :
                                <Fragment>
                                    <View/>
                                    <components.CustomButton title='Создать' onPress={createTask}/>
                                </Fragment>
                            }
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
 
export const TaskDetailsScreen = ({navigation, route}) => {
    const withGoBack = route?.params?.withGoBack;
    const prevScreenName = route.params?.prevScreenName;
    const taskData = route?.params?.data;
    const currentDate = new Date();

    const [data, setData] = useState();
    const [locationSettingsData, setLocationSettingsData] = useState({
        isForegroundGranted: null,
        isBackgroundGranted: null,
        isLocationEnabled: null,
    });

    const [isMapEnabled, setIsMapEnabled] = useState(taskData.is_map_enabled);

    const [currentLocation, setCurrentLocation] = useState();
    const [initialLocation, setInitialLocation] = useState();

    const [titleActivity, setTitleActivity] = useState();
    const [titleCategory, setTitleCategory] = useState();

    const deleteTask = () => {
        Alert.alert(
            'Удалить задачу',
            'Вы уверены, что хотите удалить задачу?',
            [
                {
                    text: 'ДА',
                    onPress: () => {
                        dbService.deleteData('task', taskData.id);
                        NotificationsService.cancelScheduleTaskNotification(taskData.id);
                        navigation.navigate(prevScreenName, {isReload: true});
                    },
                },
                {
                    text: 'Я передумал',
                    onPress: () => {},
                },
            ]
        );
    }

    const finishTask = () => {
        if (currentDate < new Date(taskData.ended_at)) {
            Alert.alert(
                'Завершить задачу',
                'Вы уверены, что хотите завершить задачу сейчас?',
                [
                    {
                        text: 'ДА',
                        onPress: () => {
                            dbService.updateData('task', {id: taskData.id, ended_at: currentDate.getTime()});
                            NotificationsService.cancelScheduleTaskNotification(taskData.id);
                            navigation.navigate(prevScreenName, {isReload: true});
                        },
                    },
                    {
                        text: 'Я передумал',
                        onPress: () => {},
                    },
                ]
            );
        }
        else {
            Alert.alert(
                'Завершение задачи',
                'Завершение задачи невозможно, т.к. она уже закончилась!',
                [
                    {
                        text: 'ОК',
                        onPress: () => {},
                    },
                ]
            );

            navigation.navigate(prevScreenName, {isReload: true});
        }
    }

    // Проверка включенной геолокации и разрешений на нее
    useEffect(() => {
        utils.checkLocation()
        .then(({ isBackgroundGranted, isForegroundGranted, isLocationEnabled }) => {
            setLocationSettingsData({
                isForegroundGranted,
                isBackgroundGranted,
                isLocationEnabled
            })
        });
    }, []);

    // Получаем текущую геолокацию пользователя каждые 10 секунд
    useEffect(() => {
        if (locationSettingsData.isLocationEnabled && taskData.is_map_enabled) {
            const interval = setInterval(() => {
                utils.getCurrentLocation()
                .then(result => {
                    setCurrentLocation(result);
                });
            }, currentLocation ? 10000 : 0);
    
            return () => clearInterval(interval);
        }
    });
    
    useEffect(() => {
        const latitude = taskData?.start_latitude || taskData?.end_latitude || currentLocation?.latitude;
        const longitude = taskData?.start_longitude || taskData?.end_longitude || currentLocation?.longitude;

        setIsMapEnabled(latitude != null && longitude != null);

        setInitialLocation({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0035,
            longitudeDelta: 0.0035,
        })
    }, [currentLocation]);

    // Получаем категории и активности из БД
    useEffect(() => {
        Promise.all([
            dbService.getTableData('category'),
            dbService.getTableData('activity')
        ])
        .then(([categoryResult, activityResult]) => {
            const categories = categoryResult._array.map(item => {return {...item, id: item.id - 1}});
            const activities = activityResult._array.map(item => {return {...item, id: item.id - 1}});

            setData({
                categories,
                activities
            })
        });
    }, []);

    // Получаем названия выбранной активност и категории
    useEffect(() => {
        if (data?.activities && data?.categories) {
            const activity = data.activities.find(item => item.id === taskData.activity_id);
            const category = data.categories.find(item => item.id === taskData.category_id);

            setTitleActivity(activity.title); 
            setTitleCategory(category.title);
        };
    }, [data]);

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundComponent/>
            <components.GoBackButton onPress={() => navigation.goBack()} withGoBack={withGoBack}/>
            {
                isMapEnabled ?
                <View                    
                    style={{
                        ...styles.defaultBox,
                        ...styles.dropShadow,
                        ...styles.mapContainer
                    }}
                >
                    <MapView
                        style={{width: '100%', height: '100%'}}
                        provider={PROVIDER_GOOGLE}
                        zoomControlEnabled={true}
                        showsUserLocation={true}
                        initialRegion={initialLocation}
                    >
                        {
                            taskData.start_latitude && taskData.start_longitude &&
                            <Marker
                                coordinate={{
                                    latitude: taskData.start_latitude,
                                    longitude: taskData.start_longitude
                                }}
                                pinColor={utils.convertColorDataToString(constants.pinkColor)}
                                title='Начальная позиция'
                                description='Эту позицию вы указали, как отправную!'
                            />
                        }
                        {
                            taskData.end_latitude && taskData.end_longitude &&
                            <Marker
                                coordinate={{
                                    latitude: taskData.end_latitude,
                                    longitude: taskData.end_longitude
                                }}
                                pinColor={utils.convertColorDataToString(constants.greenColor)}
                                title='Конечная позиция'
                                description='Эту позицию вы указали, как конечную!'
                                centerOffset={5}
                            />
                        }
                    </MapView>
                </View> :
                <View style={{
                        ...styles.defaultBox,
                        ...styles.dropShadow,
                        ...styles.mapContainer,
                        height: 50,
                    }}
                >
                    <Text style={{...styles.boxTitleText}}>КАРТА ВЫКЛЮЧЕНА</Text>
                </View>
            }
            <SafeAreaView style={{gap: constants.margin, position: 'relative', flex: 1}}>
                <ScrollView>
                    <View style={{...styles.mainContainerDefault, marginTop: constants.margin}}> 
                        <View
                            style={{
                                ...styles.dropShadow, 
                                ...styles.defaultBox,
                                padding: constants.padding,
                                justifyContent: 'flex-start',
                                width: '100%',
                                minHeight: 250,
                                gap: constants.padding
                            }}
                        >
                            <Text style={styles.boxTitleText}>{taskData?.title}</Text>
                            <components.CustomLine height={1} width={'100%'}/>
                            <View
                                style={{
                                    ...styles.defaultBox,
                                    backgroundColor: utils.convertColorDataToString(constants.grayColor),
                                    padding: constants.padding,
                                    width: '100%',
                                }}
                            >
                                <Text style={{...styles.descriptionText}}>{taskData.description}</Text>
                            </View>
                            <Text 
                                style={{
                                    ...styles.defaultLabelText, 
                                    color: utils.convertColorDataToString(constants.greenColor)
                                }}
                            >
                                <Text style={{...styles.defaultLabelText, fontFamily: 'RalewayMedium'}}>Начало: </Text> 
                                {utils.convertDateToStringFormat(new Date(taskData.started_at), {})}
                            </Text>
                            <Text 
                                style={{
                                    ...styles.defaultLabelText, 
                                    color: utils.convertColorDataToString(constants.pinkColor)
                                }}
                            >
                                <Text style={{...styles.defaultLabelText, fontFamily: 'RalewayMedium'}}>Конец: </Text> 
                                {utils.convertDateToStringFormat(new Date(taskData.ended_at), {})}
                            </Text>
                            <Text style={styles.defaultLabelText}
                            >
                                <Text style={{...styles.defaultLabelText, fontFamily: 'RalewayMedium'}}>Категория: </Text> 
                                {titleCategory}
                            </Text>
                            <Text style={styles.defaultLabelText}
                            >
                                <Text style={{...styles.defaultLabelText, fontFamily: 'RalewayMedium'}}>Активность: </Text> 
                                {titleActivity}
                            </Text>
                            <Text style={styles.defaultLabelText}>
                                <Text style={{...styles.defaultLabelText, fontFamily: 'RalewayMedium'}}>Потрачено: </Text> 
                                {taskData.budget}₽
                            </Text>
                            <Text style={styles.defaultLabelText}>
                                <Text style={{...styles.defaultLabelText, fontFamily: 'RalewayMedium'}}>Пройдено: </Text> 
                                0км
                            </Text>
                        </View>
                        <View style={{
                                width: '100%', 
                                justifyContent: 'space-between', 
                                flexDirection: 'row'
                            }}
                        >   
                            <Fragment>
                                {
                                    currentDate >= taskData.ended_at &&
                                    <View></View>
                                }
                                <components.CustomButton 
                                    backgroundColor={utils.convertColorDataToString(constants.pinkColor)} 
                                    title='Удалить' 
                                    onPress={deleteTask}
                                />
                                {
                                    currentDate < taskData.ended_at &&
                                    <components.CustomButton 
                                        title='Завершить сейчас' 
                                        onPress={finishTask}
                                    />
                                }
                            </Fragment>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}