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
import { not } from 'react-native-reanimated';
import { nutritionlistAction } from '../../../util/action';
import { t } from '../../../../locals';



const { width, height } = Dimensions.get("screen");
export default class nutritionschudule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            data: [],
            loader: false,
        };

    }
    componentDidMount() {
        // this.setState({ loader: true });
        // this.setState({ loader: true });
        const { navigation } = this.props;
        // this.setState({ loader: true })
        this.nutritionlist();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.nutritionlist();
        });
        // this.setState({ loader: false })

    }

    onRefresh() {
        this.setState({ dataSource: [] });
        this.nutritionlist();
    }

    async nutritionlist() {
        this.setState({ loader: true });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const userData = {
            "current_user_id": Id,
            "access_token": Token,
        };
        nutritionlistAction(userData).then(responseJson => {
            if (responseJson.status == 1) {
                this.setState({
                    dataSource: responseJson.result,
                    loader: false,
                });
                this.show(this.state.dataSource)
            } else {
                this.setState({ loader: false });
            }
        });
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

    _handleBackButtonClick = () => this.props.navigation.navigate('Nutritionplan')
    show(d) {
        const start = this.props.navigation.getParam('paramKey1', '2021-01-01');
        const end = this.props.navigation.getParam('paramKey2', '2021-01-01');
        const x = Object.entries(d).map((item) => item);
        for (var i = 0; i < x.length; i++) {
            if (x[i][1].start_date === start) {
                this.setState({ data: Object.entries(x[i][1].nutrition_data).map((item1) => item1) });
                break;
            }
        }
        //this.setState({data:Object.entries(x[2][1]).map((item1)=>item1)});
    }
    showString(str) {
        var str1 = str.toString().replace("\"", "")
        str1 = str1.replace("\"", "")
        var str2 = str1.split(":")
        return str2
    }
    renderItem1 = ({ item }) => {
        return (

            <Row style={{ flex: 1, justifyContent: 'flex-start', marginLeft: normalize(20), marginRight: normalize(20), marginTop: normalize(5) }}>
                <Col style={{ width: normalize(135) }}>
                    <Text style={{ fontSize: 14, fontFamily:'Poppins-Medium', color: '#333333' }}>{this.showString(item)[0]}</Text>
                </Col>
                <Col style={{ alignItems: 'center', width: normalize(20) }}>
                    <Text style={{ fontSize: 14, fontFamily:'Poppins-Medium', color: '#777777' }}>:</Text>
                </Col>
                <Col style={{ width: normalize(135) }}>
                    <Text style={{ fontSize: 14, fontFamily:'Poppins-Medium', color: '#777777' }}>{this.showString(item)[1].replace(" ", "")}</Text>
                </Col>
            </Row>

        )
    }
    renderItem = ({ item }) => {
        return (
            <ScrollView style={styles.container}>

                <Row style={{ backgroundColor: '#FCFBFB', marginTop: normalize(12), marginLeft: normalize(25), marginRight: normalize(25), marginBottom: normalize(3), borderRadius: normalize(15), borderWidth: 1, borderColor: '#D0D0D0' }}>
                    <Col>
                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: normalize(30), backgroundColor: '#FCFBFB', borderTopRightRadius: normalize(15), borderTopLeftRadius: normalize(15), borderColor: '#D0D0D0', borderBottomWidth: 1 }}>
                            <Text style={{ color: '#102b46', fontFamily:'Poppins-SemiBold', fontSize: 16, }}>{item[0]}</Text>
                        </Row>
                        <FlatList
                            data={item[1]}
                            renderItem={this.renderItem1}
                            keyExtractor={(item1) => item1.toString()}
                        />
                    </Col>
                </Row>
            </ScrollView>
        )
    }
    render() {

        const { navigate } = this.props.navigation;
        const { dataSource, loader } = this.state;

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
                            <TouchableOpacity onPress={() => navigate("Nutritionplan")} style={styles.back_arrow} >
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("Nutrition Schedule List")}</Text>
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
                        data={this.state.data}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.toString()}
                        ListEmptyComponent={
                            <EmptyComponent title={t("Data not available")} />
                        }
                        refreshControl={
                            <RefreshControl
                                colors={["#102b46"]}
                                refreshing={false}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    />
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
                            <TouchableOpacity onPress={() => navigate("Nutritionplan")} style={styles.back_arrow} >
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("Nutrition Schedule List")}</Text>
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

    container:
    {
        flex: 1,
        backgroundColor: '#fff',
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
                width: normalize(200)
            },
            android: {
                justifyContent: 'center',
                alignItems: 'center',
                width: normalize(190)
            }
        })

    },
})