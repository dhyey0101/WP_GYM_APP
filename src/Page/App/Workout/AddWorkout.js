import React, { Component } from "react";
import {
    Platform,
    View,
    Text,
    RefreshControl,
    TouchableOpacity,
    AsyncStorage,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    ScrollView,
    KeyboardAvoidingView
} from "react-native";
import validate from 'validate.js';
import moment from 'moment';
import normalize from 'react-native-normalize';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import DropdownAlert from 'react-native-dropdownalert';
import { Calendar } from 'react-native-calendars';
import { Col, Row } from 'react-native-easy-grid';
// import { Dropdown } from 'react-native-material-dropdown';
import { listWorkoutLogAction, addWorkoutLogAction, workoutdateArrayAction } from '../../../util/action.js';
// import { listWorkoutLogAction, addWorkoutLogAction } from '../../../util/action.js';
import { t } from '../../../../locals';

export default class AddWorkout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            loader: false,
            date: '',
            workoutData_Array: [],
            workoutData: [],
            selectedDate: '',
            workoutDateSource: [],
            dataSource: '',
            notes: '',
        };
        this.onDayPress = this.onDayPress.bind(this);
        // console.log(this.state);
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
        this.listWorkoutLogAction();
        this.nextDays();

        const { navigation } = this.props;
        // this.setState({ loader: true })
        this.listWorkoutLogAction();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.listWorkoutLogAction();
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
        // console.log(date.dateString)
        this.setState({
            selectedDate: date.dateString,

        });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");
        const workoutAssignData = {
            "current_user_id": Id,
            "access_token": Token,
            "record_date": date.dateString,
        };
        this.setState({ loader: true, dataSource: '', });

        listWorkoutLogAction(workoutAssignData).then(responseJson => {
            console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({
                    dataSource: responseJson.result,
                    loader: false,
                });
                this.dropdown.alertWithType('success', t("Success"), responseJson.error);
            } else {
                this.setState({ loader: false });
                this.dropdown.alertWithType('error', 'Error', responseJson.error);
            }
        });
        // this.clearText()
    }

    // async clearText() {
    //     this.setState({
    //         dataSource: [],
    //     })
    // }
    async SaveData() {
        const { navigate } = this.props.navigation;
        // console.log(this.state);
        var workoutData = [];

        this.state.dataSource.map(item => {
            let UserID = item.user_workout_id
            let ID = item.workout_id
            let Name = item.workout_name
            let row = {
                workoutId: ID,
                workoutName: Name,
                sets: this.state["sets_" + ID],
                kg: this.state["kg_" + ID],
                reps: this.state["reps_" + ID],
                resttime: this.state["restTime_" + ID]
            }
            this.setState({ User_id: UserID })
            // const Data = JSON.stringify(row);   
            workoutData[(item.workout_id)] = row;
        });

        var filtered = workoutData.filter(e => e != undefined);
        this.setState({ workoutData_Array: filtered });

        // var array = [1, 2, 3, 4];

        //     const map = array.map(element => element * 2);

        //     console.log(map);

        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        var addWorkoutData = {
            current_user_id: Id,
            member_id: Id,
            access_token: Token,
            record_date: this.state.selectedDate,
            workouts_array: this.state.workoutData_Array,
            user_workout_id: this.state.User_id,
            note: this.state.notes,
        }

        var Data = JSON.stringify(addWorkoutData);
        this.setState({ loader: true });
        var response = addWorkoutLogAction(Data, Token).then(function (responseJson) {
            this.setState({ loader: false });
            console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({ loader: false });
                this.dropdown.alertWithType('success', t("Success"), responseJson.error);

            }
            else {
                this.dropdown.alertWithType('error', 'Error', responseJson.error);
                this.setState({ loader: false });
                navigate('AddWorkout');
            }
        }.bind(this));
    }

    render() {

        // const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 0;
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
        const { loader, date, dataSource, workoutCollapsed, two_collapsed, workoutSets } = this.state;
        if (!loader) {
            return (
                <View style={styles.container}>

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
                                            textMonthFontFamily:'Poppins-SemiBold',
                                            textDayHeaderFontFamily: 'Poppins-Medium',
                                            textDayFontSize: 16,
                                            textMonthFontSize: 16,
                                            textDayHeaderFontSize: 16
                                        }}
                                    />
                                </Col>
                                {/* <Collapse
                        isCollapsed={this.state.workoutCollapsed}                            
                        onToggle={(isCollapsed) => this.setState({ workoutCollapsed: isCollapsed })}
                        style={{borderWidth: 1, borderColor: '#102b46',borderRadius:5,marginLeft: '5%', marginRight: '5%',marginBottom: '3%',}}>
						{(workoutCollapsed == true) ?(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 20,fontWeight: 'bold',
									color:'#ffffff',}}>{this.state.workoutName}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 20, width: 20,}}
									source={require('../../../images/down-arrow.png')}/>
								</Col>
						</Row>
					    </CollapseHeader>):(<CollapseHeader>
                            <Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
                                    <Col style={{width: '90%',}}>
                                        <Text style={{fontSize: 20,fontWeight: 'bold',
                                        color:'#ffffff',}}>{this.state.workoutName}</Text>
                                    </Col>
                                    <Col style={{width: '10%',}}>		
                                        <Image style={{height: 20, width: 20,}}
                                        source={require('../../../images/right-arrow.png')}/>
                                    </Col>
                            </Row>
                        </CollapseHeader>)}
                        <CollapseBody>
                            {this.state.dataSource.map((List, index) => (
                                <TouchableOpacity onPress={() => this.setState({ workoutCollapsed : false , workoutName : List.workout_name})}>
                                    <Row style={{backgroundColor: '#102b46',height: normalize(50),borderTopWidth: 1,borderColor: '#fff',borderBottomWidth: 1, borderBottomColor: '#2F465D',paddingLeft: normalize(35),alignItems: 'center',}}> 
                                        <Text style={{ color: '#fff', fontSize: 15, }}>{List.workout_name}</Text>
                                    </Row>
                                </TouchableOpacity>
                            ))}
                        </CollapseBody>
                    </Collapse> */}
                                {(dataSource != 0) ? (<View>
                                    {this.state.dataSource.map((List, index) => (
                                        <View>
                                        <Row style={styles.WorkoutTitle}>
                                                <Text style={styles.HeaderText}>{List.workout_name}</Text>
                                            </Row>
                                        <Col style={styles.WorkoutDataCol}>
                                            <Row style={styles.WorkoutDataContainer}>
                                                <Col>
                                                    <Row style={{marginLeft: normalize(10) }}>
                                                        <Col style={{justifyContent: 'center', width: normalize(70)}}>
                                                            <Text style={{ color: "white" , fontFamily: 'Poppins-Regular' , fontSize: 14 }}>{t("Sets")}({List.sets}): </Text>
                                                        </Col>
                                                        <Col style={{justifyContent: 'center',alignItems: 'flex-start'}}>
                                                            <Row style={{borderColor: 'white',borderWidth: 1,borderRadius: normalize(40),width: normalize(75)}}>
                                                                <TextInput placeholder={'Sets'}
                                                                    placeholderTextColor={'white'} style={{ color: "white", fontFamily: 'Poppins-Regular' , fontSize: 14 , paddingLeft: normalize(20),width: normalize(75)}} maxLength={4} keyboardType={"numeric"} onChangeText={(sets) => this.setState({ ['sets_' + List.workout_id]: sets })}></TextInput>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col>
                                                <Row style={{marginRight: normalize(5)}}>
                                                        <Col style={{justifyContent: 'center', alignItems: 'flex-end'}}>
                                                                <Text style={{ color: "white" , fontFamily: 'Poppins-Regular' , fontSize: 14}}>{t("Kg")}({List.kg}): </Text>
                                                        </Col>
                                                        <Col style={{ borderColor: 'white',borderWidth: 1,borderRadius: normalize(40), justifyContent: 'center', alignItems: 'center',width: normalize(75)}}>
                                                            <TextInput placeholder={'Kg'}
                                                                placeholderTextColor={'white'} style={{ color: "white", fontFamily: 'Poppins-Regular' , fontSize: 14}} keyboardType={"numeric"} maxLength={4} onChangeText={(kg) => this.setState({ ['kg_' + List.workout_id]: kg })}></TextInput>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row style={styles.WorkoutDataContainer}>
                                                <Col>
                                                    <Row style={{marginLeft: normalize(10) }}>
                                                        <Col style={{justifyContent: 'center', width: normalize(70)}}>
                                                            <Text style={{ color: "white" ,fontFamily: 'Poppins-Regular' , fontSize: 14 }}>{t("Reps")}({List.reps}): </Text>
                                                        </Col>
                                                        <Col style={{justifyContent: 'center',alignItems: 'flex-start'}}>
                                                            <Row style={{borderColor: 'white',borderWidth: 1,borderRadius: normalize(40),width: normalize(75)}}>
                                                                <TextInput placeholder={'Reps'}
                                                                placeholderTextColor={'white'} style={{ color: "white", fontFamily: 'Poppins-Regular' , fontSize: 14 , paddingLeft: normalize(20),width: normalize(75)}} keyboardType={"numeric"} maxLength={4} onChangeText={(reps) => this.setState({ ['reps_' + List.workout_id]: reps })}></TextInput>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col>
                                                    <Row style={{marginRight: normalize(5)}}>
                                                        <Col>
                                                            <Row style={{justifyContent: 'center', alignItems:'center'}}>
                                                                <Text style={{ color: "white", fontFamily: 'Poppins-Regular' , fontSize: 14 , width: normalize(120)}}>{t("Reps Time")}({List.rest_time}): </Text>
                                                            </Row>
                                                        </Col>
                                                        <Col style={{ borderColor: 'white',borderWidth: 1,borderRadius: normalize(40), justifyContent: 'center', alignItems: 'center' , width: normalize(75)}}>
                                                            <TextInput placeholder={'Min'}
                                                                placeholderTextColor={'white'} style={{ color: "white",fontFamily: 'Poppins-Regular' , fontSize: 14}} keyboardType={"numeric"} maxLength={4} onChangeText={(restTime) => this.setState({ ['restTime_' + List.workout_id]: restTime })}></TextInput>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </View>
                                    ))}
                                </View>) : (<View></View>)}

                                {(dataSource != 0) ? (<View>
                                    <Row style={styles.TextInputRow}>
                                        <TextInput style={styles.notes_Input}
                                            placeholder={t('Write here')}
                                            placeholderTextColor={'#a4a4a4'}
                                            // fontWeight={'bold'}
                                            multiline={true}
                                            // numberOfLines={4}
                                            onChangeText={(notes) => this.setState({ notes })}>
                                        </TextInput>
                                    </Row>
                                    <TouchableOpacity style={styles.btn} onPress={this.SaveData.bind(this)}>
                                        <Row style={styles.btn_container} >
                                            <Text style={styles.btn_text}>{t("Save")}</Text>
                                        </Row>
                                    </TouchableOpacity>
                                </View>) : (<View></View>)}
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
                                <Row style={{ marginTop: "5%", marginRight: "5%", marginLeft: "5%", alignItems: 'center', }}>
                                    <Text style={styles.HeaderText}>{t("Select Date")}:</Text>
                                </Row>
                                <Col style={{ borderBottomWidth: 1, borderColor: '#d4d4d4', marginRight: "5%", marginLeft: "5%", marginBottom: normalize(10)}}>
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
                                            textMonthFontFamily:'Poppins-SemiBold',
                                            textDayHeaderFontFamily: 'Poppins-Medium',
                                            textDayFontSize: 16,
                                            textMonthFontSize: 16,
                                            textDayHeaderFontSize: 16
                                        }}
                                        
                                    />
                                </Col>
                                {/* <Collapse
                        isCollapsed={this.state.workoutCollapsed}                            
                        onToggle={(isCollapsed) => this.setState({ workoutCollapsed: isCollapsed })}
                        style={{borderWidth: 1, borderColor: '#102b46',borderRadius:5,marginLeft: '5%', marginRight: '5%',marginBottom: '3%',}}>
						{(workoutCollapsed == true) ?(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 20,fontWeight: 'bold',
									color:'#ffffff',}}>{this.state.workoutName}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 20, width: 20,}}
									source={require('../../../images/down-arrow.png')}/>
								</Col>
						</Row>
					    </CollapseHeader>):(<CollapseHeader>
                            <Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
                                    <Col style={{width: '90%',}}>
                                        <Text style={{fontSize: 20,fontWeight: 'bold',
                                        color:'#ffffff',}}>{this.state.workoutName}</Text>
                                    </Col>
                                    <Col style={{width: '10%',}}>		
                                        <Image style={{height: 20, width: 20,}}
                                        source={require('../../../images/right-arrow.png')}/>
                                    </Col>
                            </Row>
                        </CollapseHeader>)}
                        <CollapseBody>
                            {this.state.dataSource.map((List, index) => (
                                <TouchableOpacity onPress={() => this.setState({ workoutCollapsed : false , workoutName : List.workout_name})}>
                                    <Row style={{backgroundColor: '#102b46',height: normalize(50),borderTopWidth: 1,borderColor: '#fff',borderBottomWidth: 1, borderBottomColor: '#2F465D',paddingLeft: normalize(35),alignItems: 'center',}}> 
                                        <Text style={{ color: '#fff', fontSize: 15, }}>{List.workout_name}</Text>
                                    </Row>
                                </TouchableOpacity>
                            ))}
                        </CollapseBody>
                    </Collapse> */}
                                {(dataSource != 0) ? (<View>
                                    {this.state.dataSource.map((List, index) => (
                                        <View>
                                            <Row style={styles.WorkoutTitle}>
                                                    <Text style={styles.HeaderText}>{List.workout_name}</Text>
                                                </Row>
                                            <Col style={styles.WorkoutDataCol}>
                                                <Row style={styles.WorkoutDataContainer}>
                                                    <Col>
                                                        <Row style={{marginLeft: normalize(10) }}>
                                                            <Col style={{justifyContent: 'center', width: normalize(80)}}>
                                                                <Text style={{ color: "white" , fontFamily: 'Poppins-Regular' , fontSize: 14 }}>{t("Sets")}({List.sets}) : </Text>
                                                            </Col>
                                                            <Col style={{justifyContent: 'center',alignItems: 'flex-start'}}>
                                                                <Row style={{borderColor: 'white',borderWidth: 1,borderRadius: normalize(40),width: normalize(75)}}>
                                                                    <TextInput placeholder={'Sets'}
                                                                        placeholderTextColor={'white'} style={{ color: "white", fontFamily: 'Poppins-Regular' , fontSize: 14 ,paddingLeft: normalize(20),width: normalize(75)}} maxLength={4} keyboardType={"numeric"} onChangeText={(sets) => this.setState({ ['sets_' + List.workout_id]: sets })}></TextInput>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col>
                                                    <Row style={{marginRight: normalize(5)}}>
                                                            <Col style={{justifyContent: 'center', alignItems: 'flex-end'}}>
                                                                    <Text style={{ color: "white" , fontFamily: 'Poppins-Regular' , fontSize: 14}}>{t("Kg")}({List.kg}) : </Text>
                                                            </Col>
                                                            <Col style={{ borderColor: 'white',borderWidth: 1,borderRadius: normalize(40), justifyContent: 'center', alignItems: 'center',width: normalize(75)}}>
                                                                <TextInput placeholder={'Kg'}
                                                                    placeholderTextColor={'white'} style={{ color: "white",fontFamily: 'Poppins-Regular' , fontSize: 14}} keyboardType={"numeric"} maxLength={4} onChangeText={(kg) => this.setState({ ['kg_' + List.workout_id]: kg })}></TextInput>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row style={styles.WorkoutDataContainer}>
                                                    <Col>
                                                        <Row style={{marginLeft: normalize(10) }}>
                                                            <Col style={{justifyContent: 'center', width: normalize(80)}}>
                                                                <Text style={{ color: "white" ,fontFamily: 'Poppins-Regular' , fontSize: 14 }}>{t("Reps")}({List.reps}) : </Text>
                                                            </Col>
                                                            <Col style={{justifyContent: 'center',alignItems: 'flex-start'}}>
                                                                <Row style={{borderColor: 'white',borderWidth: 1,borderRadius: normalize(40),width: normalize(75)}}>
                                                                    <TextInput placeholder={'Reps'}
                                                                    placeholderTextColor={'white'} style={{ color: "white", fontFamily: 'Poppins-Regular' , fontSize: 14 ,paddingLeft: normalize(20),width: normalize(75)}} keyboardType={"numeric"} maxLength={4} onChangeText={(reps) => this.setState({ ['reps_' + List.workout_id]: reps })}></TextInput>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col>
                                                        <Row style={{marginRight: normalize(5)}}>
                                                            <Col>
                                                                <Row style={{justifyContent: 'center', alignItems:'center'}}>
                                                                    <Text style={{ color: "white", fontFamily: 'Poppins-Regular' , fontSize: 14 , width: normalize(120)}}>{t("Reps Time")}({List.rest_time}) : </Text>
                                                                </Row>
                                                            </Col>
                                                            <Col style={{ borderColor: 'white',borderWidth: 1,borderRadius: normalize(40), justifyContent: 'center', alignItems: 'center' , width: normalize(75)}}>
                                                                <TextInput placeholder={'Min'}
                                                                    placeholderTextColor={'white'} style={{ color: "white",fontFamily: 'Poppins-Regular' , fontSize: 14}} keyboardType={"numeric"} maxLength={4} onChangeText={(restTime) => this.setState({ ['restTime_' + List.workout_id]: restTime })}></TextInput>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </View>
                                    ))}
                                </View>) : (<View></View>)}

                                {(dataSource != 0) ? (<View>
                                    <Row style={styles.TextInputRow}>
                                        <TextInput style={styles.notes_Input}
                                            placeholder={t('Write here')}
                                            placeholderTextColor={'#a4a4a4'}
                                            // fontWeight={'bold'}
                                            multiline={true}
                                            // numberOfLines={4}
                                            onChangeText={(notes) => this.setState({ notes })}>
                                        </TextInput>
                                    </Row>
                                    <TouchableOpacity style={styles.btn} onPress={this.SaveData.bind(this)}>
                                        <Row style={styles.btn_container} >
                                            <Text style={styles.btn_text}>{t("Save")}</Text>
                                        </Row>
                                    </TouchableOpacity>
                                </View>) : (<View></View>)}
                            </ScrollView>
                        </KeyboardAvoidingView>
                    )}
                    <DropdownAlert ref={ref => this.dropdown = ref} />
                </View >
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
                height: normalize(40),
                width: '100%',
                paddingLeft: 20,
                paddingLeft: 20,
                paddingTop: "3%",
                fontFamily:'Poppins-Medium'
            },
            android: {
                // marginTop: 10,
                height: normalize(40),
                width: '100%',
                paddingLeft: 20,
                paddingRight: 20,
                fontFamily:'Poppins-Medium'
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
        alignItems:'center'
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
        justifyContent: 'center',
        fontFamily:'Poppins-Bold'
    },
})