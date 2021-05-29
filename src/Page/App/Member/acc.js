import React, { Component } from 'react';
import {
    KeyboardAvoidingView,
    Keyboard,
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
    TextInput,
} from 'react-native';
import validate from 'validate.js';
import QRCode from 'react-native-qrcode-svg';
import DropdownAlert from 'react-native-dropdownalert';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as ImagePicker from "expo-image-picker";
import { singleMemberAction, updateMemberprofileAction } from '../../../util/action.js';
import { Col, Row } from 'react-native-easy-grid';
import { NavigationEvents } from 'react-navigation';
import normalize from 'react-native-normalize';
import moment from 'moment';
var today = new Date();
import * as ImageManipulator from 'expo-image-manipulator';
import { t } from '../../../../locals';

const { width, height } = Dimensions.get("screen");

export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            ImageLoading: false,
            user_first_name: '',
            user_last_name: '',
            user_city: '',
            Email: '',
            PhoneNumber: '',
            Location: '',
            DateOfBirth: '',
			isVisible_DOB: false,
            password: '',
            ConfirmPassword: '',
            updatedProfile: '',
            updated_Profile_base64: '',
        };

    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };
    componentDidMount() {
        const { navigation } = this.props;
        // this.setState({ loader: true })
        this.singleMember();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.singleMember();
        });
        // this.setState({ loader: false })

    }

    /* MemberShip From date */

	handler_DOB = (date) => {
		this.setState({
			isVisible_DOB: false,
            DateOfBirth: moment(date).format('YYYY/MM/DD')
        })
	}

	show_DOB = () => {
		this.setState({ isVisible_DOB: true });
		Keyboard.dismiss();
	}

	hide_DOB = () => {
		this.setState({
			isVisible_DOB: false,
		})
	}

    /* proflie Image */

    async changeImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (result) {
            // this.setState({ loader: true })
            const manipResult = await ImageManipulator.manipulateAsync(result.uri,
                [{ resize: { height: 1024 } }],
                { compress: 0, format: ImageManipulator.SaveFormat.PNG, base64: true }
            );

            this.setState({
                updatedProfile: manipResult.uri,
                updated_Profile_base64: manipResult.base64,
                updated_Profile_name: result.uri.split('/').pop(),
            });
            // this.setState({ loader: false })
        }

        if (updatedProfile.length > 0) {
            this.setState({ loader: false })
        }

        // this.setState({
        //     updatedProfile: result.uri,
        //     updated_Profile_base64 : result.base64,
        // });

        // console.log(result.base64);
    }


    async singleMember() {
        this.setState({ loader: true });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const userData = {
            "member_id": Id,
            "access_token": Token,
        };
        singleMemberAction(userData).then(responseJson => {
            console.log(responseJson);
            this.setState({ loader: true });
            if (responseJson.status == 1) {
                this.setState({
                    dataSource: responseJson.result,
                    user_first_name: responseJson.result.first_name,
                    user_last_name: responseJson.result.last_name,
                    user_city: responseJson.result.city,
                    Email: responseJson.result.username,
                    PhoneNumber: responseJson.result.mobile,
                    DateOfBirth: responseJson.result.dob,
                    Location: responseJson.result.address,
                    DOB: responseJson.result.dob,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
            }
        });
    }

    async send() {
        const { navigate } = this.props.navigation;
        const { user_first_name, user_last_name, user_city, PhoneNumber, Location, DateOfBirth , password, ConfirmPassword } = this.state;

        var constraints = {
            // user_first_name: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "^ is required."
            //     },
            //     format: {
            //         pattern: "[A-Za-z ]+",
            //         //flags: "i",
            //         message: "is not Valid."
            //     }
            // },
            // user_last_name: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "^ is required."
            //     },
            //     format: {
            //         pattern: "[A-Za-z ]+",
            //         //flags: "i",
            //         message: "is not Valid."
            //     }
            // },
            // PhoneNumber: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "^required"
            //     },
            //     format: {
            //         pattern: "[0-9]{10}",
            //         flags: "i",
            //         message: "^ (10 digit mobile number)."
            //     },
            // },
            // user_city: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "is required."
            //     },
            //     format: {
            //         pattern: "[A-Za-z-0-9-,-/ ]+",
            //         flags: "i",
            //         message: "is not valid."
            //     },
            // },
            // Location: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "is required."
            //     },
            //     format: {
            //         pattern: "[A-Za-z-0-9-,-/ ]+",
            //         flags: "i",
            //         message: "is not valid."
            //     },
            // },
            // password: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "^password required"
            //     },
            //     length: {
            //         minimum: 6,
            //         tooShort: "needs to have %{count} words or more.",
            //         message: "^ (min 6 characters)."
            //     }
            // },
            ConfirmPassword: {
                // presence: {
                //     allowEmpty: false,
                //     message: "^ ConfirmPassword required"
                // },
                equality: {
                    attribute: "password",
                    message: "^" + t("not matched with password")
                }
            },
        };

        Keyboard.dismiss();

        const result = validate({
            user_first_name: this.state.user_first_name,
            user_last_name: this.state.user_last_name,
            user_city: this.state.user_city,
            PhoneNumber: this.state.PhoneNumber,
            Location: this.state.Location,
            DateOfBirth: this.state.DateOfBirth,
            password: this.state.password,
            ConfirmPassword: this.state.ConfirmPassword,
        }, constraints);

        if (result) {
            if (result.user_first_name) {
                this.dropdown.alertWithType('error', t('Error'), result.user_first_name);
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.username);
                return false;
            }

            if (result.user_last_name) {
                this.dropdown.alertWithType('error', t('Error'), result.user_last_name);
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.username);
                return false;
            }

            if (result.PhoneNumber) {
                this.dropdown.alertWithType('error', t('Error'), result.PhoneNumber);
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.PhoneNumber);
                return false;
            }

            if (result.user_city) {
                this.dropdown.alertWithType('error', t('Error'), result.user_city);
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.username);
                return false;
            }

            if (result.Location) {
                this.dropdown.alertWithType('error', t('Error'), result.Location);
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.Location);
                return false;
            }

            // if (result.DateOfBirth) {
            //     this.dropdown.alertWithType('error', t('Error'), result.DateOfBirth);
            //     return false;
            // }

            if (result.password) {
                this.dropdown.alertWithType('error', t('Error'), result.password);
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.user_name);
                return false;
            }

            if (result.ConfirmPassword) {
                this.dropdown.alertWithType('error', t('Error'), result.ConfirmPassword);
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.user_name);
                return false;
            }
        }


        if (!result) {

            const Id = await AsyncStorage.getItem("id");
            const Token = await AsyncStorage.getItem("access_token");

            const updateProfileData = {
                current_user_id: Id,
                access_token: Token,
                first_name: this.state.user_first_name,
                last_name: this.state.user_last_name,
                mobile: this.state.PhoneNumber,
                city_name: this.state.user_city,
                address: this.state.Location,
                birth_date: this.state.DateOfBirth,
                new_password: this.state.password,
                confirm_password: this.state.ConfirmPassword,
                profile_member_image: this.state.updated_Profile_base64,

            }

            // let Token = await AsyncStorage.getItem('token');
            // Token = 'Bearer ' + Token;
            console.log(updateProfileData)
            this.setState({ loader: true });
            updateMemberprofileAction(updateProfileData).then((responseJson) => {
                // alert("Hello")
                // console.log(responseJson)
                // return false
                if (responseJson.status == 1) {

                    // AsyncStorage.setItem('profile_image', responseJson.result.iamge);
                    // AsyncStorage.setItem('first_name', responseJson.result.first_name);
                    // AsyncStorage.setItem('Last_name', responseJson.result.last_name);
                    // AsyncStorage.setItem('City_name', responseJson.result.city_name);
                    // AsyncStorage.setItem('Address', responseJson.result.address);

                    this.setState({ loader: false });
                    AsyncStorage.setItem('profile_image', responseJson.result.iamge);
                    AsyncStorage.setItem('first_name', responseJson.result.name);
                    AsyncStorage.setItem('Last_name', responseJson.result.last_name);
                    AsyncStorage.setItem('City_name', responseJson.result.city_name);
                    AsyncStorage.setItem('Address', responseJson.result.address);

                    this.dropdown.alertWithType('success', t('Success'), responseJson.error);
                    { setTimeout(() => { this.props.navigation.navigate("Dashboard") }, 650); }
                }
                else {
                    this.dropdown.alertWithType('error', t('Error'), responseJson.error);
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                }
            });
        }
    };

    onRefresh() {
        this.setState({ dataSource: [] });
        this.singleMember();
    }

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('Dashboard')

    render() {
        const { loader, dataSource, user_first_name, user_last_name, user_city, Email, PhoneNumber, Location, DateOfBirth, password, ConfirmPassword } = this.state;
        // const { navigate } = this.props.navigation;
        if (!loader) {
            return (

                <View style={styles.container}>
                    
                    {(Platform.OS == "ios") ? (
                        <KeyboardAvoidingView style={{ flexDirection: 'column', justifyContent: 'center', }} behavior="padding">
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                        colors={["#102b46"]}
                                        refreshing={this.state.loader}
                                        onRefresh={this.onRefresh.bind(this)}
                                    />
                                }
                            >
                                <Row style={{ backgroundColor: '', height: normalize(120), marginLeft: normalize(25), marginBottom: normalize(20) }}>
                                    <Col style={{ backgroundColor: '', width: '25%', justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <TouchableOpacity onPress={() => this.changeImage()}>
                                            <Col style={{ height: normalize(80), width: normalize(80), borderRadius: normalize(15), borderColor: '#102b46', borderWidth: 2, justifyContent: 'center', alignItems: 'center', }}>
                                                {(this.state.updatedProfile) ? (<Image onLoadStart={(e) => this.setState({ ImageLoading: true })}
                                                    onLoadEnd={(e) => this.setState({ ImageLoading: false })} style={{ height: normalize(80), width: normalize(80), borderRadius: normalize(15), }}
                                                    source={{ uri: this.state.updatedProfile }}
                                                />
                                                ) : (<Image style={{ height: normalize(80), width: normalize(80), borderRadius: normalize(15), }}
                                                    source={{ uri: dataSource.member_image }}
                                                />)}
                                                <ActivityIndicator
                                                    style={styles.loading}
                                                    animating={this.state.ImageLoading}
                                                    size="small"
                                                    color="#102b46"
                                                />
                                            </Col>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ backgroundColor: '', justifyContent: 'center', }}>
                                        <Row style={{ backgroundColor: '', height: '20%', }}>
                                            <Text style={{ fontFamily:'Poppins-SemiBold', fontSize: 18, color: '#102b46' }}>{dataSource.first_name} {dataSource.last_name}</Text>
                                        </Row>
                                        <Row style={{ backgroundColor: '', height: '18%', alignItems: 'center', }}>
                                            <Text style={{ fontSize: 14, fontFamily:'Poppins-Regular', color: 'gray', opacity: 0.7 }}>{dataSource.address} , {dataSource.city}</Text>
                                        </Row>
                                        <Row style={{ backgroundColor: '', height: '15%', flexDirection: 'row', }}>
                                            <Col style={{ backgroundColor: '', width: '7%', justifyContent: 'center', alignItems: 'flex-start' }}>
                                                <Image style={{ height: 12, width: 12, }}
                                                    source={require('../../../images/Location2-Pin-Gray-512.png')}
                                                />
                                            </Col>
                                            <Col style={{ backgroundColor: '', justifyContent: 'center', alignItems: 'flex-start' }}>
                                                <Text style={{ fontSize: 12, fontFamily:'Poppins-Regular', color: 'gray', opacity: 0.7 }}>{dataSource.state}</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col style={{ justifyContent: 'center', width: normalize(85) }}>
                                        <QRCode
                                            value={this.state.Data}
                                            size={60}
                                            bgColor='black'
                                            fgColor='white'
                                        />
                                    </Col>
                                </Row>


                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_user.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("First name")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={user_first_name}
                                                onChangeText={(user_first_name) => this.setState({ user_first_name })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_user.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("Last name")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={user_last_name}
                                                onChangeText={(user_last_name) => this.setState({ user_last_name })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_envelope.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TextInput style={styles.TextValue}
                                            editable={false}
                                            placeholder={t("Email")}
                                            placeholderTextColor="#102b46"
                                            maxLength={25}
                                            autoCorrect={false}
                                            autoComplete={false}
                                            value={Email}
                                            onChangeText={(Email) => this.setState({ Email })}>
                                        </TextInput>
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_Call.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("Phone Number")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={PhoneNumber}
                                                keyboardType="numeric"
                                                onChangeText={(PhoneNumber) => this.setState({ PhoneNumber })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_Location.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("City")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={user_city}
                                                onChangeText={(user_city) => this.setState({ user_city })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_Location.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("Location")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={Location}
                                                onChangeText={(Location) => this.setState({ Location })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_DOB.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TextInput
                                            placeholder={t("Date Of Birth")}
                                            editable={false}
                                            onTouchStart={this.show_DOB}
                                            showSoftInputOnFocus={false}
                                            onChangeText={(value) => this.setState({ DateOfBirth: value })}
                                            style={styles.TextValue}>
											{this.state.DateOfBirth}
                                        </TextInput>
                                    </Col>
                                    <DateTimePicker
										isVisible={this.state.isVisible_DOB}
										onConfirm={this.handler_DOB}
										onCancel={this.hide_DOB}
										mode='date'
									/>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_Password.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("New Password")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={password}
                                                secureTextEntry
                                                onChangeText={(password) => this.setState({ password })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_Password.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("Confirm Password")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={ConfirmPassword}
                                                secureTextEntry
                                                onChangeText={(ConfirmPassword) => this.setState({ ConfirmPassword })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <TouchableOpacity style={styles.btn} onPress={this.send.bind(this)}>
                                    <Row style={styles.btn_container} >
                                        <Text style={styles.btn_text}>{t("Save")}</Text>
                                    </Row>
                                </TouchableOpacity>
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
                                <Row style={{ backgroundColor: '', height: normalize(120), marginLeft: normalize(25), marginBottom: normalize(20) }}>
                                    <Col style={{ backgroundColor: '', width: '25%', justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <TouchableOpacity onPress={() => this.changeImage()}>
                                            <Col style={{ height: normalize(80), width: normalize(80), borderRadius: normalize(15), borderColor: '#102b46', borderWidth: 2, justifyContent: 'center', alignItems: 'center', }}>
                                                {(this.state.updatedProfile) ? (<Image style={{ height: normalize(80), width: normalize(80), borderRadius: normalize(15), }}
                                                    source={{ uri: this.state.updatedProfile }}
                                                />) : (<Image style={{ height: normalize(80), width: normalize(80), borderRadius: normalize(15), }}
                                                    source={{ uri: dataSource.member_image }}
                                                />)}
                                            </Col>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ backgroundColor: '', justifyContent: 'center', }}>
                                        <Row style={{ backgroundColor: '', height: '20%', }}>
                                            <Text style={{ fontFamily:'Poppins-SemiBold', fontSize: 18, color: '#102b46' }}>{dataSource.first_name} {dataSource.last_name}</Text>
                                        </Row>
                                        <Row style={{ backgroundColor: '', height: '18%', alignItems: 'center', }}>
                                            <Text style={{ fontSize: 14, fontFamily:'Poppins-Regular', color: 'gray', opacity: 0.7 }}>{dataSource.address} , {dataSource.city}</Text>
                                        </Row>
                                        <Row style={{ backgroundColor: '', height: '15%', flexDirection: 'row', }}>
                                            <Col style={{ backgroundColor: '', width: '7%', justifyContent: 'center', alignItems: 'flex-start' }}>
                                                <Image style={{ height: 12, width: 12, }}
                                                    source={require('../../../images/Location2-Pin-Gray-512.png')}
                                                />
                                            </Col>
                                            <Col style={{ backgroundColor: '', justifyContent: 'center', alignItems: 'flex-start' }}>
                                                <Text style={{ fontSize: 12, fontFamily:'Poppins-Regular', color: 'gray', opacity: 0.7 }}>{dataSource.state}</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col style={{ justifyContent: 'center', width: normalize(85) }}>
                                        <QRCode
                                            value={this.state.Data}
                                            size={60}
                                            bgColor='black'
                                            fgColor='white'
                                        />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_user.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("First name")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={user_first_name}
                                                onChangeText={(user_first_name) => this.setState({ user_first_name })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_user.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("Last name")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={user_last_name}
                                                onChangeText={(user_last_name) => this.setState({ user_last_name })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_envelope.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TextInput style={styles.TextValue}
                                            editable={false}
                                            placeholder="Email"
                                            placeholderTextColor="#102b46"
                                            maxLength={25}
                                            autoCorrect={false}
                                            autoComplete={false}
                                            value={Email}
                                            onChangeText={(Email) => this.setState({ Email })}>
                                        </TextInput>
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_Call.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("Phone Number")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={PhoneNumber}
                                                keyboardType="numeric"
                                                onChangeText={(PhoneNumber) => this.setState({ PhoneNumber })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_Location.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("City")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={user_city}
                                                onChangeText={(user_city) => this.setState({ user_city })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_Location.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("Location")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={Location}
                                                onChangeText={(Location) => this.setState({ Location })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_DOB.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TextInput
                                            placeholder={t("Date Of Birth")}
                                            onFocus={this.show_DOB}
                                            showSoftInputOnFocus={false}
                                            onChangeText={(value) => this.setState({ DateOfBirth: value })}
                                            style={styles.TextValue}>
											{this.state.DateOfBirth}
                                        </TextInput>
                                    </Col>
                                    <DateTimePicker
										isVisible={this.state.isVisible_DOB}
										onConfirm={this.handler_DOB}
										onCancel={this.hide_DOB}
										mode='date'
									/>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_Password.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("New Password")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={password}
                                                secureTextEntry
                                                onChangeText={(password) => this.setState({ password })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <Row style={styles.profile_name_row}>
                                    <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={require('../../../images/Account_Password.png')} style={{ height: normalize(22), width: normalize(22) }} />
                                    </Col>
                                    <Col style={styles.profile_name_col}>
                                        <TouchableOpacity>
                                            <TextInput style={styles.TextValue}
                                                placeholder={t("Confirm Password")}
                                                placeholderTextColor="#102b46"
                                                maxLength={25}
                                                autoCorrect={false}
                                                autoComplete={false}
                                                value={ConfirmPassword}
                                                secureTextEntry
                                                onChangeText={(ConfirmPassword) => this.setState({ ConfirmPassword })}>
                                            </TextInput>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: normalize(30), justifyContent: 'center', alignItems: 'flex-start', }}>
                                        <Image source={require('../../../images/Account_Edit.png')} style={{ height: normalize(16), width: normalize(16) }} />
                                    </Col>
                                </Row>

                                <TouchableOpacity style={styles.btn} onPress={this.send.bind(this)}>
                                    <Row style={styles.btn_container} >
                                        <Text style={styles.btn_text}>{t("Save")}</Text>
                                    </Row>
                                </TouchableOpacity>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    )}
                    <DropdownAlert ref={ref => this.dropdown = ref} />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    
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
    container:
    {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    mainContainer: {
        flex: 1,
        justifyContent: "center",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: height - (height * 65) / 100,
    },
    TextValue: {
        ...Platform.select({
            ios: {
                width: normalize(240),
                height: normalize(50),
                fontFamily:'Poppins-Medium',
                fontSize:16
            },
            android: {
                width: normalize(250),
                height: normalize(50),
                fontFamily:'Poppins-Medium',
                fontSize:16
            },
        })
    },
    profile_name_row: {
        ...Platform.select({
            ios: {
                height: normalize(40),
                marginRight: normalize(20),
                marginLeft: normalize(20),
                marginBottom: normalize(20),
                borderColor: '#D9DEE2',
                borderBottomWidth: 1,
                paddingBottom: normalize(15),
                paddingRight: normalize(15),
                paddingLeft: normalize(15),
            },
            android: {
                height: normalize(40),
                marginRight: normalize(20),
                marginLeft: normalize(20),
                marginBottom: normalize(20),
                borderColor: '#D9DEE2',
                borderBottomWidth: 1,
                paddingBottom: normalize(15),
                paddingRight: normalize(15),
                paddingLeft: normalize(15),
            }
        })
    },
    profile_name_col: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: normalize(20),
                width: normalize(245),
            },
            android: {
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: normalize(20),
                width: normalize(250),
            }
        })
    },
    btn:
    {
        backgroundColor: '#F1C40E',
        alignItems: 'center',
        borderRadius: normalize(30),
        marginRight: normalize(20),
        marginLeft: normalize(20),
        marginBottom: normalize(75),
        marginTop: normalize(15)
    },
    btn_container:
    {
        alignItems: 'center',
        height: 40,
    },
    btn_text:
    {
        color: '#233842',
        fontFamily:'Poppins-SemiBold', 
        fontSize: 18,
        justifyContent: 'center',
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