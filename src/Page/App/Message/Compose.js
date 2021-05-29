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
    FlatList
} from "react-native";
import validate from 'validate.js';
import { Col, Row } from 'react-native-easy-grid';
import normalize from 'react-native-normalize';
import DropdownAlert from 'react-native-dropdownalert';
import { getallMemberAndStaffAction, composeMessageAction } from '../../../util/action.js';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Thumbnail, List, ListItem, Separator, Textarea } from 'native-base';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { t } from '../../../../locals';


export default class compose extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            staffData: '',
            Name: '',
            Message_Comment: '',
            Message_subject: '',
        };
        // this.onDayPress = this.onDayPress.bind(this);
    }
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    componentDidMount() {
        this.getallMemberAndStaff()
    }

    async getallMemberAndStaff() {
        this.setState({ loader: true });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");
        const Data = {
            "current_user_id": Id,
            "access_token": Token,
        };
        getallMemberAndStaffAction(Data).then(responseJson => {
            console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({
                    staffData: responseJson.Member_Staff_Member,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
            }
        });
    }

    async sendmessage() {

        const { loader, Name, Message_subject, Message_Comment, } = this.state;
        const { navigate } = this.props.navigation;

        var constraints = {
            Name: {
                presence: {
                    allowEmpty: false,
                    message: t("is required")
                },
            },
            Message_subject: {
                presence: {
                    allowEmpty: false,
                    message: t("is required")
                },
            },
            Message_Comment: {
                presence: {
                    allowEmpty: false,
                    message: t("is required")
                },
            },
        };

        const result = validate({
            Name: this.state.Name,
            Message_subject: this.state.Message_subject,
            Message_Comment: this.state.Message_Comment,
        }, constraints);


        if (result) {

            if (result.Name) {
                this.dropdown.alertWithType('error', t('Error'), result.Name);
                this.setState({ visible: true });
                return false;
            }
            if (result.Message_subject) {
                this.dropdown.alertWithType('error', t('Error'), result.Message_subject);
                this.setState({ visible: true });
                return false;
            }
            if (result.Message_Comment) {
                this.dropdown.alertWithType('error', t('Error'), result.Message_Comment);
                this.setState({ visible: true });
                return false;
            }
        }

        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const signupData = {
            "current_user_id": Id,
            "access_token": Token,
			receiver: this.state.Name,
			subject: this.state.Message_subject,
			message_body: this.state.Message_Comment,
          }
        
        this.setState({ loader: true , Name: '' , Message_subject: '' , Message_Comment: '' ,});

        if (!result) {    
			var response = composeMessageAction(signupData).then(function (responseJson) {
                console.log(responseJson)
                if (responseJson.status == 1) {
                    this.setState({ loader: false });
                    this.dropdown.alertWithType('success', t('Success'), responseJson.error);
                    // storage.storeUserDetail(responseJson.result).then((data) => {

                    // })
                } else {
                    this.dropdown.alertWithType('error', t('Error'), responseJson.error);
                    this.setState({ visible: true });
                    this.setState({ loader: false });
                }
            }.bind(this))

        }
    }
    render() {
        const { loader, dataSource, staffData, Name, Message_Comment, Message_subject } = this.state;
        let staffList = [];
        for (let userObject of staffData) {
            staffList.push({ label: userObject.staff_name || userObject.member_name || userObject.admin_name , value: userObject.staff_id || userObject.member_id || userObject.admin_id })
        }
        if (!loader) {
            return (
                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <Row style={{ height: normalize(25), marginLeft: normalize(30), marginRight: normalize(30), marginTop: normalize(25) }}>
                            <Text style={{ color: '#102b46', fontFamily:'Poppins-Medium',fontSize:16 }}>{t("Message To")}: </Text>
                        </Row>
                        <TouchableOpacity>
                            <Row style={{ height: normalize(40), backgroundColor: '#FCFBFB', borderColor: '#EBEBEB', borderWidth: 1, marginLeft: normalize(30), marginRight: normalize(30), borderRadius: normalize(10), marginTop: normalize(10) }}>
                                <Col style={{ justifyContent: 'center',}}>
                                    <Dropdown
                                        // style={{fontFamily:'Poppins-Medium'}}
                                        paddingLeft={20}
                                        placeholder={t('Select member')}
                                        labelHeight={5}
                                        labelPadding={0}
                                        marginTop={10}
                                        underlineColor={'#FFFFFF'}
                                        placeholderTextColor={'#777777'}
                                        textColor={'#777777'}
                                        baseColor={'#fff'}
                                        selectedItemColor={'#777777'}
                                        value={Name}
                                        // valueExtractor={({ value }) => value}
                                        onChangeText={(value) => this.setState({ Name: value })}
                                        data={staffList}
                                    >
                                    </Dropdown>
                                </Col>
                                <Col style={{ width: normalize(40), justifyContent: 'center', alignItems: 'flex-start' }}>
                                    <Image style={{ height: 18, width: 18, }}
                                        source={require('../../../images/Down_Arrow_gray.png')} />
                                </Col>
                            </Row>
                        </TouchableOpacity>
                        {/* <Row style={{height: normalize(25), marginLeft: normalize(30), marginRight: normalize(30), marginTop:normalize(10)}}>
                    <Text style={{ color: '#102b46', fontWeight: 'bold',fontSize: 16}}>Select Class: </Text>
                </Row>
                <TouchableOpacity>
                    <Row style={{height: normalize(40),backgroundColor: '#FCFBFB',borderColor: '#EBEBEB', borderWidth: 1,marginLeft: normalize(30), marginRight: normalize(30),borderRadius: normalize(10), marginTop:normalize(10)}}>
                        <Col style={{justifyContent: 'center',}}>
                                <Dropdown
                                    paddingLeft={20}
                                    placeholder={'None'}
                                    labelHeight={5}
                                    labelPadding={0}
                                    marginTop={3}
                                    placeholderTextColor={'#777777'}
                                    textColor={'#777777'}
                                    baseColor={'#fff'}
                                    selectedItemColor={'#777777'}
                                    data={data2}
                                >
                                </Dropdown>
                        </Col>
                        <Col style={{width: normalize(40), justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Image style={{height: 18, width: 18,}}
								source={require('../../../images/Down_Arrow_gray.png')}/>
                        </Col>
                    </Row>
                </TouchableOpacity> */}

                        <Row style={{ height: normalize(25), marginLeft: normalize(30), marginRight: normalize(30), marginTop: normalize(10) }}>
                            <Text style={{ color: '#102b46', fontFamily:'Poppins-Medium',fontSize:16, fontSize: 16 }}>{t("Subject")}: </Text>
                        </Row>

                        <Row style={{ height: normalize(45), backgroundColor: '#FCFBFB', borderColor: '#EBEBEB', borderWidth: 1, marginLeft: normalize(30), marginRight: normalize(30), borderRadius: normalize(10), marginTop: normalize(10) }}>
                            <TouchableOpacity style={{ width: normalize(320) }}>
                                <TextInput style={{ fontFamily:'Poppins-Medium',fontSize:16,justifyContent: 'center', alignItems: 'center', paddingTop: normalize(6), paddingLeft: normalize(22), color: '#BAB9B9' }}
                                    placeholder={t('Add Subject')}
                                    placeholderTextColor={'#BAB9B9'}
                                    value={Message_subject}
                                    onChangeText={(Message_subject) => this.setState({ Message_subject })}
                                />
                            </TouchableOpacity>
                        </Row>

                        <Row style={{ height: normalize(25), marginLeft: normalize(30), marginRight: normalize(30), marginTop: normalize(10) }}>
                            <Text style={{ color: '#102b46', fontFamily:'Poppins-Medium',fontSize:16 }}>{t("Message Comment")}: </Text>
                        </Row>

                        <Row style={{ height: normalize(130), backgroundColor: '#FCFBFB', borderColor: '#EBEBEB', borderWidth: 1, marginLeft: normalize(30), marginRight: normalize(30), borderRadius: normalize(10), marginTop: normalize(10) }}>
                            <TouchableOpacity style={{ width: normalize(320), height: normalize(130), }}>
                                <Textarea style={{ fontFamily:'Poppins-Medium',fontSize:16,paddingLeft: normalize(22), paddingRight: normalize(22), paddingTop: normalize(10), width: normalize(320), height: normalize(130), color: '#BAB9B9' }}
                                    placeholder={t('Add Message')}
                                    placeholderTextColor={'#BAB9B9'}
                                    multiline={true}
                                    numberOfLines={2}
                                    value={Message_Comment}
                                    onChangeText={(Message_Comment) => this.setState({ Message_Comment })}
                                />
                            </TouchableOpacity>
                        </Row>

                        <TouchableOpacity style={styles.btn} onPress={this.sendmessage.bind(this)}>
                            <Row style={styles.btn_container}>
                                <Text style={styles.btn_text}>{t("Send Message")}</Text>
                            </Row>
                        </TouchableOpacity>
                    </ScrollView>
                    <DropdownAlert ref={ref => (this.dropdown = ref)} />
                </View>
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
const EmptyComponent = ({ title }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{title}</Text>
    </View>
);
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    btn:
    {
        backgroundColor: '#F1C40E',
        alignItems: 'center',
        borderRadius: normalize(30),
        marginRight: normalize(20),
        marginLeft: normalize(20),
        marginBottom: normalize(15),
        marginTop: normalize(25)
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
        fontFamily:'Poppins-SemiBold',
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        // marginTop: height - (height * 65) / 100,
    },
    emptyText: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        fontSize: 18,
        color: "#000",
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
                fontSize: 15,
                // padding: 10,
                fontWeight: "bold",
                color: "#102b46",
                // alignItems: 'center',
                height: "60%",

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
})