import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { Component } from 'react';
import { ActivityIndicator , Platform, View, StyleSheet, Image, Text, TouchableOpacity, AsyncStorage, ScrollView, Button, TextInput, StatusBar, ImageBackground, Dimensions, Alert } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import normalize from 'react-native-normalize';
import { not } from 'react-native-reanimated';
import { singleMemberAction } from "../../util/action.js";
import DropdownAlert from 'react-native-dropdownalert';
import {t} from '../../../locals';

const { width, height } = Dimensions.get('screen');
export default class CustomSidebarMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            ImageLoading:false,
            dataSource: [],
            user_image:'',
            First_Name:'',
            Last_Name: '',
            user_Address:'',
            user_City: '',
        };

    }

    async UNSAFE_componentWillMount() {
    }

    logout = async () => {
        Alert.alert(
            "Gym App",
            "Are you sure you want to exit?",
            [
              {
                text: "No",
                onPress: () =>  this.props.navigation.navigate('Dashboard'),
                style: "cancel"
              },
              { text: "Yes", onPress: () => this.props.navigation.navigate('Auth')}
            ]
          );
        await AsyncStorage.removeItem('userid');
        // await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('mobile');
        await AsyncStorage.removeItem('access_token');
        // await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('is_payment_method_save');
        await AsyncStorage.removeItem('payment_gateway_token');
        
        // Alert.alert(
		// 			'Logout',
		// 			'You are Now Logout from Device.',
		// 		);
    };
    /** Open / close sidemenu */
    toggleDrawer = (navigation) => {
        this.props.navigation.closeDrawer();    
    };

    
    async image(){
        this.setState({ loader: true })
        const userImage = await AsyncStorage.getItem("profile_image"); 
        const FirstName = await AsyncStorage.getItem("first_name"); 
        const LastName = await AsyncStorage.getItem("Last_name"); 
        const City = await AsyncStorage.getItem("City_name"); 
        const Address = await AsyncStorage.getItem("Address");
        // const userImage = await AsyncStorage.getItem("city_name"); 
        
        this.setState({
            user_image: userImage,
            First_Name: FirstName,
            Last_Name: LastName,
            user_City: City,
            user_Address: Address,

        }); 
        this.setState({ loader: false })
    }
    async componentDidMount() {
        const { navigation } = this.props;
        this.setState({ loader: true })
        this.image();
        
        this.setState({ loader: false })
    }

    async componentDidUpdate() {
        // this.setState({ loader: true })
        const userImage = await AsyncStorage.getItem("profile_image");
        const FirstName = await AsyncStorage.getItem("first_name"); 
        const LastName = await AsyncStorage.getItem("Last_name");
        const City = await AsyncStorage.getItem("City_name"); 
        const Address = await AsyncStorage.getItem("Address");

        this.setState({
            user_image: userImage,
            First_Name: FirstName,
            Last_Name: LastName,
            user_City: City,
            user_Address: Address,
        }); 
        // this.setState({ loader: false })
    }

    // async singleMember() {
    //     this.setState({ loader: true })
    //     const Id = await AsyncStorage.getItem("id");
    //     const Token = await AsyncStorage.getItem("access_token");

    //     const userData = {
    //         "member_id": Id,
    //         "access_token": Token,
    //     };
        
    //     singleMemberAction(userData).then(responseJson => {
    //         console.log(responseJson);
    //         if (responseJson.status == 1) {
    //             this.setState({
    //                 dataSource: responseJson.result,
    //                 loader: false,
    //             });
    //         } else {
    //             this.setState({ loader: false });
    //         }
    //     });
    // }
    /** Design part of page */
    render() {
        const { navigate } = this.props.navigation;
        const { loader , dataSource , user_image , First_Name , Last_Name , user_Address , user_City} = this.state;

        return (
            <View style={styles.container}>

                <StatusBar />
                {/* <ImageBackground source={require('../../images/Sidemenu-BG.png')} resizeMode='cover' style={styles.backgroundImage}> */}
                <Row style={styles.NavRow}>

                    <Col style={styles.NavColImg}>
                        <TouchableOpacity style={styles.back_arrow} onPress={this.toggleDrawer.bind(this)}>
                            <Image source={require('../../images/Close-white-512.png')} style={styles.Close} />
                        </TouchableOpacity>
                    </Col>
                </Row>
                <TouchableOpacity style={styles.ProfileRow} onPress={() => navigate('Account')}>
                    {(this.state.user_City == null) ? (
                            <Row>
                                <Col style={styles.ProfileContainer}>
                                    <Row style={{ borderWidth: 1, borderRadius: 30, height: 60, width: 60, justifyContent:'center', alignItems:'center' }}>
                                    <Image
                                        onLoadStart={(e) => this.setState({ ImageLoading: true })}
                                        source={{uri: user_image}}
                                        onLoadEnd={(e) => this.setState({ ImageLoading: false })} 
                                        style={styles.UserProfile} />
                                        <ActivityIndicator
                                            style={styles.loading}
                                            animating={this.state.ImageLoading}
                                            size="small"
                                            color="#102b46"
                                        />
                                    </Row>
                                </Col>
                                <Col>
                                    <Row style={styles.ProfileName}>
                                        <Text style={styles.sideNavText}>{First_Name} {Last_Name}</Text>
                                    </Row>
                                    <Row>
                                        <Text style={{fontSize: 16, fontFamily:'Poppins-Medium', color: '#fff'}}>{user_Address}</Text>
                                    </Row>
                                </Col>
                            </Row>  
                    ) : (
                            <Row>
                                <Col style={styles.ProfileContainer}>
                                    <Row style={{ borderWidth: 1, borderRadius: 30, height: 60, width: 60, justifyContent:'center', alignItems:'center' }}>
                                    <Image
                                        onLoadStart={(e) => this.setState({ ImageLoading: true })}
                                        source={{uri: this.state.user_image}}
                                        onLoadEnd={(e) => this.setState({ ImageLoading: false })} 
                                        source={{uri: user_image}}
                                        style={styles.UserProfile} />
                                        <ActivityIndicator
                                            style={styles.loading}
                                            animating={this.state.ImageLoading}
                                            size="small"
                                            color="#102b46"
                                        />
                                    </Row>
                                </Col>
                                <Col>
                                    <Row style={styles.ProfileName}>
                                        <Text style={styles.sideNavText}>{First_Name} {Last_Name}</Text>
                                    </Row>
                                    <Row>
                                        <Text style={{fontSize: 16, fontFamily:'Poppins-Medium', color: '#fff'}}>{user_Address} , {user_City}</Text>
                                    </Row>
                                </Col>
                            </Row>
                    )}
                </TouchableOpacity>
                    
                <Col style={{marginBottom:"2%"}}>
                    <ScrollView>
                    <TouchableOpacity onPress={() => navigate('Dashboard')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Dashboard-White.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Dashboard")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('StaffMemberList')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Staff-Member-white.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Staff Member")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('MemberShipList')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Membership-Type-White.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Membership Type")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('groupList')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Group-White.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Group")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('Member')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Staff-Member-white.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Member")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('ActivityList')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Class-Schedule-White.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Activity")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('Schedule')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Date.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Class Schedule")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('AssignWorkoutsList')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Workout-White.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Assign Workouts")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('Workouts')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Workout-White.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Workouts")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('addmeasurement')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Measurement-white.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Measurement")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('Feespayment')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Fees-Payment-White.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Fee Payment")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('Message')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Message-white.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Message")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigate('Notice')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Notice-White.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Notice")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('Nutritionplan')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Nutrition-White.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Nutrition Schedule")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => navigate('Event')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Events-White.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>Events</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => navigate('Account')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Account-White.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Account")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('SubscriptionHistory')}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Subscription-White.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Subscription History")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.logout()}>
                        <Row style={styles.DrawerRow}>
                            <Col style={styles.DrawerIcons}>
                                <Image source={require('../../images/Logout-white.png')} style={styles.Close}></Image>
                            </Col>
                            <Col>
                                <Text style={styles.sideNavSubText}>{t("Logout")}</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    
                    </ScrollView>
                    <DropdownAlert ref={ref => (this.dropdown = ref)}/>
                </Col>
            </View>
        );
    }
}

