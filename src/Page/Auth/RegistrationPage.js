import React, { Component } from 'react';
import { AsyncStorage, TouchableWithoutFeedback, Platform, Keyboard, ActivityIndicator, View, ScrollView, StyleSheet, ImageBackground, Text, TextInput, StatusBar, Image, TouchableOpacity, Alert, CheckBox, KeyboardAvoidingView, Dimensions } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import DropdownAlert from 'react-native-dropdownalert';
import { Col, Row, } from 'react-native-easy-grid';
// import DateTimePicker from 'react-native-datepicker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Dialog, { DialogContent, SlideAnimation, DialogTitle, DialogButton, DialogFooter, } from 'react-native-popup-dialog';
// import { Dropdown } from 'react-native-material-dropdown-v2';
import { Dropdown } from 'react-native-material-dropdown-v2';
import validate from 'validate.js';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Thumbnail, List, ListItem, Separator } from 'native-base';
//more information
import { signupAction } from '../../util/action';
import { storage } from '../../util/storage';
import { staffAction } from '../../util/action';
import { membershipAction } from '../../util/action';
import { classAction } from '../../util/action';
import { membershipDaysAction } from '../../util/action';
import { RadioButton } from 'react-native-paper';
import normalize from 'react-native-normalize';
import * as ImageManipulator from 'expo-image-manipulator';
import { t } from '../../../locals';
var date = moment().format("YYYY-MM-DD")
import i18n from 'i18n-js';
import * as Localization from 'expo-localization';
const lang = i18n.locale = Localization.locale.substr(0, 2);

// if (Platform.OS == 'ios') {
//     var DateTimePicker = require('react-native-datepicker').default;

// } else {
//     var DateTimePickerModal = require('@react-native-community/datetimepicker').default;

// }
var today = new Date();

export default class RegistrationPage extends Component {


	static navigationOptions = ({ navigation }) => {
		return {
			headerShown: false
		};
	};

	constructor(props) {
		super(props)
		this.state = {
			country: 'uk',
			modalVisible: false,
			loader: false,
			loading: false,
			collapsed: false,
			two_collapsed: false,
			three_collapsed: false,
			four_collapsed: true,
			Firstname: '',
			Middlename: '',
			Lastname: '',
			gender: 'male',
			// date: '',
			DateOfBirth: '',
			Address: '',
			City: '',
			State: '',
			Zipcode: '',
			mobile: '',
			email: '',
			// UserName: '',
			Password: '',
			passwordshow: true,
			SelectStaffMember: '',
			staffData: '',
			selectedMembership: '1',
			membershipData: '',
			SelectClass: '',
			classData: '',
			MembershipValidFromDate: date,
			MembershipValidToDate: '',
			membershipdays: '',
			// isProfileUpdated: 0,
			updatedProfile: '',
			updated_Profile_name: '',
			updatedProfileForDatabase: '',
			isVisible: false,
			isVisible_valid: false,
			isVisible_TO: false,
			validationError: '',
			imageSource: require('../../images/Camera.png')
		};
		// console.log(this.state);
	}

	/** Refresh page */


	componentDidMount() {
		this.staffMemberList()
		this.membershipList()
		this.getClass("1")
	}

	getPasswordshow = () => {
		if (this.state.passwordshow == true) {
			this.setState({ passwordshow: false })
		} else {
			this.setState({ passwordshow: true })
		}
	}

	async staffMemberList() {
		//this.setState({ loader: true });

		const Data = {};
		staffAction(Data).then(responseJson => {
			// console.log(responseJson);
			if (responseJson.status == 1) {
				this.setState({
					staffData: responseJson.result,
					loader: false,
				});
			} else {
				this.setState({ loader: false });
			}
		});
	}

	async membershipList() {
		// const Data = {};
		// this.s etState({ loader: true });
		membershipAction().then(responseJson => {
			if (responseJson.status == 1) {
				this.setState({
					membershipData: responseJson.result,
					loader: false,
				});
			} else {
				this.setState({ loader: false });
			}
		});
	}

	async getClass(membershipID) {
		{( membershipID == "1")?(this.setState({ loader : false , SelectClass: '1', })):(this.setState({ loader : true , SelectClass: '',}))}
		// this.setState({ loader: true, SelectClass: '', MembershipValidFromDate: '', MembershipValidToDate: '', });
		this.setState({
			selectedMembership: membershipID,
		})

		// alert(membershipID);
		const Data = {
			membership_id: membershipID,
		};
		this.setState({
			classData: '',
		});
		classAction(Data).then(responseJson => {
			// console.log(responseJson)
			if (responseJson.status == 1) {
				this.setState({
					classData: responseJson.result,
					loader: false,
				});
				this.setState({
					membershipdays: '',
					loader: false,
				});
				membershipDaysAction(Data).then(responseJson => {
					if (responseJson.status == 1) {
						this.setState({
							membershipdays: responseJson.result[0].membership_days,
							loader: false,
						});
					} else {
						this.setState({ loader: false });
					}
				});
			} else {
				this.setState({ loader: false });
			}
			// this.clearText()

		});

	}

	// async clearText() {
	// 	this.setState({
	// 		SelectClass: '',
	// 	})
	// }

	async getDays(membershipID) {
		this.setState({
			selectedMembership: membershipID,
		})
		const Data = {
			membership_id: membershipID
		};
		this.setState({
			membershipdays: ''
		});
		membershipDaysAction(Data).then(responseJson => {
			// console.log(responseJson)
			if (responseJson.status == 1) {
				this.setState({
					membershipdays: responseJson.result,
					loader: false,
				});
			} else {
				this.setState({ loader: false });
			}
		});
		// this.clearText()
	}
	// async clearText() {
	// 	this.setState({
	// 		MembershipValidFromDate: '',
	// 		MembershipValidToDate: '',
	// 	})

	// }

