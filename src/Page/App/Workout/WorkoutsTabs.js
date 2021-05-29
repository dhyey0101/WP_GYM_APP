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
import AddWorkout from './AddWorkout.js';
import ViewWorkout from './ViewWorkout.js';
import { t } from '../../../../locals';


/** Tab navigation page of bookings tab */
const TabNavigator = createMaterialTopTabNavigator(
	{
		PendingQuotation: {
			screen: AddWorkout,
			navigationOptions: {
				title: t("Add Workout")
			}
		},
		BookingStatus: {
			screen: ViewWorkout,
			navigationOptions: {
				title: t("View Workout")
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
                fontSize: 15,
                fontFamily:'Poppins-SemiBold'
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
// 	TabNavigator: { screen: TabNavigator },
// });
export default createAppContainer(TabNavigator);

