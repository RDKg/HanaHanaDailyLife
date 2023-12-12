import React, { useState, useEffect, Fragment } from 'react';
import { SafeAreaView, Text, View, TouchableHighlight, ScrollView, Alert, Linking, TextInput, RefreshControl } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import * as constants from '../constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { NotificationsService, LocationService } from '../deviceFeatures.js';
import { DatabaseHandler } from '../data/databaseHandler.js';
import { Task } from '../data/models.js'
import { styles } from '../styles.js';

const db = DatabaseHandler.openDb('HanaHanaDailyLife.db');
const dbHandler = new DatabaseHandler(db);

export const TaskEditorScreen = ({navigation, route}) => {
    const canNavigatePreviousPage = route?.params?.canNavigatePreviousPage;
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
    const [isCheckingLocationSettings, setIsCheckingLocationSettings] = useState(true);

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
            dbHandler.insertEntry('task', newTaskData)
            .then(result => {
                NotificationsService.scheduleStartTaskNotification({...newTaskData, id: result});
                NotificationsService.scheduleEndTaskNotification({...newTaskData, id: result});
            });
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
            dbHandler.updateEntry('task', newTaskData);
            NotificationsService.cancelScheduledTaskNotification(newTaskData.id);
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
                        dbHandler.deleteEntries('task', taskData.id);
                        NotificationsService.cancelScheduledTaskNotification(taskData.id);
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
        if (isCheckingLocationSettings === true) {
            LocationService.checkLocationPermissionsAndStatus()
            .then(({isBackgroundGranted, isForegroundGranted, isLocationEnabled}) => {
                setLocationSettingsData({
                    isForegroundGranted,
                    isBackgroundGranted,
                    isLocationEnabled
                });
                
                setIsMapEnabled(isForegroundGranted);
                setIsRouteFollowing(isBackgroundGranted);
            });

            setIsCheckingLocationSettings(false);
        }
    }, [isCheckingLocationSettings]);

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
            setIsMapEnabled(taskData?.is_map_enabled && locationSettingsData.isForegroundGranted);
        }
        if (taskData && locationSettingsData.isBackgroundGranted !== null) {
            setIsRouteFollowing(
                taskData?.is_map_enabled && 
                locationSettingsData.isBackgroundGranted &&
                taskData.is_route_following
            );
        }
    }, [locationSettingsData]);

    // Получаем категории и активности из БД
    useEffect(() => {
        Promise.all([
            dbHandler.getTableEntries('category'),
            dbHandler.getTableEntries('activity')
        ])
        .then(([categoryResult, activityResult]) => {
            const categories = categoryResult._array.map(item => ({
                key: item.id - 1,
                value: item.title,
            }));
            const activities = activityResult._array.map(item => ({
                category_id: item.category_id,
                key: item.id - 1,
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
        if (locationSettingsData.isForegroundGranted && isMapEnabled) {
            const interval = setInterval(() => {
                LocationService.getCurrentLocation()
                .then(result => {
                    if (result) {
                        setCurrentLocation(result);
                    }
                    else {
                        setIsCheckingLocationSettings(true);
                    }
                });
            }, currentLocation ? 10000 : 0);
    
            return () => clearInterval(interval);
        }
    });

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundImage/>
            { 
                canNavigatePreviousPage &&
                <components.NavigatePreviousScreenButton onPress={() => navigation.goBack()}/>
            }
            {
                isMapEnabled && locationSettingsData.isForegroundGranted && currentLocation ?
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
                        initialRegion={currentLocation}
                    >
                        {
                            startLocation &&
                            <Marker
                                coordinate={startLocation}
                                pinColor={utils.convertColorDataToString(constants.PINK_COLOR)}
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
                                pinColor={utils.convertColorDataToString(constants.GREEN_COLOR)}
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
            <SafeAreaView style={{gap: constants.MARGIN, position: 'relative', flex: 1}}>
                <ScrollView> 
                    <View style={{...styles.mainContainerDefault, marginTop: constants.MARGIN}}> 
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
                                underlayColor={utils.convertColorDataToString(constants.BLACK_COLOR)}
                                style={{...styles.defaultBox, position: 'relative'}}
                            >
                                <Text style={{
                                        ...styles.selectListInputStyles,
                                        backgroundColor: utils.convertColorDataToString(constants.GRAY_COLOR),
                                        color: utils.convertColorDataToString(constants.BLACK_COLOR),
                                        padding: constants.PADDING,
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
                                underlayColor={utils.convertColorDataToString(constants.BLACK_COLOR)}
                                style={{...styles.defaultBox, position: 'relative'}}
                            >
                                <Text style={{
                                        ...styles.selectListInputStyles,
                                        backgroundColor: utils.convertColorDataToString(constants.GRAY_COLOR),
                                        color: utils.convertColorDataToString(constants.BLACK_COLOR),
                                        padding: constants.PADDING,
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
                                padding: constants.PADDING,
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
                                padding: constants.PADDING,
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
                                    padding: constants.PADDING,
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
                                    right: constants.PADDING
                                }}
                            >₽</Text>
                        </View>   
                        <View style={{width: '100%', justifyContent: 'flex-end'}}>
                            <components.ToggleBox
                                onPress={() => {setIsMapEnabled(!isMapEnabled)}}
                                title='Использование карты'
                                isChecked={locationSettingsData.isForegroundGranted && isMapEnabled}
                                isActive={locationSettingsData.isForegroundGranted}
                            />
                        </View>
                        {/* <View style={{width: '100%', justifyContent: 'flex-end'}}>
                            <components.ToggleBox
                                onPress={() => {setIsRouteFollowing(!isRouteFollowing)}}
                                title='Отслеживание маршрута'
                                isChecked={locationSettingsData.isBackgroundGranted && isRouteFollowing}
                                isActive={locationSettingsData.isBackgroundGranted && isMapEnabled}
                            />
                        </View> */}
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
                                        backgroundColor={utils.convertColorDataToString(constants.PINK_COLOR)}
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