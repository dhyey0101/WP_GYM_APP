import React, { Component } from 'react';
import {
    ActivityIndicator,
    BackHandler,
    AsyncStorage,
    RefreshControl,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Button,
    FlatList,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Platform,
    Dimensions,
    Modal,
} from 'react-native';
import normalize from 'react-native-normalize';
import { Col, Row } from 'react-native-easy-grid';
import { NavigationEvents } from 'react-navigation';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { noticeListAction, viewNoticeAction } from '../../../util/action';
import moment from 'moment';
import { t } from '../../../../locals';


const { width, height } = Dimensions.get("screen");
const { member, token } = "";
export default class Notice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loader: false,
            dataSource: [],
            noticedata: [],
            data: [],
            show: false,
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

    componentDidMount() {
        const { navigation } = this.props;
        this.setState({ loader: true })
        this.noticeList();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.noticeList();
        });
        this.setState({ loader: false })

    }

    onRefresh() {
        this.setState({ dataSource: [], noticedata: [] });
        this.noticeList();
    }


    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }
    showPopup = (nid) => {
        this.viewNotice(nid);
    }
    closePopup = () => {
        this.setState({ show: false });
        this.notid = "";
    }
    _handleBackButtonClick = () => this.props.navigation.navigate('Dashboard')

    componentDidMount() {
        this.noticeList();
    }

    async noticeList() {
        this.setState({ loader: true });
        const Member = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");
        this.member = Member;
        this.token = Token;
        const userData = {
            "current_user_id": Member,
            "access_token": Token,
        };
        noticeListAction(userData).then(responseJson => {
            console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    dataSource: responseJson.result,
                    loader: false,
                });
                this.rendershow();
            }
            else {
                this.setState({ loader: false });
            }
        });
    }
    viewNotice(nid = null) {
        const userData = {
            "notice_id": nid,
            "current_user_id": this.member,
            "access_token": this.token,
        };
        viewNoticeAction(userData).then(responseJson => {
            console.log(responseJson)
            if (responseJson.status === 1) {
                this.setState({
                    show: true,
                    noticedata: responseJson.result,
                });
            }
        });
    }
    renderItem = ({ item }) => {
        const { show, noticedata } = this.state;
        return (
            <View style={styles.container}>

                <Row style={{ height: normalize(65), backgroundColor: '', marginRight: normalize(25), marginLeft: normalize(25), marginTop: normalize(20), borderBottomWidth: 0.7, borderBottomColor: '#777777' }}>
                    <Col style={{ width: '13%', paddingBottom: normalize(20) }}>
                        <View style={{ height: normalize(46), width: normalize(46), justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#102B46', padding: normalize(5), borderRadius: 23 }}>
                            <Image style={{ alignSelf: 'center', height: normalize(25), width: normalize(25) }}
                                source={require("../../../images/Logo.png")}
                            />
                        </View>
                    </Col>
                    <Col style={{ width: '55%', justifyContent: 'center', paddingBottom: normalize(20) }}>
                        <View style={{ marginLeft: normalize(20) }}>
                            <Text numberOfLines={5} style={{ color: '#102B46', fontStyle: 'Poppins-Medium', fontSize: 15 }}>{item[1].notice_title}</Text>
                            <Text style={{ fontSize: 12, color: '#777777', fontStyle: 'Poppins-Regular' }}>{item[1].start_date}  |  {item[1].notice_for} </Text>
                        </View>
                    </Col>
                    <Col style={{ width: '32%', justifyContent: 'center', alignSelf: 'center', marginBottom: normalize(10) }}>
                        <TouchableHighlight onPress={() => this.showPopup(item[1].notice_id)}
                            underlayColor={'#F1C40E'}
                            style={{ justifyContent: 'center', alignItems: 'center', marginLeft: normalize(10), height: normalize(35), width: normalize(95), borderWidth: 1, borderRadius: normalize(20), borderColor: '#102B46' }}>
                            <Text style={{ marginBottom: '3%', color: '#102B46', fontSize: 16, fontStyle: 'Poppins-Medium' }}>{t("View")}</Text>
                        </TouchableHighlight>

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={show} >
                            <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ height: "55%", width: "85%", backgroundColor: '#fff', borderRadius: 20, margin: '10%' }}>
                                    <Row style={{ height: "20%", position: 'relative', borderBottomWidth: 0.5, borderBottomColor: '#8A8B8B', }}>
                                        <Col style={{ paddingLeft: "10%", width: "83%", backgroundColor: '', borderTopLeftRadius: 20, justifyContent: 'center', }}>
                                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 17, color: '#102B46' }}>{noticedata.notice_title}</Text>
                                        </Col>
                                        <Col>
                                            <TouchableOpacity style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={this.closePopup}>
                                                <Image
                                                    style={{ height: 20, width: 20, }}
                                                    source={require('../../../images/Close-blue-512.png')} />
                                            </TouchableOpacity>
                                        </Col>
                                    </Row>
                                    <Row style={{ height: "15%", alignItems: 'center', marginTop: '1%', paddingLeft: "10%", }}>

                                        <Col>
                                            <Text style={{ color: '#102B46', fontFamily: 'Poppins-Medium', fontSize: 15 }}>{t("Start Date")}</Text>
                                            <Text style={{ color: '#777777', fontFamily: 'Poppins-Medium', fontSize: 14 }}>{noticedata.start_date}</Text>
                                        </Col>
                                        <Col>
                                            <Text style={{ color: '#102B46', fontFamily: 'Poppins-Medium', fontSize: 15 }}>{t("End Date")}</Text>
                                            <Text style={{ color: '#777777', fontFamily: 'Poppins-Medium', fontSize: 14 }}>{noticedata.end_date}</Text>
                                        </Col>
                                    </Row>
                                    <Row style={{ height: '15%', alignItems: 'center', paddingLeft: '10%', }}>

                                        <Image source={require("../../../images/Member_icon.png")} style={{ height: normalize(20), width: normalize(20), borderRadius: 30, borderWidth: 1 }} />

                                        <Text style={{ color: '#777777', marginLeft: '3%', fontFamily: 'Poppins-Medium', fontSize: 14 }}>{noticedata.notice_for} {t("Members")}</Text>
                                    </Row>
                                    <Row style={{ height: '40%', marginLeft: '10%', marginTop: '2%', marginRight: '10%', borderRadius: 7, borderWidth: 0.5, borderColor: '#777777' }}>
                                        <ScrollView style={{ marginHorizontal: 7, marginVertical: 7 }}><Text style={{ color: '#777777', fontFamily: 'Poppins-Regular', fontSize: 15 }}>{noticedata.notice_content}</Text></ScrollView>
                                    </Row>
                                </View>
                            </View>
                        </Modal>

                    </Col>
                </Row>

            </View>

        );
    }
    rendershow() {
        if (this.state.dataSource) {
            const x = Object.entries(this.state.dataSource).map((item) => item)
            this.setState({ data: x })
        }
    }
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
                    <StatusBar />
                    <Row style={styles.NaveBar}>
                        <Col>
                            <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={styles.menu_col}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Menu-white.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col>
                            <TouchableOpacity onPress={() => navigate('Dashboard')} style={styles.back_arrow}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("Notice List")}</Text>
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

                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                colors={["#102b46"]}
                                refreshing={this.state.loader}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    >
                        <FlatList
                            data={this.state.data}
                            keyExtractor={(item) => item.toString()}
                            renderItem={this.renderItem}
                            /*ListEmptyComponent={
                                <EmptyComponent title="Data not available." />
                            }*/
                            refreshControl={
                                <RefreshControl
                                    colors={["#102b46"]}
                                    refreshing={false}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                        />
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
                            <TouchableOpacity onPress={() => navigate('Dashboard')} style={styles.back_arrow}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("Notice List")}</Text>
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
const EmptyComponent = ({ title }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{title}</Text>
    </View>
);
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