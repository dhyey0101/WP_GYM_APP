import React, { Component } from 'react';
import {
    BackHandler,
    ActivityIndicator,
    AsyncStorage,
    RefreshControl,
    Alert,
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Platform,
    Dimensions,
} from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { NavigationEvents } from 'react-navigation';
import { extend } from 'validate.js';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import payamount from './payamount.js';
import viewinvoice from './viewinvoice.js';
import { t } from '../../../../locals';


/** Tab navigation page of bookings tab */ 
const TabNavigator = createMaterialTopTabNavigator(
	{
		payamount: {
			screen: payamount,
			navigationOptions: {
				title: t("Pay Amount")
			}
		},
		viewinvoice: {
			screen: viewinvoice,
			navigationOptions: {
				title: t("View Invoice")
			}
        },  
	}, {
        tabBarPosition: 'top',
        swipeEnabled: true,
        animationEnabled: true,
        tabBarOptions: {
            upperCaseLabel: false,
            activeTintColor: '#f1c40e',
            inactiveTintColor: '#fff',
            style: {
                backgroundColor: '#102b46',
            },
            labelStyle: {
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600'
            },
            indicatorStyle: {
                borderBottomColor: '#f1c40e',
                borderBottomWidth: 2,
            },
        },
    }
)
/** Tab navigation route of booking */
// const TabStack = createStackNavigator({
//     TabNavigator: { screen: TabNavigator },
// });
export default createAppContainer(TabNavigator);

