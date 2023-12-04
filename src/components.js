import React, { useState, useEffect, Fragment, useRef } from 'react';
import { View, TouchableOpacity, Animated, Text, TouchableHighlight, FlatList, RefreshControl } from 'react-native';
import { SvgXml, Line, Svg } from 'react-native-svg';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';

import { v4 as uuidv4 } from 'uuid'; 
import { LinearGradient } from 'expo-linear-gradient';

import * as constants from './styles/constants.js';
import * as utils from './utils.js';
import { styles } from './styles/styles.js';

import BackgroundSVG from '../assets/img/background.svg';
import BackgroundProfileSVG from '../assets/img/background-header-avatar-vector.svg';
import ArrowBackSVG from '../assets/ico/arrow-back-ico.svg';
import ArrowDownSVG from '../assets/ico/arrow-down-ico.svg';

export const BackgroundComponent = () => {
    return (
        <View style={styles.backgroundWrapper}>
            <BackgroundSVG width={'100%'}/>
        </View>
    );
}

export const BackgroundProfileComponent = () => {
    return (
        <View style={{...styles.backgroundWrapper, gap: -150}}>
            <BackgroundProfileSVG width={'100%'} style={{top: -75}}/>
            <BackgroundSVG width={'100%'}/>
        </View>
    );
}

export const GoBackButtonComponent = ({onPress}) => {
    return (
        <TouchableHighlight 
            onPress={() => onPress()}
            underlayColor={utils.convertColorDataToString(constants.grayColor)}
            style={{
                ...styles.marginVertical,
                ...styles.defaultBox, 
                ...styles.dropShadow, 
                width: 34, 
                height: 32,
                position: 'absolute',
                left: constants.margin,
                zIndex: 9999,
            }}
        >
            <ArrowBackSVG width={16} height={14}/>
        </TouchableHighlight>
    );
}

export const SvgXmlRenderer = ({SvgXmlString, width, height}) => {
    return <SvgXml xml={SvgXmlString} width={width} height={height}/>
}

export const NavigationTabButton = ({Component, isActive}) => {
    if (isActive) {
        Component = <>
            {Component}
            <LinearGradient
                colors={[utils.convertColorDataToString(constants.pinkColor), 'rgba(255, 5, 95, 0.19)', 'transparent']}
                locations={[0, 0.1, 1]}
                style={{...styles.activeTabButton, ...styles.gradient}}
            />
        </>
    }

    return Component;
}

export const JumpAnimation = ({Component, heightJump=5, duration=75}) => {
    let translateY = new Animated.Value(0);

    let handleJump = () => {
        Animated.sequence([
            Animated.timing(translateY, {
                toValue: -heightJump, 
                duration: duration,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: duration,
                useNativeDriver: true,
            }),
        ]).start();
    };

    let animatedStyle = {
        transform: [{ translateY }],
    };

    return (
        <TouchableOpacity onPress={handleJump}>
            <Animated.View style={animatedStyle}>
                {Component}
            </Animated.View>
        </TouchableOpacity>
    );
}

export const TabBarIcon = ({svgXmlStringObj, isFocused, width=26, height=26}) => {
    let svgXmlString = svgXmlStringObj(isFillGradient=(isFocused));
    let SvgXmlComponent = <SvgXmlRenderer SvgXmlString={svgXmlString} width={width} height={height}/>

    return <NavigationTabButton Component={SvgXmlComponent} isActive={isFocused}/>
}

export const GoBackButton = ({onPress, withGoBack}) => {
    if (withGoBack) 
        return <GoBackButtonComponent onPress={onPress}/>
    
    return null;
}

export const TaskButton = ({
    onPress=null, 
    underlayColor=utils.convertColorDataToString(constants.grayColor),
    AvatarComponent=constants.avatars.anotherTaskAvatar, 
    title=null, 
    description=null,
}) => {
    return (
        <TouchableHighlight
            onPress={onPress}
            underlayColor={underlayColor} 
            style={{
                ...styles.defaultBox, 
                ...styles.dropShadow, 
                padding: constants.padding,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: constants.padding,
                position: 'relative'
            }}
        >
            <>
                <AvatarComponent/>
                <View 
                    style={{
                        flex: 1,
                        gap: constants.margin / 2,
                        marginTop: -5,
                    }}
                >   
                    <Text 
                        numberOfLines={1} 
                        style={{
                            ...styles.defaultTextButton, 
                            fontSize: 20, 
                            width: '100%'
                        }}>{title}
                    </Text>
                    {
                        typeof description === 'string' ?           
                        <Text 
                            numberOfLines={1} 
                            style={{
                                ...styles.defaultTextSentences, 
                            }}>{description}
                        </Text> :
                        null
                    }
                </View>
            </>
        </TouchableHighlight>
    );
}

