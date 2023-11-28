import React from 'react';
import { SafeAreaView, Text, View, TouchableHighlight, useWindowDimensions } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LinearGradient } from 'expo-linear-gradient';

import * as constants from '../styles/constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { styles } from '../styles/styles.js'; 

import { AboutScreen } from './AboutScreen.js';
import { EventTabNavigator } from './EventsScreen.js';
import { MessengerScreen } from './MessengerScreen.js';
import { NotificationsScreen } from './NotificationsScreen.js'; 
import { ProfileTabNavigator } from './ProfileScreen.js';
import { SettingsScreen } from './SettingsScreen.js';
import { StatsScreen } from './StatsScreen.js';
import { UsersScreen } from './UsersScreen.js';

import BackgroundProfileButton from '../../assets/img/background-profile-button.svg';
import BackgroundSettingsButton from '../../assets/img/background-settings-button.svg';
import BackgroundMessengerButton from '../../assets/img/background-messenger-button.svg';
import VectorMessengerButton from '../../assets/img/vector-messenger-button.svg';

const Stack = createNativeStackNavigator();

export const HomeTabNavigator = () => {
    return (
        <Stack.Navigator 
            initialRouteName='Home'
            screenOptions={
                {
                    headerShown: false
                }
            }
        >
            <Stack.Screen name='Home' component={HomeScreen}/>
            <Stack.Screen name='Profile' component={ProfileTabNavigator}/>
            <Stack.Screen name='Settings' component={SettingsScreen}/>
            <Stack.Screen name='Messenger' component={MessengerScreen}/>
            <Stack.Screen name='Events' component={EventTabNavigator} initialParams={{withGoBack: true}}/>
            <Stack.Screen name='Stats' component={StatsScreen}/>
            <Stack.Screen name='Users' component={UsersScreen}/>
            <Stack.Screen name='Notifications' component={NotificationsScreen}/>
            <Stack.Screen name='About' component={AboutScreen}/>
        </Stack.Navigator>
    )
}

