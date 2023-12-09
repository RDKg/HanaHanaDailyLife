import React from 'react';
import { SafeAreaView, Text, View, TouchableHighlight, useWindowDimensions } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LinearGradient } from 'expo-linear-gradient';

import * as constants from '../constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { styles } from '../styles.js'; 

import { AboutScreen } from './AboutScreen.js';
import { TaskTabNavigator } from './TasksScreen.js';
import { ProfileTabNavigator } from './ProfileScreen.js';
import { SettingsScreen } from './SettingsScreen.js';
import { StatsScreen } from './StatsScreen.js';

import BackgroundProfileButton from '../../assets/img/background-profile-button.svg';
import BackgroundSettingsButton from '../../assets/img/background-settings-button.svg';
import BackgroundTasksButton from '../../assets/img/background-tasks-button.svg';
import VectorTasksButton from '../../assets/img/vector-tasks-button.svg';

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
            <Stack.Screen name='Tasks' component={TaskTabNavigator} initialParams={{withGoBack: true}}/>
            <Stack.Screen name='Stats' component={StatsScreen}/>
            <Stack.Screen name='About' component={AboutScreen}/>
        </Stack.Navigator>
    )
}

export const HomeScreen = ({navigation}) => {
    const { width } = useWindowDimensions(); 
    const heightForSquareProfileButton = (width - constants.MARGIN - constants.PADDING) / 2;

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundImage/>
            <SafeAreaView style={{...styles.mainRestrictor, ...styles.marginVertical, gap: constants.MARGIN}}>
                <View 
                    style={{ 
                        alignItems: 'stretch',
                        flexDirection: 'row',
                        gap: constants.MARGIN,
                        maxHeight: heightForSquareProfileButton
                    }}>
                    <TouchableHighlight 
                        onPress={() => navigation.navigate('Profile', {withGoBack: true})} 
                        underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
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
                                    color: utils.convertColorDataToString(constants.WHITE_COLOR),
                                    position: 'absolute',
                                    bottom: 30,
                                    left: 15,
                                }}
                            >МОЙ{'\n'}ПРОФИЛЬ</Text>
                        </>
                    </TouchableHighlight>
                    <View style={{flex: 1, gap: constants.MARGIN}}>
                        <TouchableHighlight 
                            onPress={() => navigation.navigate('Settings', {withGoBack: true})} 
                            underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
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
                                    colors={constants.PINK_TO_PURPLE_LIGHT_GRADIENT.colors}
                                    locations={[0, 1]}
                                    style={{...styles.gradient, opacity: 0.5}}
                                />
                                <Text style={{
                                    ...styles.defaultTextButton, 
                                    fontSize: 20, 
                                    color: utils.convertColorDataToString(constants.WHITE_COLOR)
                                }}>НАСТРОЙКИ</Text>                                
                            </>
                        </TouchableHighlight>
                        <TouchableHighlight 
                            onPress={() => navigation.navigate('Tasks', {withGoBack: true})} 
                            underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
                            style={{
                                ...styles.defaultBox, 
                                ...styles.dropShadow, 
                                flex: 1,
                            }
                        }>
                            <>
                                <VectorTasksButton style={{
                                    position: 'absolute',
                                    zIndex: 1, 
                                    bottom: -25,
                                    resizeMode: 'cover' 
                                }} width={'100%'}/>  
                                <LinearGradient
                                    colors={constants.PINK_TO_PURPLE_LIGHT_GRADIENT.colors}
                                    locations={[0, 1]}
                                    style={{...styles.gradient, opacity: 0.5}}
                                />
                                <BackgroundTasksButton style={{
                                    position: 'absolute',
                                    zIndex: -1, 
                                    resizeMode: 'cover' 
                                }} width={'150%'}/>  
                                <Text style={{
                                    ...styles.defaultTextButton, 
                                    fontSize: 20, 
                                    color: utils.convertColorDataToString(constants.WHITE_COLOR)
                                }}>ПЛАНЫ</Text>
                            </>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={{gap: constants.MARGIN}}>
                    <TouchableHighlight 
                        onPress={() => navigation.navigate('Stats', {withGoBack: true})} 
                        underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
                        style={{
                            ...styles.defaultBox, 
                            ...styles.dropShadow, 
                            padding: constants.PADDING
                        }
                    }>
                        <Text style={styles.defaultTextButton}>СТАТИСТИКА</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        onPress={() => navigation.navigate('About', {withGoBack: true})} 
                        underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
                        style={{
                            ...styles.defaultBox, 
                            ...styles.dropShadow, 
                            padding: constants.PADDING
                        }
                    }>
                        <Text style={styles.defaultTextButton}>О ПРИЛОЖЕНИИ</Text>
                    </TouchableHighlight>
                </View>
            </SafeAreaView>
        </View>
    );
}

