import React, { useCallback, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import * as components from './src/components.js';
import * as constants from './src/styles/constants.js';
import * as utils from './src/utils.js';
import { NotificationsService } from './src/backgroundTask.js';
import { openDB, DatabaseService } from './src/data/databaseService.js';

import { TaskTabNavigator } from './src/screens/TasksScreen.js';
import { SettingsScreen } from './src/screens/SettingsScreen.js';
import { ProfileTabNavigator } from './src/screens/ProfileScreen.js';
import { StatsScreen } from './src/screens/StatsScreen.js';
import { HomeTabNavigator } from './src/screens/HomeScreen.js'

const Tab = createBottomTabNavigator();

const db = openDB('HanaHanaDailyLife.db');
const dbService = new DatabaseService(db);

dbService.createAndInsertDefaultData();  
NotificationsService.registerForPushNotifications(); 
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = Font.useFonts(constants.fontFiles);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync(); 
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null; 
    }

    return (
        <NavigationContainer>
            <View onLayout={onLayoutRootView}></View>
            <StatusBar translucent backgroundColor="transparent"/>
            <Tab.Navigator 
                initialRouteName='HomeTab'
                screenOptions={
                    {
                        headerShown: false,
                        tabBarLabel: '',
                        tabBarStyle: {
                            height: constants.heightNavTab,
                        },
                        style: {
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }, 
                    }
                }
            >
                <Tab.Screen 
                    name='StatsTab' 
                    component={StatsScreen}
                    options={
                        { 
                            tabBarIcon: ({color, size, focused}) => <components.TabBarIcon 
                                svgXmlStringObj={utils.svgXmlStringsObject.Stats} 
                                isFocused={focused}
                            />
                        }
                    }
                />  
                <Tab.Screen 
                    name='ProfileTab' 
                    component={ProfileTabNavigator}  
                    options={ 
                        { 
                            tabBarIcon: ({focused}) => <components.TabBarIcon 
                                svgXmlStringObj={utils.svgXmlStringsObject.Profile} 
                                isFocused={focused}
                            />
                        }
                    }
                />
                <Tab.Screen 
                    name='HomeTab' 
                    component={HomeTabNavigator} 
                    options={
                        { 
                            tabBarIcon: ({focused}) => <components.TabBarIcon 
                                svgXmlStringObj={utils.svgXmlStringsObject.Home} 
                                isFocused={focused}
                                width={36}
                                height={36}
                            />
                        }
                    }
                />
                <Tab.Screen 
                    name='TasksTab' 
                    component={TaskTabNavigator} 
                    options={
                        { 
                            tabBarIcon: ({focused}) => <components.TabBarIcon 
                                svgXmlStringObj={utils.svgXmlStringsObject.Tasks} 
                                isFocused={focused}
                            />
                        }
                    }
                />
                <Tab.Screen 
                    name='SettingsTab' 
                    component={SettingsScreen} 
                    options={
                        { 
                            tabBarIcon: ({focused}) => <components.TabBarIcon 
                                svgXmlStringObj={utils.svgXmlStringsObject.Settings} 
                                isFocused={focused}
                            />
                        }
                    }
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

// dbService.getAllTableNames().then(result => {
//     result._array.forEach(item => {
//         console.log(item)
//         dbService.dropTableData(item.name) 
//     })
// }) 