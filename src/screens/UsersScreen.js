import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, Text, View, TouchableHighlight, useWindowDimensions, ImageBackground, ScrollView } from 'react-native';
import { Line, Svg } from 'react-native-svg';

import { LinearGradient } from 'expo-linear-gradient';

import * as constants from '../styles/constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { styles } from '../styles/styles.js';

export const UsersScreen = ({ navigation, route }) => {
    const withGoBack = route?.params?.withGoBack;
    
    return (
        <View style={styles.mainContainer}>
            <components.BackgroundComponent/>
            <components.GoBackButton onPress={() => navigation.goBack()} withGoBack={withGoBack}/>
            <SafeAreaView style={{...styles.mainRestrictor, gap: constants.margin, position: 'relative'}}>
            </SafeAreaView>
        </View>
    );
}