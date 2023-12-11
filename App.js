import React, { useCallback } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import * as components from './src/components.js';
import * as constants from './src/constants.js';
import * as utils from './src/utils.js';
import { NotificationsService } from './src/deviceFeatures.js';
import { DatabaseHandler } from './src/data/dbHandler.js';

import { TaskTabNavigator } from './src/screens/TasksScreen.js';
import { SettingsScreen } from './src/screens/SettingsScreen.js';
import { ProfileTabNavigator } from './src/screens/ProfileScreen.js';
import { StatsScreen } from './src/screens/StatsScreen.js';
import { HomeTabNavigator } from './src/screens/HomeScreen.js'

const db = DatabaseHandler.openDb('HanaHanaDailyLife.db');
const dbService = new DatabaseHandler(db);
dbService.createAndInsertDefaultData();  

// function getRandomDateInYear(year) {
//     const startDate = new Date(`${year}-01-01T00:00:00Z`);
//     const endDate = new Date(`${year + 1}-01-01T00:00:00Z`);
//     const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
//     return new Date(randomTime);
//   }

// for (let i = 0; i < 23; i++) {
//     const d = getRandomDateInYear(2007);
//     dbService.insertData('task', {
//         title: 'wrvwr',
//         description: 'werwer', 
//         budget: Math.random() * (10000 - 1000) + 1000,
//         route: null,
//         is_route_following: null,
//         is_map_enabled: null,
//         start_latitude: null,
//         start_longitude: null,
//         end_latitude: null,
//         end_longitude: null,
//         created_at: d.getTime(),
//         started_at: d.getTime(),
//         ended_at: d.getTime()+500,
//         category_id: 1,
//         activity_id: 1
//     })
// }
const Tab = createBottomTabNavigator();

NotificationsService.registerForPushNotifications(); 
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = Font.useFonts(constants.FONT_FILES);

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
                            height: constants.HEIGHT_NAVIGATION_TAB,
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