export const TasksButtons = ({
    data,
    currentScreenName,
    navigation
}) => {
    const currentDate = new Date();
    const tasksButtons = data.map((mainData) => {
        const titleComponent = <Text key={uuidv4()} style={styles.screenTitleText}>{mainData.title}</Text>;
        const buttonsComponents = mainData.data.map((item) => {
            const startDate = new Date(item.started_at);
            const endDate = new Date(item.ended_at);
            const startTimeString = utils.convertDateToStringFormat(
                startDate, 
                {
                    isDay: false, 
                    isMonth: false, 
                    isYear: false
                }
            );

            let timeRemaining = utils.getTimeRemaining(currentDate, endDate);

            if (timeRemaining == null) {
                timeRemaining = utils.convertDateToStringFormat(endDate, {});
            }

            const taskButton = (
                <TaskButton
                    key={uuidv4()}
                    AvatarComponent={constants.avatars[item.avatar]}
                    description={item.description}
                    title={item.title}
                    onPress={() => {navigation.navigate(
                            currentDate >= startDate ? 'TaskDetails' : 'TaskEditor', 
                            {
                                withGoBack: true, 
                                data: item, 
                                prevScreenName: currentScreenName
                            }
                        );
                    }}
                />
            );

            return (
                <View key={uuidv4()} style={{width: '100%'}}>
                    {
                        currentDate >= startDate ?
                        <LinearGradient
                            key={uuidv4()}
                            colors={constants.pinkToPurpleGradient.colors}
                            start={constants.pinkToPurpleGradient.start}
                            end={constants.pinkToPurpleGradient.end}
                            style={{
                                ...styles.gradientBorder,
                            }}
                        >
                            {taskButton}
                        </LinearGradient> :
                        <Fragment key={uuidv4()}>
                            {taskButton}
                        </Fragment>
                    }
                    <Text 
                        key={uuidv4()}
                        style={{
                            ...styles.hintText, 
                            position: 'absolute',
                            color: utils.convertColorDataToString(constants.greenColor),
                            padding: constants.padding,
                            right: 0,
                            top: 0,
                        }}
                    >{startTimeString}</Text>
                    <Text 
                        key={uuidv4()}
                        style={{
                            ...styles.hintText, 
                            position: 'absolute',
                            color: utils.convertColorDataToString(constants.pinkColor),
                            padding: constants.padding,
                            right: 0,
                            bottom: 0,
                            
                        }}
                    >{timeRemaining}</Text>
                </View>
            );
        });
        
        return (
            <Fragment key={uuidv4()}>
                {titleComponent}
                {buttonsComponents}
            </Fragment>
        );
    });

    return tasksButtons;
}

