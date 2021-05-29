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
} from 'react-native';
import normalize from 'react-native-normalize';
import { Col, Row } from 'react-native-easy-grid';
import { NavigationEvents } from 'react-navigation';
import { staffMemberListAction } from '../../../util/action.js';
import { t } from '../../../../locals';

const { width, height } = Dimensions.get("screen");

export default class StaffMemberList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            ImageLoading:false,
            dataSource: [],
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
        this.StaffMemberList();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.StaffMemberList();
        });
        this.setState({ loader: false })
    }

    async StaffMemberList() {
        this.setState({ loader: true });
        const Id = await AsyncStorage.getItem("id");
        const member_id = await AsyncStorage.getItem("member");
        const Token = await AsyncStorage.getItem("access_token");
        const loginData = {
            "current_user_id": Id,
            "member_id": "member",
            "access_token": Token,
        };
        console.log(loginData);
        staffMemberListAction(loginData).then(responseJson => {
            console.log(responseJson)
            if (responseJson.status == 1) {

                this.setState({
                    dataSource: responseJson.result,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
            }
        });
    }
    onRefresh() {
        this.setState({ dataSource: [] });
        this.StaffMemberList();
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

    // render item for flatlist
    renderItem = ({ item }) => {
        const { loader, dataSource } = this.state;


        return (
            <View style={styles.mainContainer}>
                <View>
                    <Row style={{ backgroundColor: '', borderBottomWidth: 0.5, borderBottomColor: 'gray', marginRight: '3%', marginLeft: '3%', height: 95 }}>
                        <Col style={{ backgroundColor: '', width: '23%', justifyContent: 'center', alignItems: 'center' }}>
                            <Col style={{ backgroundColor: '', borderWidth: 1, height: 70, width: 70, borderRadius: 50 }}>
                                <Image
                                    onLoadStart={(e) => this.setState({ ImageLoading: true })}
                                    onLoadEnd={(e) => this.setState({ ImageLoading: false })}
                                    source={item.staff_image ? { uri: item.staff_image } : null}
                                    style={{ height: 68, width: 68, borderRadius: 50 }}
                                />
                                <ActivityIndicator
                                style={styles.loading}
                                animating={this.state.ImageLoading}
                                size="small"
                                color="#102b46"
                                />
                            </Col>
                        </Col>
                        <Col style={{ backgroundColor: '', justifyContent: 'center' }}>
                            <Row style={{ height: '21%', }}>
                                <Text style={{ fontFamily:'Poppins-Medium', fontSize: 15, color: '#102b46', paddingLeft: '3%', }}>{item.staff_name}</Text>
                            </Row>
                            <Row style={{ height: '21%', }}>
                                <Col style={{ backgroundColor: '', }}>
                                    <Text style={{ color: 'gray', fontSize: 12, fontFamily:'Poppins-Regular', paddingLeft: '3%', }}>{item.email}</Text>
                                </Col>
                            </Row>
                            <Row style={{ height: '21%', }}>
                                <Col style={{ backgroundColor: '', }}>
                                    <Text style={{ color: 'gray', fontSize: 12, fontFamily:'Poppins-Regular', paddingLeft: '3%', }}>{item.mobile}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </View>
            </View>
        );
    };

    render() {
        const { loader, dataSource } = this.state;
        const { navigate } = this.props.navigation;
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
                            <TouchableOpacity onPress={() => navigate("Dashboard")} style={styles.back_arrow}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("Staff Member")}</Text>
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

                    <FlatList
                        data={this.state.dataSource}
                        renderItem={this.renderItem}
                        // renderItem={({item}) => <Text> {item.title}</Text>}
                        keyExtractor={(item) => item.staff_id.toString()}
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

                </View>
            );
        } else {
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
                            <TouchableOpacity onPress={() => navigate("Dashboard")} style={styles.back_arrow}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("Staff Member")}</Text>
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
        fontFamily:'Poppins-Regular',
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
        fontFamily:'Poppins-Regular',
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