/** CSS */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#102B46',
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
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    text: {
        ...Platform.select({
            ios: {
                marginTop: 3,
                color: '#4f603c',
                marginLeft: 20,
                height: 40,
                fontWeight: "bold",
                fontStyle: 'italic',
                fontSize: 18,

            },
            android: {
                color: '#4f603c',
                marginLeft: 20,
                height: 40,
                fontWeight: "bold",
                fontSize: 18,
                fontStyle: 'italic',

            }
        })
    },

    Close: {
        width: 23,
        height: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },
    UserProfile: {
        borderRadius: 30,
        height: 60,
        width: 60,
    },
    logo: {
        width: 300,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Center: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    Listlogo: {
        ...Platform.select({
            ios: {
                width: 30,
                height: 30,

            },
            android: {
                width: 30,
                height: 30,

            }
        })
    },
    NavRow: {
        ...Platform.select({
            ios: {
                height: normalize(90),
                paddingTop: normalize(25),
            },
            android: {
                height: normalize(65),
            }
        })

    },
    NavCol: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: "20%",
    },
    NavColImg: {
        alignItems: 'flex-end',
    },
    back_arrow: {
        ...Platform.select({
        ios: {
            justifyContent: 'center',
            alignItems: 'center',
            height: normalize(65),
            width: normalize(60)    
        },
        android:{
            justifyContent: 'center',
            alignItems: 'center',
            height: normalize(65),
            width: normalize(60)
        },
      })  
    },
    sideNavText: {        
        textAlign: 'center',
        fontSize: 22,
        fontFamily:'Poppins-Bold',
        color: '#fff'
    },
    sideNavSubText: {
        fontSize: 18,
        fontFamily:'Poppins-Medium',
        color: '#fff'
    },
    ProfileRow:{
        backgroundColor: '#1e4164', 
        height: "16%",
    },
    ProfileContainer: {
        justifyContent: 'center',
        marginLeft: "7%", 
        width: "23%",
    },
    ProfileName: {
        marginTop: '13%', 
        height: "30%", 
        // marginBottom: "5%",
    },
    DrawerRow: {
        marginLeft: '10%', 
        marginTop: "7%", 
        marginRight: '10%', 
        // height: "6%",
    },
    DrawerIcons: {
        width: '15%', 
        height: '8%'
    },
});