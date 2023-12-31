import React, { useState, useCallback } from 'react';
import { SafeAreaView, Text, View, TouchableHighlight, ScrollView } from 'react-native';

import * as constants from '../constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { styles } from '../styles.js';

import aboutJsonData from '../contents/about.json';

export const AboutScreen = ({ navigation, route }) => {
    const canNavigatePreviousPage = route?.params?.canNavigatePreviousPage;

    const [activeComponents, setActiveComponents] = useState([]);

    const handleActiveComponents = useCallback((key) => {
        let newActiveComponents;
    
        if (activeComponents.includes(key)) {
            const index = activeComponents.findIndex(item => item === key);
    
            if (index !== -1) {
                newActiveComponents = [...activeComponents.slice(0, index), ...activeComponents.slice(index + 1)];
            }
        }
        else {
            newActiveComponents = [...activeComponents, key];
        }
    
        setActiveComponents(newActiveComponents);
    }, [activeComponents]);
    
    return (
        <View style={styles.mainContainer}>
            <components.BackgroundImage/>
            { 
                canNavigatePreviousPage &&
                <components.NavigatePreviousScreenButton onPress={() => navigation.goBack()}/>
            }
            <SafeAreaView style={{...styles.mainRestrictor}}> 
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View 
                        style={{
                            ...styles.marginVertical,
                            justifyContent: 'center',
                            gap: constants.PADDING,
                        }}
                    >
                        {
                            Object.keys(aboutJsonData).map(key => (
                                <View key={key} style={{width: '100%', position: 'relative'}}>
                                    <TouchableHighlight
                                        onPress={() => handleActiveComponents(key)} 
                                        underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
                                        style={{
                                            ...styles.defaultBox,
                                            ...styles.dropShadow,
                                            width: '100%',
                                            padding: constants.PADDING,
                                            borderBottomRightRadius: 0,
                                            borderBottomLeftRadius: 0,
                                            zIndex: 5
                                        }}
                                    >
                                            <Text style={{...styles.defaultTextButton, textAlign: 'center'}}>{aboutJsonData[key]['title'].toUpperCase()}</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        onPress={() => handleActiveComponents(key)} 
                                        underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
                                        style={{ 
                                            ...styles.defaultBox,
                                            width: '100%',
                                            padding: activeComponents.includes(key) ? constants.PADDING : 5, 
                                            borderTopRightRadius: 0,
                                            borderTopLeftRadius: 0,
                                        }}
                                    >
                                        {
                                            activeComponents.includes(key) ?
                                            <Text style={{...styles.defaultTextSentences, textAlign: 'justify'}}>{aboutJsonData[key]['description']}</Text> :
                                            <Text style={{...styles.defaultTextSentences, textAlign: 'center', fontSize: 10}}>НАЖМИ, ЧТОБЫ ПОСМОТРЕТЬ</Text>
                                        }
                                    </TouchableHighlight>
                                </View>
                            ))
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}