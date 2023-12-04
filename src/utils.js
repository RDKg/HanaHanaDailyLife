import React, { useState, useEffect } from 'react';
import { Alert, Linking } from 'react-native';

import * as Location from 'expo-location';

import * as constants from './styles/constants.js';

export const svgXmlStringsObject = {
    Stats: graphIcoXmlStringSvg,
    Profile: profileIcoXmlStringSvg,
    Home: homeIcoXmlStringSvg,
    Tasks: taskIcoXmlStringSvg,
    Settings: settingsIcoXmlStringSvg,
}

export function taskIcoXmlStringSvg(isFillGradient) {
    let gradientFill = isFillGradient ? 'url(#gradient)' : '#525252'; 

    let svgXmlString = `
        <svg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <defs>
                <linearGradient  
                    id='gradient' 
                    x1=${constants.pinkToPurpleLightGradient.start.x}
                    y1=${constants.pinkToPurpleLightGradient.start.y}
                    x2=${constants.pinkToPurpleLightGradient.end.x}
                    y2=${constants.pinkToPurpleLightGradient.end.y}
                >
                    <Stop offset='0' stop-color='${constants.pinkToPurpleLightGradient.colors[0]}'/>
                    <Stop offset='1' stop-color='${constants.pinkToPurpleLightGradient.colors[1]}'/>
                </linearGradient>
            </defs>
            <path 
                d="M6.50011 6.93334C6.71559 6.93334 6.92225 6.84203 7.07462 6.6795C7.22699 6.51696 7.3126 6.29652 7.3126 6.06667V0.866667C7.3126 0.636813 7.22699 0.416373 7.07462 0.253841C6.92225 0.0913093 6.71559 0 6.50011 0C6.28462 0 6.07796 0.0913093 5.92559 0.253841C5.77322 0.416373 5.68762 0.636813 5.68762 0.866667V6.06667C5.68762 6.29652 5.77322 6.51696 5.92559 6.6795C6.07796 6.84203 6.28462 6.93334 6.50011 6.93334Z" 
                fill='${gradientFill}'
            />
            <path 
                d="M19.4999 6.93334C19.7154 6.93334 19.922 6.84203 20.0744 6.6795C20.2268 6.51696 20.3124 6.29652 20.3124 6.06667V0.866667C20.3124 0.636813 20.2268 0.416373 20.0744 0.253841C19.922 0.0913093 19.7154 0 19.4999 0C19.2844 0 19.0778 0.0913093 18.9254 0.253841C18.773 0.416373 18.6874 0.636813 18.6874 0.866667V6.06667C18.6874 6.29652 18.773 6.51696 18.9254 6.6795C19.0778 6.84203 19.2844 6.93334 19.4999 6.93334Z" 
                fill='${gradientFill}'
            />
            <path 
                d="M24.5779 3.46665H21.328V6.06665C21.328 6.57233 21.1397 7.0573 20.8045 7.41487C20.4692 7.77244 20.0146 7.97332 19.5405 7.97332C19.0665 7.97332 18.6118 7.77244 18.2766 7.41487C17.9414 7.0573 17.753 6.57233 17.753 6.06665V3.46665H8.28758V6.06665C8.28758 6.57233 8.09925 7.0573 7.76404 7.41487C7.42882 7.77244 6.97417 7.97332 6.5001 7.97332C6.02604 7.97332 5.57139 7.77244 5.23617 7.41487C4.90096 7.0573 4.71263 6.57233 4.71263 6.06665V3.46665H1.46269C1.26933 3.46431 1.0775 3.50334 0.898538 3.58145C0.719575 3.65956 0.557114 3.77516 0.420763 3.92142C0.284412 4.06767 0.176941 4.2416 0.104706 4.43293C0.0324702 4.62425 -0.00306264 4.82909 0.000208851 5.03532V24.4313C-0.00301917 24.6339 0.0312005 24.8352 0.100913 25.0237C0.170626 25.2122 0.274466 25.3842 0.406502 25.5298C0.538539 25.6755 0.696185 25.792 0.870436 25.8727C1.04469 25.9533 1.23213 25.9966 1.42206 26H24.5779C24.7679 25.9966 24.9553 25.9533 25.1296 25.8727C25.3038 25.792 25.4615 25.6755 25.5935 25.5298C25.7255 25.3842 25.8294 25.2122 25.8991 25.0237C25.9688 24.8352 26.003 24.6339 25.9998 24.4313V5.03532C26.003 4.83273 25.9688 4.63144 25.8991 4.44295C25.8294 4.25447 25.7255 4.08248 25.5935 3.93681C25.4615 3.79114 25.3038 3.67464 25.1296 3.59397C24.9553 3.5133 24.7679 3.47004 24.5779 3.46665ZM19.4511 12.636L11.5944 21.0167L7.31259 16.4147C7.12289 16.1921 7.02014 15.9006 7.02537 15.5999C7.0306 15.2991 7.14342 15.0119 7.34072 14.797C7.53803 14.5821 7.80489 14.4558 8.08666 14.444C8.36842 14.4321 8.64377 14.5357 8.85632 14.7333L11.6025 17.6627L17.8749 10.972C17.9779 10.8622 18.1001 10.775 18.2346 10.7156C18.3692 10.6562 18.5134 10.6256 18.659 10.6256C18.8046 10.6256 18.9488 10.6562 19.0833 10.7156C19.2178 10.775 19.3401 10.8622 19.443 10.972C19.546 11.0818 19.6277 11.2122 19.6834 11.3557C19.7391 11.4992 19.7678 11.653 19.7678 11.8083C19.7678 11.9636 19.7391 12.1174 19.6834 12.2609C19.6277 12.4044 19.546 12.5348 19.443 12.6447L19.4511 12.636Z" 
                fill='${gradientFill}'
            />
        </svg>
    `;
    
    return svgXmlString;
}
 
