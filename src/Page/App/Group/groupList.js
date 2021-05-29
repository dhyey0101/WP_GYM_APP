import React, { Component } from 'react';
import { Modal, Button, BackHandler, TouchableHighlight, ActivityIndicator, AsyncStorage, RefreshControl, Alert, StyleSheet, Text, View, Image, FlatList, TouchableOpacity, StatusBar, ScrollView, Platform, Dimensions, } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { groupListAction } from '../../../util/action.js';
import { viewgroupListAction } from '../../../util/action.js';
import { NavigationEvents } from 'react-navigation';
import normalize from 'react-native-normalize';
import { t } from '../../../../locals';

const { width, height } = Dimensions.get("screen");

export default class groupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AddId: '',
            dataSource: [],
            MemberData: [],
            GroupName: '',
            ImageLoading: false,
            modalVisible: false,
            loader: false,
        };

    }

    // modalDidOpen = () => console.log("Modal did open.");

    // modalDidClose = () => {
    //     this.setState({ open: false });
    //     console.log("Modal did close.");
    // };

    // moveUp = () => this.setState({ offset: -100 });

    // resetPosition = () => this.setState({ offset: 0 });

    // openModal = () => this.setState({ open: true });

    // closeModal = () => this.setState({ open: false });

    // toggleModal = () => {
    //     this.setState({isModalVisible: !this.state.isModalVisible});
    // };

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    onRefresh() {
        this.groupListAction();
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.setState({ loader: true })
        this.groupListAction();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.groupListAction();
        });
        this.setState({ loader: false })
    }

    // listType(modallist) {
    //     this.setModallistType(!modallist);
    // }

    // setModallistType = (visible) => {
    //     this.setState({ modallist: visible });
    // }

    async groupListAction() {

        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const groupData = {
            "current_user_id": Id,
            "access_token": Token,
        };
        this.setState({ loader: true });
        groupListAction(groupData).then(responseJson => {
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

    Visible(modalVisible) {
        this.setState({ modalVisible: false });
    }

    async setModalVisible(GroupID) {

        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");
        // const group_id = await AsyncStorage.getItem("group_id");

        const viewData = {
            "current_user_id": Id,
            "access_token": Token,
            "group_id": GroupID,
        };

        viewgroupListAction(viewData).then(responseJson => {
            // console.log(responseJson);
            // this.setState({ modalVisible: true });
            if (responseJson.status == 1) {
                this.setState({
                    // loader:true,
                    MemberData: responseJson.result,
                    GroupName: responseJson.group_name,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
            }
        });
        this.setState({ modalVisible: true });


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
        const { modalVisible } = this.state;
        return (
            <View>
                <Row style={styles.RowContainer}>
                    <Col style={styles.ImageCol}>
                        <Col style={styles.ImageContainer}>
                            <Image onLoadStart={(e) => this.setState({ ImageLoading: true })}
                                onLoadEnd={(e) => this.setState({ ImageLoading: false })}
                                source={item.group_image ? { uri: item.group_image } : null} style={styles.GroupImage} />
                            {/* <Text>{item.membership_image}</Text> */}
                            <ActivityIndicator
                                style={styles.loading}
                                animating={this.state.ImageLoading}
                                // size="small"
                                color="#102b46"
                            />
                        </Col>
                    </Col>
                    <Col style={{marginTop: normalize(20) , marginBottom: normalize(20)}}>
                        <Col style={{ justifyContent: 'center'}}>
                            <Text style={styles.MemberShipName}>
                                {item.group_name}
                            </Text>
                        </Col>
                        <Col style={{justifyContent: 'center'}}>
                            <Text style={{ color: '#777777', fontSize: 12 , fontFamily: 'Poppins-Regular' , }}>{item.total_group_member} {t("member")}</Text>
                        </Col>
                    </Col>
                    <Col style={{ justifyContent: 'center', alignItems: 'center', width: '30%', }}>
                        <TouchableHighlight onPress={() => this.setModalVisible(item.group_id)}
                            underlayColor={'#F1C40E'}
                            style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#102B46', height: normalize(35), width: normalize(95), borderRadius: normalize(30) }}>
                            <Text style={{ fontSize: 18, color: '#102B46', fontFamily: 'Poppins-Medium'}}>{t("View")}</Text>
                        </TouchableHighlight>
                    </Col>
                </Row>
            </View>
        )
    }
    render() {
        const { loader, dataSource, modalVisible, MemberData, GroupName } = this.state;
        const { navigate } = this.props.navigation;
        // console.log(this.state);
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
                            <Text style={styles.NaveText}>{t("Group List")}</Text>
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
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    colors={["#102b46"]}
                                    refreshing={this.state.loader}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                        >
                            <Col>
                                <FlatList
                                    data={dataSource}
                                    keyExtractor={(item) => item.group_name}
                                    renderItem={this.renderItem}
                                />
                            </Col>
                            <Col>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={modalVisible}>

                                    <View style={{ shadowOffset: { width: 0, height: 1, }, elevation: 300, height: Dimensions.get('window').height, backgroundColor: "rgba(100,100,100, 0.8)", }}>

                                        <View style={{ height: normalize(300), backgroundColor: '#fff', borderRadius: 20, marginLeft: normalize(60), marginRight: normalize(60), marginTop: normalize(160), paddingBottom: normalize(50) }}>
                                            <Row style={{ height: '15%', borderBottomWidth: 0.5, borderBottomColor: '#8A8B8B', }}>
                                                <Col style={{ paddingLeft: '10%', width: '81%', borderTopLeftRadius: 20, justifyContent: 'center', }}>
                                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 20, color: '#102B46' }}>{GroupName}</Text>
                                                </Col>
                                                <Col style={{ backgroundColor: '', borderTopRightRadius: 20, justifyContent: 'center', alignItems: 'flex-start', }}>
                                                    <TouchableOpacity onPress={() => { this.Visible(!modalVisible), this.setState({ MemberData: [], GroupName: '' }) }} style={{ height: normalize(45), width: normalize(50), justifyContent: 'center', alignItems: 'center', }}>
                                                        <Image
                                                            style={{ height: 18, width: 18, }}
                                                            source={require('../../../images/Close-blue-512.png')} />
                                                    </TouchableOpacity>
                                                </Col>
                                            </Row>

                                            <View>
                                                <ScrollView>
                                                    {this.state.MemberData.map((Member, index) => (

                                                        <Row style={{ borderBottomWidth: 0.5, borderBottomColor: '#8A8B8B', height: normalize(55), alignItems: 'center', marginHorizontal: "5%" }}>
                                                            {/* <Col style={{}}>
                                                                <Image
                                                                    onLoadStart={(e) => this.setState({ ImageLoading: true })}
                                                                    onLoadEnd={(e) => this.setState({ ImageLoading: false })}
                                                                    style={{ height: normalize(42), width: normalize(42), borderRadius: normalize(40) }}
                                                                    source={{ uri: Member.member_image }} />
                                                                <ActivityIndicator
                                                                    style={styles.loading}
                                                                    animating={this.state.ImageLoading}
                                                                    // size="small"
                                                                    color="#102b46"
                                                                />
                                                            </Col> */}
                                                            <Col style={styles.ImageCol}>
                                                                <Col style={styles.ImageContainer}>
                                                                    <Image onLoadStart={(e) => this.setState({ ImageLoading: true })}
                                                                        onLoadEnd={(e) => this.setState({ ImageLoading: false })}
                                                                        source={Member.member_image ? { uri: Member.member_image } : null} style={styles.SubGroupImage} />
                                                                    {/* <Text>{item.membership_image}</Text> */}
                                                                    <ActivityIndicator
                                                                        style={styles.loading}
                                                                        animating={this.state.ImageLoading}
                                                                        // size="small"
                                                                        color="#102b46"
                                                                    />
                                                                </Col>
                                                            </Col>
                                                            <Col style={{ marginLeft: 20 }}>
                                                                <Text style={{ fontSize: 15, fontFamily: 'Poppins-Regular', color: '#102B46', }}>{Member.member_name}</Text>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        </View>
                                    </View>
                                </Modal>
                            </Col>
                        </ScrollView>
                    </View>
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
                            <Text style={styles.NaveText}>{t("Group List")}</Text>
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
        fontFamily:'Poppins-Regular'
    },
    container:
    {
        flex: 1,
        backgroundColor: '#fff'
    },
    RowContainer: {
        borderBottomWidth: 1,
        marginLeft: "3%",
        marginRight: "3%",
        borderBottomColor: "#E9E8E8",
        height: normalize(90),
    },
    ImageCol: {
        justifyContent: "center",
        alignItems: 'center',
        width: "20%",
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
    GroupImage: {
        height: 30,
        width: 30,
        borderRadius: 20,
    },
    SubGroupImage: {
        height: 50,
        width: 50,
        borderRadius: 40,
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
        color: '#102b46',
        fontSize: 15,
        fontFamily: 'Poppins-Bold'
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
                height: normalize(55),
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
    MembershipDetailContainer: {
        justifyContent: 'center',
        marginTop: 5,
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