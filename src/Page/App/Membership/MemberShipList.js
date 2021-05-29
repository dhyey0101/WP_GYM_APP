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
import { memberShipListAction } from '../../../util/action.js';
import { NavigationEvents } from 'react-navigation';
import { t } from '../../../../locals';

const { width, height } = Dimensions.get("screen");

export default class MemberShipList extends Component {
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
        this.memberShipList();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.memberShipList();
        });
        this.setState({ loader: false })
    }

    async memberShipList() {
        this.setState({ loader: true });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const loginData = {
            "current_user_id": Id,
            "access_token": Token,
        };
        memberShipListAction(loginData).then(responseJson => {
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
        this.memberShipList();
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

                <View>
                    <Row style={styles.RowContainer}>
                        <Col style={styles.ImageCol}>
                            <Col style={styles.ImageContainer}>
                                <Image source={item.membership_image ? { uri: item.membership_image } : null} style={styles.MembershipImage} />
                                {/* <Text>{item.membership_image}</Text> */}
                            </Col>
                        </Col>
                        <Col style={styles.MembershipDetailContainer}>
                            <Col>
                                <Text style={styles.MemberShipName}>
                                    {item.membership_name}
                                </Text>
                            </Col>
                            <Col>
                                <Row style={{ marginTop: 5 }}>
                                    {/* <Col style={{ borderRightWidth: 2, borderColor: '#777777', width: "32%", marginBottom: "13%" }}>
                                        <Text style={{ color: '#777777', }}>1 Month</Text>
                                    </Col> */}
                                    <Col style={{ marginBottom: "13%" }}>
                                        <Text style={{ color: '#777777', fontSize: 12, fontFamily:'Poppins-Regular'}}>{item.membership_period} {t("Days")}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                        <Col style={{ width: "20%", justifyContent: "center", alignItems:'flex-end' }}>
                            <Text style={{ color: '#777777', fontSize: 17, fontFamily:'Poppins-Bold' }}>
                                {item.currency_symbol} {item.membership_amount}
                            </Text>
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
                            <Text style={styles.NaveText}>{t("Membership List")}</Text>
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
                    <FlatList
                        data={this.state.dataSource}
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
                            <Text style={styles.NaveText}>{t("Membership List")}</Text>
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
    emptyText: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        fontSize: 18,
        color: "#000",
    },
    container:
    {
        flex: 1,
        backgroundColor:'#fff'
    },
    IconClick: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    RowContainer: {    
        borderBottomWidth: 1,
        marginLeft: "5%",
        marginRight: "5%",
        borderBottomColor: "#E1E1E1"
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
        marginTop: "11%", 
        color: '#102B46', 
        fontSize: 15,
        fontFamily:'Poppins-Medium'
    },
    MembershipDetailContainer: {
        marginLeft:"0%"
    },
    NaveBar: {
        ...Platform.select({
            ios:{
                height: normalize(75),
				backgroundColor: '#102b46',
				justifyContent: 'center',
                alignItems: 'center',
                paddingTop: normalize(25),
            }, 
            android:{
                height: normalize(50),
				backgroundColor: '#102b46',
				justifyContent: 'center',
				alignItems: 'center',
            }})
        
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
            ios:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }, 
            android:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }})
        
    },
    back_arrow: {
        ...Platform.select({
            ios:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }, 
            android:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }})
        
    },
    workout_col: {
        ...Platform.select({
            ios:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }, 
            android:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }})
        
    },
    message_col: {
        ...Platform.select({
            ios:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }, 
            android:{
                width: normalize(50),
                height: normalize(50),
                justifyContent: 'center',
                alignItems: 'center',
            }})
        
    },
    name_col: {
        ...Platform.select({
            ios:{
                justifyContent: 'center',
                alignItems: 'center',
                width: normalize(185)
            }, 
            android:{
                justifyContent: 'center',
                alignItems: 'center',
                width: normalize(185)
            }})
        
    },
})