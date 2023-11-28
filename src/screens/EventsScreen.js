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
import { openDB, DatabaseService, Event } from '../data/databaseService.js';
import { styles } from '../styles/styles.js';

import HistorySVG from '../../assets/ico/history-ico.svg';

const Stack = createNativeStackNavigator();

const db = openDB('HanaHanaDailyLife.db');
const dbService = new DatabaseService(db);

export const EventTabNavigator = ({route}) => {
    const withGoBack = route?.params?.withGoBack;

    return (
        <Stack.Navigator
            initialRouteName='HomeEvent'
            screenOptions={
                {
                    headerShown: false
                }
            }
        >
            <Stack.Screen name='HomeEvent' component={EventsScreen} initialParams={{withGoBack}}/>
            <Stack.Screen name='EventEditor' component={EventEditorScreen}/>
            <Stack.Screen name='EventDetails' component={EventDetailsScreen}/>
        </Stack.Navigator>
    )
}

export const EventsScreen = ({navigation, route}) => {
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
        const events = [];
        const condition = isShowingCompleted ? [
            {field: 'ended_at', comparison: '<=', value: currentDate.getTime()}
        ] : [
            {field: 'ended_at', comparison: '>', value: currentDate.getTime()}
        ];

        Promise.all([
            dbService.getTableData('category'),
            dbService.getTableData('activity'),
            dbService.getTableData(
                'event', 
                {orderBy: 'started_at', typeOrder: 'ASC'},
                condition,
                {limit: requestDataCount},
            )
        ])
        .then(([categoryResult, activityResult, eventsResult]) => {
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
            eventsResult._array.forEach((item) => {
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
                
                const existingItemIndex = events.findIndex((findIndex) => findIndex.title == formattedDate);

                if (existingItemIndex !== -1) {
                    events[existingItemIndex].data.push(data.data[0])
                } 
                else {
                    events.push(data);
                }
            });

            setData({
                categories,
                activities,
                events
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
                        <components.EventButton
                            onPress={() => navigation.navigate('EventEditor', {withGoBack: true, prevScreenName: 'HomeEvent'})}
                            AvatarComponent={constants.avatars.PlusEventAvatar}
                            title={'Добавить новый план'}
                        />
                        {
                            data?.events &&
                            <components.EventsButtons
                                currentScreenName='HomeEvent'
                                data={data?.events}
                                navigation={navigation}
                            />
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

export const EventEditorScreen = ({navigation, route}) => {
    const withGoBack = route?.params?.withGoBack;
    const prevScreenName = route.params?.prevScreenName;
    const eventData = route?.params?.data;
    const currentDate = new Date();

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

    const [startDate, setStartDate] = useState(currentDate);
    const [endDate, setEndDate] = useState(currentDate);

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

    const getNewEventData = () => {
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

        if (eventData) {
            result['id'] = eventData?.id;
        }

        return result;
    }

    const createEvent = () => {
        const newEventData = getNewEventData();
        const eventValidation = new Event(newEventData);

        setValidationErrors(eventValidation.errors);

        if (Object.keys(eventValidation.errors).length === 0) {
            dbService.insertData('event', newEventData);
            navigation.navigate(prevScreenName, {isReload: true});
        }
    } 

    const changeEvent = () => {
        const newEventData = getNewEventData();
        const eventValidation = new Event(newEventData);

        setValidationErrors(eventValidation.errors);

        if (new Date(eventData.started_at) <= currentDate) {
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
        else if (Object.keys(eventValidation.errors).length === 0) {
            dbService.updateData('event', newEventData)
            navigation.navigate(prevScreenName, {isReload: true});
        }
    }

    const deleteEvent = () => {
        Alert.alert(
            'Удалить задачу',
            'Вы уверены, что хотите удалить задачу?',
            [
                {
                    text: 'ДА',
                    onPress: () => {
                        dbService.deleteData('event', eventData.id);
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

    // Если были переданы данные об ивенте, то устанавливаем их
    useEffect(() => {
        if (eventData) {
            setIsMapEnabled(eventData?.is_map_enabled);
            setIsRouteFollowing(eventData?.is_route_following);
            setStartLocation(        
                eventData.start_longitude && eventData.start_latitude ?
                {
                    longitude: eventData?.start_longitude,
                    latitude: eventData?.start_latitude,
                } :
                null
            );
            setEndLocation(
                eventData.end_longitude && eventData.end_latitude ?
                {
                    longitude: eventData?.end_longitude,
                    latitude: eventData?.end_latitude,
                } :
                null
            );
            setSelectedCategoryID(eventData?.category_id);
            setSelectedActivityID(eventData?.activity_id);
            setTitle(eventData?.title);
            setDescription(eventData?.description);
            setBudget(eventData?.budget);
            setStartDate(new Date(eventData?.started_at));
            setEndDate(new Date(eventData?.ended_at));
        }
    }, []);

    // Получаем переданные данные, которые должны обновиться после получения данных из БД
    useEffect(() => {
        if (eventData && locationSettingsData.isForegroundGranted !== null) {
            setIsMapEnabled(eventData?.is_map_enabled);
        }
        if (eventData && locationSettingsData.isBackgroundGranted !== null) {
            setIsRouteFollowing(eventData.is_route_following);
        }
    }, [locationSettingsData]);

    // Проверка включенной геолокации и разрешений на нее
    useEffect(() => {
        utils.isLocationSettingEnabled()
        .then(locationEnabled => {
            setLocationSettingsData(prevState => ({
                ...prevState,
                isLocationEnabled: locationEnabled
            }));
            
            if (locationEnabled === false) {
                Alert.alert(
                    'Геолокация',
                    'Для полной работы приложения желательно включить геолокацию.',
                    [{text: 'ОК', onPress: () => {}}]
                );
            }
            else {
                utils.isForegroundLocationPermissionGranted()
                .then(foregroundResult => {
                    setIsMapEnabled(foregroundResult);
                    setLocationSettingsData(prevState => ({
                        ...prevState,
                        isForegroundGranted: foregroundResult
                    }));
                
                    if (foregroundResult === false) {
                        Alert.alert(
                            'Разрешения',
                            'Для полной работы приложения желательно разрешить отслеживание геолокации.',
                            [
                                {text: 'Не хочу', onPress: () => {}},
                                {text: 'Предоставить разрешение', onPress: () => Linking.openSettings()},
                            ]
                        );
                    }
                    else {
                        utils.isBackgroundLocationPermissionGranted()
                        .then(backgroundResult => {
                            setIsRouteFollowing(backgroundResult)
                            setLocationSettingsData(prevState => ({
                                ...prevState,
                                isBackgroundGranted: backgroundResult
                            }));
        
                            if (backgroundResult === false) {
                                Alert.alert(
                                    'Разрешения',
                                    'Для полной работы приложения желательно разрешить доступ к геолокации в любое время.',
                                    [
                                        {text: 'Не хочу', onPress: () => {}},
                                        {text: 'Предоставить разрешение', onPress: () => Linking.openSettings()},
                                    ]
                                );
                            }
                        });
                    }
                });
            }
        });
    }, []);

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
                                eventData ?
                                <Fragment>
                                    <components.CustomButton 
                                        title='Удалить' 
                                        onPress={deleteEvent}
                                        backgroundColor={utils.convertColorDataToString(constants.pinkColor)}
                                    />
                                    <components.CustomButton 
                                        title='Изменить'
                                        onPress={changeEvent}
                                    />
                                </Fragment> :
                                <Fragment>
                                    <View/>
                                    <components.CustomButton title='Создать' onPress={createEvent}/>
                                </Fragment>
                            }
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
 
export const EventDetailsScreen = ({navigation, route}) => {
    const withGoBack = route?.params?.withGoBack;
    const prevScreenName = route.params?.prevScreenName;
    const eventData = route?.params?.data;
    const currentDate = new Date();

    const [data, setData] = useState();
    const [locationSettingsData, setLocationSettingsData] = useState({
        isForegroundGranted: null,
        isBackgroundGranted: null,
        isLocationEnabled: null,
    });

    const [isMapEnabled, setIsMapEnabled] = useState(eventData.is_map_enabled);

    const [currentLocation, setCurrentLocation] = useState();
    const [initialLocation, setInitialLocation] = useState();

    const [titleActivity, setTitleActivity] = useState();
    const [titleCategory, setTitleCategory] = useState();

    const deleteEvent = () => {
        Alert.alert(
            'Удалить задачу',
            'Вы уверены, что хотите удалить задачу?',
            [
                {
                    text: 'ДА',
                    onPress: () => {
                        dbService.deleteData('event', eventData.id);
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

    const finishEvent = () => {
        if (currentDate < new Date(eventData.ended_at)) {
            Alert.alert(
                'Завершить задачу',
                'Вы уверены, что хотите завершить задачу сейчас?',
                [
                    {
                        text: 'ДА',
                        onPress: () => {
                            dbService.updateData('event', {id: eventData.id, ended_at: currentDate.getTime()});
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
        utils.isLocationSettingEnabled()
        .then(locationEnabled => {
            setLocationSettingsData(prevState => ({
                ...prevState,
                isLocationEnabled: locationEnabled
            }));
            
            if (locationEnabled === false) {
                Alert.alert(
                    'Геолокация',
                    'Для полной работы приложения желательно включить геолокацию.',
                    [{text: 'ОК', onPress: () => {}}]
                );
            }
            else {
                utils.isForegroundLocationPermissionGranted()
                .then(foregroundResult => {
                    setLocationSettingsData(prevState => ({
                        ...prevState,
                        isForegroundGranted: foregroundResult
                    }));
                
                    if (foregroundResult === false) {
                        Alert.alert(
                            'Разрешения',
                            'Для полной работы приложения желательно разрешить отслеживание геолокации.',
                            [
                                {text: 'Не хочу', onPress: () => {}},
                                {text: 'Предоставить разрешение', onPress: () => Linking.openSettings()},
                            ]
                        );
                    }
                    else {
                        utils.isBackgroundLocationPermissionGranted()
                        .then(backgroundResult => {
                            setLocationSettingsData(prevState => ({
                                ...prevState,
                                isBackgroundGranted: backgroundResult
                            }));
        
                            if (backgroundResult === false) {
                                Alert.alert(
                                    'Разрешения',
                                    'Для полной работы приложения желательно разрешить доступ к геолокации в любое время.',
                                    [
                                        {text: 'Не хочу', onPress: () => {}},
                                        {text: 'Предоставить разрешение', onPress: () => Linking.openSettings()},
                                    ]
                                );
                            }
                        });
                    }
                });
            }
        });
    }, []);

    // Получаем текущую геолокацию пользователя каждые 10 секунд
    useEffect(() => {
        if (locationSettingsData.isLocationEnabled && eventData.is_map_enabled) {
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
        const latitude = eventData?.start_latitude || eventData?.end_latitude || currentLocation?.latitude;
        const longitude = eventData?.start_longitude || eventData?.end_longitude || currentLocation?.longitude;

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
            const activity = data.activities.find(item => item.id === eventData.activity_id);
            const category = data.categories.find(item => item.id === eventData.category_id);

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
                            eventData.start_latitude && eventData.start_longitude &&
                            <Marker
                                coordinate={{
                                    latitude: eventData.start_latitude,
                                    longitude: eventData.start_longitude
                                }}
                                pinColor={utils.convertColorDataToString(constants.pinkColor)}
                                title='Начальная позиция'
                                description='Эту позицию вы указали, как отправную!'
                            />
                        }
                        {
                            eventData.end_latitude && eventData.end_longitude &&
                            <Marker
                                coordinate={{
                                    latitude: eventData.end_latitude,
                                    longitude: eventData.end_longitude
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
                            <Text style={styles.boxTitleText}>{eventData?.title}</Text>
                            <components.CustomLine height={1} width={'100%'}/>
                            <View
                                style={{
                                    ...styles.defaultBox,
                                    backgroundColor: utils.convertColorDataToString(constants.grayColor),
                                    padding: constants.padding,
                                    width: '100%',
                                }}
                            >
                                <Text style={{...styles.descriptionText}}>{eventData.description}</Text>
                            </View>
                            <Text 
                                style={{
                                    ...styles.defaultLabelText, 
                                    color: utils.convertColorDataToString(constants.greenColor)
                                }}
                            >
                                <Text style={{...styles.defaultLabelText, fontFamily: 'RalewayMedium'}}>Начало: </Text> 
                                {utils.convertDateToStringFormat(new Date(eventData.started_at), {})}
                            </Text>
                            <Text 
                                style={{
                                    ...styles.defaultLabelText, 
                                    color: utils.convertColorDataToString(constants.pinkColor)
                                }}
                            >
                                <Text style={{...styles.defaultLabelText, fontFamily: 'RalewayMedium'}}>Конец: </Text> 
                                {utils.convertDateToStringFormat(new Date(eventData.ended_at), {})}
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
                                {eventData.budget}₽
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
                                    currentDate >= eventData.ended_at &&
                                    <View></View>
                                }
                                <components.CustomButton 
                                    backgroundColor={utils.convertColorDataToString(constants.pinkColor)} 
                                    title='Удалить' 
                                    onPress={deleteEvent}
                                />
                                {
                                    currentDate < eventData.ended_at &&
                                    <components.CustomButton 
                                        title='Завершить сейчас' 
                                        onPress={finishEvent}
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