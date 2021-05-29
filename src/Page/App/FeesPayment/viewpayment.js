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
    TouchableHighlight,
} from 'react-native';
import normalize from 'react-native-normalize';
import moment from 'moment';
import { singlepaymentDetailsAction } from '../../../util/action.js';
import { Col, Row } from 'react-native-easy-grid';
import { NavigationEvents } from 'react-navigation';
import { t } from '../../../../locals';

const { width, height } = Dimensions.get("screen");
// import PaymentTab from './payment_Tab.js';

export default class viewpayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            paymentSource: [],
            loader: false,
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

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    componentDidMount() {
        this.singlepaymentDetails();
    }

    onRefresh() {
        this.singlepaymentDetails();
        this.setState({ paymentSource: [] });
    }

    async singlepaymentDetails() {
        this.setState({ loader: true });
        const data = this.props.navigation.getParam('memberkey',);
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const payment = {
            "current_user_id": Id,
            "access_token": Token,
            "mp_id": data,
        };
        singlepaymentDetailsAction(payment).then(responseJson => {
            console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    paymentSource: responseJson.result,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
            }
        });
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('Feespayment')

    render() {

        const { navigate } = this.props.navigation;
        const { paymentSource, loader } = this.state;
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
                            <TouchableOpacity onPress={() => navigate('Feespayment')} style={styles.back_arrow}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("Fees Payment")}</Text>
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
                    {/* <PaymentTab /> */}
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                colors={["#102b46"]}
                                refreshing={this.state.loader}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    >
                        <Row style={{ height: normalize(35), alignItems: 'flex-end', marginLeft: normalize(20) }}>
                            <Text style={{ color: '#102b46', fontSize: 18, fontFamily:'Poppins-Medium' }}>{t("Payment Details")}: </Text>
                        </Row>

                        <Row style={{ height: normalize(55), marginTop: normalize(10), borderBottomWidth: 1, borderColor: '#EAEAEA', marginLeft: normalize(20), marginRight: normalize(20) }}>
                            <Col style={{ width: normalize(45), justifyContent: 'center', marginLeft: normalize(20), marginBottom: normalize(5) }}>
                                <Image style={{ height: 28, width: 28, }}
                                    source={require('../../../images/subscription_menu.png')}
                                />
                            </Col>
                            <Col style={{ marginBottom: normalize(5) }}>
                                <Row style={{ alignItems: 'flex-start', marginTop: normalize(7) }}>
                                    <Text style={{ color: '#102b46', fontFamily:'Poppins-SemiBold', fontSize: 14 }}>{t("Title")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 12, fontFamily:'Poppins-Regular' }}>{paymentSource.membership_title}</Text>
                                </Row>
                            </Col>
                        </Row>

                        <Row style={{ height: normalize(55), marginTop: normalize(10), borderBottomWidth: 1, borderColor: '#EAEAEA', marginLeft: normalize(20), marginRight: normalize(20) }}>
                            <Col style={{ width: normalize(45), justifyContent: 'center', marginLeft: normalize(20), marginBottom: normalize(5) }}>
                                <Image style={{ height: 28, width: 28, }}
                                    source={require('../../../images/Account-Yellow-512.png')}
                                />
                            </Col>
                            <Col style={{ marginBottom: normalize(5) }}>
                                <Row style={{ alignItems: 'flex-start', marginTop: normalize(7) }}>
                                    <Text style={{ color: '#102b46', fontFamily:'Poppins-SemiBold', fontSize: 14 }}>{t("Member Name")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 12, fontFamily:'Poppins-Regular'}}>{paymentSource.member_name}</Text>
                                </Row>
                            </Col>
                        </Row>

                        <Row style={{ height: normalize(55), marginTop: normalize(10), borderBottomWidth: 1, borderColor: '#EAEAEA', marginLeft: normalize(20), marginRight: normalize(20) }}>
                            <Col style={{ width: normalize(45), justifyContent: 'center', marginLeft: normalize(20), marginBottom: normalize(5) }}>
                                <Image style={{ height: 28, width: 28, }}
                                    source={require('../../../images/subscription_payment.png')}
                                />
                            </Col>
                            <Col style={{ marginBottom: normalize(5) }}>
                                <Row style={{ alignItems: 'flex-start', marginTop: normalize(7) }}>
                                    <Text style={{ color: '#102b46', fontFamily:'Poppins-SemiBold', fontSize: 14 }}>{t("Amount")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 12, fontFamily:'Poppins-Regular' }}>{paymentSource.currency_symbol} {paymentSource.membership_amount}</Text>
                                </Row>
                            </Col>
                        </Row>

                        <Row style={{ height: normalize(55), marginTop: normalize(10), borderBottomWidth: 1, borderColor: '#EAEAEA', marginLeft: normalize(20), marginRight: normalize(20) }}>
                            <Col style={{ width: normalize(45), justifyContent: 'center', marginLeft: normalize(20), marginBottom: normalize(5) }}>
                                <Image style={{ height: 28, width: 28, }}
                                    source={require('../../../images/subscription_payment.png')}
                                />
                            </Col>
                            <Col style={{ marginBottom: normalize(5) }}>
                                <Row style={{ alignItems: 'flex-start', marginTop: normalize(7) }}>
                                    <Text style={{ color: '#102b46', fontFamily:'Poppins-SemiBold', fontSize: 14 }}>{t("Paid Amount")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 12, fontFamily:'Poppins-Regular' }}>{paymentSource.currency_symbol} {paymentSource.paid_amount}</Text>
                                </Row>
                            </Col>
                        </Row>

                        <Row style={{ height: normalize(55), marginTop: normalize(10), borderBottomWidth: 1, borderColor: '#EAEAEA', marginLeft: normalize(20), marginRight: normalize(20) }}>
                            <Col style={{ width: normalize(45), justifyContent: 'center', marginLeft: normalize(20), marginBottom: normalize(5) }}>
                                <Image style={{ height: 28, width: 28, }}
                                    source={require('../../../images/subscription_payment.png')}
                                />
                            </Col>
                            <Col style={{ marginBottom: normalize(5) }}>
                                <Row style={{ alignItems: 'flex-start', marginTop: normalize(7) }}>
                                    <Text style={{ color: '#102b46', fontFamily:'Poppins-SemiBold', fontSize: 14 }}>{t("Due Amount")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 12, fontFamily:'Poppins-Regular' }}>{paymentSource.currency_symbol} {paymentSource.due_amount}</Text>
                                </Row>
                            </Col>
                        </Row>

                        <Row style={{ height: normalize(55), marginTop: normalize(10), borderBottomWidth: 1, borderColor: '#EAEAEA', marginLeft: normalize(20), marginRight: normalize(20) }}>
                            <Col style={{ width: normalize(45), justifyContent: 'center', marginLeft: normalize(20), marginBottom: normalize(5) }}>
                                <Image style={{ height: 28, width: 28, }}
                                    source={require('../../../images/subscription_Date.png')}
                                />
                            </Col>
                            <Col style={{ marginBottom: normalize(5) }}>
                                <Row style={{ alignItems: 'flex-start', marginTop: normalize(7) }}>
                                    <Text style={{ color: '#102b46', fontFamily:'Poppins-SemiBold', fontSize: 14 }}>{t("Membership Start Date")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    {/* <Text style={{ color: 'gray', fontSize: 12 }}>{moment(paymentSource.membership_valid_from).format('DD MMMM, YYYY')}</Text> */}
                                    <Text style={{ color: 'gray', fontSize: 12, fontFamily:'Poppins-Regular' }}>{paymentSource.membership_valid_from}</Text>
                                </Row>
                            </Col>
                        </Row>

                        <Row style={{ height: normalize(55), marginTop: normalize(10), borderBottomWidth: 1, borderColor: '#EAEAEA', marginLeft: normalize(20), marginRight: normalize(20) }}>
                            <Col style={{ width: normalize(45), justifyContent: 'center', marginLeft: normalize(20), marginBottom: normalize(5) }}>
                                <Image style={{ height: 28, width: 28, }}
                                    source={require('../../../images/subscription_Date.png')}
                                />
                            </Col>
                            <Col style={{ marginBottom: normalize(5) }}>
                                <Row style={{ alignItems: 'flex-start', marginTop: normalize(7) }}>
                                    <Text style={{ color: '#102b46', fontFamily:'Poppins-SemiBold', fontSize: 14 }}>{t("Membership End Date")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    {/* <Text style={{ color: 'gray', fontSize: 12 }}>{moment(paymentSource.membership_valid_to).format('DD MMMM, YYYY')}</Text> */}
                                    <Text style={{ color: 'gray', fontSize: 12, fontFamily:'Poppins-Regular' }}>{paymentSource.membership_valid_to}</Text>
                                </Row>
                            </Col>
                        </Row>

                        <Row style={{ height: normalize(55), marginTop: normalize(10), borderBottomWidth: 1, borderColor: '#EAEAEA', marginLeft: normalize(20), marginRight: normalize(20), marginBottom: normalize(30) }}>
                            <Col style={{ width: normalize(45), justifyContent: 'center', marginLeft: normalize(20), marginBottom: normalize(5) }}>
                                <Image style={{ height: 28, width: 28, }}
                                    source={require('../../../images/sand-clock-Yellow-512.png')}
                                />
                            </Col>
                            <Col style={{ marginBottom: normalize(5) }}>
                                <Row style={{ alignItems: 'flex-start', marginTop: normalize(7) }}>
                                    <Text style={{ color: '#102b46', fontFamily:'Poppins-SemiBold', fontSize: 14 }}>{t("Payment Status")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 12, fontFamily:'Poppins-Regular' }}>{paymentSource.payment_status}</Text>
                                </Row>
                            </Col>
                        </Row>
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
                            <TouchableOpacity onPress={() => navigate('Feespayment')} style={styles.back_arrow}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("Fees Payment")}</Text>
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
        fontFamily:'Poppins-Regular'
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