import { Form } from "native-base";
import React, { Component } from "react";
import {
    BackHandler,
    Toast,
    Platform,
    View,
    Text,
    Modal,
    TouchableOpacity,
    AsyncStorage,
    Image,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    ScrollView,
    Dimensions,
    Linking,
} from "react-native";
import normalize from 'react-native-normalize';
import { Calendar } from 'react-native-calendars';
import { Col, Row } from 'react-native-easy-grid';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { viewWorkoutLogAction, workoutdateArrayAction } from '../../../util/action.js';
// import { listWorkoutLogAction } from '../../../util/action.js';
import DropdownAlert from 'react-native-dropdownalert';
import moment from 'moment';
import { t } from '../../../../locals';

export default class Configuration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            date: '',
            selectedDate: '',
            dataSource: '',
            workoutDateSource: [],
        };
        this.onDayPress = this.onDayPress.bind(this);
    }
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    onRefresh() {
        this.setState({ dataSource: [], selectedDate: '', });
        this.onDayPress();
    }

    async componentDidMount() {
        this.workoutdateArrayAction();
        this.viewWorkoutLogAction();
        this.nextDays();

        const { navigation } = this.props;
        // this.setState({ loader: true })
        this.viewWorkoutLogAction();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.viewWorkoutLogAction();
        });
        this.setState({ loader: false })
    }

    // Assign workout Date list array

    async workoutdateArrayAction() {
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");
        const workoutArrayData = {
            "current_user_id": Id,
            "access_token": Token,
        };

        workoutdateArrayAction(workoutArrayData).then(responseJson => {
            console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({
                    workoutDateSource: responseJson.result,
                    loader: false,

                });

            } else {
                this.setState({ loader: false });
            }
        });
    }

    async onDayPress(date) {

        this.setState({
            selectedDate: date.dateString,
        });

        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const workoutAssignData = {
            "member_id": Id,
            "access_token": Token,
            "current_date": date.dateString,
        };
        this.setState({ loader: true, dataSource: '', });

        viewWorkoutLogAction(workoutAssignData).then(responseJson => {
            console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    dataSource: responseJson.result,
                    loader: false,
                });
                this.dropdown.alertWithType('success', t('Success'), responseJson.error);
            } else {
                this.setState({ loader: false });
                this.dropdown.alertWithType('error', t('Error'), responseJson.messgae);
            }
        });
        // this.clearText()
    }

    render() {

        // const mark = {
        //     [this.state.selectedDate]: {
        //         customStyles: {
        //             container: {
        //                 backgroundColor: '#102b46',
        //                 borderWidth: 2,
        //                 borderColor: '#f1c40e'
        //             },
        //             text: {
        //                 color: '#fff',
        //                 //   fontWeight: 'bold'
        //             }
        //         }
        //     },
        // };

        const nextDays = this.state.workoutDateSource;

        let mark = {}

        nextDays.forEach((day) => {
            mark[day] = {
                selected: true,
                // marked: true,
                customStyles: {
                    container: {
                        backgroundColor: '#102b46',
                    },
                    text: {
                        color: '#f1c40e',
                    }
                }
            };
            mark[this.state.selectedDate] = {
                selected: true,
                // marked: true,
                customStyles: {
                    container: {
                        backgroundColor: '#f1c40e',
                        borderColor: '#102b46',
                        borderWidth: 2,
                    },
                    text: {
                        color: '#102b46',
                        fontWeight: 'bold',

                    }
                }
            }

        });

        const { navigate } = this.props.navigation;
        const { date, loader, dataSource, workoutDateSource } = this.state;
        let data = [{
            value: 'Banana',
        }, {
            value: 'Mango',
        }, {
            value: 'Pear',
        }];
        if (!loader) {
            return (
                <View style={styles.container}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                colors={["#102b46"]}
                                refreshing={this.state.loader}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    >
                        <Row style={{ marginTop: "5%", marginRight: "5%", marginLeft: "5%", alignItems: 'center', }}>
                            <Text style={styles.HeaderText}>{t("Select Date")}:</Text>
                        </Row>
                        <Col style={{ borderBottomWidth: 1, borderColor: '#d4d4d4', marginRight: "5%", marginLeft: "5%", }}>
                            <Calendar
                                monthFormat={'MMMM, yyyy'}
                                markingType={'custom'}
                                date={this.state.date}
                                onDayPress={(date) => { this.onDayPress(date) }}
                                markedDates={mark}
                                theme={{
                                    textSectionTitleColor: '#b6c1cd',
                                    textSectionTitleDisabledColor: '#102b46',
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: '#00adf5',
                                    dayTextColor: '#2d4150',
                                    textDisabledColor: '#d9e1e8',
                                    dotColor: '#00adf5',
                                    selectedDotColor: '#ffffff',
                                    arrowColor: '#102b46',
                                    disabledArrowColor: '#d9e1e8',
                                    monthTextColor: '#102b46',
                                    indicatorColor: '#102b46',
                                    // textDayFontFamily: 'monospace',
                                    // textMonthFontFamily: 'monospace',
                                    // textDayHeaderFontFamily: 'monospace',
                                    textDayFontFamily: 'Poppins-Medium',
                                    textMonthFontFamily: 'Poppins-SemiBold',
                                    textDayHeaderFontFamily: 'Poppins-Medium',
                                    textDayFontSize: 16,
                                    textMonthFontSize: 16,
                                    textDayHeaderFontSize: 16
                                }}
                            />
                        </Col>


                        {(dataSource != 0) ? (<View>
                            {this.state.dataSource.map((Data, index) => (
                                <View>
                                    <Row style={styles.WorkoutTitle}>
                                        <Text style={styles.HeaderText}>{Data.workout_name}</Text>
                                    </Row>
                                    <Col style={styles.WorkoutDataCol}>
                                        <Row style={styles.WorkoutDataContainer}>
                                            <Col>
                                                <Row style={{ marginLeft: normalize(5) }}>
                                                    <Col style={{ justifyContent: 'center', width: normalize(70) }}>
                                                        <Text style={{ color: "white", fontFamily: 'Poppins-Regular', fontSize: 13 }}>{t("Sets")}({Data.total_sets}): </Text>
                                                    </Col>
                                                    <Col style={{ borderColor: 'white', borderWidth: 1, borderRadius: normalize(40), justifyContent: 'center', alignItems: 'center', width: normalize(75) }}>
                                                        <Text style={{ color: "white", fontFamily: 'Poppins-Regular', fontSize: 13 }}>{Data.memeber_sets}</Text>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row style={{ marginRight: normalize(5) }}>
                                                    <Col style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                                        <Text style={{ color: "white", fontFamily: 'Poppins-Regular', fontSize: 13 }}>{t("Kg")}({Data.total_kg}): </Text>
                                                    </Col>
                                                    <Col style={{ borderColor: 'white', borderWidth: 1, borderRadius: normalize(40), justifyContent: 'center', alignItems: 'center', width: normalize(75) }}>
                                                        <Text style={{ color: "white", fontFamily: 'Poppins-Regular', fontSize: 13 }}>{Data.memeber_kg}</Text>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row style={styles.WorkoutDataContainer}>
                                            <Col>
                                                <Row style={{ marginLeft: normalize(5) }}>
                                                    <Col style={{ justifyContent: 'center', width: normalize(70) }}>
                                                        <Text style={{ color: "white", fontFamily: 'Poppins-Regular', fontSize: 13 }}>{t("Reps")}({Data.total_reps}): </Text>
                                                    </Col>
                                                    <Col style={{ borderColor: 'white', borderWidth: 1, borderRadius: normalize(40), justifyContent: 'center', alignItems: 'center', width: normalize(75) }}>
                                                        <Text style={{ color: "white", fontFamily: 'Poppins-Regular', fontSize: 13 }}>{Data.memeber_reps}</Text>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row style={{ marginRight: normalize(5) }}>
                                                    <Col style={{justifyContent:'center'}}>
                                                        <Text style={{ color: "white", fontFamily: 'Poppins-Regular', fontSize: 13, }}>{t("Reps Time")}({Data.total_rest_time}): </Text>
                                                    </Col>
                                                    <Col style={{ borderColor: 'white', borderWidth: 1, borderRadius: normalize(40), justifyContent: 'center', alignItems: 'center', width: normalize(75) }}>
                                                        <Text style={{ color: "white", fontFamily: 'Poppins-Regular', fontSize: 13 }}>{Data.memeber_rest_time}</Text>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </View>
                            ))}</View>) : (<View></View>)}

                    </ScrollView>
                    <DropdownAlert ref={ref => this.dropdown = ref} />
                </View >
            )
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    loader: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        color: "#102b46",
    },
    Navebar: {
        ...Platform.select({
            ios: {
                height: 45,
                marginTop: "10%",
                borderBottomWidth: 1
            },
            android: {
                height: 40,
                //   borderWidth: 1,   
                borderBottomWidth: 1
            },
        }),
    },
    BackArrow: {
        ...Platform.select({
            ios: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10,
                // marginTop: 10,
            },
            android: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10,
                marginTop: 10,
            }
        })
    },
    Menu: {
        ...Platform.select({
            ios: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
            },
            android: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                marginTop: 10,
            }
        })

    },

    NavCol: {
        width: "10%"
    },
    Header: {
        justifyContent: "center",
        alignItems: "center",

    },
    HeaderText: {
        ...Platform.select({
            ios: {
                fontSize: 17,
                // padding: 10,
                fontFamily: 'Poppins-Bold',
                color: "#102b46",
                // alignItems: 'center',
                // height: 15,

            },
            android: {

                fontSize: 17,
                // padding: 10,
                fontFamily: 'Poppins-Bold',
                color: "#102b46",
                // alignItems: 'center',
            }
        })
    },
    notes_Input: {
        ...Platform.select({
            ios: {
                height: 40,
                width: '100%',
                paddingLeft: 10,
                paddingTop: "3%"
            },
            android: {
                // marginTop: 10,
                height: 40,
                width: '100%',
                paddingLeft: 10,
            }
        })
    },
    WorkoutDataCol: {
        backgroundColor: '#102b46',
        borderRadius: normalize(10),
        marginTop: normalize(5),
        paddingTop: normalize(10),
        paddingBottom: normalize(10),
        marginBottom: normalize(20),
        marginLeft: normalize(10),
        marginRight: normalize(10)
    },
    WorkoutDataLastCol: {
        marginRight: '5%',
        marginLeft: '5%',
        borderColor: "#d4d4d4",
        marginBottom: '5%',
    },
    WorkoutTitle: {
        marginBottom: 8,
        marginLeft: normalize(10),
        height: 25,
        alignItems: 'center'
    },
    WorkoutDataContainer: {
        height: normalize(30),
        marginTop: normalize(10),
        marginBottom: normalize(10),
    },

    WorkoutFieldContainer: {
        width: normalize(170),
        height: normalize(30),
        marginTop: normalize(15),
        marginBottom: normalize(15),
    },
    WorkoutFieldSubContainer1: {
        marginLeft: normalize(20),
        justifyContent: 'center',
        width: normalize(70),
    },
    WorkoutFieldSubContainer2: {
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: normalize(10),
    },
    TextInputRow: {
        borderWidth: 1,
        borderRadius: 40,
        height: normalize(45),
        marginLeft: normalize(22),
        marginRight: normalize(22),
        backgroundColor: '#FCFBFB',
        borderColor: '#ecebeb',
        justifyContent: 'center',
    },
    btn:
    {
        backgroundColor: '#F1C40E',
        alignItems: 'center',
        borderRadius: 20,
        marginRight: normalize(22),
        marginLeft: normalize(22),
        marginTop: normalize(20),
        marginBottom: normalize(25),
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
})