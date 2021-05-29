import React, { Component } from 'react';
import {
    ActivityIndicator,
    BackHandler,
    AsyncStorage,
    RefreshControl,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Button,
    FlatList,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Platform,
    Dimensions,
    Modal,
} from 'react-native';
import normalize from 'react-native-normalize';
import { Col, Row } from 'react-native-easy-grid';
import { NavigationEvents } from 'react-navigation';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { noticeListAction, viewNoticeAction } from '../../../util/action';
import moment from 'moment';
import { t } from '../../../../locals';
import MemberTabs from './MemberTabs';

const { width, height } = Dimensions.get("screen");
const { member, token } = "";
export default class Notice extends React.Component {
    constructor(props) {
        super(props);

    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };
    
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };
    render() {
      const { navigate } = this.props.navigation;
            return (
                <View style={{ flex: 1}}>
                <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <StatusBar />
                    <Row style={styles.NaveBar}>
                        <Col>
                            <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={styles.menu_col}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Menu-white.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col>
                            <TouchableOpacity onPress={() => navigate("Dashboard")} style={styles.back_arrow}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("View Member")}</Text>
                        </Col>
                        
                        <Col>
                            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Workouts')} style={styles.workout_col}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Workout-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Message')} style={styles.message_col}>
                            <Image style={styles.Naveicon}
                                source={require('../../../images/Message-white.png')}
                            />
                            </TouchableOpacity>
                        </Col>
                    
                    
                    </Row>
                    <MemberTabs />
                </View>
            );
}
}
const styles = StyleSheet.create({
     NaveBar: {
        ...Platform.select({
            ios:{
                height: normalize(75),
				backgroundColor: '#102b46',
				justifyContent: 'center',
                alignItems: 'center',
                paddingTop: normalize(25),
            }, 
            android:{
                height: normalize(50),
				backgroundColor: '#102b46',
				justifyContent: 'center',
				alignItems: 'center',
            }})
        
    },
    Naveicon:
    {
        height: normalize(25),
        width: normalize(25),
	},
    NaveText: {
        color: '#fff',
        fontSize: 18, 
        textAlign: 'center',
    },
    menu_col: {
        ...Platform.select({
            ios:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }, 
            android:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }})
        
    },
    back_arrow: {
        ...Platform.select({
            ios:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }, 
            android:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }})
        
    },
    workout_col: {
        ...Platform.select({
            ios:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }, 
            android:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }})
        
    },
    message_col: {
        ...Platform.select({
            ios:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }, 
            android:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }})
        
    },
    name_col: {
        ...Platform.select({
            ios:{
                justifyContent: 'center',
                alignItems: 'center',
                width: normalize(185)
            }, 
            android:{
                justifyContent: 'center',
                alignItems: 'center',
                width: normalize(185)
            }})
        
    },
})