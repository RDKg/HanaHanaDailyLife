import React, { useState, useEffect, Fragment } from 'react';
import { SafeAreaView, Text, View, ScrollView, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import * as constants from '../constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { NotificationsService, LocationService } from '../deviceFeatures.js';
import { DatabaseHandler } from '../data/dbHandler.js';
import { styles } from '../styles.js';

const db = DatabaseHandler.openDb('HanaHanaDailyLife.db');
const dbHandler = new DatabaseHandler(db);

export const TaskDetailsScreen = ({navigation, route}) => {
    const canNavigatePreviousPage = route?.params?.canNavigatePreviousPage;
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
                        dbHandler.deleteData('task', taskData.id);
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

    const finishTask = () => {
        if (currentDate < new Date(taskData.ended_at)) {
            Alert.alert(
                'Завершить задачу',
                'Вы уверены, что хотите завершить задачу сейчас?',
                [
                    {
                        text: 'ДА',
                        onPress: () => {
                            dbHandler.updateData('task', {id: taskData.id, ended_at: currentDate.getTime()});
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
        LocationService.checkLocationPermissionsAndStatus()
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
                LocationService.getCurrentLocation()
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
            dbHandler.getTableData('category'),
            dbHandler.getTableData('activity')
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
            <components.BackgroundImage/>
            { 
                canNavigatePreviousPage &&
                <components.NavigatePreviousScreenButton onPress={() => navigation.goBack()}/>
            }
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
                                pinColor={utils.convertColorDataToString(constants.PINK_COLOR)}
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
                                pinColor={utils.convertColorDataToString(constants.GREEN_COLOR)}
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
            <SafeAreaView style={{gap: constants.MARGIN, position: 'relative', flex: 1}}>
                <ScrollView>
                    <View style={{...styles.mainContainerDefault, marginTop: constants.MARGIN}}> 
                        <View
                            style={{
                                ...styles.dropShadow, 
                                ...styles.defaultBox,
                                padding: constants.PADDING,
                                justifyContent: 'flex-start',
                                width: '100%',
                                minHeight: 250,
                                gap: constants.PADDING
                            }}
                        >
                            <Text style={styles.boxTitleText}>{taskData?.title}</Text>
                            <components.CustomLine height={1} width={'100%'}/>
                            <View
                                style={{
                                    ...styles.defaultBox,
                                    backgroundColor: utils.convertColorDataToString(constants.GRAY_COLOR),
                                    padding: constants.PADDING,
                                    width: '100%',
                                }}
                            >
                                <Text style={{...styles.descriptionText}}>{taskData.description}</Text>
                            </View>
                            <Text 
                                style={{
                                    ...styles.defaultLabelText, 
                                    color: utils.convertColorDataToString(constants.GREEN_COLOR)
                                }}
                            >
                                <Text style={{...styles.defaultLabelText, fontFamily: 'RalewayMedium'}}>Начало: </Text> 
                                {utils.convertDateToStringFormat(new Date(taskData.started_at), {})}
                            </Text>
                            <Text 
                                style={{
                                    ...styles.defaultLabelText, 
                                    color: utils.convertColorDataToString(constants.PINK_COLOR)
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
                            {/* <Text style={styles.defaultLabelText}>
                                <Text style={{...styles.defaultLabelText, fontFamily: 'RalewayMedium'}}>Пройдено: </Text> 
                                0км
                            </Text> */}
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
                                    backgroundColor={utils.convertColorDataToString(constants.PINK_COLOR)} 
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