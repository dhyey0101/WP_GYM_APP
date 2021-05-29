import React, { Component  ,  useState, useCallback, useEffect } from "react";
import {
    BackHandler,
    Toast,
    Platform,
    View,
    Text,
    Modal,
    FlatList,
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
import { GiftedChat , Bubble , Time } from "react-native-gifted-chat";
import { viewMessageAction , replymessageListAction , sendreplyMessageAction } from '../../../util/action.js';
import { Col, Row } from 'react-native-easy-grid';
import moment from 'moment';
import normalize from "react-native-normalize";
import { t } from '../../../../locals';

const { width, height } = Dimensions.get("screen");


export default class InboxView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: '',
            // photo:'',
            Title:'',
            dataSource: [],
            messages: [],
            MessageId:'', 
            ReceiverId:'',
            user_id:'',
            User_Image:'',
        };
    }

    
    
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };
    
    async UNSAFE_componentWillMount() {
        let userID = await AsyncStorage.getItem("id");

        this.setState({
          user_id: userID,
        });
        
    }

    componentDidMount() {
        
        const photo = this.props.navigation.getParam('userImage',);
        this.setState({ User_Image : photo })
        // const Text = this.props.navigation.getParam('messagetext',);
        const title = this.props.navigation.getParam('messagetitle',);
        this.setState({ Title : title})
        this.replymessageList()
        const receiverid = this.props.navigation.getParam('receiverid',);
        this.setState({ ReceiverId : receiverid})
        const messageid = this.props.navigation.getParam('messagekey',);
        this.setState({ MessageId : messageid})
        

        // this.setState({
        //     messages: [
                
        //         {
        //             _id: 3,
        //             createdAt: "2021-05-03T10:17:29+00:00",
        //             text: "Hello",
        //             user:{
        //               _id: 194,
        //               avatar: "https://3dlif.com/wordpress/wpgym/wp-content/uploads/2021/04/minion.jpg",
        //               name: "Vatsal Ribadiya",
        //             },
        //           },
        //           {
        //             _id: 194,
        //             createdAt: "2021-05-03T10:19:22+00:00",
        //             text: "Hy vatsal.....!!!!!!!!",
        //             user:{
        //               _id: 3,
        //               avatar: "https://3dlif.com/wordpress/wpgym/wp-content/uploads/2021/02/profile.jpg",
        //               name: "Dhrumil Adeshara",
        //             },
        //           },
        //           {
        //             _id: 3,
        //             createdAt: "2021-05-03T10:19:48+00:00",
        //             text: "What\\'s up dhrumil?",
        //             user: {
        //               _id: 194,
        //               avatar: "https://3dlif.com/wordpress/wpgym/wp-content/uploads/2021/04/minion.jpg",
        //               name: "Vatsal Ribadiya",
        //             },
        //           },
        //         ],
        //   });

          
        // this.setState({ loader: false })
    }

    // onSend (messages = [])  {
    //     setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    //   };

    async replymessageList() {
            this.setState({ loader: true });
            const viewMessageID = this.props.navigation.getParam('viewMessageID',);
            const messageID = this.props.navigation.getParam('messagekey',);
            const Id = await AsyncStorage.getItem("id");
            const Token = await AsyncStorage.getItem("access_token");
    
            const messagelist = {
                "message_id" : messageID,
                "from" : "inbox",
                "current_user_id": Id,
                "view_message_id": viewMessageID,
                "access_token": Token,
            };
            replymessageListAction(messagelist).then(responseJson => {
                // console.log(responseJson);
                if (responseJson.status == 1) {
                    // this.setState((previousMessages) => ({messages: GiftedChat.append(previousMessages.messages,responseJson.result.reverse()),}));
    
                    this.setState({ messages : responseJson.result, loader: false, });
                } else {
                    this.setState({ loader: false });
                }
            });
        };
    
    
    async onSend(messages = []) {

        const userID = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");
        
        const { MessageId , ReceiverId } = this.state;

        const sendmessage = {

            "message_id" : MessageId,
            "reply_message_content" : messages[0].text,
            "receiver_id" : ReceiverId,
            "current_user_id": userID,
            "access_token": Token,
        };

        messages._id = MessageId;
        messages.user = {
            _id: userID,
        };

        sendreplyMessageAction(sendmessage).then(responseJson => {
            if (responseJson.status == 1) {
            } else {
                this.setState({ loader: false });
            }
        });

        this.setState((previousState) => ({
            messages: GiftedChat.prepend(previousState.messages, messages),
          }));
        
    }

    renderBubble(props) {
        return (
            <Bubble
                  {...props}
                  textStyle={{
                  right: {
                      color: '#f1c40e',
                      fontFamily: 'Poppins-Medium'
                  },
                  left: {
                    color: '#f1c40e',
                    fontFamily: 'Poppins-Medium'
                },
                  }}
                  wrapperStyle={{
                  right: {
                      backgroundColor: '#102b46',
                  },
                  left: {
                    backgroundColor: '#102b46',
                },
                  }}
            />
            
        
        );
      }

    renderTime = (props) => {
        return (
          <Time
          {...props}
            timeTextStyle={{
              left: {
                color: '#f1c40e',
                fontFamily: 'Poppins-Medium'
              },
              right: {
                color: '#f1c40e',
                fontFamily: 'Poppins-Medium'
              },
            }}
          />
        );
      };   
      
      
    render() {

        const { loader, dataSource , photo , Title , renderBubble , renderTime , messages , user_id , User_Image } = this.state;
        const { navigate } = this.props.navigation;
        console.log(this.state);
            return (
                <View style={styles.container}>
                    <View style ={{  height: normalize(50) , borderBottomColor: '#102b46', borderBottomWidth: 1}}>
                        <Row>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Inbox")} >
                                <Col style={styles.back_arrow}>
                                    <Image style={{ width : normalize(27) , height: normalize(27)}}
                                        source={require('../../../images/view_msg_arrow.png')}
                                    />
                                </Col>
                            </TouchableOpacity>
                            <Col style={{justifyContent:'center',alignItems: 'center', marginRight: normalize(30)}}> 
                                <Text style = {{color:'#102b46', fontSize: 20, fontWeight:'bold'}}>{this.state.Title}</Text>
                            </Col>
                        </Row>
                    </View>
                    {/* <Row style = {{ height: normalize(75), marginLeft: normalize(25) ,marginRight: normalize(25) ,borderTopWidth: 1}} >
                        <Col style={{  width: normalize(70),justifyContent: 'center',alignItems: 'flex-start'}}>
                            <Col style={{borderWidth: 1,height: 55 , width: 55 , borderRadius: 40, alignItems: 'center',justifyContent: 'center'}}>
                                <Image style={{ height: normalize(57) , width: normalize(57) , borderRadius: normalize(65), alignItems: 'center',justifyContent: 'center'}}
                                    source={{uri: photo}}
                                />
                            </Col>
                        </Col>
                        <Col style={{alignItems: 'flex-start',paddingTop: normalize(15)}}>
                            <Text style = {{color:'#102b46', fontSize: 17, fontWeight:'bold'}}>{dataSource.sender}</Text>  
                        </Col>
                    </Row>
                    <Row style={{marginLeft: normalize(30), marginRight: normalize(30)}}>
                    <Text style = {{color:'#102b46', fontSize: 15,}}>{dataSource.message_content}</Text>
                    </Row> */}
                    <GiftedChat
                        textInputStyle={{
                            fontFamily: 'Poppins-Medium'
                        }}
                        placeholder={'Type a message...'}
                        inverted={false}
                        isAnimated={true}
                        renderBubble={this.renderBubble}
                        renderTime={this.renderTime}
                        messages={this.state.messages}
                        showUserAvatar
                        onSend={(messages) => this.onSend(messages)}
                        alwaysShowSend={true}
                        user={{
                            _id: parseInt(user_id),
                            avatar: User_Image ,
                       }}
                    />
                </View>
            );

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
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