	async signup() {

		const { loader, Firstname, Middlename, Lastname, gender, DateOfBirth, Address, City, State, Zipcode, mobile, email, Password, SelectStaffMember, selectedMembership, SelectClass, MembershipValidFromDate, MembershipValidToDate } = this.state;
		const { navigate } = this.props.navigation;
		// console.log(this.state);
		var constraints = {
			Firstname: {
				presence: {
					allowEmpty: false,
					message: t("is required")
				},
				format: {
					pattern: "[A-Za-z ]+",
					flags: "i",
					message: t("is not Valid")
				}	
			},
			
			// Middlename: {
			//     presence: {
			//         allowEmpty: false,
			//         message: "is required."
			//     },
			//     format: {
			//         pattern: "[A-Za-z ]+",
			//         flags: "i",
			//         message: "is not Valid."
			//     },
			// },
			Lastname: {
				presence: {
					allowEmpty: false,
					message: t("is required")
				},
				format: {
					pattern: "[A-Za-z ]+",
					flags: "i",
					message: t("is not Valid")
				},
			},
			gender: {
				presence: {
					allowEmpty: false,
					message: t("must be select either male or female")
				},
			},
			// DateOfBirth: {
			//     presence: {
			//         allowEmpty: false,
			//         message: ""
			//     },
			// },
			// Address: {
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
			// City: {
			//     presence: {
			//         allowEmpty: false,
			//         message: "is required."
			//     },
			//     format: {
			//         pattern: "[A-Za-z ]+",
			//         flags: "i",
			//         message: "is not valid."
			//     },
			// },
			// State: {
			//     presence: {
			//         allowEmpty: false,
			//         message: "is required."
			//     },
			//     format: {
			//         pattern: "[A-Za-z ]+",
			//         flags: "i",
			//         message: "is not valid."
			//     },
			// },
			// Zipcode: {
			//     presence: {
			//         allowEmpty: false,
			//         message: "^required"
			//     },
			//     format: {
			//         pattern: "[0-9]{6}",
			//         flags: "i",
			//         message: "^ (6 digit Zip code)"
			//     },
			// },
			// mobile: {
			//     presence: {
			//         allowEmpty: false,
			//         message: "^required"
			//     },
			//     format: {
			//         pattern: "[0-9]{10}",
			//         flags: "i",
			//         message: "^ (10 digit mobile number)"
			//     },
			// },
			email: {
				presence: {
					allowEmpty: false,
					message: "^" + t("Email is required")
				},
				email: {
					message:"^" + t("doesn't look like a valid")
				},
			},
			// UserName: {
			//     presence: {
			//         allowEmpty: false,
			//         message: "is required."
			//     },
			//     format: {
			//         pattern: "[A-Za-z ]+",
			//         //flags: "i",
			//         message: "is not Valid."
			//     }
			// },
			Password: {
				presence: {
					allowEmpty: false,
					message: "^" + t("password is required")
				}
			},
			// SelectStaffMember: {
			//     presence: {
			//         allowEmpty: false,
			//         message: ""
			//     },
			// },
			selectedMembership: {
				presence: {
					allowEmpty: false,
					message: ""
				},
			},
			SelectClass: {
				presence: {
					allowEmpty: false,
					message: ""
				},
			},
			MembershipValidFromDate: {
				presence: {
					allowEmpty: false,
					message: ""
				},
			},
			// MembershipValidToDate: {
			// 	presence: {
			// 		allowEmpty: false,
			// 		message: ""
			// 	},
			// },
		};

		const result = validate({
			Firstname: this.state.Firstname,
			Middlename: this.state.Middlename,
			Lastname: this.state.Lastname,
			gender: this.state.gender,
			DateOfBirth: this.state.DateOfBirth,
			Address: this.state.Address,
			City: this.state.City,
			State: this.state.State,
			Zipcode: this.state.Zipcode,
			mobile: this.state.mobile,
			email: this.state.email,
			// UserName: this.state.UserName,
			Password: this.state.Password,
			SelectStaffMember: this.state.SelectStaffMember,
			selectedMembership: this.state.selectedMembership,
			SelectClass: this.state.SelectClass,
			MembershipValidFromDate: this.state.MembershipValidFromDate,
			MembershipValidToDate: this.state.MembershipValidToDate,
		}, constraints);


		if (result) {
			// if(result.email && result.password){
			//   this.setState({ PopupError: result.email && result.password})
			//   this.setState({ visible: true });
			//   return false;
			// }
			if (result.Firstname) {
				this.dropdown.alertWithType('error', t('Error'), result.Firstname);
				// this.setState({ validationError: result.Firstname });
				this.setState({ visible: true });
				return false;
			}
			if (result.Middlename) {
				this.dropdown.alertWithType('error', t('Error'), result.Middlename);
				// this.setState({ validationError: result.Middlename })
				this.setState({ visible: true });
				return false;
			}
			if (result.Lastname) {
				this.dropdown.alertWithType('error', t('Error'), result.Lastname);
				// this.setState({ validationError: result.Lastname});
				this.setState({ visible: true });
				return false;
			}
			if (result.gender) {
				this.dropdown.alertWithType('error', t('Error'), result.gender);
				// this.setState({ validationError: result.gender});
				this.setState({ visible: true });
				return false;
			}
			if (result.DateOfBirth) {
				this.dropdown.alertWithType('error', t('Error'), result.DateOfBirth);
				// this.setState({ validationError: result.date});
				this.setState({ visible: true });
				return false;
			}
			if (result.Address) {
				this.dropdown.alertWithType('error', t('Error'), result.Address);
				// this.setState({ validationError: result.Address });
				this.setState({ visible: true });
				return false;
			}
			if (result.City) {
				this.dropdown.alertWithType('error', t('Error'), result.City);
				// this.setState({ validationError: result.City });
				this.setState({ visible: true });
				return false;
			}
			if (result.State) {
				this.dropdown.alertWithType('error', t('Error'), result.State);
				// this.setState({ validationError: result.State });
				this.setState({ visible: true });
				return false;
			}
			if (result.Zipcode) {
				this.dropdown.alertWithType('error', t('Error'), result.Zipcode);
				// this.setState({ validationError: result.Zipcode });
				this.setState({ visible: true });
				return false;
			}
			if (result.mobile) {
				this.dropdown.alertWithType('error', t('Error'), result.mobile);
				// this.setState({ validationError: result.mobile });
				this.setState({ visible: true });
				return false;
			}
			if (result.email) {
				this.dropdown.alertWithType('error', t('Error'), result.email);
				// this.setState({ validationError: result.email });
				this.setState({ visible: true });
				return false;
			}
			// if (result.UserName) 
			// {
			// 	this.dropdown.alertWithType('error', 'Error', result.UserName);
			// 	// this.setState({ validationError: result.UserName });
			// 	this.setState({ visible: true });
			// 	return false;
			// }
			if (result.Password) {
				this.dropdown.alertWithType('error', t('Error'), result.Password);
				// this.setState({ validationError: result.Password });
				this.setState({ visible: true });
				return false;
			}
			if (result.SelectStaffMember) {
				this.dropdown.alertWithType('error', t('Error'), result.SelectStaffMember);
				// this.setState({ validationError: result.SelectStaffMember });
				this.setState({ visible: true });
				return false;
			}
			if (result.selectedMembership) {
				this.dropdown.alertWithType('error', t('Error'), result.selectedMembership);
				// this.setState({ validationError: result.selectedMembership });
				this.setState({ visible: true });
				return false;
			}
			if (result.SelectClass) {
				this.dropdown.alertWithType('error', t('Error'), result.SelectClass);
				// this.setState({ validationError: result.SelectClass });
				this.setState({ visible: true });
				return false;
			}
			if (result.MembershipValidFromDate) {
				this.dropdown.alertWithType('error', t('Error'), result.MembershipValidFromDate);
				// this.setState({ validationError: result.MembershipValidFromDate });
				this.setState({ visible: true });
				return false;
			}
			if (result.MembershipValidToDate) {
				this.dropdown.alertWithType('error', t('Error'), result.MembershipValidToDate);
				// this.setState({ validationError: result.MembershipValidToDate });
				this.setState({ visible: true });
				return false;
			}
		}

		const signupData = {
			first_name: this.state.Firstname,
			middle_name: this.state.Middlename,
			last_name: this.state.Lastname,
			gender: this.state.gender,
			dob: this.state.DateOfBirth,
			address: this.state.Address,
			city: this.state.City,
			state: this.state.State,
			zip: this.state.Zipcode,
			mobile: this.state.mobile,
			email: this.state.email,
			// username: this.state.UserName,
			password: this.state.Password,
			staff_member: this.state.SelectStaffMember,
			membership: this.state.selectedMembership,
			class: this.state.SelectClass,
			membership_valid_from: this.state.MembershipValidFromDate,
			membership_valid_to: this.state.MembershipValidToDate,
			hidden_member_image: this.state.updatedProfileForDatabase,
			role: 'member',
		}


		/*from Data*/
		// const formData = new FormData()
		// 	formData.append('first_name', this.state.Firstname);
		// 	formData.append('middle_name', this.state.Middlename);
		// 	formData.append('last_name', this.state.Lastname);
		// 	formData.append('gender', this.state.gender);
		// 	formData.append('dob', this.state.DateOfBirth);
		// 	formData.append('address', this.state.Address);
		// 	formData.append('city', this.state.City);
		// 	formData.append('state', this.state.State);
		// 	formData.append('zip', this.state.Zipcode);
		// 	formData.append('mobile', this.state.mobile);
		// 	formData.append('email', this.state.email);
		// 	formData.append('username', this.state.UserName);
		// 	formData.append('password', this.state.Password);
		// 	formData.append('staff_member', this.state.SelectStaffMember);
		// 	formData.append('membership', this.state.selectedMembership);
		// 	formData.append('class', this.state.SelectClass);
		// 	formData.append('membership_valid_from', this.state.MembershipValidFromDate);
		// 	formData.append('membership_valid_to', this.state.MembershipValidToDate);
		// 	formData.append('hidden_member_image_name',this.state.updated_Profile_name);
		// 	// formData.append('hidden_member_image', this.state.updatedProfileForDatabase);
		// 	formData.append("hidden_member_image", {
		// 		uri: this.state.updatedProfileForDatabase,
		// 		name: "image.jpg",
		// 		type: "image/jpg",
		// 	});	

		// console.log(signupData);
		// this.setState({ loader: true });

		// if (!result) {

		// 	this.setState({ validationError: '' })

		// 	var response = signupAction(signupData).then(function (responseJson) {
		// 		navigate('LoginPage');
		// 		alert(responseJson.error);
		// 		Alert.alert(
		// 			'Success',
		// 			responseJson.error,
		// 		);
		// 		console.log(responseJson);
		// 		if (responseJson.status == 1) {
		// 			this.setState({ loader: false });
		// 			AsyncStorage.setItem('eamil', this.state.email);
		// 			AsyncStorage.setItem('password', this.state.Password);
		// 			storage.storeUserDetail(responseJson.result).then((data) => {

		// 			})
		// 			.catch((err) => {
		// 			    console.log(err)
		// 			});
		// 		} else {
		// 			alert(responseJson.message);
		// 			this.setState({ visible: true ,});
		// 			this.setState({ loader: false , });
		// 			alert(responseJson.error);
		// 			navigate('RegistrationPage');
		// 			alert(this.state.email);	

		// 		}
		// 	}.bind(this))

		// }

		this.setState({ loader: true })

		if (!result) {
			this.setState({ validationError: '' })
			var response = signupAction(signupData).then(function (responseJson) {
				// console.log(responseJson);
				// return false;
				// alert(responseJson.error);
				Alert.alert(
					'Success',
					responseJson.error,
				);
				if (responseJson.status == 1) {
					this.setState({ loader: false });
					// this.dropdown.alertWithType('success', t('Success'), responseJson.error);	
					AsyncStorage.setItem('email', this.state.email);
					AsyncStorage.setItem('password', this.state.Password);
					// storage.storeUserDetail(responseJson.result).then((data) => {
						
						// })
					navigate('LoginPage');
					} else {
					this.setState({ visible: true });
					this.setState({ loader: false });
					navigate('RegistrationPage');
					this.dropdown.alertWithType('error', t('Error'), responseJson.error);
				}

			}.bind(this))

		}

	}

