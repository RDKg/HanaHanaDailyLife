import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableHighlight } from 'react-native';

import * as constants from '../constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { DatabaseHandler } from '../data/dbHandler.js';
import { styles } from '../styles.js'; 

const db = DatabaseHandler.openDb('HanaHanaDailyLife.db');
const dbService = new DatabaseHandler(db);

export const DeveloperScreen = ({navigation, route}) => {
    const canNavigatePreviousPage = route?.params?.canNavigatePreviousPage;

    const createRandomTasks = () => {
        const randomYear = Math.round(Math.random() * (2023 - 2015) + 2015);
        const randomDate = utils.getRandomDateInYear(randomYear);
        const datetime = randomDate.getTime();

        dbService.insertData('task', {
            title: 'wrvwr',
            description: 'werwer', 
            budget: (Math.random() * (5000 - 0) + 0),
            route: null,
            is_route_following: null,
            is_map_enabled: null,
            start_latitude: null,
            start_longitude: null,
            end_latitude: null,
            end_longitude: null,
            created_at: datetime,
            started_at: datetime + (Math.random() * (999 - 1 + 1) + 1),
            ended_at: datetime + (Math.random() * (2000 - 1000 + 1) + 1000),
            category_id: 1,
            activity_id: 1
        })
    }

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundImage/>
            { 
                canNavigatePreviousPage &&
                <components.NavigatePreviousScreenButton onPress={() => navigation.goBack()}/>
            }
            <SafeAreaView style={{gap: constants.MARGIN, position: 'relative', flex: 1}}>
                <View style={{...styles.mainContainerDefault}}>
                    <TouchableHighlight 
                        onPress={() => createRandomTasks()} 
                        underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
                        style={{
                            ...styles.defaultBox, 
                            ...styles.dropShadow,
                            width: '100%'
                        }}
                    >
                        <Text style={{...styles.defaultTextButton, padding: constants.PADDING, textAlign: 'center'}}>СОЗДАТЬ РАНДОМНЫЕ ЗАДАЧИ</Text>
                    </TouchableHighlight>
                </View>
            </SafeAreaView>
        </View>
    );
}