import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, Text, View, TouchableHighlight, ScrollView } from 'react-native';
import { Line, Svg } from 'react-native-svg';

import * as constants from '../styles/constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { styles } from '../styles/styles.js';

export const StatsScreen = ({ navigation, route }) => {
    const withGoBack = route?.params?.withGoBack;
    
    const monthLabels = [
        'Январь', 'Февраль', 'Март', 
        'Апрель', 'Май', 'Июнь', 
        'Июль', 'Август', 'Сентябрь', 
        'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const years = [];
    const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
    const selectedIndex = years.indexOf(selectedYear);

    const pricesDivider = [0];

    const [scrollViewWidth, setScrollViewWidth] = useState(0);
    const scrollViewElementWidth = scrollViewWidth / years.length;
    const scrollViewRef = useRef();
    
    if (years.length > 0) {
        useEffect(() => {
            const x = scrollViewElementWidth * selectedIndex - (scrollViewElementWidth * 1.5);
            
            scrollViewRef.current.scrollTo({x: x, y: 0, animated: false});
        }, [selectedYear]);
    }

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundComponent/>
            <components.GoBackButton onPress={() => navigation.goBack()} withGoBack={withGoBack}/>
            <SafeAreaView style={{...styles.mainRestrictor, ...styles.marginVertical, gap: constants.margin}}>
                <View style={{...styles.defaultBox, ...styles.dropShadow, width: '100%'}}>
                    <View style={{gap: 10, flexDirection: 'row', padding: constants.margin, alignItems: 'center'}}>
                        <View style={{
                            alignItems: 'center', 
                            gap: constants.padding*2, 
                            marginHorizontal: constants.margin, 
                            marginTop: 40,
                            marginBottom: 25,
                        }}>
                            {pricesDivider.map((priceDivider, index) => (
                                <View key={index} style={{justifyContent: 'center'}}>
                                    <Text style={{...styles.defaultTextStats, fontSize: 12}}>{priceDivider}К</Text>
                                </View>
                            ))}
                        </View>
                        <View style={{flex: 1, gap: constants.margin}}>
                            <View style={{
                                flexDirection: 'row', 
                                justifyContent: 'space-between', 
                                paddingRight: constants.padding, 
                                paddingLeft: constants.padding
                                }}
                            >
                                {monthLabels.map((label, index) => (
                                    <Text key={index} style={{...styles.defaultTextStats, fontSize: 8}}>{label.toUpperCase().slice(0, 3)}</Text>
                                ))}
                            </View>
                            <View 
                                style={{
                                    backgroundColor: utils.convertColorDataToString(constants.grayColor),
                                    borderRadius: constants.borderRadius,
                                    flex: 1,
                                }}
                            >
                                <View 
                                    style={{
                                        flex: 1, 
                                        justifyContent: 'space-between', 
                                        paddingVertical: constants.padding*2, 
                                        opacity: 0.25
                                    }}
                                >
                                    {pricesDivider.map((priceDivider, index) => (
                                        <components.CustomLine key={index} height={1}/>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                    {years.length > 0 ? <View style={{width: '100%', paddingHorizontal: constants.padding}}>
                        <ScrollView
                            ref={scrollViewRef}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ 
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: constants.padding,
                                paddingTop: 0,
                                gap: constants.padding*3,
                            }}
                            onContentSizeChange={(contentWidth) => {
                                setScrollViewWidth(contentWidth);
                            }}
                        >
                            {years.map((year, index) => (
                                <TouchableHighlight
                                    key={index}
                                    onPress={() => setSelectedYear(year)}
                                >
                                    <Text 
                                        style={{
                                            ...styles.defaultTextStats,
                                            color: year === selectedYear ? utils.convertColorDataToString(constants.purpleColor) : styles.defaultTextStats.color,
                                            fontFamily: year === selectedYear ? 'RalewayRegular' : styles.defaultTextStats.fontFamily,
                                        }}
                                    >{year}</Text>
                                </TouchableHighlight>
                            ))}
                        </ScrollView>
                    </View> : <Text style={{
                                        ...styles.defaultTextStats, 
                                        padding: constants.padding, 
                                        paddingTop: 0
                                    }}>Данные отсутствуют</Text>}
                    {years.length > 0 ? <View style={{height: 1, width: '100%', padding: constants.padding, paddingTop: 0}}>
                        <Svg style={{height: 1}}>
                            <Line x1='0' y1='0' x2='100%' y2='0' stroke={utils.convertColorDataToString(constants.blackColor)} strokeWidth='1'/>
                        </Svg>
                    </View> : null}
                </View>
            </SafeAreaView>
        </View>
    );
}