export const FlatListTasksButtons = (props) => {
    const currentDate = new Date();
    const {    
        data,
        currentScreenName,
        navigation,
        onScroll,
        onRefresh,
        refreshing,
        refreshList,
        children
    } = props;

    if (data.length == 0) {
        data.push(1);
    }

    return (
        <FlatList
            data={data}
            style={{height: '100%', width: '100%'}}
            contentContainerStyle={{gap: constants.padding}}
            scrollEventThrottle={250}
            onScroll={onScroll} 
            extraData={refreshList}
            keyExtractor={(item) => uuidv4()}
            renderItem={({item}) => (
                <View style={{gap: constants.padding}}> 
                    <Text style={{...styles.screenTitleText, textAlign: 'center'}}>{item.title}</Text>
                    <FlatList
                        scrollEventThrottle={250}
                        data={item.data}
                        style={{gap: constants.padding, width: '100%'}}
                        keyExtractor={(subItem) => subItem.id}
                        renderItem={({item: subItem}) => {
                            const startDate = new Date(subItem.started_at);
                            const endDate = new Date(subItem.ended_at);
                            const startTimeString = utils.convertDateToStringFormat(
                                startDate, 
                                {
                                    isDay: false, 
                                    isMonth: false, 
                                    isYear: false
                                }
                            );

                            let timeRemaining = utils.getTimeRemaining(currentDate, endDate);
                
                            if (timeRemaining == null) {
                                timeRemaining = utils.convertDateToStringFormat(endDate, {});
                            }

                            const taskButton = (
                                <TaskButton 
                                    AvatarComponent={constants.avatars[subItem.avatar]} 
                                    description={subItem.description} 
                                    title={subItem.title}
                                    onPress={() => {navigation.navigate(
                                            currentDate >= startDate ? 'TaskDetails' : 'TaskEditor', 
                                            {
                                                withGoBack: true, 
                                                data: subItem, 
                                                prevScreenName: currentScreenName
                                            }
                                        );
                                    }}
                                />
                            );

                            return (
                                <View style={{width: '100%'}}>
                                    {
                                        currentDate >= startDate ?
                                        <LinearGradient
                                            colors={constants.pinkToPurpleGradient.colors}
                                            start={constants.pinkToPurpleGradient.start}
                                            end={constants.pinkToPurpleGradient.end}
                                            style={{
                                                ...styles.gradientBorder,
                                            }}
                                        >
                                            {taskButton}
                                        </LinearGradient> :
                                        <Fragment>
                                            {taskButton}
                                        </Fragment>
                                    }
                                    <Text 
                                        style={{
                                            ...styles.hintText, 
                                            position: 'absolute',
                                            padding: constants.padding,
                                            right: 0,
                                            top: 0,
                                        }}
                                        >{startTimeString}</Text>
                                    <Text 
                                        style={{
                                            ...styles.hintText, 
                                            position: 'absolute',
                                            color: utils.convertColorDataToString(constants.pinkColor),
                                            padding: constants.padding,
                                            right: 0,
                                            bottom: 0,
                                        }}
                                    >{timeRemaining}</Text>
                                </View>
                            );
                        }}
                    />
                </View>
            )}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[utils.convertColorDataToString(constants.pinkColor)]}
                />
            }
        />
    );
}

export const StylizedSelectList = ({
    data,
    setSelected,
    onChange=null,
    defaultOption=null,
    clear=null,
    placeholder='Кликни :3'
}) => {

    return (
        <SelectList 
            data={data}
            setSelected={setSelected}
            defaultOption={defaultOption}
            search={false}
            fontFamily='RalewayLight'
            inputStyles={styles.selectListInputStyles}
            boxStyles={styles.selectListBoxStyles}
            dropdownItemStyles={styles.dropdownItemStyles}
            dropdownStyles={styles.selectListDropdownStyles}
            dropdownTextStyles={styles.selectListDropdownTextStyles}
            dropdownShown={false}
            placeholder={placeholder}
            onChange={onChange}
            arrowicon={<ArrowDownSVG width={12} height={6}/>}
        />
    );
}

export const BoxToolBar = (props) => {
    const {    
        style,
        title,
        children
    } = props;

    return (
        <View
            style={{
                ...styles.defaultBox,
                ...styles.dropShadow,
                ...styles.boxToolbarContainer,
                ...style,
                width: '100%',
            }}
        >
            <Text style={{...styles.boxTitleText, marginTop: -4}}>{title}</Text>
            {children}
        </View>
    );
}

