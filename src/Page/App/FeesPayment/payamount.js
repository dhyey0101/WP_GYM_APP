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
import { Col, Row } from 'react-native-easy-grid';
import normalize from 'react-native-normalize';
import { not } from 'react-native-reanimated';
import { NavigationEvents } from 'react-navigation';
import { t } from '../../../../locals';

const { width, height } = Dimensions.get("screen");


export default class payamount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
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
        this.setState({ data });
        const data = this.props.navigation.getParam('memberkey',);
        this.setState({ data });
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('Feespayment')

    render() {

        const { navigate } = this.props.navigation;
        const { loader } = this.state;
        console.log(this.state);
        if (!loader) {
            return (
                <View style={styles.container}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                colors={["#102b46"]}
                                refreshing={this.state.loader}
                            // onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    >
                        <Row style={{ height: normalize(35), alignItems: 'flex-end', marginLeft: normalize(20) }}>
                            <Text style={{ color: '#102b46', fontSize: 17, fontWeight: 'bold', }}>{t("Payment Details")}: </Text>
                        </Row>

                        <Row style={{ height: normalize(55), marginTop: normalize(10), borderBottomWidth: 1, borderColor: '#EAEAEA', marginLeft: normalize(20), marginRight: normalize(20) }}>
                            <Col style={{ width: normalize(45), justifyContent: 'center', marginLeft: normalize(20), marginBottom: normalize(5) }}>
                                <Image style={{ height: 28, width: 28, }}
                                    source={require('../../../images/subscription_menu.png')}
                                />
                            </Col>
                            <Col style={{ marginBottom: normalize(5) }}>
                                <Row style={{ alignItems: 'flex-start', marginTop: normalize(7) }}>
                                    <Text style={{ color: '#102b46', fontWeight: 'bold', fontSize: 13 }}>{t("Title")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 11 }}>{t("Platinum Membership")}</Text>
                                </Row>
                            </Col>
                        </Row>

                        <Row style={{ height: normalize(55), marginTop: normalize(10), borderBottomWidth: 1, borderColor: '#EAEAEA', marginLeft: normalize(20), marginRight: normalize(20) }}>
                            <Col style={{ width: normalize(45), justifyContent: 'center', marginLeft: normalize(20), marginBottom: normalize(5) }}>
                                <Image style={{ height: 30, width: 30, }}
                                    source={require('../../../images/Account-Yellow-512.png')}
                                />
                            </Col>
                            <Col style={{ marginBottom: normalize(5) }}>
                                <Row style={{ alignItems: 'flex-start', marginTop: normalize(7) }}>
                                    <Text style={{ color: '#102b46', fontWeight: 'bold', fontSize: 13 }}>{t("Member Name")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 11 }}>Dhrumil Adeshara</Text>
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
                                    <Text style={{ color: '#102b46', fontWeight: 'bold', fontSize: 13 }}>{t("Amount")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 11 }}>$ 500</Text>
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
                                    <Text style={{ color: '#102b46', fontWeight: 'bold', fontSize: 13 }}>{t("Paid Amount")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 11 }}>$ 505</Text>
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
                                    <Text style={{ color: '#102b46', fontWeight: 'bold', fontSize: 13 }}>{t("Due Amount")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 11 }}>$ 5</Text>
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
                                    <Text style={{ color: '#102b46', fontWeight: 'bold', fontSize: 13 }}>{t("Membership Start Date")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 11 }}>08 october,2020</Text>
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
                                    <Text style={{ color: '#102b46', fontWeight: 'bold', fontSize: 13 }}>{t("Membership End Date")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 11 }}>30 october,2020</Text>
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
                                    <Text style={{ color: '#102b46', fontWeight: 'bold', fontSize: 13 }}>{t("Payment Status")}</Text>
                                </Row>
                                <Row style={{ alignItems: 'flex-end', marginBottom: normalize(7) }}>
                                    <Text style={{ color: 'gray', fontSize: 11 }}>{t("Not Paid")}</Text>
                                </Row>
                            </Col>
                        </Row>
                        <Text style={{ fontSize: 25, color: 'red', }}>{this.state.data}</Text>
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
                height: "9%",
                backgroundColor: '#102b46',
            },
            android: {
                height: "7%",
                backgroundColor: '#102b46',
                justifyContent: 'center',
                alignItems: 'center',
            }
        })

    },
    Naveicon:
    {
        height: 20,
        width: 20,
    },
    NaveText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
})