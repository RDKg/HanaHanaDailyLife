import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, TouchableHighlight, TextInput, ImageBackground, ScrollView } from 'react-native';
import { Line, Svg } from 'react-native-svg';

import * as constants from '../styles/constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { StorageHandler } from '../data/dataHandler.js';
import { styles } from '../styles/styles.js';

export const SettingsScreen = ({ navigation, route }) => {
    const withGoBack = route?.params?.withGoBack;

    const [username, setUsername] = useState();
    
    const [isTaskStartNotificationsEnabled, setIsTaskStartNotificationsEnabled] = useState();
    const [isTaskEndNotificationsEnabled, setIsTaskEndNotificationsEnabled] = useState();
    
    return (
        <View style={styles.mainContainer}>
            <components.BackgroundComponent/>
            <components.GoBackButton onPress={() => navigation.goBack()} withGoBack={withGoBack}/>
            <SafeAreaView style={{gap: constants.margin, position: 'relative', flex: 1}}>   
                <ScrollView style={{height: '100%'}}>
                    <View 
                        style={{
                            ...styles.mainContainerDefault, 
                            alignItems: 'flex-start',
                            gap: constants.padding
                        }}
                    >
                        <View 
                            style={{
                                ...styles.defaultBox, 
                                ...styles.dropShadow,
                                padding: constants.padding,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                width: '100%',
                            }}
                        >
                            <View 
                                style={{
                                    backgroundColor: utils.convertColorDataToString(constants.grayColor),
                                    borderRadius: constants.borderRadius,
                                    width: 64,
                                    height: 64
                                }}
                            >
                                <ImageBackground/>
                            </View>
                            <components.CustomButton 
                                title="Установить аватарку"
                            />
                        </View>
                        <View style={{position: 'relative', width: '100%'}}>
                            <TextInput
                                placeholder='Как вас звать?'
                                maxLength={30}
                                style={{
                                    ...styles.inputAreaText, 
                                    ...styles.defaultBox,
                                    ...styles.dropShadow,
                                    padding: constants.padding,
                                    width: '100%'
                                }}
                            />
                            <components.CustomButton
                                title="ОК"
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    height: '100%',
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                }}
                            />
                        </View>
                        <View style={{width: '100%'}}>
                            <components.ToggleBox
                                title="Уведомление об активации задания"
                                isChecked={isTaskStartNotificationsEnabled}
                                onPress={() => setIsTaskStartNotificationsEnabled(!isTaskStartNotificationsEnabled)}
                            />
                        </View>
                        <View style={{width: '100%'}}>
                            <components.ToggleBox
                                title="Уведомление об окончании задания"
                                isChecked={isTaskEndNotificationsEnabled}
                                onPress={() => setIsTaskEndNotificationsEnabled(!isTaskEndNotificationsEnabled)}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
