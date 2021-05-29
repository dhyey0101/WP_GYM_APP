import React, { Component } from 'react';
import {
    KeyboardAvoidingView,
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
import normalize from 'react-native-normalize';
import { Col, Row } from 'react-native-easy-grid';
import { Calendar } from 'react-native-calendars';
import { NavigationEvents } from 'react-navigation';
import DropdownAlert from 'react-native-dropdownalert';
import { addmeasurementAction } from '../../../util/action.js';
import moment from 'moment';
import { t } from '../../../../locals';


const { width, height } = Dimensions.get("screen");
const today = moment().format('YYYY-MM-DD');

export default class addmeasurement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: '',
            date: '',
            loader: false,
            dataSource: [],
            Height: '',
            Weight: '',
            Chest: '',
            Waist: '',
            Thigh: '',
            Arms: '',
            Fat: '',
        };
        this.onDayPress = this.onDayPress.bind(this);
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    // onRefresh() {
    //     this.setState({ dataSource: [] });
    //     this.StaffMemberList();
    // }

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('Dashboard')


    async onDayPress(date) {
        console.log(date.dateString)
        this.setState({
            selectedDate: date.dateString,
        });
    }
    async SaveData() {
        const { navigate } = this.props.navigation;
        var constraints = {

            Date: {
                presence: {
                    allowEmpty: false,
                    message: t("is required")
                },
            },

            // Height: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "field is required"
            //     },
            // },
            // Weight: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "field is required"
            //     },
            // },
            // Chest: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "field is required"
            //     },
            // },
            // Waist: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "field is required"
            //     },
            // },
            // Thigh: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "field is required"
            //     },
            // },
            // Arms: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "field is required"
            //     },
            // },
            // Fat: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "field is required"
            //     },
            // },
        }

        const result = validate({
            Date: this.state.selectedDate,
            Height: this.state.Height,
            Weight: this.state.Weight,
            Chest: this.state.Chest,
            Waist: this.state.Waist,
            Thigh: this.state.Thigh,
            Arms: this.state.Arms,
            Fat: this.state.Fat,
        }, constraints);

        if (result) {

            if (result.Date) {
                this.dropdown.alertWithType('error', 'Error', result.Date);
                return false;
            }

            if (result.Height) {
                this.dropdown.alertWithType('error', 'Error', result.Height);
                return false;
            }

            if (result.Weight) {
                this.dropdown.alertWithType('error', 'Error', result.Weight);
                return false;
            }
            if (result.Chest) {
                this.dropdown.alertWithType('error', 'Error', result.Chest);
                return false;
            }
            if (result.Waist) {
                this.dropdown.alertWithType('error', 'Error', result.Waist);
                return false;
            }
            if (result.Thigh) {
                this.dropdown.alertWithType('error', 'Error', result.Thigh);
                return false;
            }

            if (result.Arms) {
                this.dropdown.alertWithType('error', 'Error', result.Arms);
                return false;
            }
            if (result.Fat) {
                this.dropdown.alertWithType('error', 'Error', result.Fat);
                return false;
            }
        }

        if (!result) {
            const Id = await AsyncStorage.getItem("id");
            const Token = await AsyncStorage.getItem("access_token");
            var measurementData = {
                current_user_id: Id,
                member_id: Id,
                access_token: Token,
                Height: this.state.Height,
                Weight: this.state.Weight,
                Chest: this.state.Chest,
                Waist: this.state.Waist,
                Thigh: this.state.Thigh,
                Arms: this.state.Arms,
                Fat: this.state.Fat,
                result_date: this.state.selectedDate,

            }
            console.log(measurementData);
            this.setState({ loader: true });
            var response = addmeasurementAction(measurementData).then(function (responseJson) {
                console.log(responseJson)
                if (responseJson.status == 1) {
                    this.setState({ loader: false });
                    this.dropdown.alertWithType('success', t("Success"), responseJson.error);
                    // .catch((err) => {
                    //     console.log(err)
                    // });
                } else {
                    // alert(responseJson.message);
                    this.setState({ visible: true });
                    this.dropdown.alertWithType('error', 'Error', responseJson.error);
                    this.setState({ loader: false });
                }
            }.bind(this))
        }
    }
    async componentDidMount() {
        this.addmeasurementAction();
    }
    onRefresh() {
        this.setState({ selectedDate: '', });
        this.onDayPress();
    }


    render() {
        const { loader, dataSource } = this.state;
        const { navigate } = this.props.navigation;
        const mark = {
            [this.state.selectedDate]: {
                customStyles: {
                    container: {
                        backgroundColor: '#C40404',
                        borderWidth: 2,
                        borderColor: '#102B46'
                    },
                    text: {
                        color: '#fff',
                    }
                }
            },
        };
        if (!loader) {
            return (
                <View style={styles.container}>
                    <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <StatusBar />

                    {/* <Row style={styles.NaveBar}>
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
                            <Text style={styles.NaveText}>Measurement</Text>
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
                    {(Platform.OS == "ios") ? (
                        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled keyboardVerticalOffset={100}>
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                        colors={["#102b46"]}
                                        refreshing={this.state.loader}
                                        onRefresh={this.onRefresh.bind(this)}
                                    />
                                }
                            >
                                <Row style={{ marginRight: "5%", marginLeft: "5%" }}>
                                    <Text style={styles.HeaderText}>{t("Select Date")}:</Text>
                                </Row>
                                <Col>
                                    <Calendar
                                        monthFormat={'MMMM, yyyy'}
                                        markingType={'custom'}
                                        minDate={new Date()}
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
                                            textMonthFontFamily:'Poppins-SemiBold',
                                            textDayHeaderFontFamily: 'Poppins-Medium',
                                            textDayFontSize: 16,
                                            textMonthFontSize: 16,
                                            textDayHeaderFontSize: 16
                                        }}

                                    />
                                    <Col style={{ marginRight: '5%', marginLeft: '5%',borderTopWidth:1, borderColor: "#d4d4d4",}}>
                                        <Row style={{ marginBottom: 8, marginTop: 8, height: 25, }}>
                                            <Col style={{ width: normalize(200) }}>
                                                <Text style={styles.HeaderText}>{t("Add Measurement")}</Text>
                                            </Col>
                                            
                                        </Row>
                                        <Row style={styles.WorkoutDataContainer}>
                                            <Col>
                                                <Row style={styles.WorkoutFieldContainer}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{ fontFamily:'Poppins-Medium', fontSize:15 }}>{t("Height")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={'Centimeter'}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), width: normalize(85), }} maxLength={3} onChangeText={(Height) => this.setState({ Height })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col style={{ alignItems: 'flex-end' }}>
                                                <Row style={styles.WorkoutFieldContainer}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{ fontFamily:'Poppins-Medium', fontSize:15 }}>{t("Weight")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={t('Kg')}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), width: normalize(85), }} maxLength={3} onChangeText={(Weight) => this.setState({ Weight })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>

                                        </Row>
                                        <Row style={styles.WorkoutDataContainer}>
                                            <Col>
                                                <Row style={styles.WorkoutFieldContainer}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{fontFamily:'Poppins-Medium', fontSize:15 }}>{t("Chest")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={t('Inches')}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), width: normalize(85), }} maxLength={3} onChangeText={(Chest) => this.setState({ Chest })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col style={{ alignItems: 'flex-end' }}>
                                                <Row style={styles.WorkoutFieldContainer}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{fontFamily:'Poppins-Medium', fontSize:15 }}>{t("Waist")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={t('Inches')}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), width: normalize(85), }} maxLength={3} onChangeText={(Waist) => this.setState({ Waist })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>

                                        </Row>

                                        <Row style={styles.WorkoutDataContainer}>
                                            <Col>
                                                <Row style={styles.WorkoutFieldContainer}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{ fontFamily:'Poppins-Medium', fontSize:15 }}>{t("Thigh")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={t('Inches')}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), width: normalize(85), }} maxLength={3} onChangeText={(Thigh) => this.setState({ Thigh })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col style={{ alignItems: 'flex-end' }}>
                                                <Row style={styles.WorkoutFieldContainer}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{ fontFamily:'Poppins-Medium', fontSize:15 }}>{t("Arms")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={t('Inches')}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), width: normalize(85), }} maxLength={3} onChangeText={(Arms) => this.setState({ Arms })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>

                                        </Row>

                                        <Row style={{ height: 40, marginBottom: '8%', }}>
                                            <Col>
                                                <Row style={{ borderWidth: 1, borderRadius: 30, width: "45%", backgroundColor: '#fcfbfb', borderColor: '#ecebeb' }}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{ fontFamily:'Poppins-Medium', fontSize:15 }}>{t("Fat")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={t('Percentage')}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), width: normalize(85), }} maxLength={3} onChangeText={(Fat) => this.setState({ Fat })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>

                                        <TouchableOpacity style={styles.btn} onPress={this.SaveData.bind(this)}>
                                            <Row style={styles.btn_container} >
                                                <Text style={styles.btn_text}>{t("Save")}</Text>
                                            </Row>
                                        </TouchableOpacity>

                                        {/* <TouchableOpacity style={styles.btn} onPress={()=> navigate('viewmeasurement')}>
                                <Row style={styles.btn_container} >
                                    <Text style={styles.btn_text}>Save</Text>
                                </Row>
                            </TouchableOpacity> */}

                                    </Col>
                                </Col>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    ) : (
                        <KeyboardAvoidingView>
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                        colors={["#102b46"]}
                                        refreshing={this.state.loader}
                                        onRefresh={this.onRefresh.bind(this)}
                                    />
                                }
                            >
                                <Row style={{ marginRight: "5%", marginLeft: "5%", alignItems: 'center', }}>
                                    <Text style={styles.HeaderText}>{t("Select Date")}</Text>
                                </Row>
                                <Col>
                                    <Calendar
                                        monthFormat={'MMMM, yyyy'}
                                        markingType={'custom'}
                                        minDate={new Date()}
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
                                            textMonthFontFamily:'Poppins-SemiBold',
                                            textDayHeaderFontFamily: 'Poppins-Medium',
                                            textDayFontSize: 16,
                                            textMonthFontSize: 16,
                                            textDayHeaderFontSize: 16
                                        }}

                                    />
                                    <Col style={{ marginRight: '5%', marginLeft: '5%', borderColor: "#d4d4d4", marginTop: '4%',borderTopColor: '#d4d4d4', borderTopWidth: 1, }}>
                                        <Row style={{ marginBottom: 8, marginTop: 8, height: 25, }}>
                                            <Col style={{ width: normalize(200) }}>
                                                <Text style={styles.HeaderText}>{t("Add Measurement")}</Text>
                                            </Col>
                                        </Row>
                                        <Row style={styles.WorkoutDataContainer}>
                                            <Col>
                                                <Row style={styles.WorkoutFieldContainer}> 
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{ fontFamily:'Poppins-Medium', fontSize:14 }}>{t("Height")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={'Centimeter'}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), fontSize:12 ,fontFamily: 'Poppins-Regular' , width: normalize(85), }} maxLength={3} onChangeText={(Height) => this.setState({ Height })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col style={{ alignItems: 'flex-end' }}>
                                                <Row style={styles.WorkoutFieldContainer}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{ fontFamily:'Poppins-Medium', fontSize:14 }}>{t("Weight")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={'Kg'}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), fontSize:12 ,fontFamily: 'Poppins-Regular' , width: normalize(85), }} maxLength={3} onChangeText={(Weight) => this.setState({ Weight })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>

                                        </Row>
                                        <Row style={styles.WorkoutDataContainer}>
                                            <Col>
                                                <Row style={styles.WorkoutFieldContainer}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{ fontFamily:'Poppins-Medium', fontSize:14 }}>{t("Chest")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={'Inches'}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), fontSize:12 ,fontFamily: 'Poppins-Regular' , width: normalize(85), }} maxLength={3} onChangeText={(Chest) => this.setState({ Chest })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col style={{ alignItems: 'flex-end' }}>
                                                <Row style={styles.WorkoutFieldContainer}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{ fontFamily:'Poppins-Medium', fontSize:14 }}>{t("Waist")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={'Inches'}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), fontSize:12 ,fontFamily: 'Poppins-Regular' , width: normalize(85), }} maxLength={3} onChangeText={(Waist) => this.setState({ Waist })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>

                                        </Row>

                                        <Row style={styles.WorkoutDataContainer}>
                                            <Col>
                                                <Row style={styles.WorkoutFieldContainer}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{ fontFamily:'Poppins-Medium', fontSize:14 }}>{t("Thigh")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={'Inches'}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), fontSize:12 ,fontFamily: 'Poppins-Regular' , width: normalize(85), }} maxLength={3} onChangeText={(Thigh) => this.setState({ Thigh })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col style={{ alignItems: 'flex-end' }}>
                                                <Row style={styles.WorkoutFieldContainer}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{ fontFamily:'Poppins-Medium', fontSize:14 }}>{t("Arms")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={'Inches'}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), fontSize:12 ,fontFamily: 'Poppins-Regular' , width: normalize(85), }} maxLength={3} onChangeText={(Arms) => this.setState({ Arms })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>

                                        </Row>

                                        <Row style={{ height: 40, marginBottom: '8%', }}>
                                            <Col>
                                                <Row style={{ borderWidth: 1, borderRadius: 30, width: "45%", backgroundColor: '#fcfbfb', borderColor: '#ecebeb' }}>
                                                    <Col style={styles.WorkoutFieldSubContainer1}>
                                                        <Text style={{ fontFamily:'Poppins-Medium', fontSize:14 }}>{t("Fat")}</Text>
                                                    </Col>
                                                    <Col style={styles.WorkoutFieldSubContainer2}>
                                                        <TextInput
                                                            placeholder={'Percentage'}
                                                            keyboardType="numeric"
                                                            style={{ color: "#a4a4a4", paddingLeft: normalize(5), fontSize:12 ,fontFamily: 'Poppins-Regular' , width: normalize(85), }} maxLength={3} onChangeText={(Fat) => this.setState({ Fat })}>

                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>

                                        <TouchableOpacity style={styles.btn} onPress={this.SaveData.bind(this)}>
                                            <Row style={styles.btn_container} >
                                                <Text style={styles.btn_text}>{t("Save")}</Text>
                                            </Row>
                                        </TouchableOpacity>

                                        {/* <TouchableOpacity style={styles.btn} onPress={()=> navigate('viewmeasurement')}>
                                <Row style={styles.btn_container} >
                                    <Text style={styles.btn_text}>Save</Text>
                                </Row>
                            </TouchableOpacity> */}

                                    </Col>
                                </Col>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    )}
                    <DropdownAlert ref={ref => this.dropdown = ref} />
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
        paddingLeft: '6%',
        paddingRight: '6%',
    },
    Header: {
        justifyContent: "center",
        alignItems: "center",

    },
    HeaderText: {
        ...Platform.select({
            ios: {
                fontSize: 18,
                // padding: 10,
                fontFamily:'Poppins-SemiBold',
                color: "#102b46",
                // alignItems: 'center',
                // height: 15,

            },
            android: {

                fontSize: 18,
                // padding: 10,
                fontFamily:'Poppins-SemiBold',
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
        marginBottom: normalize(40)
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
        justifyContent: 'center',
        fontFamily: 'Poppins-Bold'
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
                width: normalize(185)
            },
            android: {
                justifyContent: 'center',
                alignItems: 'center',
                width: normalize(185)
            }
        })

    },
})