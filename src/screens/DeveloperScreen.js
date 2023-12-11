import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, TouchableHighlight } from 'react-native';

import { v4 as uuidv4 } from 'uuid'; 

import * as constants from '../constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { DatabaseHandler } from '../data/dbHandler.js';
import { styles } from '../styles.js'; 

const db = DatabaseHandler.openDb('HanaHanaDailyLife.db');
const dbHandler = new DatabaseHandler(db);

export const DeveloperScreen = ({navigation, route}) => {
    const canNavigatePreviousPage = route?.params?.canNavigatePreviousPage;

    const [activities, setActivities] = useState();

    const clearTasksDataFromDb = () => {
        dbHandler.dropTableData('task');
        dbHandler.createAndInsertDefaultData();
    }

    const generateTaskData = () => {
        const randomYear = Math.round(Math.random() * (2023 - 2015) + 2015);
        const randomDate = utils.getRandomDateInYear(randomYear);
        const datetime = randomDate.getTime();
        const isMapEnabled = utils.random(0, 1, 0) === 1;
        const activity = activities[utils.random(0, activities.length-1, 0)];

        return {
            title: uuidv4(),
            description: uuidv4(), 
            budget: utils.random(0, 1, 0) ? utils.random(0, 5000, 0) : 0,
            route: null,
            is_route_following: null,
            is_map_enabled: isMapEnabled,
            start_latitude: isMapEnabled && utils.random(-180, 180, 5),
            start_longitude: isMapEnabled && utils.random(-180, 180, 5),
            end_latitude: isMapEnabled && utils.random(-90, 90, 5),
            end_longitude: isMapEnabled && utils.random(-90, 90, 5),
            created_at: datetime,
            started_at: datetime + utils.random(1, 5000, 0),
            ended_at: datetime + utils.random(5000, 25000, 0),
            category_id: activity.category_id - 1,
            activity_id: activity.id - 1
        }
    }

    const createRandomTasks = () => {
        const taskData = generateTaskData();
        
        dbHandler.insertData('task', taskData);
    }

    useEffect(() => {
        dbHandler.getTableData('activity')
        .then((activityResult) => {
            const activities = activityResult._array.map(item => {return {...item, id: item.id - 1}});

            setActivities(activities)
        });
    }, []);

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundImage/>
            { 
                canNavigatePreviousPage &&
                <components.NavigatePreviousScreenButton onPress={() => navigation.goBack()}/>
            }
            <SafeAreaView style={{gap: constants.MARGIN, position: 'relative', flex: 1}}>
                {
                    activities &&
                    <View style={{...styles.mainContainerDefault}}>
                        <TouchableHighlight 
                            onPress={() => createRandomTasks()} 
                            underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
                            style={{...styles.defaultBox, ...styles.dropShadow, width: '100%'}}
                        >
                            <Text style={{...styles.defaultTextButton, padding: constants.PADDING, textAlign: 'center'}}>СОЗДАТЬ РАНДОМНУЮ ЗАДАЧУ</Text>
                        </TouchableHighlight>
                        <TouchableHighlight 
                            onPress={() => clearTasksDataFromDb()} 
                            underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
                            style={{...styles.defaultBox, ...styles.dropShadow, width: '100%'}}
                        >
                            <Text style={{...styles.defaultTextButton, padding: constants.PADDING, textAlign: 'center'}}>УДАЛИТЬ ВСЕ ЗАДАЧИ ИЗ БД</Text>
                        </TouchableHighlight>
                    </View>
                }
            </SafeAreaView>
        </View>
    );
}