export const HomeScreen = ({navigation}) => {
    const { width } = useWindowDimensions(); 
    const heightForSquareProfileButton = (width - constants.margin - constants.padding) / 2;

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundComponent/>
            <SafeAreaView style={{...styles.mainRestrictor, ...styles.marginVertical, gap: constants.margin}}>
                <View 
                    style={{ 
                        alignItems: 'stretch',
                        flexDirection: 'row',
                        gap: constants.margin,
                        maxHeight: heightForSquareProfileButton
                    }}>
                    <TouchableHighlight 
                        onPress={() => navigation.navigate('Profile', {withGoBack: true})} 
                        underlayColor={utils.convertColorDataToString(constants.grayColor)}
                        style={
                            {
                                ...styles.defaultBox, 
                                ...styles.dropShadow, 
                                flex: 1, 
                                height: heightForSquareProfileButton,
                                overflow: 'hidden'
                            }
                        }
                    >
                        <>
                            <BackgroundProfileButton 
                                width={'100%'}
                                style={{
                                    position: 'absolute', 
                                    aspectRatio: 1,
                                    zIndex: -1, 
                                    bottom: -10, 
                                    left: -20,
                                    resizeMode: 'cover' 
                                }} 
                            />
                            <Text 
                                style={{
                                    ...styles.defaultTextButton, 
                                    fontSize: 20, 
                                    color: utils.convertColorDataToString(constants.whiteColor),
                                    position: 'absolute',
                                    bottom: 30,
                                    left: 15,
                                }}
                            >МОЙ{'\n'}ПРОФИЛЬ</Text>
                        </>
                    </TouchableHighlight>
                    <View style={{flex: 1, gap: constants.margin}}>
                        <TouchableHighlight 
                            onPress={() => navigation.navigate('Settings', {withGoBack: true})} 
                            underlayColor={utils.convertColorDataToString(constants.grayColor)}
                            style={{
                                ...styles.defaultBox, 
                                ...styles.dropShadow, 
                                maxHeight: 65,
                                flex: 1
                            }
                        }>
                            <>
                                <BackgroundSettingsButton style={{
                                    position: 'absolute',
                                    aspectRatio: 1,
                                    zIndex: -1, 
                                    top: -5,
                                    left: 0,
                                    resizeMode: 'cover'
                                }} width={'100%'}/>
                                <LinearGradient
                                    colors={constants.pinkToPurpleLightGradient.colors}
                                    locations={[0, 1]}
                                    style={{...styles.gradient, opacity: 0.5}}
                                />
                                <Text style={{
                                    ...styles.defaultTextButton, 
                                    fontSize: 20, 
                                    color: utils.convertColorDataToString(constants.whiteColor)
                                }}>НАСТРОЙКИ</Text>                                
                            </>
                        </TouchableHighlight>
                        <TouchableHighlight 
                            // onPress={() => navigation.navigate('Messenger', {withGoBack: true})} 
                            // underlayColor={utils.convertColorDataToString(constants.grayColor)}
                            style={{
                                ...styles.defaultBox, 
                                ...styles.dropShadow, 
                                flex: 1,
                                opacity: 0.65,
                            }
                        }>
                            <>
                                <VectorMessengerButton style={{
                                    position: 'absolute',
                                    zIndex: 1, 
                                    bottom: -25,
                                    resizeMode: 'cover' 
                                }} width={'100%'}/>  
                                <LinearGradient
                                    colors={constants.pinkToPurpleLightGradient.colors}
                                    locations={[0, 1]}
                                    style={{...styles.gradient, opacity: 0.5}}
                                />
                                <BackgroundMessengerButton style={{
                                    position: 'absolute',
                                    zIndex: -1, 
                                    resizeMode: 'cover' 
                                }} width={'150%'}/>  
                                <Text style={{
                                    ...styles.defaultTextButton, 
                                    fontSize: 20, 
                                    color: utils.convertColorDataToString(constants.whiteColor)
                                }}>МЕССЕНДЖЕР</Text>
                            </>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={{gap: constants.margin}}>
                    <TouchableHighlight 
                        onPress={() => navigation.navigate('Events', {withGoBack: true})} 
                        underlayColor={utils.convertColorDataToString(constants.grayColor)}
                        style={{
                            ...styles.defaultBox, 
                            ...styles.dropShadow, 
                            padding: constants.padding
                        }
                    }>
                        <Text style={styles.defaultTextButton}>УПРАВЛЕНИЕ ПЛАНАМИ</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        onPress={() => navigation.navigate('Stats', {withGoBack: true})} 
                        underlayColor={utils.convertColorDataToString(constants.grayColor)}
                        style={{
                            ...styles.defaultBox, 
                            ...styles.dropShadow, 
                            padding: constants.padding
                        }
                    }>
                        <Text style={styles.defaultTextButton}>СТАТИСТИКА</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        // onPress={() => navigation.navigate('Users', {withGoBack: true})} 
                        // underlayColor={utils.convertColorDataToString(constants.grayColor)}
                        style={{
                            ...styles.defaultBox, 
                            ...styles.dropShadow, 
                            padding: constants.padding,
                            opacity: 0.65,
                        }
                    }>
                        <Text style={styles.defaultTextButton}>ПОЛЬЗОВАТЕЛИ</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        onPress={() => navigation.navigate('Notifications', {withGoBack: true})} 
                        underlayColor={utils.convertColorDataToString(constants.grayColor)}
                        style={{
                            ...styles.defaultBox, 
                            ...styles.dropShadow, 
                            padding: constants.padding,
                        }
                    }>
                        <Text style={styles.defaultTextButton}>УВЕДОМЛЕНИЯ</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        onPress={() => navigation.navigate('About', {withGoBack: true})} 
                        underlayColor={utils.convertColorDataToString(constants.grayColor)}
                        style={{
                            ...styles.defaultBox, 
                            ...styles.dropShadow, 
                            padding: constants.padding
                        }
                    }>
                        <Text style={styles.defaultTextButton}>О ПРИЛОЖЕНИИ</Text>
                    </TouchableHighlight>
                </View>
            </SafeAreaView>
        </View>
    );
}

