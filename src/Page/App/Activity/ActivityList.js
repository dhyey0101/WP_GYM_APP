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
    Share,
} from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import normalize from 'react-native-normalize';
import { activityListAction } from '../../../util/action.js';
import { NavigationEvents } from 'react-navigation';
import { t } from '../../../../locals';

const { width, height } = Dimensions.get("screen");
export default class ActivityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
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
        this.ActivityList();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.ActivityList();
        });
        this.setState({ loader: false })
    }
    async ActivityList() {
        this.setState({ loader: true });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const Data = {
            "current_user_id": Id,
            "access_token": Token,
        };
        activityListAction(Data).then(responseJson => {
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
        this.ActivityList();
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
        return (
            <View style={styles.mainContainer}>

                <View style={styles.RowContainer}>
                    <Col>
                        <Row style={{ marginLeft: normalize(15), marginTop: normalize(5), }}>
                            <Col>
                                <Text style={styles.MemberShipName}>{item.activity_title}</Text>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: normalize(2),}}>
                            <Col style={{ width: normalize(23), marginLeft: normalize(15), justifyContent: 'center', alignItems: 'flex-start', paddingLeft: normalize(3) }}>
                                <Image style={{ height: normalize(14), width: normalize(14), }}
                                    source={require('../../../images/Category.png')}
                                />
                            </Col>
                            <Col style={{ justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Text style={{ color: '#777777', fontSize: 12 , fontFamily: 'Poppins-Regular'}}>{item.activity_category}</Text>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: normalize(4),}}>
                            <Col style={{ backgroundColor: '', width: normalize(23), marginLeft: normalize(15), justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Image style={{ height: normalize(16), width: normalize(16), }}
                                    source={require('../../../images/General-Training.png')}
                                />
                            </Col>
                            <Col style={{ justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Text style={{ color: '#777777', fontSize: 12 , fontFamily: 'Poppins-Regular'}}>{item.activity_trainer}</Text>
                            </Col>
                        </Row>
                        <Row style={{}}>
                            <Col style={{ backgroundColor: '', width: normalize(23), marginLeft: normalize(15),}}>
                                <Image style={{ height: normalize(17), width: normalize(16), }}
                                    source={require('../../../images/Membership-Type-gray-512.png')}
                                />
                            </Col>
                            <Col style={{ }}>
                                <Text style={{ fontSize: 11, fontFamily: 'Poppins-Regular' ,color: '#777777'}}>{item.membership_list}</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: normalize(10) }}>
                            <Image style={{ width: "100%", borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}
                                source={require('../../../images/trainer.png')}
                            />
                        </Row>
                    </Col>
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
                            <Text style={styles.NaveText}>{t("Activity List")}</Text>
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
                        keyExtractor={(item) => item.activity_id.toString()}
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
                            <Text style={styles.NaveText}>{t("Activity List")}</Text>
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

    mainContainer: {
        // flex: 1,
        justifyContent: "center",
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
        fontFamily: 'Poppins-Regular'
    },
    container:
    {
        flex: 1,
        backgroundColor: '#fff'
    },
    RowContainer: {

        borderWidth: 1,
        marginLeft: normalize(20),
        marginRight: normalize(20),
        borderRadius: normalize(10),
        marginTop: normalize(10),
        marginBottom: normalize(10),
        borderColor: '#777777',
        backgroundColor: '#fcfbfb'

    },
    ImageCol: {
        justifyContent: "center",
        width: "20%"
    },
    ImageContainer: {
        height: 50,
        width: 50,
        borderWidth: 1,
        borderRadius: 30,
        backgroundColor: '#eabf0e',
        alignItems: "center",
        justifyContent: "center",
    },
    MembershipImage: {
        height: 30,
        width: 30,
        borderRadius: 20,
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
    MemberShipName: {
        // marginTop: "10%", 
        color: '#102b46',
        fontSize: 17,
        fontFamily: 'Poppins-Medium'
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