export function graphIcoXmlStringSvg(isFillGradient) {
    let gradientFill = isFillGradient ? 'url(#gradient)' : '#525252'; 

    let svgXmlString = `
        <svg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <defs>
                <linearGradient  
                    id='gradient' 
                    x1=${constants.pinkToPurpleLightGradient.start.x}
                    y1=${constants.pinkToPurpleLightGradient.start.y}
                    x2=${constants.pinkToPurpleLightGradient.end.x}
                    y2=${constants.pinkToPurpleLightGradient.end.y}
                >
                    <Stop offset='0' stop-color='${constants.pinkToPurpleLightGradient.colors[0]}'/>
                    <Stop offset='1' stop-color='${constants.pinkToPurpleLightGradient.colors[1]}'/>
                </linearGradient>
            </defs>
            <path 
                d="M5.90909 14.1818H1.18182C0.472727 14.1818 0 14.6545 0 15.3636V24.8182C0 25.5273 0.472727 26 1.18182 26H5.90909C6.61818 26 7.09091 25.5273 7.09091 24.8182V15.3636C7.09091 14.6545 6.61818 14.1818 5.90909 14.1818ZM24.8182 9.45455H20.0909C19.3818 9.45455 18.9091 9.92727 18.9091 10.6364V24.8182C18.9091 25.5273 19.3818 26 20.0909 26H24.8182C25.5273 26 26 25.5273 26 24.8182V10.6364C26 9.92727 25.5273 9.45455 24.8182 9.45455ZM15.3636 0H10.6364C9.92727 0 9.45455 0.472727 9.45455 1.18182V24.8182C9.45455 25.5273 9.92727 26 10.6364 26H15.3636C16.0727 26 16.5455 25.5273 16.5455 24.8182V1.18182C16.5455 0.472727 16.0727 0 15.3636 0Z" 
                fill='${gradientFill}'
            />
        </svg>
    `;
    
    return svgXmlString;
}

