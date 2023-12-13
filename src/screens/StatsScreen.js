import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, Text, View, TouchableHighlight, ScrollView, RefreshControl } from 'react-native';
import { Line, Svg } from 'react-native-svg';

import { v4 as uuidv4 } from 'uuid'; 

import * as constants from '../constants.js';
import * as components from '../components.js';
import * as utils from '../utils.js';
import { DatabaseService } from '../data/databaseService.js';
import { styles } from '../styles.js';

const db = DatabaseService.openDb('HanaHanaDailyLife.db');
const dbService = new DatabaseService(db);

const monthLabels = [
    'Январь', 'Февраль', 'Март', 
    'Апрель', 'Май', 'Июнь', 
    'Июль', 'Август', 'Сентябрь', 
    'Октябрь', 'Ноябрь', 'Декабрь'
];

export const StatsScreen = ({ navigation, route }) => {
    const canNavigatePreviousPage = route?.params?.canNavigatePreviousPage;
    const currentDate = new Date();

    const [priceDividerHeight, setPriceDividerHeight] = useState();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [tasks, setTasks] = useState();

    const [priceDividers, setPriceDividers] = useState([0, 0, 0, 0, 0]);
    const [existingYears, setExistingYears] = useState([]);
    const [monthlyBudgetsOfYear, setMonthlyBudgetsOfYear] = useState();
    
    const [selectedYear, setSelectedYear] = useState();
    const [selectedMonth, setSelectedMonth] = useState();

    const onRefresh = () => {
        setIsRefreshing(true);
        setIsDataLoaded(false);
    };

    const fetchExistingYears = () => {
        dbService.getExistingYears()
        .then(result => {
            setExistingYears(result);
            setSelectedYear(result[0]);
        });
    }

    const fetchMonthlyBudgetsOfYear = () => {
        dbService.getMonthlyBudgetsOfYear(selectedYear)
        .then(result => {
            const prices = [0];
            let maxPrice = 0;

            result.map(item => {
                if (maxPrice < item.total_budget) {
                    maxPrice = item.total_budget;
                }
            })

            for (let i = 1; i <= 5; i++) {
                prices.push(Math.round(maxPrice / i) / 1000);
            } 

            setPriceDividers(prices.sort());
            setSelectedMonth(result[result.length-1]?.month);
            setMonthlyBudgetsOfYear(result);
        });
    }

    const fetchTasksOfMonthAndYear = () => {
        dbService.getTasksOfMonthAndYear(selectedYear, selectedMonth)
        .then(result => {
            setTasks(result);
        })
        
    }

    const handleLayoutPriceDividerHeight = (event) => {
        if (priceDividerHeight == null) {
            setPriceDividerHeight(event.nativeEvent.layout.height);
        }
    };

    useEffect(() => {
        if (!isDataLoaded) {
            fetchExistingYears();
        }

        setIsDataLoaded(true);
        setIsRefreshing(false);
    }, [isDataLoaded]);

    useEffect(() => {
        if (selectedYear) {
            fetchMonthlyBudgetsOfYear();
        }
        else {
            setMonthlyBudgetsOfYear(null);
        }
    }, [selectedYear, existingYears]);

    useEffect(() => {
        if (selectedMonth) {
            fetchTasksOfMonthAndYear();
        }
    }, [selectedMonth]);
    
    return (
        <View style={styles.mainContainer}>
            <components.BackgroundImage/>
            { 
                canNavigatePreviousPage &&
                <components.NavigatePreviousScreenButton onPress={() => navigation.goBack()}/>
            }
            <SafeAreaView style={{gap: constants.MARGIN, position: 'relative', flex: 1}}>   
                <ScrollView
                    style={{height: '100%'}}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={[utils.convertColorDataToString(constants.PINK_COLOR)]}
                        />
                    }
                >
                    <View style={{...styles.mainContainerDefault}}>
                        <View 
                            style={{
                                ...styles.defaultBox, 
                                ...styles.dropShadow, 
                                padding: constants.PADDING,
                                gap: constants.PADDING,
                            }}
                        >
                            <View
                                style={{
                                    gap: constants.PADDING,
                                    flexDirection: 'row',
                                    position: 'relative',
                                }}
                            >
                                <View style={{gap: constants.MARGIN}}>
                                    <Text style={{...styles.defaultTextStats, fontSize: 6}}></Text>
                                    <View 
                                        style={{
                                            paddingVertical: constants.MARGIN,
                                            justifyContent: 'space-between',
                                            gap: constants.MARGIN, 
                                            flex: 1, 
                                        }}
                                    >
                                        {
                                            priceDividers.map(item => (
                                                <Text 
                                                    key={uuidv4()} 
                                                    onLayout={(event) => handleLayoutPriceDividerHeight(event)}
                                                    style={{
                                                        ...styles.defaultTextStats, 
                                                        fontSize: 10, 
                                                        textAlign: 'center',
                                                    }}
                                                >{item}К</Text>
                                            ))
                                        }
                                    </View>
                                </View>
                                <View style={{gap: constants.MARGIN, flex: 1}}>
                                    <View 
                                        style={{
                                            paddingHorizontal: constants.MARGIN,
                                            justifyContent: 'space-between',
                                            flexDirection: 'row', 
                                        }}
                                    >
                                        {
                                            monthLabels.map((item, index) => (
                                                <Text 
                                                    key={uuidv4()} 
                                                    style={{...styles.defaultTextStats, fontSize: 6, width: 16, textAlign: 'center'}}
                                                >{item.slice(0, 3).toUpperCase()}</Text>
                                            ))
                                        }
                                    </View>
                                    <View 
                                        style={{
                                            ...styles.defaultBox,
                                            backgroundColor: utils.convertColorDataToString(constants.GRAY_COLOR),
                                            position: 'relative',
                                            overflow: 'hidden',
                                            height: 250,
                                            flex: 1,
                                        }}
                                    >
                                        <View 
                                            style={{
                                                paddingVertical: constants.MARGIN,
                                                justifyContent: 'space-between', 
                                                gap: constants.MARGIN, 
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0.25,
                                                flex: 1,
                                            }}
                                        >
                                            {
                                                priceDividers.map((priceDivider, index) => (
                                                    <View key={uuidv4()} style={{height: priceDividerHeight, justifyContent: 'center'}}>
                                                        <components.CustomLine key={index} height={1}/>
                                                    </View>
                                                ))
                                            }
                                        </View>
                                        {
                                            monthlyBudgetsOfYear &&
                                            <View
                                                style={{
                                                    paddingHorizontal: constants.MARGIN,
                                                    justifyContent: 'space-between',
                                                    flexDirection: 'row',
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                            >
                                                {
                                                    monthLabels.map((item, index) => {
                                                        const isExist = monthlyBudgetsOfYear.find(month => month.month - 1 == index);

                                                        if (!isExist) {
                                                            return <View style={{width: 16}}/>
                                                        }

                                                        const isSelected = selectedMonth - 1 == index;
                                                        

                                                        return (
                                                            <TouchableHighlight
                                                                key={uuidv4()}
                                                                onPress={() => setSelectedMonth(index+1)}
                                                                underlayColor={utils.convertColorDataToString(constants.PINK_COLOR)}
                                                                style={{
                                                                    width: 16,
                                                                    minHeight: 10,
                                                                    height: 10,
                                                                    backgroundColor: isSelected ?
                                                                                    utils.convertColorDataToString(constants.PINK_COLOR) :
                                                                                    utils.convertColorDataToString(constants.PURPLE_COLOR)

                                                                }}
                                                            >
                                                                <></>
                                                            </TouchableHighlight> 
                                                        );
                                                    })
                                                    
                                                }
                                            </View>
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={{width: '100%', gap: constants.PADDING}}>
                                {
                                    existingYears.length ?
                                    <>
                                        <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ 
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {
                                                existingYears.map(year => (
                                                    <TouchableHighlight
                                                        key={uuidv4()}
                                                        onPress={() => setSelectedYear(year)}
                                                        underlayColor={null}
                                                        style={{paddingHorizontal: constants.PADDING * 1.5}}
                                                    >
                                                        <Text 
                                                            style={{
                                                                ...styles.defaultTextStats,
                                                                color: year === selectedYear && utils.convertColorDataToString(constants.PURPLE_COLOR),
                                                                fontFamily: year === selectedYear ? 'RalewayRegular' : styles.defaultTextStats.fontFamily,
                                                            }}
                                                        >{year}</Text>
                                                    </TouchableHighlight>
                                                ))
                                            }
                                        </ScrollView> 
                                        <View>
                                            <components.CustomLine/>
                                        </View>
                                        {
                                            tasks && 
                                            <>
                                                <Text style={{...styles.boxTitleText, textAlign: 'center'}} >{monthLabels[selectedMonth-1]} {selectedYear} г.</Text>
                                                <Text style={styles.defaultTextStats}>Количество планов: {tasks.length}</Text>
                                                <Text 
                                                    style={styles.defaultTextStats}
                                                >Потрачено: {monthlyBudgetsOfYear.find(item => item.month == selectedMonth)?.total_budget} руб.</Text>
                                            </>
                                        }
                                    </> :
                                    <Text style={{...styles.defaultTextStats}}>Данные отсутствуют</Text>
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

export const StatsScreenOld = ({ navigation, route }) => {
    const canNavigatePreviousPage = route?.params?.canNavigatePreviousPage;

    const currentDate = new Date();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [tasksData, setTasksData] = useState();
    const [years, setYears] = useState([]);
    const [monthlyBudgets, setMonthlyBudgets] = useState();
    
    const [selectedYear, setSelectedYear] = useState();
    const [selectedMonth, setSelectedMonth] = useState();

    const [pricesDivider, setPricesDivider] = useState([0]);

    const [scrollViewWidth, setScrollViewWidth] = useState(0);
    const scrollViewElementWidth = scrollViewWidth / years.length;
    const scrollViewRef = useRef();
    
    useEffect(() => {
        if (years.length > 0) {
            const x = scrollViewElementWidth * years.indexOf(selectedYear) - (scrollViewElementWidth * 1.5);
            
            scrollViewRef.current.scrollTo({x: x, y: 0, animated: false});
        }
    }, [selectedYear]);

    const fetchYears = () => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT DISTINCT strftime('%Y', datetime(started_at / 1000, 'unixepoch')) AS year
                FROM task;`,
                [],
                (_, {rows}) => {
                    const yearsResult = rows._array.map(item => item.year).sort().reverse();

                    setYears(yearsResult);
                    setSelectedYear(yearsResult[0]);
                },
                (_, error) => {
                    console.error('Ошибка выполнения запроса для получения уникальных дат:', error);
                }
            );
        });
    };

    const fetchMonthlyBudgets = () => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT 
                    CAST(strftime('%m', datetime(started_at / 1000, 'unixepoch')) AS INTEGER) AS month,
                    strftime('%Y', datetime(started_at / 1000, 'unixepoch')) AS year,
                    SUM(budget) AS total_budget
                FROM task
                WHERE strftime('%Y', datetime(started_at / 1000, 'unixepoch')) = ?
                GROUP BY month
                ORDER BY month;`,
                [selectedYear || years[0]], 
                (_, {rows}) => {
                    const budgets = rows._array;
                    const prices = [];
                    let maxPrice = 0;

                    budgets.map(item => {
                        if (maxPrice < item.total_budget) {
                            maxPrice = item.total_budget;
                        }
                    })

                    for (let i = 1; i <= 5; i++) {
                        prices.push(Math.round(maxPrice / i));
                    } 

                    setPricesDivider(prices.reverse()); 
                    setSelectedMonth(budgets[budgets.length-1].month);
                    setMonthlyBudgets(budgets);
                },
                (_, error) => {
                    console.error('Ошибка выполнения запроса для получения данных о месяцах:', error);
                }
            );
        });
    }

    const fetchTasksData = () => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT 
                    *
                FROM task
                WHERE strftime('%Y', datetime(started_at / 1000, 'unixepoch')) = ?
                AND CAST(strftime('%m', datetime(started_at / 1000, 'unixepoch')) AS INTEGER) = ?;`,
                [selectedYear || years[0], selectedMonth],   
                (_, {rows}) => {
                    setTasksData({data: rows._array});
                },
                (_, error) => {
                    console.error('Ошибка выполнения запроса для получения данных за месяц:', error);
                }
            );
        });
    }

    const onRefresh = () => {
        setIsDataLoaded(false);
        setMonthlyBudgets([]);
        setPricesDivider([0]);
        fetchYears();
        setIsRefreshing(false);
    };

    useEffect(() => {
        onRefresh();
    }, []);

    useEffect(() => {
        if (selectedYear) {
            fetchMonthlyBudgets();
        }
    }, [selectedYear]);

    useEffect(() => {
        if (selectedMonth && (selectedYear || years[0])) {
            fetchTasksData();
        }
    }, [selectedMonth]);

    useEffect(() => {
        if (years.length != 0) {
            fetchMonthlyBudgets();
        }
    }, [years]);

    return (
        <View style={styles.mainContainer}>
            <components.BackgroundImage/>
            { 
                canNavigatePreviousPage &&
                <components.NavigatePreviousScreenButton onPress={() => navigation.goBack()}/>
            }
            <SafeAreaView style={{gap: constants.MARGIN, position: 'relative', flex: 1}}>
                <ScrollView
                    style={{height: '100%'}}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={[utils.convertColorDataToString(constants.PINK_COLOR)]}
                        />
                    }
                >
                    <View style={{...styles.mainContainerDefault}}>
                        <View style={{...styles.defaultBox, ...styles.dropShadow, width: '100%'}}>
                            <View style={{gap: 10, flexDirection: 'row', padding: constants.MARGIN, alignItems: 'center'}}>
                                <View 
                                    style={{
                                        alignItems: 'center', 
                                        gap: constants.PADDING*2, 
                                        marginHorizontal: constants.MARGIN, 
                                        marginTop: 40,
                                        marginBottom: 25,
                                    }}
                                >
                                    {
                                        pricesDivider.map((priceDivider, index) => (
                                            <View key={index} style={{justifyContent: 'center'}}>
                                                <Text style={{...styles.defaultTextStats, fontSize: 8}}>{priceDivider/1000}К</Text>
                                            </View>
                                        ))
                                    }
                                </View>
                                <View style={{flex: 1, gap: constants.MARGIN}}>
                                    <View 
                                        style={{
                                            flexDirection: 'row', 
                                            justifyContent: 'space-between', 
                                            paddingRight: constants.PADDING, 
                                            paddingLeft: constants.PADDING
                                        }}
                                    >
                                        {
                                            monthLabels.map((label, index) => (
                                                <Text 
                                                    key={index} 
                                                    style={{
                                                        ...styles.defaultTextStats, 
                                                        fontSize: 8
                                                    }}
                                                >{label.toUpperCase().slice(0, 3)}</Text>
                                            ))
                                        }
                                    </View>
                                    <View 
                                        style={{
                                            backgroundColor: utils.convertColorDataToString(constants.GRAY_COLOR),
                                            borderRadius: constants.BORDER_RADIUS,
                                            flex: 1,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <View 
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                flexDirection: 'row', 
                                                justifyContent: 'space-between',
                                                paddingRight: constants.PADDING, 
                                                paddingLeft: constants.PADDING
                                            }}
                                        >
                                            {
                                                monthlyBudgets &&
                                                monthLabels.map((item, index) => {
                                                    const hasMonth = monthlyBudgets.find(item => item.month == index+1);
                                                    
                                                    if (hasMonth) {
                                                        const closestNumber = pricesDivider.reduce((prev, curr) => {
                                                            return Math.abs(curr - hasMonth.total_budget) < Math.abs(prev - hasMonth.total_budget) ? curr : prev;
                                                        });
                                                        const closestNumberIndex = pricesDivider.findIndex(price => price == closestNumber);
                                                        const part = (Math.min(pricesDivider[closestNumberIndex], hasMonth.total_budget) + 0.01) / 
                                                                     (Math.max(pricesDivider[closestNumberIndex], hasMonth.total_budget) + 0.01);

                                                        return (
                                                            <TouchableHighlight 
                                                                key={index}
                                                                onPress={() => {setSelectedMonth(index+1)}}
                                                                underlayColor={utils.convertColorDataToString(constants.PINK_COLOR)}
                                                                style={{
                                                                    ...styles.defaultBox, 
                                                                    ...styles.dropShadow,
                                                                    borderRadius: 0, 
                                                                    height: (220 / 5) * (closestNumberIndex + part), 
                                                                    width: 14, 
                                                                    backgroundColor: utils.convertColorDataToString(selectedMonth == index + 1 ? constants.PINK_COLOR : constants.PURPLE_COLOR),
                                                                    zIndex: 999
                                                                }}
                                                            >
                                                                <View></View>
                                                            </TouchableHighlight>
                                                        );
                                                    }

                                                    return (
                                                        <View style={{width: 14}}></View>
                                                    );
                                                })
                                            }
                                        </View>
                                        <View 
                                            style={{
                                                flex: 1, 
                                                justifyContent: 'space-between', 
                                                paddingVertical: constants.PADDING*2, 
                                                opacity: 0.25
                                            }}
                                        >
                                            {
                                                pricesDivider.map((priceDivider, index) => (
                                                    <components.CustomLine key={index}/>
                                                ))
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {
                                years.length > 0 ? 
                                <>
                                    <View style={{width: '100%', paddingHorizontal: constants.PADDING}}>
                                        <ScrollView
                                            ref={scrollViewRef}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ 
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: constants.PADDING,
                                                paddingTop: 0,
                                                gap: constants.PADDING*3,
                                            }}
                                            onContentSizeChange={(contentWidth) => {
                                                setScrollViewWidth(contentWidth);
                                            }}
                                        >
                                            {
                                                years.map((year, index) => (
                                                    <TouchableHighlight 
                                                        key={uuidv4()}
                                                        onPress={() => setSelectedYear(year)}
                                                        underlayColor={null}
                                                    >
                                                        <Text 
                                                            style={{
                                                                ...styles.defaultTextStats,
                                                                color: year === selectedYear ? utils.convertColorDataToString(constants.PURPLE_COLOR) : styles.defaultTextStats.color,
                                                                fontFamily: year === selectedYear ? 'RalewayRegular' : styles.defaultTextStats.fontFamily,
                                                            }}
                                                        >{year}</Text>
                                                    </TouchableHighlight>
                                                ))
                                            }
                                        </ScrollView>
                                    </View>
                                    <View style={{height: 1, width: '100%', padding: constants.PADDING, paddingTop: 0}}>
                                        <Svg style={{height: 1}}>
                                            <Line x1='0' y1='0' x2='100%' y2='0' stroke={utils.convertColorDataToString(constants.BLACK_COLOR)} strokeWidth='1'/>
                                        </Svg>
                                    </View>
                                    {
                                        tasksData &&
                                        <View style={{width: '100%', paddingHorizontal: constants.PADDING, gap: constants.PADDING}}>
                                            <Text style={styles.boxTitleText}>{monthLabels[selectedMonth-1]} {selectedYear} Г.</Text>
                                            <View style={{width: '100%', justifyContent: 'flex-start', gap: constants.PADDING, paddingBottom: constants.PADDING}}>
                                                {/* <Text style={styles.defaultTextStats}>
                                                    Пройдено:
                                                </Text> */}
                                                <Text style={styles.defaultTextStats}>
                                                    Количество планов: {tasksData.data.length}
                                                </Text>
                                                <Text style={styles.defaultTextStats}>
                                                    Потрачено: {Math.round(monthlyBudgets.find(item => item.month == selectedMonth)?.total_budget)} руб.
                                                </Text>
                                            </View>
                                        </View>
                                    }
                                </> :
                                <Text 
                                    style={{
                                        ...styles.defaultTextStats, 
                                        padding: constants.PADDING, 
                                        paddingTop: 0
                                    }}
                                >Данные отсутствуют</Text>
                            }
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}