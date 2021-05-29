import React, { Component } from "react";
import {
    BackHandler,
    Toast,
    Platform,
    View,
    Text,
    Modal,
    TouchableOpacity,
    AsyncStorage,
    Image,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    ScrollView,
    Dimensions,
    Linking,
    StatusBar,
    FlatList
} from "react-native";
import normalize from 'react-native-normalize';
import { NavigationEvents } from 'react-navigation';
import { Col, Row } from 'react-native-easy-grid';
import { classListAction } from '../../../util/action.js';
import { t } from '../../../../locals';

const { width, height } = Dimensions.get("screen");


export default class ClassList extends Component {

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
        this.ClassList();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.ClassList();
        });
        this.setState({ loader: false })
    }

    async ClassList() {
        this.setState({ loader: true });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");
        
        const loginData = {
            "current_user_id": Id,
            "access_token": Token,
            
        };
        classListAction(loginData).then(responseJson => {
            // console.log(responseJson)
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
        this.ClassList();
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
            <View style={styles.container} >
                    <Row style={{height: normalize(80),backgroundColor: '',marginRight: normalize(30), marginLeft: normalize(30),borderBottomWidth: 1,borderBottomColor: '#EFEEEE'}}>
                        <Col style={{width: normalize(165),backgroundColor: ''}}>
                            <Row style={{backgroundColor: '',justifyContent: 'flex-start', alignItems: 'flex-end',}}>
                                <Text style={{fontSize: 18, fontFamily: 'Poppins-Bold' ,color: '#102b46',}}>{item.class_name}</Text>
                            </Row>
                            <Row style={{backgroundColor: '',height: normalize(40),paddingBottom: normalize(15)}}>
                                <Col style={{backgroundColor: '',width: normalize(25),justifyContent: 'center', alignItems: 'flex-start',}}>
                                    <Image style={{height: 16, width: 16,}}
                                        source={require('../../../images/Time-512.png')}
                                    />
                                </Col>
                                <Col style={{backgroundColor: '',justifyContent: 'center', alignItems: 'flex-start', paddingTop: normalize(5)}}>
                                    <Text style={{color: 'gray',fontFamily: 'Poppins-Medium' , fontSize: 13,}}>{item.start_time} - {item.end_time}</Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col style={{}}>
                            <Row style={{backgroundColor: '',justifyContent: 'flex-start', alignItems: 'flex-end',}}>
                                <Text style={{color: 'gray',fontFamily: 'Poppins-Medium' ,fontSize: 13,}}>{item.staff_member}</Text>
                            </Row>
                            <Row style={{backgroundColor: '',height: '50%',}}>
                            </Row>
                        </Col>
                    </Row>
            </View>
        );
    };

    render() {
        const { loader, dataSource } = this.state;
        const { navigate } = this.props.navigation;

        if (!loader) {  
            return (
                <View style={{ flex: 1}}>
                    <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <StatusBar />
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={this.renderItem}
                        // renderItem={({item}) => <Text> {item.title}</Text>}
                        keyExtractor={(item) => item.class_id.toString()}
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
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                    color="#102b46"
                />
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
    container: {
        flex: 1,
    },
    Navebar: {
        ...Platform.select({
            ios: {
                height: 45,
                marginTop: "10%",
                borderBottomWidth: 1
            },
            android: {
                height: 40,
                //   borderWidth: 1,   
                borderBottomWidth: 1
            },
        }),
    },
    BackArrow: {
        ...Platform.select({
            ios: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10,
                // marginTop: 10,
            },
            android: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10,
                marginTop: 10,
            }
        })
    },
    Menu: {
        ...Platform.select({
            ios: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
            },
            android: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                marginTop: 10,
            }
        })

    },

    NavCol: {
        width: "10%"
    },
    Header: {
        justifyContent: "center",
        alignItems: "center",

    },
    HeaderText: {
        ...Platform.select({
            ios: {
                fontSize: 15,
                // padding: 10,
                fontWeight: "bold",
                color: "#102b46",
                // alignItems: 'center',
                height: "60%",

            },
            android: {

                fontSize: 15,
                // padding: 10,
                fontWeight: "bold",
                color: "#102b46",
                // alignItems: 'center',
            }
        })
    },
})