	/* date picker DOB */

	handlerDOB = (date) => {
		this.setState({
			isVisible: false,
			DateOfBirth: moment(date).format('YYYY-MM-DD')
		});
		Keyboard.dismiss();
	}

	showDOB = () => {
		this.setState({ isVisible: true });
		Keyboard.dismiss();
	}

	hideDOB = () => {
		this.setState({
			isVisible: false,
		});
	}

	/* MemberShip From date */

	handler_valid = (date) => {
		var membershipdays = this.state.membershipdays;
		this.setState({
			isVisible_valid: false,
			MembershipValidFromDate: moment(date).format('YYYY-MM-DD'),

		})

		if (membershipdays > 0) {
			var fromDate = moment(date).format('YYYY-MM-DD');
			var toDate = moment(fromDate).add(parseFloat(membershipdays), 'days').format('YYYY-MM-DD');
			this.setState({
				MembershipValidToDate: moment(toDate).format('YYYY-MM-DD')
			})
		}
	}

	show_valid = () => {
		this.setState({ isVisible_valid: true });
		Keyboard.dismiss();
	}

	hide_valid = () => {
		this.setState({
			isVisible_valid: false,
		})
	}

	/* MemberShip From To date */

	handler_To = (date) => {
		this.setState({
			isVisible_TO: false,
			MembershipValidToDate: moment(date).format('D/MM/YYYY')
		})
	}

	show_To = () => {
		this.setState({ isVisible_TO: true });
		Keyboard.dismiss();
	}

