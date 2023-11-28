import React, { useState, useEffect } from 'react';

import * as Location from 'expo-location';

import * as constants from './styles/constants.js';

export const svgXmlStringsObject = {
    Stats: graphIcoXmlStringSvg,
    Profile: profileIcoXmlStringSvg,
    Home: homeIcoXmlStringSvg,
    Events: eventIcoXmlStringSvg,
    Notifications: notifcationsIcoXmlStringSvg,
}

export function eventIcoXmlStringSvg(isFillGradient) {
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

export function notifcationsIcoXmlStringSvg(isFillGradient) {
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
                d="M23.8776 13.5306V24.1429C23.8776 24.6354 23.6819 25.1078 23.3336 25.4561C22.9853 25.8043 22.513 26 22.0204 26H1.85714C1.3646 26 0.892226 25.8043 0.543945 25.4561C0.195663 25.1078 0 24.6354 0 24.1429V3.97959C0 3.48705 0.195663 3.01468 0.543945 2.66639C0.892226 2.31811 1.3646 2.12245 1.85714 2.12245H12.4694C12.6805 2.12245 12.8829 2.2063 13.0322 2.35557C13.1815 2.50483 13.2653 2.70728 13.2653 2.91837C13.2653 3.12946 13.1815 3.3319 13.0322 3.48117C12.8829 3.63043 12.6805 3.71429 12.4694 3.71429H1.85714C1.78678 3.71429 1.7193 3.74224 1.66954 3.79199C1.61979 3.84175 1.59184 3.90923 1.59184 3.97959V24.1429C1.59184 24.2132 1.61979 24.2807 1.66954 24.3305C1.7193 24.3802 1.78678 24.4082 1.85714 24.4082H22.0204C22.0908 24.4082 22.1583 24.3802 22.208 24.3305C22.2578 24.2807 22.2857 24.2132 22.2857 24.1429V13.5306C22.2857 13.3195 22.3696 13.1171 22.5188 12.9678C22.6681 12.8185 22.8705 12.7347 23.0816 12.7347C23.2927 12.7347 23.4952 12.8185 23.6444 12.9678C23.7937 13.1171 23.8776 13.3195 23.8776 13.5306ZM26 4.5102C26 5.40224 25.7355 6.27424 25.2399 7.01594C24.7443 7.75764 24.0399 8.33572 23.2158 8.67709C22.3916 9.01846 21.4848 9.10777 20.6099 8.93375C19.735 8.75972 18.9314 8.33016 18.3006 7.6994C17.6698 7.06864 17.2403 6.265 17.0663 5.3901C16.8922 4.51521 16.9815 3.60836 17.3229 2.78422C17.6643 1.96009 18.2424 1.25569 18.9841 0.760107C19.7258 0.264519 20.5978 0 21.4898 0C22.686 0 23.8332 0.475181 24.679 1.32101C25.5248 2.16684 26 3.31402 26 4.5102ZM24.4082 4.5102C24.4082 3.93301 24.237 3.36877 23.9163 2.88885C23.5957 2.40892 23.1399 2.03487 22.6066 1.81398C22.0733 1.5931 21.4866 1.53531 20.9205 1.64791C20.3543 1.76052 19.8343 2.03847 19.4262 2.44661C19.0181 2.85475 18.7401 3.37475 18.6275 3.94086C18.5149 4.50697 18.5727 5.09375 18.7936 5.62702C19.0145 6.16028 19.3885 6.61606 19.8684 6.93674C20.3484 7.25741 20.9126 7.42857 21.4898 7.42857C22.2638 7.42857 23.0061 7.1211 23.5534 6.5738C24.1007 6.0265 24.4082 5.2842 24.4082 4.5102Z" 
                fill='${gradientFill}'
            />
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
        console.error('Ошибка получения текущей геолокации: ', error)

        return {}
    }
}