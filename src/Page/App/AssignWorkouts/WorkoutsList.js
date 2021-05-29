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
import { workoutidwiseAssignAction } from '../../../util/action.js';
import normalize from 'react-native-normalize';
import { Col, Row } from 'react-native-easy-grid';
import { NavigationEvents } from 'react-navigation';
import { color } from 'react-native-reanimated';
import { t } from '../../../../locals';


const { width, height } = Dimensions.get("screen");

export default class WorkoutsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            data: '',
            loader: false,
        };

    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    onRefresh() {
        this.setState({ dataSource: [] });
        this.workoutidwiseAssign();
    }

    componentDidMount() {
        const { navigation } = this.props;
        // this.setState({ loader: true })
        this.setState({ dataSource: [] });
        this.workoutidwiseAssign()

        this.focusListener = navigation.addListener("didFocus", () => {
            this.workoutidwiseAssign();
        });
        // this.setState({ loader: false })
    }

    async workoutidwiseAssign() {
        this.setState({ loader: true });
        this.setState({ data });
        const data = this.props.navigation.getParam('paramKey',);
        this.setState({ data });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const workoutData = {
            "current_user_id": Id,
            "access_token": Token,
            "workout_id": data,
        };
        workoutidwiseAssignAction(workoutData).then(responseJson => {
            console.log(responseJson)
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


    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('AssignWorkoutsList')

    render() {
        const { navigate } = this.props.navigation;
        const { dataSource, loader } = this.state;
        if (!loader) {
            return (
                <View style={styles.container}>
                    <Row style={styles.NaveBar}>
                        <Col>
                            <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={styles.menu_col}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Menu-white.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col>
                            <TouchableOpacity onPress={() => navigate("AssignWorkoutsList")} style={styles.back_arrow}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("Assigned Workout List")}</Text>
                        </Col>

                        <Col>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Workouts')} style={styles.workout_col}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Workout-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Message')} style={styles.message_col}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Message-white.png')}
                                />
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                colors={["#102b46"]}
                                refreshing={this.state.loading}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    >
                        {this.state.dataSource.map((Workout, index) =>
                            <Row style={{ height: normalize(120), marginLeft: normalize(20), marginTop: normalize(15), marginBottom: normalize(5), marginRight: normalize(20), backgroundColor: '#FCFBFB', borderRadius: normalize(20), borderWidth: 1, borderColor: '#D7D7D7', }}>
                                <Col>
                                    <Row style={{ height: normalize(35), borderBottomWidth: 1, borderBottomColor: '#D7D7D7', justifyContent: 'center', alignItems: 'center', }}>
                                        <Text style={{ fontSize: 19, color: '#102b46', fontFamily: 'Poppins-Bold' }}>{Workout.day}</Text><Text style={{ fontSize: 18, fontFamily: 'Poppins-Bold', color: '#777777' }}>({Workout.workout_name})</Text>
                                    </Row>
                                    <Row style={{ height: normalize(30), justifyContent: 'center', alignItems: 'center', marginLeft: normalize(5), marginRight: normalize(0), marginTop: normalize(7) }}>
                                        <Col style={{ width: normalize(80)}}>
                                            <Text style={{ fontSize: 18, color: '#333333', fontFamily: 'Poppins-Bold' }}>{t("Sets")} :</Text>
                                        </Col>
                                        <Col style={{ width: normalize(80) }}>
                                            <Text style={{ fontSize: 18, color: '#777777', fontFamily: 'Poppins-Medium' }}>{Workout.sets}</Text>
                                        </Col>
                                        <Col style={{ width: normalize(110) }}>
                                            <Text style={{ fontSize: 18, color: '#333333', fontFamily: 'Poppins-Bold' }}>{t("Kg")} :</Text>
                                        </Col>
                                        <Col >
                                            <Text style={{ fontSize: 18, color: '#777777', fontFamily: 'Poppins-Medium' }}>{Workout.kg}</Text>
                                        </Col>
                                    </Row>
                                    <Row style={{ height: normalize(30), justifyContent: 'center', alignItems: 'center', marginLeft: normalize(5), marginRight: normalize(5), }}>
                                        <Col style={{ width: normalize(80)}}>
                                            <Text style={{ fontSize: 18, color: '#333333', fontFamily: 'Poppins-Bold' }}>{t("Reps")} :</Text>
                                        </Col>
                                        <Col style={{ width: normalize(80) }}>
                                            <Text style={{ fontSize: 18, color: '#777777', fontFamily: 'Poppins-Medium' }}>{Workout.reps}</Text>
                                        </Col>
                                        <Col style={{ width: normalize(110) }}>
                                            <Text style={{ fontSize: 18, color: '#333333', fontFamily: 'Poppins-Bold' }}>{t("Rest Time")} :</Text>
                                        </Col>
                                        <Col>
                                            <Text style={{ fontSize: 18, color: '#777777', fontFamily: 'Poppins-Medium' }}>{Workout.rest_time}</Text>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        )}
                    </ScrollView>
                </View>
            );
        } else {
                return (
                    <View style={styles.container}>
                <Row style={styles.NaveBar}>
                        <Col>
                            <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={styles.menu_col}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Menu-white.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col>
                            <TouchableOpacity onPress={() => navigate("AssignWorkoutsList")} style={styles.back_arrow}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("Assigned Workout List")}</Text>
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
                    <ActivityIndicator
                        style={styles.loading}
                        size="large"
                        color="#102b46"
                    />
                </View>
                    
                );
            }
    }

}
const styles = StyleSheet.create({

    container:
    {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    NaveBar: {
        ...Platform.select({
            ios: {
                height: normalize(75),
                backgroundColor: '#102b46',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: normalize(25),
            },
            android: {
                height: normalize(50),
                backgroundColor: '#102b46',
                justifyContent: 'center',
                alignItems: 'center',
            }
        })

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
        fontFamily: 'Poppins-Regular'
    },
    menu_col: {
        ...Platform.select({
            ios: {
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            },
            android: {
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }
        })

    },
    back_arrow: {
        ...Platform.select({
            ios: {
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            },
            android: {
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }
        })

    },
    workout_col: {
        ...Platform.select({
            ios: {
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            },
            android: {
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }
        })

    },
    message_col: {
        ...Platform.select({
            ios: {
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            },
            android: {
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }
        })

    },
    name_col: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                alignItems: 'center',
                width: normalize(200)
            },
            android: {
                justifyContent: 'center',
                alignItems: 'center',
                width: normalize(185)
            }
        })

    },
})