export function homeIcoXmlStringSvg(isFillGradient) {
    let gradientFill = isFillGradient ? 'url(#gradient)' : '#525252'; 

    let svgXmlString = `
        <svg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <defs>
                <linearGradient  
                    id='gradient' 
                    x1=${constants.pinkToPurpleLightGradient.start.x}
                    y1=${constants.pinkToPurpleLightGradient.start.y}
                    x2=${constants.pinkToPurpleLightGradient.end.x}
                    y2=${constants.pinkToPurpleLightGradient.end.y}
                >
                    <Stop offset='0' stop-color='${constants.pinkToPurpleLightGradient.colors[0]}'/>
                    <Stop offset='1' stop-color='${constants.pinkToPurpleLightGradient.colors[1]}'/>
                </linearGradient>
            </defs>
            <path 
                d="M34.8774 19.1201C34.7291 19.121 34.582 19.0926 34.4447 19.0366C34.3073 18.9806 34.1824 18.8981 34.0771 18.7938L17.9688 2.70167L1.86047 18.7938C1.64482 18.9782 1.36744 19.0745 1.08374 19.0636C0.800036 19.0526 0.530918 18.9352 0.330163 18.7348C0.129407 18.5344 0.0117988 18.2657 0.000840677 17.9825C-0.0101174 17.6993 0.0863814 17.4224 0.271054 17.2071L17.1797 0.327236C17.3909 0.117643 17.6766 0 17.9744 0C18.2722 0 18.5579 0.117643 18.7691 0.327236L35.6778 17.2071C35.8329 17.3651 35.9379 17.5652 35.9797 17.7824C36.0216 17.9997 35.9983 18.2244 35.9129 18.4285C35.8275 18.6326 35.6838 18.8071 35.4996 18.9301C35.3154 19.0531 35.099 19.1192 34.8774 19.1201Z" 
                fill='${gradientFill}'
            />
            <path 
                d="M17.9688 6.50525L4.44186 20.0541V33.7493C4.44186 34.3462 4.67938 34.9187 5.10218 35.3408C5.52498 35.7629 6.09842 36 6.69634 36H14.587V24.7467H21.3505V36H29.2412C29.8391 36 30.4126 35.7629 30.8354 35.3408C31.2582 34.9187 31.4957 34.3462 31.4957 33.7493V19.9754L17.9688 6.50525Z" 
                fill='${gradientFill}'
            />
        </svg>
    `;
    
    return svgXmlString;
}

export function settingsIcoXmlStringSvg(isFillGradient) {
    let gradientFill = isFillGradient ? 'url(#gradient)' : '#525252'; 

    let svgXmlString = `
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.4939 13.1667C23.4939 12.8677 23.4805 12.5817 23.4538 12.2827L25.9406 10.4497C26.4754 10.0597 26.6225 9.33166 26.2882 8.75966L23.788 4.56066C23.6277 4.2853 23.3684 4.07724 23.0599 3.97646C22.7515 3.87568 22.4156 3.88928 22.1168 4.01466L19.2423 5.19766C18.7476 4.85966 18.2261 4.56066 17.678 4.31366L17.2902 1.31066C17.21 0.660657 16.6351 0.166656 15.9666 0.166656H10.9796C10.2978 0.166656 9.72285 0.660657 9.64263 1.31066L9.2549 4.31366C8.70673 4.56066 8.1853 4.85966 7.69061 5.19766L4.81607 4.01466C4.20106 3.75466 3.47908 3.98866 3.14483 4.56066L0.644649 8.77266C0.310401 9.34466 0.45747 10.0597 0.992268 10.4627L3.47908 12.2957C3.42366 12.8794 3.42366 13.4669 3.47908 14.0507L0.992268 15.8837C0.45747 16.2737 0.310401 17.0017 0.644649 17.5737L3.14483 21.7727C3.47908 22.3447 4.20106 22.5787 4.81607 22.3187L7.69061 21.1357C8.1853 21.4737 8.70673 21.7727 9.2549 22.0197L9.64263 25.0227C9.72285 25.6727 10.2978 26.1667 10.9663 26.1667H15.9532C16.6217 26.1667 17.1966 25.6727 17.2769 25.0227L17.6646 22.0197C18.2128 21.7727 18.7342 21.4737 19.2289 21.1357L22.1034 22.3187C22.7184 22.5787 23.4404 22.3447 23.7747 21.7727L26.2748 17.5737C26.6091 17.0017 26.462 16.2867 25.9272 15.8837L23.4404 14.0507C23.4805 13.7517 23.4939 13.4657 23.4939 13.1667ZM13.5199 17.7167C10.9395 17.7167 8.84043 15.6757 8.84043 13.1667C8.84043 10.6577 10.9395 8.61666 13.5199 8.61666C16.1003 8.61666 18.1994 10.6577 18.1994 13.1667C18.1994 15.6757 16.1003 17.7167 13.5199 17.7167Z" fill='${gradientFill}'/>
            <defs>
                <linearGradient 
                    id='gradient' 
                    x1=${constants.pinkToPurpleLightGradient.start.x}
                    y1=${constants.pinkToPurpleLightGradient.start.y}
                    x2=${constants.pinkToPurpleLightGradient.end.x}
                    y2=${constants.pinkToPurpleLightGradient.end.y}
                >
                    <Stop offset='0' stop-color='${constants.pinkToPurpleLightGradient.colors[0]}'/>
                    <Stop offset='1' stop-color='${constants.pinkToPurpleLightGradient.colors[1]}'/>
                </linearGradient>
            </defs>
        </svg>    
    `;
    
    return svgXmlString;
}

