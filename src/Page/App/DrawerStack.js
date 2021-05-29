import React, { Component } from 'react';
import { StyleSheet,Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import CustomSideBar from './CustomSideBar';
import Dashboard from './Dashboard.js';
import MemberShipList from './Membership/MemberShipList.js';
import ActivityList from './Activity/ActivityList.js';
import Workouts from './Workout/Workouts.js';
import Schedule from './ClassSchedule/schedule.js';
import Nutritionplan from './NutritionPlan/nutritionplan.js';
import StaffMemberList from './StaffMember/staffmemberlist.js';
import Message from './Message/message.js';
import groupList from './Group/groupList.js';
import AssignWorkoutsList from './AssignWorkouts/AssignWorkoutsList.js';
import WorkoutsList from './AssignWorkouts/WorkoutsList.js';
import ViewMember from './Member/Viewmember.js';
import memberArea from './Member/memberArea.js';
import addmeasurement from './Measurement/addmeasurement.js';
import viewmeasurement from './Measurement/measurementview.js';
import Feespayment from './FeesPayment/feespayment.js';
import viewpayment from './FeesPayment/viewpayment.js';	
import viewinvoice from './FeesPayment/viewinvoice.js';
import Member from	'./Member/MemberTabs.js';
import Account from './Account/account.js';
import SubscriptionHistory from './SubscriptionHistory/subscriptionhistory.js';
import nutritionschudule from './NutritionPlan/nutritionschudule.js';
// import Event from './Event/event.js';
import Notice from './Notice/showNotices.js';

const { width, height } = Dimensions.get('screen');


/** PusherIntegration page route */
// const PusherIntegration_StackNavigator = createStackNavigator({
//   PusherPage: { screen: PusherPage },

// });

const Dashboard_StackNavigator = createStackNavigator({
	First: { screen: Dashboard }
});
const MemberShipList_StackNavigator = createStackNavigator({
	MemberShipList: { screen: MemberShipList }
});
const Workouts_StackNavigator = createStackNavigator({
	Workouts: { screen: Workouts }
});
const schedule_StackNavigator = createStackNavigator({
	Schedule: { screen: Schedule }
});
const nutritionplan_StackNavigator = createStackNavigator({
	Nutritionplan: { screen: Nutritionplan },
	nutritionschudule: { screen: nutritionschudule }
});
const StaffMemberList_StackNavigator = createStackNavigator({
	StaffMemberList: { screen: StaffMemberList }
});
const activity_StackNavigator = createStackNavigator({
	ActivityList: { screen: ActivityList }
});
const message_StackNavigator = createStackNavigator({
	Message: { screen: Message },
});
const groupList_StackNavigator = createStackNavigator({
	groupList: { screen: groupList }
});

const AssignWorkoutsList_StackNavigator = createStackNavigator({
	AssignWorkoutsList: { screen: AssignWorkoutsList },
	WorkoutsList: { screen: WorkoutsList }
});

// const ViewMember_StackNavigator = createStackNavigator({
// 	ViewMember: { screen: ViewMember },
// 	Account: { screen: Account }
// });

const  Member_StackNavigator = createStackNavigator({
	Member: { screen: memberArea }
});

const addmeasurement_StackNavigator = createStackNavigator({
	addmeasurement: { screen: addmeasurement },
});

const Feespayment_StackNavigator = createStackNavigator({
	Feespayment: { screen: Feespayment },
	viewpayment: { screen: viewpayment },
	viewinvoice: { screen: viewinvoice }
});

const Account_StackNavigator = createStackNavigator({
	Account: { screen: Account }
});

const SubscriptionHistory_StackNavigator = createStackNavigator({
	SubscriptionHistory: { screen: SubscriptionHistory }
});

// const Event_StackNavigator = createStackNavigator({
// 	Event: { screen: Event }
// });

const notices_StackNavigator = createStackNavigator({
	Notice: { screen: Notice }
});

const DrawerNavigator = createDrawerNavigator(
	{
	// PusherIntegration: { screen: PusherIntegration_StackNavigator },
	Dashboard: { screen: Dashboard_StackNavigator },
	MemberShipList: { screen: MemberShipList_StackNavigator },
	Workouts: { screen: Workouts_StackNavigator },
	Schedule: { screen: schedule_StackNavigator },
	Nutritionplan: { screen: nutritionplan_StackNavigator },
	StaffMemberList: { screen: StaffMemberList_StackNavigator },
	Message: { screen: message_StackNavigator },
	groupList: { screen: groupList_StackNavigator },
	AssignWorkoutsList: { screen: AssignWorkoutsList_StackNavigator },
	ActivityList: { screen: activity_StackNavigator },
	// ViewMember: { screen: ViewMember_StackNavigator },
	addmeasurement: { screen: addmeasurement_StackNavigator },
	Feespayment: { screen: Feespayment_StackNavigator },
	Account: { screen: Account_StackNavigator },
	SubscriptionHistory: { screen: SubscriptionHistory_StackNavigator },
	Member: { screen: Member_StackNavigator },
	Notice: {screen: notices_StackNavigator},
	},
	{
		contentComponent: CustomSideBar,
		drawerWidth: width-75,

	});
export default createAppContainer(DrawerNavigator);

const styles = StyleSheet.create({
	DrawerLogoPart: {
		marginTop: 80,
		height: 150,
		alignItems: 'center',
		justifyContent: 'center'
	},
	DrawerLogo: {
		height: 120,
		width: 120,
		marginLeft: 5
	},
	DrawerLogoText: {
		color: '#FFFFFF',
		fontSize: 20,
		marginTop: 10,
		opacity: 0.8,
	}
});