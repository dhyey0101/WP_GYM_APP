import React, { Component } from 'react';
import {
    BackHandler,
    ActivityIndicator,
    AsyncStorage,
    RefreshControl,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Platform,
    Dimensions,
} from 'react-native';
import validate from 'validate.js';
import { Col, Row } from 'react-native-easy-grid';
// import { Calendar } from 'react-native-calendars';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import normalize from 'react-native-normalize';
import { viewmeasurementAction } from '../../../util/action.js';
import { not } from 'react-native-reanimated';
import { t } from '../../../../locals';


const { width, height } = Dimensions.get("screen");

export default class viewmeasurement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            dataSource: [],
        };

    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    async componentDidMount() {
        const { navigation } = this.props;
        // this.setState({ loader: true })
        this.viewmeasurement();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.viewmeasurement();
        });
        // this.setState({ loader: false })
    }
    async viewmeasurement() {
        
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");
        
        const viewData = {
            "current_user_id": Id,
            "access_token": Token,
        };
        this.setState({ loader: true });
        viewmeasurementAction(viewData).then(responseJson => {
            console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({
                    dataSource: responseJson.result,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
            }
        });
    }
    onRefresh() {
        this.setState({ dataSource: [] });
        this.viewmeasurement();
    }

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('addmeasurement')

    render() {
        const { loader, dataSource } = this.state;
        const { navigate } = this.props.navigation;

        if (!loader) {
            return (
                <View style={styles.container}>
                    <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <StatusBar  />
                    
                    

                    {/* <Row style={styles.NaveBar}>
                        <Col>
                            <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={styles.menu_col}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Menu-white.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col>
                            <TouchableOpacity onPress={() => navigate("addmeasurement")} style={styles.back_arrow}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>View Measurement</Text>
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
                    </Row> */}
                    
                    <ScrollView
                        refreshControl={
                                <RefreshControl
                                    colors={["#102b46"]}
                                    refreshing={this.state.loader}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                    >
                        {(dataSource != 0) ? (
                            <View>
                                {this.state.dataSource.map((View, index) => (
                                        <Row style={{ backgroundColor: '#FCFBFB', borderColor: '#EBEBEB', borderWidth: 1, height: normalize(75), marginLeft: normalize(20), marginRight: normalize(20), borderRadius: normalize(10),marginBottom: normalize(15)}}>
                                            <Col style={{ width: normalize(80), justifyContent: 'center', alignItems: 'center',}}>
                                                <Image style={{height: normalize(50), width: normalize(50),borderRadius: normalize(15),}}
                                                    source={{uri: View.photo}} 
                                                />
                                            </Col>
                                            <Col style={{justifyContent: 'center'}}>
                                                <Text style={{ color: '#102b46', fontFamily: 'Poppins-SemiBold', fontSize: 17, }}>{View.measurement}</Text>
                                                {/* <Text style={{ color: '#102b46', fontSize: 15, fontWeight: 'bold', }}>{moment(View.record_date).format('DD MMMM YYYY')}</Text> */}
                                                <Text style={{ color: '#102b46', fontFamily: 'Poppins-Medium', fontSize: 14 }}>{View.record_date}</Text>
                                            </Col>
                                            <Col style={{ width: normalize(120), justifyContent: 'center', alignItems: 'flex-start', }}>
                                                <Text style={{ color: 'gray', fontFamily: 'Poppins-Regular', fontSize: 12 }}>{View.result}</Text>
                                            </Col>
                                        </Row>
                        ))}
                            </View>
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center',marginTop: normalize(225)}}>
                                <Text style={{ fontSize: 19, color: '#102b46', fontWeight: 'bold'}}>{t("Measurement Data are Not Available")}</Text>
                            </View>
                        )}
                        </ScrollView>
                        

        </View>
            );
        } else {
            return (
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                    color="#102b46"
                />
            );
        }

    }
    
}
// empty component
const EmptyComponent = ({ title }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{title}</Text>
    </View>
);
const styles = StyleSheet.create({
    
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    mainContainer: {
        flex: 1,
        justifyContent: "center",
    },
    container:
    { 
        flex: 1,
        backgroundColor: '#ffffff',
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: height - (height * 65) / 100,
    },
    emptyText: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        fontSize: 18,
        color: "#000",
    },
    
    WorkoutDataLastCol: {
        marginRight: '5%',
        marginLeft: '5%',
        borderColor: "#d4d4d4",
        marginBottom: '5%',
    },
    WorkoutDataContainer: {
        height: 40,
        marginBottom: "4%"
    },
    WorkoutFieldContainer: {
        borderWidth: 1,
        borderRadius: 30,
        width: "90%",
        backgroundColor: '#fcfbfb',
        borderColor: '#ecebeb'
    },
    WorkoutFieldSubContainer1: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderColor: '#ecebeb'
    },
    WorkoutFieldSubContainer2: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    Header: {
        justifyContent: "center",
        alignItems: "center",

    },
    HeaderText: {
        ...Platform.select({
            ios: {
                fontSize: 15,
                // padding: 10,
                fontWeight: "bold",
                color: "#102b46",
                // alignItems: 'center',
                height: 15,

            },
            android: {

                fontSize: 15,
                // padding: 10,
                fontWeight: "bold",
                color: "#102b46",
                // alignItems: 'center',
            }
        })
    },
    btn:
    {
        backgroundColor: '#F1C40E',
        alignItems: 'center',
        borderRadius: 20,
        marginRight: '5%',
        marginLeft: '5%',
        marginBottom: "5%"
    },
    btn_container:
    {
        alignItems: 'center',
        height: 40,
    },
    btn_text:
    {
        color: '#233842',
        fontSize: 18,
        fontWeight: "bold",
        justifyContent: 'center',
    },
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