export function profileIcoXmlStringSvg(isFillGradient) {
    let gradientFill = isFillGradient ? 'url(#gradient)' : '#525252'; 

    let svgXmlString = `
        <svg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <defs>
                <linearGradient  
                    id='gradient' 
                    x1=${constants.pinkToPurpleLightGradient.start.x}
                    y1=${constants.pinkToPurpleLightGradient.start.y}
                    x2=${constants.pinkToPurpleLightGradient.end.x}
                    y2=${constants.pinkToPurpleLightGradient.end.y}
                >
                    <Stop offset='0' stop-color='${constants.pinkToPurpleLightGradient.colors[0]}'/>
                    <Stop offset='1' stop-color='${constants.pinkToPurpleLightGradient.colors[1]}'/>
                </linearGradient>
            </defs>
            <path 
                d="M13 22.36C9.75 22.36 6.877 20.696 5.2 18.2C5.239 15.6 10.4 14.17 13 14.17C15.6 14.17 20.761 15.6 20.8 18.2C19.9406 19.4797 18.7796 20.5285 17.4194 21.2539C16.0592 21.9794 14.5415 22.3592 13 22.36ZM13 3.9C14.0343 3.9 15.0263 4.31089 15.7577 5.04228C16.4891 5.77368 16.9 6.76566 16.9 7.8C16.9 8.83434 16.4891 9.82632 15.7577 10.5577C15.0263 11.2891 14.0343 11.7 13 11.7C11.9657 11.7 10.9737 11.2891 10.2423 10.5577C9.51089 9.82632 9.1 8.83434 9.1 7.8C9.1 6.76566 9.51089 5.77368 10.2423 5.04228C10.9737 4.31089 11.9657 3.9 13 3.9ZM13 0C11.2928 0 9.60235 0.336255 8.02511 0.989566C6.44788 1.64288 5.01477 2.60045 3.80761 3.80761C1.36964 6.24558 0 9.55219 0 13C0 16.4478 1.36964 19.7544 3.80761 22.1924C5.01477 23.3995 6.44788 24.3571 8.02511 25.0104C9.60235 25.6637 11.2928 26 13 26C16.4478 26 19.7544 24.6304 22.1924 22.1924C24.6304 19.7544 26 16.4478 26 13C26 5.811 20.15 0 13 0Z" 
                fill='${gradientFill}'
            />
        </svg>
    `;
    
    return svgXmlString;
}

export function convertColorDataToString(colorData) {
    return `rgba(
        ${colorData.rgb[0]}, 
        ${colorData.rgb[1]}, 
        ${colorData.rgb[2]}, 
        ${colorData.a}
    )`;
}