export const ToggleBox = ({
    onPress,
    isChecked=true,
    isActive=true,
    width=120,
    height=45,
    title,
    labels=['ВКЛ', 'ВЫКЛ'],
    backgroundColor=utils.convertColorDataToString(constants.whiteColor),
    backgroundColorIsTrue=utils.convertColorDataToString(constants.greenColor),
    backgroundColorIsFalse=utils.convertColorDataToString(constants.pinkColor),
}) => {
    return (
        <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: constants.padding,
                alignContent: 'center',
                alignItems: 'center'
            }}
        >
            <Text style={{...styles.boxTitleText, fontSize: 16, flexShrink: 1, textAlign: 'right'}}>{title}</Text>
            <TouchableHighlight
                onPress={!isActive ? () => {} : onPress}
                underlayColor={utils.convertColorDataToString(constants.whiteColor)}
                style={{
                    ...styles.defaultBox,
                    ...styles.dropShadow,
                    width: width,
                    height: height,
                    backgroundColor: isChecked ? backgroundColorIsTrue : backgroundColor,
                    position: 'relative',
                    opacity: !isActive ? 0.5 : 1
                }}
            >   
                <>
                    <Text style={{...styles.toggleBoxText, position: 'absolute', paddingRight: width/2}}>{labels[0]}</Text>
                    <TouchableHighlight
                        onPress={!isActive ? () => {} : onPress}
                        underlayColor={utils.convertColorDataToString(constants.whiteColor)}
                        style={{
                            ...styles.defaultBox,
                            ...styles.dropShadow,
                            width: width/2,
                            height: height,
                            alignSelf: 'flex-end',
                            backgroundColor: !isChecked ? backgroundColorIsFalse : backgroundColor,
                            position: 'relative',
                            opacity: !isActive ? 0.5 : 1
                        }}
                    >
                        <Text style={{...styles.toggleBoxText, position: 'absolute'}}>{labels[1]}</Text>
                    </TouchableHighlight>
                </>
            </TouchableHighlight>
        </View>
    );
}

export const CustomButton = ({
    title,
    onPress,
    textColor=utils.convertColorDataToString(constants.whiteColor),
    backgroundColor=utils.convertColorDataToString(constants.greenColor),
    underlayColor=utils.convertColorDataToString(constants.blackColor),
    style,
}) => {
    return (
        <TouchableHighlight
            onPress={onPress}
            underlayColor={underlayColor}
            style={{
                ...styles.defaultBox,
                ...styles.dropShadow,
                backgroundColor: backgroundColor,
                padding: constants.padding,
                ...style
            }}
        >
            <Text
                style={{
                    ...styles.defaultTextButton,
                    color: textColor,
                    marginTop: -3,
                }}
            >{title}</Text>
        </TouchableHighlight>
    );
}

export const CheckBox = ({
    onPress,
    isChecked=true,
    isActive=true,
    width=45,
    height=45,
    backgroundColorIsTrue=utils.convertColorDataToString(constants.greenColor),
    backgroundColorIsFalse=utils.convertColorDataToString(constants.pinkColor),
}) => {

}

export const CustomDateTimePicker = ({
    currentDate=new Date(),
    minimumDate=new Date(),
    onChange=(date) => {},
}) => {
    const [showDatePicker, setShowDatePicker] = useState(true);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [date, setDate] = useState(currentDate);
    const [time, setTime] = useState(currentDate);

    const HandleDatePicker = async (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setShowDatePicker(false);
            onChange(new Date(currentDate));
        }
        else {
            setDate(selectedDate);
            setShowDatePicker(false);
            setShowTimePicker(true);
        }
    };

    const HandleTimePicker = async (event, selectedDate) => {
        setTime(selectedDate);
        setShowTimePicker(false);

        const newDate = new Date(
            date.getFullYear(), 
            date.getMonth(), 
            date.getDate(), 
            selectedDate.getHours(), 
            selectedDate.getMinutes(),
            selectedDate.getSeconds(),
        );

        onChange(newDate);
    };

    return (
        <>
            {
                showDatePicker ?
                <DateTimePicker 
                    value={date} 
                    minimumDate={minimumDate}
                    mode="date" 
                    display="spinner"
                    onChange={HandleDatePicker}
                />:
                <></>
            }
            {
                showTimePicker ?
                <DateTimePicker 
                    value={time} 
                    mode="time" 
                    display="spinner"
                    onChange={HandleTimePicker}
                />:
                <></>
            }
        </>
    );
}

export const CustomLine = ({
    height,
    width,
    strokeWidth=1,
    color=utils.convertColorDataToString(constants.blackColor)
}) => {
    return (
        <View style={{height: height, width: width}}>
            <Svg style={{height: height, width: width}}>
                <Line x1='0' y1='0' x2='100%' y2='0' stroke={color} strokeWidth={strokeWidth}/>
            </Svg>
        </View>
    );
}