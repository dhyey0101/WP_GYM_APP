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
    FlatList,
    KeyboardAvoidingView
} from "react-native";
import normalize from 'react-native-normalize';
import validate from 'validate.js';
import { Col, Row } from 'react-native-easy-grid';
import moment from 'moment';
import Detalis from './DetailsTab';
import { singleMemberAction } from "../../../util/action.js";
import { t } from '../../../../locals';

// import Account from './Account/account.js';


export default class Configuration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            dataSource: [],
            ImageLoading:false,
        };
        // this.onDayPress = this.onDayPress.bind(this);
    }

    
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };
    
    componentDidMount() {
        const { navigation } = this.props;
        this.setState({ loader: true })
        this.singleMember();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.singleMember();
        });
        this.setState({ loader: false })
    }
    
    onRefresh() {
        this.singleMember();
    }

    navigatetoacc() {
        const { navigate } = this.props.navigation;
        navigate('Acc');
    }
    async singleMember() {
        this.setState({ loader: true });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const userData = {
            "member_id": Id,
            "access_token": Token,
        };
        singleMemberAction(userData).then(responseJson => {
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
    
    render() {

        const { navigate } = this.props.navigation;
        const { dataSource, loader } = this.state;
        
        if (!loader) {
        return (
            <View style={{ flex: 1, }}>
                <Row style={{backgroundColor: '',height: normalize(105),marginLeft: normalize(25),marginBottom: normalize(20)}}>
                        <Col style={{backgroundColor: '', width: '25%',justifyContent: 'center',alignItems: 'flex-start',}}>
                            <Col style={{height: normalize(80), width: normalize(80),borderRadius: normalize(15), borderColor: '#102b46',borderWidth: 2,justifyContent: 'center', alignItems: 'center',}}>
                                <Image 
                                onLoadStart={(e) => this.setState({ ImageLoading: true })}
                                onLoadEnd={(e) => this.setState({ ImageLoading: false })}
                                style={{height: normalize(80), width: normalize(80),borderRadius: normalize(15),}}
                                source={{uri: dataSource.member_image}} />
                                <ActivityIndicator
                                        style={styles.loading}
                                        animating={this.state.ImageLoading}
                                        size="small"
                                        color="#102b46"
                                    />
                            </Col>
                        </Col>
                        <Col style={{backgroundColor: '', justifyContent: 'center',}}>
                            <Row style={{backgroundColor: '', height: '20%',}}>
                                <Text style={{ fontFamily: 'Poppins-Bold' , fontSize: 16, color: '#102b46' }}>{dataSource.first_name} {dataSource.last_name}</Text>
                            </Row>
                            <Row style={{backgroundColor: '', height: '18%',alignItems: 'center',}}>
                                <Text style={{fontSize: 12,color: 'gray', fontFamily: 'Poppins-Regular',opacity: 0.7}}>{dataSource.address}, {dataSource.city}</Text>
                            </Row> 
                            <Row style={{backgroundColor: '', height: '15%',flexDirection: 'row',}}>
                                <Col style={{backgroundColor: '',width: '7%',justifyContent: 'center', alignItems: 'flex-start'}}>
                                    <Image style={{height: 12 , width: 12,}}  
                                        source={require('../../../images/Location2-Pin-Gray-512.png')}
                                    />
                                    
                                </Col>
                                <Col style={{backgroundColor: '',justifyContent: 'center', alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 12,color: 'gray',fontFamily: 'Poppins-Regular',opacity: 0.7}}>{dataSource.state}</Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col style={{width: normalize(100) , marginTop: normalize(75),}}>
                            <TouchableOpacity onPress={() => this.navigatetoacc()} style={{backgroundColor: '#F1C40E', height: normalize(30), marginRight: normalize(20) , borderRadius: normalize(5) , justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: '#102B46', fontSize: 15}}>{t("Update")}</Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                <Detalis />
            </View>
        )
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
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
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