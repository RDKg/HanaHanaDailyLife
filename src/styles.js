import { StatusBar, StyleSheet } from 'react-native';

import * as utils from './utils.js';
import * as constants from './constants.js';

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: utils.convertColorDataToString(constants.GRAY_COLOR),
    },
    backgroundWrapper: {
        position: 'absolute',
        width: '100%',
    },
    mainRestrictor: {
        marginHorizontal: constants.MARGIN,
        flex: 1,
    },
    marginVertical: {
        marginBottom: constants.MARGIN,
        marginTop: (StatusBar.currentHeight || 0) + constants.MARGIN,
    },
    activeTabButton: {
        top: -0.5,
        left: 0,
    },
    redBorder: {
        borderWidth: 1,
        borderColor: utils.convertColorDataToString(constants.PINK_COLOR)
    },
    mainContainerDefault: {
        margin: constants.MARGIN,
        marginTop: (StatusBar.currentHeight || 0) + constants.MARGIN,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        gap: constants.PADDING,
    },
    boxToolbarContainer: {
        padding: constants.PADDING,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mapContainer: {
        position: 'relative',
        justifyContent: 'center', 
        alignContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderRadius: 0,
        height: 320,
        zIndex: 1,
    },
    defaultBox: {
        backgroundColor: utils.convertColorDataToString(constants.WHITE_COLOR),
        borderRadius: constants.BORDER_RADIUS,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    dropShadow: {
        shadowColor: utils.convertColorDataToString(constants.BLACK_COLOR),
        shadowOpacity: 0.15,
        shadowOffset: {
            width: 0,
            height: 5  
        },
        shadowRadius: 5,
        elevation: 5,
    },
    gradientBorder: {
        borderRadius: constants.BORDER_RADIUS,
        padding: 1,
        borderWidth: 1,
        borderColor: 'transparent', 
    },
    gradient: {
        position: 'absolute',
        zIndex: -999,
        width: '100%',
        height: '100%',
    },
    defaultTextButton: {
        fontSize: 16,
        fontFamily: 'RalewayRegular',
        color: utils.convertColorDataToString(constants.BLACK_COLOR),
        fontVariant: 'lining-nums'
    },
    defaultTextSentences: {
        fontSize: 14,
        fontFamily: 'RalewayLight',
        color: utils.convertColorDataToString(constants.BLACK_COLOR),
        fontVariant: 'lining-nums'
    },
    defaultTextStats: {
        fontSize: 16,
        fontFamily: 'RalewayLight',
        color: utils.convertColorDataToString(constants.BLACK_COLOR),
        fontVariant: 'lining-nums'
    },
    screenTitleText: {
        fontSize: 24,
        fontFamily: 'RalewayRegular',
        color: utils.convertColorDataToString(constants.BLACK_COLOR),
        fontVariant: 'lining-nums'
    },
    hintText: {
        fontSize: 14,
        fontFamily: 'RalewayLight',
        color: utils.convertColorDataToString(constants.BLACK_COLOR),
        fontVariant: 'lining-nums',
        textAlign: 'center'
    },
    boxTitleText: {
        fontSize: 20,
        fontFamily: 'RalewayRegular',
        color: utils.convertColorDataToString(constants.BLACK_COLOR),
        fontVariant: 'lining-nums',
        textAlign: 'center'
    },
    inputAreaText: {
        fontFamily: 'RalewayLight',
        fontSize: 16,
        color: utils.convertColorDataToString({...constants.BLACK_COLOR, a: 0.75}),
        fontVariant: 'lining-nums'
    },
    toggleBoxText: {
        fontFamily: 'RalewayLight',
        fontSize: 12,
        color: utils.convertColorDataToString(constants.BLACK_COLOR),
        fontVariant: 'lining-nums' 
    },
    descriptionText: {
        color: utils.convertColorDataToString(constants.BLACK_COLOR),
        fontFamily: 'RalewayLight',
        fontSize: 16,
        fontVariant: 'lining-nums',
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    defaultLabelText: {
        color: utils.convertColorDataToString(constants.BLACK_COLOR),
        fontFamily: 'RalewayLight',
        fontSize: 16,
        fontVariant: 'lining-nums',
        textAlign: 'left',
        alignSelf: 'flex-start',
    },

    innerMapTextTransform: {
        bottom: constants.PADDING,
        padding: constants.PADDING,
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 999,
    },
    selectListInputStyles: {
        fontSize: 16,
        color: utils.convertColorDataToString(constants.WHITE_COLOR),
        fontFamily: 'RalewayLight',
        marginTop: -3,
        paddingRight: constants.MARGIN,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    selectListBoxStyles: {
        backgroundColor: utils.convertColorDataToString(constants.PURPLE_COLOR),
        borderWidth: 0,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        maxWidth: 175
    },
    selectListDropdownItemStyles: {
        alignItems: 'center',
    },
    selectListDropdownStyles: {
        backgroundColor: utils.convertColorDataToString(constants.PURPLE_COLOR),
        borderWidth: 0,
        maxWidth: 175
    },
    selectListDropdownTextStyles: {
        color: utils.convertColorDataToString(constants.WHITE_COLOR),
        fontSize: 16,
        textAlign: 'center',
    },
});