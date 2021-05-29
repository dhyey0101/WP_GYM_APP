import React, { Component } from "react";
import {
    BackHandler,
    Toast,
    Platform,
    View,
    Text,
    FlatList,
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
    KeyboardAvoidingView
} from "react-native";
import validate from 'validate.js';
import { Col, Row } from 'react-native-easy-grid';
import moment from 'moment';
import { sentmessagelistAction } from '../../../util/action.js';
import normalize from "react-native-normalize";
import { t } from '../../../../locals';

const { width, height } = Dimensions.get("screen");

export default class sent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            dataSource: [],
        };
        // this.onDayPress = this.onDayPress.bind(this);
    }


    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    componentDidMount() {
        const { navigation } = this.props;
        // this.setState({ loader: true })
        this.sentmessagelist();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.sentmessagelist();
        });
        // this.setState({ loader: false })
    }

    async sentmessagelist() {
        this.setState({ loader: true });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const loginData = {
            "current_user_id": Id,
            "access_token": Token,
        };
        sentmessagelistAction(loginData).then(responseJson => {
            this.setState({ loader: true });
            console.log(responseJson);
            if (responseJson.status == 1) {

                this.setState({ dataSource: responseJson.result, loader: false, });
            } else {
                this.setState({ loader: false });
            }
        });
    }
    onRefresh() {
        this.setState({ dataSource: [] });
        this.sentmessagelist();
    }
    // render item for flatlist
    renderItem = ({ item }) => {
        return (
            <View style={styles.mainContainer}>
                <View>
                <TouchableOpacity onPress={ () => this.props.navigation.navigate('SentView', { messagekey: item.message_id, viewMessageID: item.view_message_id , messageimage: item.gmgt_user_avatar_image , messagetext: item.description , messagetitle: item.subject , replyid : item.replay_id , receiverid : item.receiver_id , userImage : item.current_user_image })}>
                    <Row style={{borderBottomWidth: 1 ,borderBottomColor: '#E0DFDF',marginRight: '5%', marginLeft: '5%',height: 95}}>
                                    <Col style={{width: '21%',justifyContent: 'center',alignItems: 'flex-start'}}>
                                        <Col style={{borderWidth: 1,height: normalize(65) , width: normalize(65) , borderRadius: normalize(65), alignItems: 'center',justifyContent: 'center'}}>
                                        <Image style={{ height: normalize(65) , width: normalize(65) , borderRadius: normalize(65), alignItems: 'center',justifyContent: 'center'}}
                                            source={{uri: item.gmgt_user_avatar_image}}
                                            />
                                        </Col>
                                    </Col>
                                    <Col style={{justifyContent: 'center',}}>
                                        <Row style={{height: '21%',}}>
                                            <Col>
                                                    <Text style={{ fontFamily:'Poppins-Medium', fontSize: 15, color: '#102b46', }}>{item.message_for}</Text>
                                            </Col>
                                            <Col style={{width: '28%',justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                                <Text style={{ color: 'gray', fontSize: 11, fontFamily:'Poppins-Regular' }}>{item.date}</Text>
                                            </Col>
                                        </Row>
                                        <Row style={{height: '21%',}}>
                                            <Col style={{backgroundColor: '',}}>
                                                    <Text style={{ color: 'gray', fontSize: 12, fontFamily:'Poppins-Regular' }}>{item.subject}</Text> 
                                            </Col>
                                        </Row>
                                        <Row style={{height: '21%',}}>
                                            <Col style={{backgroundColor: '',}}> 
                                                <Text style={{color: 'gray',fontSize: 12, fontFamily:'Poppins-Regular'}} numberOfLines={1}>{item.description}</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                            </Row>
                    </TouchableOpacity>
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
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.message_for.toString()}
                        ListEmptyComponent={
                            <EmptyComponent title={t("Sent Message not available")} />
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
    container: {
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
                height: 15,

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
    notes_Input: {
        ...Platform.select({
            ios: {
                height: 40,
                width: '100%',
                paddingLeft: 10,
                paddingTop: "3%"
            },
            android: {
                // marginTop: 10,
                height: 40,
                width: '100%',
                paddingLeft: 10,
            }
        })
    },
})