	hide_To = () => {
		this.setState({
			isVisible_TO: false,
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
			this.setState({ loader: true })
			const manipResult = await ImageManipulator.manipulateAsync(result.uri,
				[{ resize: { height: 1024 } }],
				{ compress: 0, format: ImageManipulator.SaveFormat.PNG, base64: true }
			);

			this.setState({
				updatedProfile: manipResult.uri,
				updatedProfileForDatabase: manipResult.base64,
				updated_Profile_name: result.uri.split('/').pop(),
			});
			this.setState({ loader: false })
		}

		if (this.state.updatedProfile.length > 0) {
			this.setState({ loader: false })
		}

		// this.setState({
		// 	updatedProfile: result.uri,
		// 	updatedProfileForDatabase: result.base64,
		// 	updated_Profile_name: result.uri.split('/').pop(),
		// });


	}

	render() {
		const { loader, staffData, membershipData, classData, membershipdays, gender } = this.state;
		let staffList = [];
		for (let userObject of staffData) {
			staffList.push({ label: userObject.staff_name, value: userObject.staff_id });
		}
		const membershipList = [];
		for (let userObject of this.state.membershipData) {
			membershipList.push({ label: userObject.membership_label, value: userObject.membership_id })
		}
		const classList = [];
		for (let userObject of this.state.classData) {
			classList.push({ label: userObject.class_name, value: userObject.class_id });
		}

		const DaysList = [];
		for (let userObject of this.state.membershipdays) {
			DaysList.push({ label: userObject.membership_id, date: userObject.membership_days });
		}

		const { navigate } = this.props.navigation;
		const { modalVisible, Firstname, Middlename, Lastname, Address, City, State, Zipcode, mobile, email, Password, collapsed, two_collapsed, three_collapsed, four_collapsed, selectedMembership ,SelectClass , SelectStaffMember, MembershipValidFromDate } = this.state;
		if (!loader) {
			return (
				<View style={styles.container}>

					<StatusBar />
					<ImageBackground source={require('../../images/Login-BG-Image.png')} style={styles.bg_image}>
						<KeyboardAvoidingView behavior={Platform.select({ android: 'height', ios: 'padding' })} style={{ flex: 1 }} >
							<ScrollView style={{ flexGrow: 1, }}>
								<Row style={styles.back_arrow}>
									<TouchableOpacity style={{ height: normalize(45), width: normalize(70), justifyContent: 'center', alignItems: 'center', }} onPress={() => this.props.navigation.navigate('LoginPage')}>
										<Image style={styles.icon_image}
											source={require('../../images/Back.png')}
										/>
									</TouchableOpacity>
								</Row>

								<Col style={{ backgroundColor: '', marginBottom: '3%', }}>

									<Row style={{ height: '14%', marginBottom: '5%', justifyContent: 'center', }}>
										<Col style={{ backgroundColor: "#ffffff", borderWidth: 1, width: 150, height: 150, borderRadius: 75, }}>
											<Col style={{ justifyContent: 'center', }}>
												{(this.state.updatedProfile) ? (<Image style={{ width: 150, height: 150, borderRadius: 75 }}
													source={{ uri: this.state.updatedProfile }}
												/>) : (<Image style={styles.image}
													source={require('../../images/Logo.png')}
												/>)}
											</Col>
											<TouchableOpacity
												onPress={() => this.changeImage()}
												style={{ backgroundColor: '#ffffff', borderWidth: 1, width: 50, height: 50, borderRadius: 50, marginLeft: '70%', marginTop: '70%', position: 'absolute', }}>
												<Col style={{ justifyContent: 'center', alignItems: "center", }}>
													<Image style={{ height: 30, width: 30, }}
														source={this.state.imageSource}
													/>
												</Col>
											</TouchableOpacity>
										</Col>
									</Row>
								</Col>

								<Col style={{ marginBottom: '10%', }}>

									<Col style={{ borderWidth: 1, borderColor: '#ffffff', borderRadius: 5, marginLeft: '2%', marginRight: '2%', }}>
										<Collapse
											isCollapsed={this.state.collapsed}
											onToggle={(isCollapsed) => this.setState({ collapsed: !this.state.collapsed })}>
											{(collapsed == true) ? (<CollapseHeader>
												<Row style={{ height: 35, borderBottomWidth: 1, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center', }}>
													<Col style={{ width: '90%', paddingLeft: '3%', }}>
														<Text style={{
															fontSize: 17, fontFamily:'Poppins-Medium',
															color: '#ffffff',
														}}>{t("Personal Information")}</Text>
													</Col>
													<Col style={{ width: '10%', }}>
														<Image style={{ height: 20, width: 20, }}
															source={require('../../images/up-arrow.png')} />
													</Col>
												</Row>
											</CollapseHeader>) : (<CollapseHeader>
												<Row style={{ height: 35, borderBottomWidth: 1, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center', }}>
													<Col style={{ width: '90%', paddingLeft: '3%', }}>
														<Text style={{
															fontSize: 17, fontFamily:'Poppins-Medium',
															color: '#ffffff',
														}}>{t("Personal Information")}</Text>
													</Col>
													<Col style={{ width: '10%', }}>
														<Image style={{ height: 20, width: 20, }}
															source={require('../../images/down-arrow.png')} />
													</Col>
												</Row>
											</CollapseHeader>)}


											<CollapseBody>

												<ListItem style={{ height: 45, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#848485', marginRight: '3%', marginLeft: '3%', }}>
													<Row>
														<Col style={{ width: '15%', alignItems: 'center', justifyContent: 'center', }}>
															<Image style={{ height: 22, width: 22, }}
																source={require('../../images/Name.png')} />
														</Col>
														<Col>
															{(this.state.Firstname != 0) ? (<View>
																<TextInput style={{ fontSize: 16, fontFamily:'Poppins-Medium',color: '#ffffff', height: normalize(45), width: normalize(310) }}
																	value={Firstname}
																	onChangeText={(value) => Firstname(value)}
																	onChangeText={(Firstname) => this.setState({ Firstname })}
																	placeholderTextColor="#ffffff"
																	placeholder={t("First name")}
																	maxLength={10}
																>
																</TextInput>
															</View>) : (<View>
																	<TextInput style={{ fontSize: 16, fontFamily:'Poppins-Medium', color: '#ffffff', height: normalize(45), }}
																		value={Firstname}
																		onChangeText={(Firstname) => this.setState({ Firstname })}
																		placeholderTextColor="#ffffff"
																		placeholder={t("First name")}
																		maxLength={10}
																	>
																	</TextInput>
																	<Text style={{ color: 'red', position: 'absolute', marginTop: normalize(13),marginLeft: normalize(95)}}>*</Text>
															</View>)}

														</Col>
													</Row>
												</ListItem>

												<ListItem style={{ height: 45, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#848485', marginRight: '3%', marginLeft: '3%', }}>
													<Row>
														<Col style={{ backgroundColor: '', width: '15%', alignItems: 'center', justifyContent: 'center', }}>
															<Image style={{ height: 22, width: 22, }}
																source={require('../../images/Name.png')} />
														</Col>
														<Col>
															<TextInput style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', height: normalize(45), width: normalize(310) }}
																value={Middlename}
																onChangeText={(Middlename) => this.setState({ Middlename })}
																placeholderTextColor="#ffffff"
																placeholder={t("Middle name")}
																maxLength={10}
															>
															</TextInput>
														</Col>
													</Row>
												</ListItem>

												<ListItem style={{ height: 45, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#848485', marginRight: '3%', marginLeft: '3%', }}>
													<Row>
														<Col style={{ backgroundColor: '', width: '15%', alignItems: 'center', justifyContent: 'center' }}>
															<Image style={{ height: 22, width: 22, }}
																source={require('../../images/Name.png')} />
														</Col>
														<Col>
															{(this.state.Lastname != 0) ? (<View>
																<TextInput style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', height: normalize(45), width: normalize(310) }}
																	value={Lastname}
																	onChangeText={(Lastname) => this.setState({ Lastname })}
																	placeholderTextColor="#ffffff"
																	placeholder={t("Last name")}
																	maxLength={10}
																>
																</TextInput>
															</View>) : (<View>
																	<TextInput style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', height: normalize(45) }}
																		value={Lastname}
																		onChangeText={(Lastname) => this.setState({ Lastname })}
																		placeholderTextColor="#ffffff"
																		placeholder={t("Last name")}
																		maxLength={10}
																	>
																	</TextInput>
																		<Text style={{ color: 'red', position: 'absolute', marginTop: normalize(13), marginLeft: normalize(95)}}>*</Text>
															</View>)}
														</Col>
													</Row>
												</ListItem>

												<ListItem style={{ height: 45, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#848485', marginRight: '3%', marginLeft: '3%', }}>
													<Row>
														<Col style={{ width: '15%', alignItems: 'center', justifyContent: 'center', }}>
															<Image style={{ height: 22, width: 22, }}
																source={require('../../images/Gender.png')} />
														</Col>
														<Col style={styles.radio_col}>
															<View style={styles.radio}>
																<RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#fffff' : '#fffff', uncheckedColor: Platform.OS === 'ios' ? '#fffff' : '#fffff' }}
																	value="male"
																	color='#ffffff'
																	uncheckedColor='#ffffff'
																	status={gender === 'male' ? 'checked' : 'unchecked'}
																	onPress={() => this.setState({ gender: 'male' })}
																/>
															</View>
															<Text style={{ fontSize: 16, fontFamily:'Poppins-Medium', color: '#ffffff', paddingRight: '48%', }}>
																{t("Male")}</Text>
														</Col>
														<Col style={{ paddingRight: '5%', flexDirection: 'row', alignItems: 'center', }}>
															<View style={styles.radio}>
																<RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#fffff' : '#fffff', uncheckedColor: Platform.OS === 'ios' ? '#fffff' : '#fffff' }}
																	value="Female"
																	color='#ffffff'
																	uncheckedColor='#ffffff'
																	status={gender === 'Female' ? 'checked' : 'unchecked'}
																	onPress={() => this.setState({ gender: 'Female' })}
																/>
															</View>
															<Text style={{ fontSize: 16, fontFamily:'Poppins-Medium', color: '#ffffff', paddingRight: '40%', }}>
																{t("Female")}</Text>
														</Col>
													</Row>
												</ListItem>

												{/* Date Of Birth   */}

												{/* <Row style={{height: 45, justifyContent: 'center', alignItems: 'center',marginRight: '3%', marginLeft: '3%',}}>
							<Col style={{backgroundColor: '',width: '15%',alignItems: 'center',justifyContent:'center',}}>
								<TouchableOpacity>
									<Image style={{height: 22, width: 22,}}
										source={require('../../images/DOB.png')}
									/>
								</TouchableOpacity>
							</Col>
							<Col>
								{(this.state.DateOfBirth != 0)?(<View>
									{(Platform.OS == "ios")?(
										<TextInput style={{color: '#ffffff', fontSize: 15 ,height: normalize(45),width: normalize(310)}}
											placeholderTextColor = "#ffffff"
											placeholder="Date Of Birth"
											onTouchStart={this.showDOB}
											editable={false}
											showSoftInputOnFocus={false}
											onChangeText={(date) => this.setState({DateOfBirth})}
										>
										{this.state.DateOfBirth}
										</TextInput>
									):(
										<TextInput style={{color: '#ffffff', fontSize: 15 ,height: normalize(45),width: normalize(310)}}
											placeholderTextColor = "#ffffff"
											placeholder="Date Of Birth"
											onFocus={this.showDOB}
											showSoftInputOnFocus={false}
											onChangeText={(date) => this.setState({DateOfBirth})}
										>
										{this.state.DateOfBirth}
										</TextInput>
									)}
								</View>):(<View>
									{(Platform.OS == "ios")?(
										<TextInput style={{color: '#ffffff', fontSize: 15 ,height: normalize(45),width: normalize(310)}}
											placeholderTextColor = "#ffffff"
											placeholder="Date Of Birth"
											onTouchStart={this.showDOB}
											editable={false}
											showSoftInputOnFocus={false}
											onChangeText={(date) => this.setState({DateOfBirth})}
										>
										{this.state.DateOfBirth}
										</TextInput>
									):(
										<TextInput style={{color: '#ffffff', fontSize: 15 ,height: normalize(45),width: normalize(310)}}
											placeholderTextColor = "#ffffff"
											placeholder="Date Of Birth"
											onFocus={this.showDOB}
											showSoftInputOnFocus={false}
											onChangeText={(date) => this.setState({DateOfBirth})}
										>
										{this.state.DateOfBirth}
										</TextInput>
									)}
								<Text style={{ color: 'red', position: 'absolute',marginLeft: normalize(95), marginTop: normalize(13),}}>*</Text>
								</View>)}
							</Col>
							<DateTimePicker
								isVisible={this.state.isVisible}
	                            onConfirm={this.handlerDOB}
	                            onCancel={this.hideDOB}
	                            mode='date'
	                            maximumDate={today}
						    />
						</Row> */}

												{/* <Row style={{height: 45, justifyContent: 'center', alignItems: 'center',marginRight: '3%', marginLeft: '3%',}}>
							<Col style={{backgroundColor: '',width: '15%',alignItems: 'center',justifyContent:'center',}}>
									<Image style={{height: 22, width: 22,}}
										source={require('../../images/DOB.png')}
									/>
							</Col>
							<Col style={{ justifyContent: 'center',alignItems: 'flex-start',}}>
                                <TouchableOpacity style={{color: '#ffffff', fontSize: 15 ,}}>
                                    <DateTimePicker
                                        date={this.state.DateOfBirth}
										mode="date"
										maxDate = { new Date() }
                                        placeholder={"Date Of Birth *"}
                                        format="YYYY-MM-DD"
										maximumDate={today}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"

                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                width: 0,
                                                height: 0,
                                                // marginLeft: 0
                                            },
                                            placeholderText: {
												...Platform.select({
													ios: {
														fontSize: 15,
														color: '#fff',
														marginRight: normalize(39),	
													},
													android: {
														fontSize: 15,
														color: '#fff',
														marginRight: normalize(48),
													},
												})
											},
                                            dateText: {
												...Platform.select({
													ios: {
														fontSize: 15,
														color: '#fff',
														marginRight: normalize(55),	
													},
													android: {
														fontSize: 15,
														color: '#fff',
														marginRight: normalize(70),
													},
												})
											},
											dateInput: {
												borderColor: '#000',
                                            }
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => { this.setState({ DateOfBirth: date }) }}
                                    />
                                </TouchableOpacity>
							</Col>
                        </Row> */}
											</CollapseBody>
										</Collapse>
									</Col>

									<Col style={{ borderWidth: 1, borderColor: '#ffffff', borderRadius: 5, marginLeft: '2%', marginRight: '2%', marginTop: '5%', }}>
										<Collapse
											isCollapsed={this.state.three_collapsed}
											onToggle={(isCollapsed) => this.setState({ three_collapsed: !this.state.three_collapsed })}>
											{(three_collapsed == true) ? (<CollapseHeader>
												<Row style={{ height: 35, borderBottomWidth: 1, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center', }}>
													<Col style={{ width: '90%', paddingLeft: '3%', }}>
														<Text style={{
															fontSize: 17, fontFamily:'Poppins-Medium',
															color: '#ffffff',
														}}>{t("Login Information")}</Text>
													</Col>
													<Col style={{ width: '10%', }}>
														<Image style={{ height: 20, width: 20, }}
															source={require('../../images/up-arrow.png')} />
													</Col>
												</Row>
											</CollapseHeader>) : (<CollapseHeader>
												<Row style={{ height: 35, borderBottomWidth: 1, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center', }}>
													<Col style={{ width: '90%', paddingLeft: '3%', }}>
														<Text style={{
															fontSize: 17, fontFamily:'Poppins-Medium',
															color: '#ffffff',
														}}>{t("Login Information")}</Text>
													</Col>
													<Col style={{ width: '10%', }}>
														<Image style={{ height: 20, width: 20, }}
															source={require('../../images/down-arrow.png')} />
													</Col>
												</Row>
											</CollapseHeader>)}

											<CollapseBody>
												<ListItem style={{ height: 45, justifyContent: 'center', alignItems: 'center', marginRight: '3%', marginLeft: '3%', }}>
													<Row>
														<Col style={{ backgroundColor: '', width: '15%', alignItems: 'center', justifyContent: 'center', }}>
															<Image style={{ height: 22, width: 22, }}
																source={require('../../images/Email.png')} />
														</Col>
														<Col>
															{(this.state.email != 0) ? (<View>
																<TextInput style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', height: normalize(45), width: normalize(310) }}
																	placeholderTextColor="#ffffff"
																	onChangeText={(email) => this.setState({ email })}
																	value={email}
																	placeholder={t("Email")}
																	maxLength={30}
																>
																</TextInput>
															</View>) : (<View>
																	<TextInput style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', height: normalize(45) }}
																		placeholderTextColor="#ffffff"
																		onChangeText={(email) => this.setState({ email })}
																		value={email}
																		placeholder={t("Email")}
																		maxLength={30}
																	>
																	</TextInput>
																	<Text style={{ color: 'red', position: 'absolute', marginTop: normalize(10) , marginLeft: normalize(50)}}>*</Text>
															</View>)}
														</Col>
													</Row>
												</ListItem>

												<Row style={{ height: 45, justifyContent: 'center', alignItems: 'center', marginRight: '3%', marginLeft: '3%', }}>
													<Col style={styles.user_col}>
														<Image style={{ height: 22, width: 22, }}
															source={require('../../images/Password.png')} />
													</Col>
													<Col>
														{(this.state.Password != 0) ? (<View>
															<TextInput style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', height: normalize(45), width: normalize(305) }}
																placeholderTextColor="#ffffff"
																value={Password}
																onChangeText={(Password) => this.setState({ Password })}
																placeholder={t("Password")}
																maxLength={10}
																secureTextEntry={this.state.passwordshow}
															>
															</TextInput>
															{this.state.passwordshow ? (<TouchableOpacity style={{ width: normalize(50), position: 'absolute', marginLeft: normalize(255), paddingLeft: normalize(15), paddingTop: normalize(12), height: normalize(45), }}
																onPress={this.getPasswordshow}>
																<Image source={require('../../images/Eye_White.png')}
																	style={{ height: normalize(25), width: normalize(25) }}></Image>
															</TouchableOpacity>) : (<TouchableOpacity style={{ width: normalize(50), position: 'absolute', marginLeft: normalize(255), paddingLeft: normalize(15), paddingTop: normalize(12), height: normalize(45), }}
																onPress={this.getPasswordshow}>
																<Image source={require('../../images/EyeClose_White.png')}
																	style={{ height: normalize(25), width: normalize(25) }}></Image>
															</TouchableOpacity>)}
														</View>) : (<View>
																<TextInput style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', height: normalize(45) }}
																	placeholderTextColor="#ffffff"
																	value={Password}
																	onChangeText={(Password) => this.setState({ Password })}
																	placeholder={t("Password")}
																	secureTextEntry={this.state.passwordshow}
																>
																</TextInput>
															{this.state.passwordshow ? (<TouchableOpacity style={{ width: normalize(50), position: 'absolute', marginLeft: normalize(255), paddingLeft: normalize(15), paddingTop: normalize(12), height: normalize(45), }}
																onPress={this.getPasswordshow}>
																<Image source={require('../../images/Eye_White.png')}
																	style={{ height: normalize(25), width: normalize(25) }}></Image>
															</TouchableOpacity>) : (<TouchableOpacity style={{ width: normalize(50), position: 'absolute', marginLeft: normalize(255), paddingLeft: normalize(15), paddingTop: normalize(12), height: normalize(45), }}
																onPress={this.getPasswordshow}>
																<Image source={require('../../images/EyeClose_White.png')}
																	style={{ height: normalize(25), width: normalize(25) }}></Image>
															</TouchableOpacity>)}
																<Text style={{ color: 'red', position: 'absolute', marginTop: normalize(10) , marginLeft: normalize(85)}}>*</Text>
														</View>)}

													</Col>
												</Row>
											</CollapseBody>
										</Collapse>

									</Col>

									<Col style={{ borderWidth: 1, borderColor: '#ffffff', borderRadius: 5, marginLeft: '2%', marginRight: '2%', marginTop: '5%', }}>
										<Collapse
											isCollapsed={this.state.two_collapsed}
											onToggle={(isCollapsed) => this.setState({ two_collapsed: !this.state.two_collapsed })}>
											{(two_collapsed == true) ? (<CollapseHeader>
												<Row style={{ height: 35, borderBottomWidth: 1, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center', }}>
													<Col style={{ width: '90%', paddingLeft: '3%', }}>
														<Text style={{
															fontSize: 17, fontFamily:'Poppins-Medium',
															color: '#ffffff',
														}}>{t("Contact Information")}</Text>
													</Col>
													<Col style={{ width: '10%', }}>
														<Image style={{ height: 20, width: 20, }}
															source={require('../../images/up-arrow.png')} />
													</Col>
												</Row>
											</CollapseHeader>) : (<CollapseHeader>
												<Row style={{ height: 35, borderBottomWidth: 1, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center', }}>
													<Col style={{ width: '90%', paddingLeft: '3%', }}>
														<Text style={{
															fontSize: 17, fontFamily:'Poppins-Medium',
															color: '#ffffff',
														}}>{t("Contact Information")}</Text>
													</Col>
													<Col style={{ width: '10%', }}>
														<Image style={{ height: 20, width: 20, }}
															source={require('../../images/down-arrow.png')} />
													</Col>
												</Row>
											</CollapseHeader>)}

											<CollapseBody>
												<ListItem style={{ height: 45, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#848485', marginRight: '3%', marginLeft: '3%', }}>
													<Row>
														<Col style={{ backgroundColor: '', width: '15%', alignItems: 'center', justifyContent: 'center', }}>
															<Image style={{ height: 22, width: 22, }}
																source={require('../../images/Location.png')} />
														</Col>
														<Col>
															<TextInput style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', height: normalize(45), width: normalize(310) }}
																placeholderTextColor="#ffffff"
																value={Address}
																onChangeText={(Address) => this.setState({ Address })}
																placeholder={t("Address")}
																maxLength={30}
															>
															</TextInput>
														</Col>
													</Row>
												</ListItem>
												<ListItem style={{ height: 45, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#848485', marginRight: '3%', marginLeft: '3%', }}>
													<Row>
														<Col style={{ backgroundColor: '', width: '15%', alignItems: 'center', justifyContent: 'center', }}>
															<Image style={{ height: 22, width: 22, }}
																source={require('../../images/Location.png')} />
														</Col>
														<Col>
															<TextInput style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', height: normalize(45), width: normalize(310) }}
																placeholderTextColor="#ffffff"
																value={City}
																onChangeText={(City) => this.setState({ City })}
																placeholder={t("City")}
																maxLength={10}
															>
															</TextInput>
														</Col>
													</Row>
												</ListItem>
												<ListItem style={{ height: 45, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#848485', marginRight: '3%', marginLeft: '3%', }}>
													<Row>
														<Col style={{ backgroundColor: '', width: '15%', alignItems: 'center', justifyContent: 'center', }}>
															<Image style={{ height: 22, width: 22, }}
																source={require('../../images/Location.png')} />
														</Col>
														<Col>
															<TextInput style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', height: normalize(45), width: normalize(310) }}
																placeholderTextColor="#ffffff"
																value={State}
																onChangeText={(State) => this.setState({ State })}
																placeholder={t("State")}
																maxLength={10}
															>
															</TextInput>
														</Col>
													</Row>
												</ListItem>
												<ListItem style={{ height: 45, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#848485', marginRight: '3%', marginLeft: '3%', }}>
													<Row>
														<Col style={{ backgroundColor: '', width: '15%', alignItems: 'center', justifyContent: 'center', }}>
															<Image style={{ height: 22, width: 22, }}
																source={require('../../images/Location.png')} />
														</Col>
														<Col>
															<TextInput style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', height: normalize(45), width: normalize(310) }}
																placeholderTextColor="#ffffff"
																value={Zipcode}
																onChangeText={(Zipcode) => this.setState({ Zipcode })}
																placeholder={t("Zip Code")}
																keyboardType="numeric"
																maxLength={6}
															>
															</TextInput>
														</Col>
													</Row>
												</ListItem>
												<ListItem style={{ height: 45, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#848485', marginRight: '3%', marginLeft: '3%', }}>
													<Row>
														<Col style={{ backgroundColor: '', width: '15%', alignItems: 'center', justifyContent: 'center', }}>
															<Image style={{ height: 22, width: 22, }}
																source={require('../../images/call.png')} />
														</Col>
														<Col>
															<TextInput style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', height: normalize(45), width: normalize(310) }}
																placeholderTextColor="#ffffff"
																placeholder={t("Mobile Number")}
																value={mobile}
																onChangeText={(mobile) => this.setState({ mobile })}
																keyboardType="numeric"
																maxLength={10}
															>
															</TextInput>
														</Col>
													</Row>
												</ListItem>
											</CollapseBody>
										</Collapse>
									</Col>



									<Col style={{ borderWidth: 1, borderColor: '#ffffff', borderRadius: 5, marginLeft: '2%', marginRight: '2%', marginTop: '5%', }}>
										<Collapse
											isCollapsed={this.state.four_collapsed}
											onToggle={(isCollapsed) => this.setState({ four_collapsed: !this.state.four_collapsed })}>
											{(four_collapsed == true) ? (<CollapseHeader>
												<Row style={{ height: 35, borderBottomWidth: 1, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center', }}>
													<Col style={{ width: '90%', paddingLeft: '3%', }}>
														<Text style={{
															fontSize: 17, fontFamily:'Poppins-Medium',
															color: '#ffffff',
														}}>{t("More Information")}</Text>
													</Col>
													<Col style={{ width: '10%', }}>
														<Image style={{ height: 20, width: 20, }}
															source={require('../../images/up-arrow.png')} />
													</Col>
												</Row>
											</CollapseHeader>) : (<CollapseHeader>
												<Row style={{ height: 35, borderBottomWidth: 1, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center', }}>
													<Col style={{ width: '90%', paddingLeft: '3%', }}>
														<Text style={{
															fontSize: 17, fontFamily:'Poppins-Medium',
															color: '#ffffff',
														}}>{t("More Information")}</Text>
													</Col>
													<Col style={{ width: '10%', }}>
														<Image style={{ height: 20, width: 20, }}
															source={require('../../images/down-arrow.png')} />
													</Col>
												</Row>
											</CollapseHeader>)}
											<CollapseBody>

												{/* <Row style={{ height: 45, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, }}>
													<Col style={{ marginRight: '3%', marginLeft: '3%',}}>
														<Dropdown
															tintColor={'red'}
															paddingLeft={16}
															placeholder={t('Staff Member')}
															placeholderStyle={{
																color: '#FFFFFF'
															}}
															underlineColor={'red'}
															labelHeight={5}
															labelPadding={0}
															value={SelectStaffMember}
															// valueExtractor={({ value }) => value}
															onChangeText={(value) => this.setState({ SelectStaffMember: value })}
															data={staffList}
														>
														</Dropdown>
														
													</Col>
												</Row> */}

												<Row style={{ height: 45, justifyContent: 'center', alignItems: 'center',marginTop: '3%' }}>
													<Col style={{ marginRight: '3%', marginLeft: '3%', }}>
														{(this.state.selectedMembership != 0) ? (<View>
															<Dropdown
																// paddingLeft={16}
																label={t('Membership')}
																// placeholderTextColor={'#fff'}
																// textColor={'#fff'}
																labelHeight={5}
																baseColor={'#848485'}
																labelPadding={0}
																selectedItemColor={'#000'}
																value={selectedMembership}
																style={{ color: 'white', fontSize: 16, fontFamily:'Poppins-Medium',}}
																// valueExtractor={({ value }) => 1}
																onChangeText={(value) => this.getClass(value)}
																data={membershipList}
															>
															</Dropdown>
														</View>) : (<View>
															<Dropdown
																// paddingLeft={16}
																label={t('Membership')}
																style = {{color: 'white', fontSize: 16, fontFamily:'Poppins-Medium',}}
																labelHeight={5}
																labelPadding={0}
																value={selectedMembership}
																// valueExtractor={({ value }) => 1}
																onChangeText={(value) => this.getClass(value)}
																data={membershipList}
															>
															</Dropdown>
															<Text style={{ color: 'red', position: 'absolute', marginLeft: normalize(117), marginTop: normalize(10), }}>*</Text>
														</View>)}
													</Col>
												</Row>

												<Row style={{ height: 45, justifyContent: 'center', alignItems: 'center', marginTop: '3%'}}>
													<Col style={{ marginRight: '3%', marginLeft: '3%', }}>
														{(this.state.SelectClass != 0) ? (<View>
															<Dropdown
																paddingLeft={16}
																label={t('Select Class')}
																placeholderTextColor={'#fff'}
																textColor={'#fff'}
																labelHeight={5}
																baseColor={'#848485'}
																labelPadding={0}
																selectedItemColor={'#000'}
																value={SelectClass}
																style={{ color : "white", fontSize: 16, fontFamily:'Poppins-Medium',}}
																onChangeText={(value) => { this.setState({ SelectClass: value }) }}
																data={classList}
															>
															</Dropdown>
														</View>) : (<View>
															<Dropdown
																paddingLeft={16}
																label={t('Select Class')}
																placeholderTextColor={'#fff'}
																textColor={'#fff'}
																labelHeight={5}
																baseColor={'#848485'}
																labelPadding={0}
																selectedItemColor={'#000'}
																value={SelectClass}
																style={{ color : "white", fontSize: 16, fontFamily:'Poppins-Medium',}}
																onChangeText={(value) => { this.setState({ SelectClass: value }) }}
																data={classList}
															>
															</Dropdown>
															<Text style={{ color: 'red', position: 'absolute', marginLeft: normalize(115), marginTop: normalize(10) }}>*</Text>
														</View>)}
													</Col>
												</Row>
												<Row style={{ height: 45, justifyContent: 'center', alignItems: 'center', marginTop: '3%'}}>
													<Col style={{ width: '52%', marginLeft: '7%', }}>
														{(this.state.MembershipValidFromDate != 0) ? (<View>
															<Text style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', }}>{t("Membership Valid From")}    :</Text>
														</View>) : (<View>
															<Text style={{ color: '#ffffff', fontSize: 16, fontFamily:'Poppins-Medium', }}>{t("Membership Valid From")}    :</Text>
															<Text style={{ color: 'red', position: 'absolute', marginLeft: normalize(170), marginTop: normalize(0) }}>*</Text>
														</View>)}
													</Col>
													<Col style={{ marginRight: '4%', marginLeft: '4%', justifyContent: 'center', alignItems: 'center', borderColor: '#ffffff', borderWidth: 1, borderRadius: 15 }}>
														{(Platform.OS == "ios") ? (
															<TextInput style={{ color: '#ffffff', fontSize: 15, fontFamily:'Poppins-Medium', height: normalize(30) , justifyContent: 'center' , alignItems: 'center'}}
																placeholderTextColor="#ffffff"
																placeholder={t("Select Date")}
																editable={false}
																onTouchStart={this.show_valid}
																showSoftInputOnFocus={false}
																onChangeText={(value) => this.setState({ MembershipValidFromDate: value })}
																data={DaysList}
															>
																{this.state.MembershipValidFromDate}
															</TextInput>
														) : (
															<TextInput style={{ color: '#ffffff', fontSize: 15, fontFamily:'Poppins-Medium', height: normalize(30) , justifyContent: 'center' , alignItems: 'center'}}
																placeholderTextColor="#ffffff"
																placeholder={t("Select Date")}
																onFocus={this.show_valid}
																showSoftInputOnFocus={false}
																onChangeText={(value) => this.setState({ MembershipValidFromDate: value })}
																data={DaysList}
															>
																{this.state.MembershipValidFromDate}
															</TextInput>
														)}
													</Col>
													<DateTimePicker
														isVisible={this.state.isVisible_valid}
														onConfirm={this.handler_valid}
														onCancel={this.hide_valid}
														mode='date'
														minimumDate={today}
													/>
												</Row>

												{/* <Row style={{ height: 45, justifyContent: 'center', alignItems: 'center', }}>
													<Col style={{ width: '52%', marginLeft: '7%', }}>
														<Text style={{ color: '#ffffff', fontSize: 15, }}>{t("Membership Valid To")} :</Text>
													</Col>

													<Col style={{ marginRight: '4%', marginLeft: '4%', justifyContent: 'center', alignItems: 'center', borderColor: '#ffffff', borderWidth: 1, borderRadius: 15 }}>
														<TextInput style={{ color: '#ffffff', fontSize: 15, height: normalize(28) }}
															placeholderTextColor="#ffffff"
															placeholder={t("Select Date")}
															editable={false}
														>
															{this.state.MembershipValidToDate}
														</TextInput>
													</Col>
													<DateTimePicker
														isVisible={this.state.isVisible_TO}
														onConfirm={this.handler_To}
														onCancel={this.hide_To}
														mode='date'
														minimumDate={today}	
													/>
												</Row> */}

											</CollapseBody>
										</Collapse>

									</Col>

									<TouchableOpacity style={styles.signup_btn} onPress={this.signup.bind(this)}>
										<Row style={styles.btn_container}>
											<Text style={styles.signup_text}>{t("Submit")}</Text>
										</Row>
									</TouchableOpacity>
									{/* <Dialog
                                align= 'center' 
                                visible={this.state.visible}
                                width={0.9}
                                dialogAnimation={new SlideAnimation({
                                slideFrom: 'bottom'})}
                                dialogTitle={<DialogTitle title="Alert" />}
                                footer={
                                  <DialogFooter>
                                    <DialogButton
                                      text="OK"
                                      onPress={() => {this.setState({visible: false}); }}
                                    />
                                  </DialogFooter>
                                }
                                >
                                <DialogContent>
                                <Text>{this.state.validationError}</Text>
                                
                                </DialogContent>
							</Dialog> */}

									<Row style={{ marginRight: '20%', marginLeft: '20%', marginTop: '5%', justifyContent: 'center', alignItems: 'center', }}>
										<Col style={{ width: '80%', }}>
											<Text style={{ color: 'gray', fontSize: 14, fontFamily: 'Poppins-Regular'}}>
												{t("Already have an Account?")}
											</Text>
										</Col>
										<Col style={{ width: '20%', }}>
											<TouchableOpacity style={{ height: normalize(30), width: normalize(70), justifyContent: 'center', alignItems: 'center', }} onPress={() => this.props.navigation.navigate('LoginPage')}>
												<Text style={{ color: '#ffffff', fontSize: 16, textDecorationLine: 'underline', fontFamily: 'Poppins-Medium' }}>{t("Login")}</Text>
											</TouchableOpacity>
										</Col>
									</Row>
								</Col>
							</ScrollView>
							{/* <DateTimePicker
								isVisible={this.state.isVisible_valid}
	                            onConfirm={this.handler_valid}
	                            onCancel={this.hide_valid}
	                            mode='date'
	                            minimumDate={today}
						    /> */}

						</KeyboardAvoidingView>
					</ImageBackground>
					<DropdownAlert ref={ref => (this.dropdown = ref)} />
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		justifyContent: 'center'
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
	image:
	{
		height: 120,
		width: 120,
		alignSelf: 'center',
		justifyContent: 'center',
	},
	TextareaContainer:
	{
		height: "100%",
		borderRadius: 10,
		backgroundColor: 'gray',
		opacity: 0.6,
		paddingLeft: 15,
		fontSize: 20,
	},
	Textarea:
	{
		textAlignVertical: 'top',
		fontSize: 14,
		color: "#ffffff",
	},
	container:
	{
		flex: 1,
	},
	bg_image:
	{
		flex: 1,
		resizeMode: 'stretch',
		//position: 'absolute',
		left: 0,
		top: 0,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	headercontainer:
	{
		height: "11%",
		marginTop: "30%",
		marginBottom: "10%",
	},
	header:
	{
		flex: 1,
		fontSize: 35,
		color: 'white',
		opacity: 0.5,
		textAlign: 'center',
		alignSelf: 'center',
	},
	input:
	{
		//height: '3%',
		//marginBottom: "3%", 
		marginLeft: "5%",
		marginRight: "5%",
		marginTop: '2%',
		backgroundColor: 'gray',
		opacity: 0.6,
		borderRadius: 10,
	},
	user_input:
	{
		justifyContent: 'center',
		width: '85%',
	},
	text_input:
	{
		fontSize: 18,
		color: 'white',
		paddingLeft: 15,
		justifyContent: 'center',
	},
	input_icon:
	{
		justifyContent: 'center',
		alignItems: "center",
		marginRight: "5%",
		width: '15%',
	},
	icon_image:
	{
		height: normalize(20),
		width: normalize(20),
		//opacity: 0.4,
	},
	Textarea:
	{
		textAlignVertical: 'top',  // hack android
		height: 170,
		fontSize: 14,
		color: '#333',
	},
	signup_btn:
	{
		backgroundColor: '#F1C40E',
		alignItems: 'center',
		borderRadius: 20,
		//height: '9%',
		marginTop: '8%',
		alignItems: 'center',
		marginRight: '5%',
		marginLeft: '5%',
	},
	btn_container:
	{
		//justifyContent: 'center',
		alignItems: 'center',
		height: 40,
	},
	signup_text:
	{
		color: '#000000',
		fontSize: 18,
		justifyContent: 'center',
		alignItems: 'center',
		fontFamily: 'Poppins-Medium'
	},
	back_arrow: {
		...Platform.select({
			ios: {
				marginLeft: normalize(30),
				marginTop: normalize(25),
			},
			android: {
				marginLeft: normalize(25),
				marginTop: normalize(15),
			},
		})
	},
	radio: {
		...Platform.select({
			ios: {
				width: normalize(35),
				borderWidth: 1,
				marginRight: normalize(10),
				borderRadius: normalize(35),
				height: normalize(35),
				borderColor: '#ffffff',
			}
		})
	},
	radio_col: {
		...Platform.select({
			ios: {
				marginLeft: normalize(17),
				flexDirection: 'row',
				alignItems: 'center',
				width: '35%',
				justifyContent: 'flex-end',
			},
			android: {
				marginLeft: normalize(6),
				flexDirection: 'row',
				alignItems: 'center',
				width: '35%',
				justifyContent: 'flex-end',
			},
		})
	},
	user_col: {
		...Platform.select({
			ios: {
				width: (48),
				alignItems: 'center',
				justifyContent: 'center',
			},
			android: {
				width: (45),
				marginRight: '0.3%',
				alignItems: 'center',
				justifyContent: 'center',
			},
		})
	},
});