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
import { Col, Row } from 'react-native-easy-grid';
import { NavigationEvents } from 'react-navigation';
import { paymentListAction } from '../../../util/action.js';
import { t } from '../../../../locals';
const { width, height } = Dimensions.get("screen");

export default class feespayment extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            paymentSource: [],
            loader: false,
        };

    }

    componentDidMount() {
        const { navigation } = this.props;
        // this.setState({ loader: true })
        this.paymentList();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.paymentList();
        });
        // this.setState({ loader: false })
    }

    onRefresh() {
        this.paymentList();
        this.setState({ paymentSource: [] });
    }
    async paymentList() {
        this.setState({ loader: true });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const payment = {
            "current_user_id": Id,
            "access_token": Token,
        };
        paymentListAction(payment).then(responseJson => {
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

    _handleBackButtonClick = () => this.props.navigation.navigate('Dashboard')


    // render item for flatlist
    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <Row style={{ backgroundColor: '', height: normalize(130), marginLeft: normalize(25), marginRight: normalize(25), paddingTop: normalize(10), paddingBottom: normalize(15), borderBottomWidth: 1.5, borderBottomColor: '#EFEFEF' }}>
                    <Col style={{ backgroundColor: '', width: '60%', }}>
                        <Col style={{ width: "100%" }}>
                            <Text numberOfLines={5} style={{ color: '#102b46', fontSize: 18, fontFamily:'Poppins-Medium', }}>{item.membership_title}</Text>
                        </Col>
                        <Row>
                            <Col style={{ justifyContent: 'center', width: '50%', backgroundColor: '' }}>
                                <Text style={{ color: 'gray', fontSize: 14, fontFamily:'Poppins-Medium' }}>{t("Amount")}</Text>
                            </Col>
                            <Col style={{ justifyContent: 'center', width: '5%', backgroundColor: '' }}>
                                <Text style={{ color: 'gray', fontSize: 14, fontFamily:'Poppins-Medium', }}>:</Text>
                            </Col>
                            <Col style={{ justifyContent: 'center', alignItems: 'flex-end', width: '45%', backgroundColor: '' }}>
                                <Text style={{ color: 'gray', fontSize: 14, fontFamily:'Poppins-Medium', }}>{item.currency_symbol} {item.amount}</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ justifyContent: 'center', width: '50%', backgroundColor: '' }}>
                                <Text style={{ color: 'gray', fontSize: 14, fontFamily:'Poppins-Medium', }}>{t("Due Amount")}</Text>
                            </Col>
                            <Col style={{ justifyContent: 'center', width: '5%', backgroundColor: '' }}>
                                <Text style={{ color: 'gray', fontSize: 14, fontFamily:'Poppins-Medium', }}>:</Text>
                            </Col>
                            <Col style={{ justifyContent: 'center', alignItems: 'flex-end', width: '45%', backgroundColor: '' }}>
                                <Text style={{ color: 'gray', fontSize: 14, fontFamily:'Poppins-Medium', }}>{item.currency_symbol} {item.due_amount}</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ justifyContent: 'center', width: '50%', backgroundColor: '' }}>
                                <Text style={{ color: 'gray', fontSize: 14, fontFamily:'Poppins-Medium', }}>{t("Status")}</Text>
                            </Col>
                            <Col style={{ justifyContent: 'center', width: '5%', backgroundColor: '' }}>
                                <Text style={{ color: 'gray', fontSize: 14, fontFamily:'Poppins-Medium' }}>:</Text>
                            </Col>
                            <Col style={{ justifyContent: 'center', alignItems: 'flex-end', width: '45%', backgroundColor: '' }}>
                                <Text style={{ color: 'gray', fontSize: 14, fontFamily:'Poppins-Medium' }}>{item.payment_status}</Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col style={{ backgroundColor: '', paddingTop: '5%', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Row>
                            <TouchableHighlight
                                onPress={() => this.props.navigation.navigate('viewpayment', { memberkey: item.membership_id, })}
                                underlayColor={'#F1C40E'}
                                style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#102B46', height: 35, width: 100, borderRadius: 20 }}>
                                <Text style={{ fontSize: 13, fontFamily: 'Poppins-Bold', color: '#102B46', }}>{t("View Details")}</Text>
                            </TouchableHighlight>
                        </Row>
                        <Row>
                            <TouchableHighlight
                                onPress={() => this.props.navigation.navigate('viewinvoice', { memberinvoicekey: item.invoice_id, membership_name : item.membership_title })}
                                underlayColor={'#F1C40E'}
                                style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#102B46', height: 35, width: 100, borderRadius: 20 }}>
                                <Text style={{ fontSize: 13, fontFamily: 'Poppins-Bold' , color: '#102B46', }}>{t("View Invoice")}</Text>
                            </TouchableHighlight>
                        </Row>
                    </Col>
                </Row>
            </View>
        );
    };

    render() {

        const { navigate } = this.props.navigation;
        const { paymentSource, loader } = this.state;

        if (!loader) {
            return (
                <View style={styles.container}>
                    <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <Row style={styles.NaveBar}>
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
                    <Row>
                        <FlatList
                            data={this.state.paymentSource}
                            renderItem={this.renderItem}
                            // renderItem={({item}) => <Text> {item.title}</Text>}
                            keyExtractor={(item) => item.membership_id.toString()}
                            ListEmptyComponent={
                                <EmptyComponent title={t("Data not available")} />
                            }
                            refreshControl={
                                <RefreshControl
                                    colors={["#102b46"]}
                                    refreshing={this.state.loading}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                        />
                    </Row>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                <NavigationEvents
                            onWillFocus={this._onFocus}
                            onWillBlur={this._onBlurr}
                        />
                <Row style={styles.NaveBar}>
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