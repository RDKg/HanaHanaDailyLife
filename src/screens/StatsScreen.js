import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, Text, View, TouchableHighlight, ScrollView, RefreshControl, Fragment } from 'react-native';
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
    const graphContainerHeight = 250;
    const steps = 5;

    const [monthLabelColumns, setMonthLabelColumns] = useState(<></>);
    const [budgetRows, setBudgetRows] = useState(<></>);
    const [rowLines, setRowLines] = useState(<></>);

    const [budgetDividerHeight, setBudgetDividerHeight] = useState();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [tasks, setTasks] = useState();

    const [budgetDividers, setBudgetDividers] = useState([0, 0, 0, 0, 0]);
    const [existingYears, setExistingYears] = useState([]);
    const [monthlyBudgetsOfYear, setMonthlyBudgetsOfYear] = useState();
    
    const [selectedYear, setSelectedYear] = useState();
    const [selectedMonth, setSelectedMonth] = useState();

    const onRefresh = () => {
        setIsRefreshing(true);
        setIsDataLoaded(false);
    };

    const handleLayoutbudgetDividerHeight = (event) => {
        if (budgetDividerHeight == null) {
            setBudgetDividerHeight(event.nativeEvent.layout.height);
        }
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
            const budgets = [];
            let maxBudget = 0;
            let minBudget = 0;

            result.map(item => {
                if (maxBudget < item.total_budget) {
                    maxBudget = item.total_budget;
                }

                if (minBudget > item.total_budget) {
                    minBudget = item.total_budget;
                }
            })

            const budgetsGap = (maxBudget - minBudget) / (steps);

            for (let i = 1; i <= steps; i++) {
                budgets.push(budgetsGap*i);
            } 

            setBudgetDividers(budgets);
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

    const createBudgetRows = () => {
        const rows = budgetDividers.map(item => (
            <Text 
                key={uuidv4()} 
                onLayout={(event) => handleLayoutbudgetDividerHeight(event)}
                style={{
                    ...styles.defaultTextStats, 
                    fontSize: 10, 
                    textAlign: 'center',
                }}
            >{Math.floor(item / 100) / 10}К</Text>
        ));

        setBudgetRows(rows);
    }

    const createMonthLabelColumns = () => {
        const columns = monthLabels.map((item, index) => (
            <Text 
                key={uuidv4()} 
                style={{...styles.defaultTextStats, fontSize: 6, width: 16, textAlign: 'center'}}
            >{item.slice(0, 3).toUpperCase()}</Text>
        ))

        setMonthLabelColumns(columns);
    }

    const createGraphRowLines = () => {
        const lines = budgetDividers.map((priceDivider, index) => (
            <View key={uuidv4()} style={{height: budgetDividerHeight, justifyContent: 'center'}}>
                <components.CustomLine height={1}/>
            </View>
        ));

        setRowLines(lines);
    }

    const getBudgetColumnHeight = (columnNum) => {
        const currentMonth = monthlyBudgetsOfYear.find(item => item.month - 1 == columnNum);

        if (!currentMonth) {
            return 0;
        }

        const maxBudget = budgetDividers[budgetDividers.length-1];
        const budget = currentMonth.total_budget;
        const graphNoPadding = graphContainerHeight - constants.MARGIN * 2;
        const result = (graphNoPadding / (maxBudget - budgetDividers[0])) * (budget - budgetDividers[0]) - constants.MARGIN + budgetDividerHeight;
        let height = constants.MARGIN;
        
        if (height < result) {
            height = result;
        }
        
        if (!Number.isFinite(height)) {
            return 0;
        }

        return height;
    }

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

    useEffect(() => {
        createBudgetRows();
        createGraphRowLines();
    }, [budgetDividers]);
    
    useEffect(() => {
        createMonthLabelColumns();
    }, []);

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
                        <View style={{width: '100%'}}>
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
                                            {budgetRows}
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
                                            {monthLabelColumns}
                                        </View>
                                        <View 
                                            style={{
                                                ...styles.defaultBox,
                                                backgroundColor: utils.convertColorDataToString(constants.GRAY_COLOR),
                                                position: 'relative',
                                                overflow: 'hidden',
                                                height: graphContainerHeight,
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
                                                {rowLines}
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
                                                        monthLabels.map((item, index) => (
                                                            <TouchableHighlight
                                                                key={uuidv4()}
                                                                onPress={() => setSelectedMonth(index+1)}
                                                                underlayColor={utils.convertColorDataToString(constants.PINK_COLOR)}
                                                                style={{
                                                                    ...styles.dropShadow,
                                                                    width: 16,
                                                                    height: getBudgetColumnHeight(index),
                                                                    backgroundColor: index == selectedMonth - 1 ?
                                                                        utils.convertColorDataToString(constants.PINK_COLOR) :
                                                                        utils.convertColorDataToString(constants.PURPLE_COLOR)

                                                                }}
                                                            >
                                                                <></>
                                                            </TouchableHighlight> 
                                                        ))
                                                    }
                                                </View>
                                            }
                                        </View>
                                    </View>
                                </View>
                                <View style={{gap: constants.PADDING, width: '100%'}}>
                                    {
                                        existingYears.length ?
                                        <>
                                            <ScrollView
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                contentContainerStyle={{ 
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
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
                                            <components.CustomLine/>
                                            {
                                                monthlyBudgetsOfYear && tasks && 
                                                <>
                                                    <Text style={{...styles.boxTitleText, textAlign: 'center'}} >{monthLabels[selectedMonth-1]} {selectedYear} г.</Text>
                                                    <Text style={styles.defaultTextStats}>Количество планов: {tasks.length}</Text>
                                                    <Text 
                                                        style={styles.defaultTextStats}
                                                    >Потрачено: {monthlyBudgetsOfYear.find(item => item.month == selectedMonth)?.total_budget} руб.</Text>
                                                </>
                                            }
                                        </> :
                                        <Text style={{...styles.defaultTextStats, textAlign: 'center'}}>Данные отсутствуют</Text>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}