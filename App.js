import React, { useCallback } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';
import * as Font from 'expo-font';

import * as components from './src/components.js';
import * as constants from './src/styles/constants.js';
import * as utils from './src/utils.js';
import { openDB, DatabaseService } from './src/data/databaseService.js';

import { EventTabNavigator } from './src/screens/EventsScreen.js';
import { NotificationsScreen } from './src/screens/NotificationsScreen.js';
import { ProfileTabNavigator } from './src/screens/ProfileScreen.js';
import { StatsScreen } from './src/screens/StatsScreen.js';
import { HomeTabNavigator } from './src/screens/HomeScreen.js'
 
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

const db = openDB('HanaHanaDailyLife.db');
const dbService = new DatabaseService(db);

// dbService.dropTableData('event')
// dbService.dropTableData('category')
// dbService.dropTableData('activity')
dbService.createAndInsertDefaultData(); 

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
                    name='EventsTab' 
                    component={EventTabNavigator} 
                    options={
                        { 
                            tabBarIcon: ({focused}) => <components.TabBarIcon 
                                svgXmlStringObj={utils.svgXmlStringsObject.Events} 
                                isFocused={focused}
                            />
                        }
                    }
                />
                <Tab.Screen 
                    name='NotificationsTab' 
                    component={NotificationsScreen} 
                    options={
                        { 
                            tabBarIcon: ({focused}) => <components.TabBarIcon 
                                svgXmlStringObj={utils.svgXmlStringsObject.Notifications} 
                                isFocused={focused}
                            />
                        }
                    }
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
