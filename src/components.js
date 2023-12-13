import React, { useState, Fragment } from 'react';
import { View, TouchableOpacity, Animated, Text, TouchableHighlight, FlatList, RefreshControl } from 'react-native';
import { SvgXml, Line, Svg } from 'react-native-svg';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';

import { v4 as uuidv4 } from 'uuid'; 
import { LinearGradient } from 'expo-linear-gradient';

import * as constants from './constants.js';
import * as utils from './utils.js';
import { styles } from './styles.js';

import BackgroundSVG from '../assets/img/background.svg';
import BackgroundProfileSVG from '../assets/img/background-header-avatar-vector.svg';
import ArrowBackSVG from '../assets/ico/arrow-back-ico.svg';
import ArrowDownSVG from '../assets/ico/arrow-down-ico.svg';

export const BackgroundImage = () => {
    return (
        <View style={styles.backgroundWrapper}>
            <BackgroundSVG width={'100%'}/>
        </View>
    );
}

export const BackgroundImageProfile = () => {
    return (
        <View style={{...styles.backgroundWrapper, gap: -150}}>
            <BackgroundProfileSVG width={'100%'} style={{top: -75}}/>
            <BackgroundSVG width={'100%'}/>
        </View>
    );
}

export const NavigatePreviousScreenButton = ({ 
    onPress 
}) => {
    return (
        <TouchableHighlight 
            onPress={() => onPress()}
            underlayColor={utils.convertColorDataToString(constants.GRAY_COLOR)}
            style={{
                ...styles.marginVertical,
                ...styles.defaultBox, 
                ...styles.dropShadow, 
                width: 34, 
                height: 32,
                position: 'absolute',
                left: constants.MARGIN,
                zIndex: 9999,
            }}
        >
            <ArrowBackSVG width={16} height={14}/>
        </TouchableHighlight>
    );
}

export const SvgXmlRenderer = ({ 
    svgXmlString, 
    width, 
    height 
}) => {
    return (
        <SvgXml xml={svgXmlString} width={width} height={height}/>
    );
}

export const NavigationTabButton = ({ 
    Component, 
    isActive 
}) => {
    if (isActive) {
        Component = (
            <>
                {Component}
                <LinearGradient
                    colors={[utils.convertColorDataToString(constants.PINK_COLOR), 'rgba(255, 5, 95, 0.19)', 'transparent']}
                    locations={[0, 0.1, 1]}
                    style={{...styles.activeTabButton, ...styles.gradient}}
                />
            </>
        );
    }

    return Component;
}

export const TabBarIcon = ({ 
    svgXmlStringObj, 
    isFocused, 
    width=26, 
    height=26 
}) => {
    let svgXmlString = svgXmlStringObj(isFillGradient=(isFocused));
    let SvgXmlComponent = <SvgXmlRenderer svgXmlString={svgXmlString} width={width} height={height}/>;

    return (
        <NavigationTabButton Component={SvgXmlComponent} isActive={isFocused}/>
    );
}

export const TaskButton = ({
    onPress=null, 
    underlayColor=utils.convertColorDataToString(constants.GRAY_COLOR),
    AvatarComponent=constants.TASKS_AVATARS.anotherTaskAvatar, 
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
                padding: constants.PADDING,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: constants.PADDING,
                position: 'relative'
            }}
        >
            <>
                <AvatarComponent/>
                <View 
                    style={{
                        flex: 1,
                        gap: constants.MARGIN / 2,
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
                    AvatarComponent={constants.TASKS_AVATARS[item.avatar]}
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
                            colors={constants.PINK_TO_PURPLE_GRADIENT.colors}
                            start={constants.PINK_TO_PURPLE_GRADIENT.start}
                            end={constants.PINK_TO_PURPLE_GRADIENT.end}
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
                            color: utils.convertColorDataToString(constants.GREEN_COLOR),
                            padding: constants.PADDING,
                            right: 0,
                            top: 0,
                        }}
                    >{startTimeString}</Text>
                    <Text 
                        key={uuidv4()}
                        style={{
                            ...styles.hintText, 
                            position: 'absolute',
                            color: utils.convertColorDataToString(constants.PINK_COLOR),
                            padding: constants.PADDING,
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
    backgroundColor=utils.convertColorDataToString(constants.WHITE_COLOR),
    backgroundColorIsTrue=utils.convertColorDataToString(constants.GREEN_COLOR),
    backgroundColorIsFalse=utils.convertColorDataToString(constants.PINK_COLOR),
}) => {
    return (
        <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: constants.PADDING,
                alignContent: 'center',
                alignItems: 'center'
            }}
        >
            <Text style={{...styles.boxTitleText, fontSize: 16, flexShrink: 1, textAlign: 'right'}}>{title}</Text>
            <TouchableHighlight
                onPress={!isActive ? () => {} : onPress}
                underlayColor={utils.convertColorDataToString(constants.WHITE_COLOR)}
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
                        underlayColor={utils.convertColorDataToString(constants.WHITE_COLOR)}
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
    textColor=utils.convertColorDataToString(constants.WHITE_COLOR),
    backgroundColor=utils.convertColorDataToString(constants.GREEN_COLOR),
    underlayColor=utils.convertColorDataToString(constants.BLACK_COLOR),
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
                padding: constants.PADDING,
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
    style,
    width='100%',
    height=1,
    strokeWidth=1,
    color=utils.convertColorDataToString(constants.BLACK_COLOR),
}) => {
    return (
        <Svg style={{height: height, width: width, ...style}}>
            <Line x1='0' y1='0' x2='100%' y2='0' stroke={color} strokeWidth={strokeWidth}/>
        </Svg>
    );
}