export function convertDateToStringFormat(date, {isDay=true, isMonth=true, isYear=true, isSecond=false, isMinute=true, isHour=true}) {
    const monthOptions = { month: 'short', locale: 'ru-RU' };

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours(); 
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedMonth = new Intl.DateTimeFormat('ru-RU', monthOptions).formatToParts(date)[0].value.toUpperCase();
    const formattedHour = hours.toString().length <= 1 ? '0' + hours : hours;
    const formattedMinutes = minutes.toString().length <= 1 ? '0' + minutes : minutes;
    const formattedSeconds = seconds.toString().length <= 1 ? '0' + seconds : seconds;

    const formattedTime = [
        isHour ? formattedHour : null, 
        isMinute ? formattedMinutes : null, 
        isSecond ? formattedSeconds : null
    ].filter(item => item !== null).join(':');

    const formattedDate = `
        ${isDay ? day : ''} 
        ${isMonth ? formattedMonth : ''} 
        ${isYear ? year + ' Г.': ''}
        ${formattedTime}`

    return formattedDate.replace(/\s+/g, ' ').trim();
}

export function getTimeRemaining(startDate, endDate) {
    const seconds = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 1000;

    if (seconds < 0) {
        return null;
    }

    if (seconds < 3600) {
        return Math.floor(seconds / 60) + 'М';
    }
    else if (seconds < 86400) {
        return Math.floor(seconds / 3600) + 'Ч';
    }
    else {
        return Math.floor(seconds / 86400) + 'Д';
    }
}

export async function isForegroundLocationPermissionGranted() {
    try {
        const foregroundResponse = await Location.requestForegroundPermissionsAsync();

        return foregroundResponse.status === 'granted';
    }
    catch (error) {
        console.error('Ошибка получения разрешения на использование геолокации: ', error);

        return false;
    }
}

export async function isBackgroundLocationPermissionGranted() {
    try {
        const backgroundResponse = await Location.requestBackgroundPermissionsAsync();

        return backgroundResponse.status === 'granted';
    }
    catch (error) {
        console.error('Ошибка получения разрешения на использование геолокации на фоне: ', error);

        return false
    }
}

export async function isLocationSettingEnabled() {
    try {
        const status = await Location.getProviderStatusAsync();

        return status.gpsAvailable;
    }
    catch (error) {
        console.error('Не удалось проверить включена ли геолокация: ', error);

        return false;
    }
}

export async function getCurrentLocation(
    accuracy=Location.Accuracy.Balanced, 
    latitudeDelta=0.0035, 
    longitudeDelta=0.0035
) {
    try {
        const { coords } = await Location.getCurrentPositionAsync({
            accuracy: accuracy
        });

        return {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
        };
    }
    catch (error) {
        console.error(`Ошибка получения текущей геолокации: ${error}`);

        return null;
    }
}

export async function checkLocation() {
    let isForegroundGranted = false;
    let isBackgroundGranted = false;
    let isLocationEnabled = false;

    const checkLocationSetting = async () => {
        isLocationEnabled = await isLocationSettingEnabled();

        if (!isLocationEnabled) {
            showLocationSettingAlert();
        } else {
            await checkForegroundPermission();
        }
    };

    const checkForegroundPermission = async () => {
        isForegroundGranted = await isForegroundLocationPermissionGranted();

        if (!isForegroundGranted) {
            showForegroundPermissionAlert();
        } else {
            await checkBackgroundPermission();
        }
    };

    const checkBackgroundPermission = async () => {
        isBackgroundGranted = await isBackgroundLocationPermissionGranted();

        if (!isBackgroundGranted) {
            showBackgroundPermissionAlert();
        }
    };

    const showLocationSettingAlert = () => {
        Alert.alert(
            'Геолокация',
            'Для полной работы приложения желательно включить геолокацию.',
            [
                {text: 'ОК', onPress: () => {}}
            ]
        );
    }

    const showForegroundPermissionAlert = () => {
        Alert.alert(
            'Разрешения',
            'Для полной работы приложения желательно разрешить отслеживание геолокации.',
            [
                { text: 'Не хочу', onPress: () => { } },
                { text: 'Предоставить разрешение', onPress: () => Linking.openSettings() },
            ]
        );
    };

    const showBackgroundPermissionAlert = () => {
        Alert.alert(
            'Разрешения',
            'Для полной работы приложения желательно разрешить доступ к геолокации в любое время.',
            [
                { text: 'Не хочу', onPress: () => { } },
                { text: 'Предоставить разрешение', onPress: () => Linking.openSettings() },
            ]
        );
    };

    await checkLocationSetting();

    return {
        isForegroundGranted,
        isBackgroundGranted,
        isLocationEnabled
    };
}