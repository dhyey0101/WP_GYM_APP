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
import { singleMemberAction } from '../../../util/action.js';
import { Col, Row } from 'react-native-easy-grid';
import { NavigationEvents } from 'react-navigation';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
const { width, height } = Dimensions.get("screen");

export default class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            collapsed: false,
        };

    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };
    
    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    };

    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };
    componentDidMount() {
        this.singleMember();
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
    onRefresh() {
        this.setState({ dataSource: [] });
        this.singleMemberAction();
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

        render() {
            const { loader, dataSource , collapsed } = this.state;
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
                            <Text style={styles.NaveText}>Event List</Text>
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
                <ScrollView>
                    
                    <Row style={{backgroundColor: '',height: normalize(120),marginLeft: normalize(25),marginBottom: normalize(20)}}>
                        <Col style={{backgroundColor: '', width: '25%',justifyContent: 'center',alignItems: 'flex-start',}}>
                            <Col style={{height: normalize(80), width: normalize(80),borderRadius: normalize(15), borderColor: '#102b46',borderWidth: 2,justifyContent: 'center', alignItems: 'center',}}>
                                <Image style={{height: normalize(80), width: normalize(80),borderRadius: normalize(15),}}
                                    source={{uri: dataSource.member_image}} />
                            </Col>
                        </Col>
                        <Col style={{backgroundColor: '', justifyContent: 'center',}}>
                            <Row style={{backgroundColor: '', height: '17%',}}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#102b46' }}>{dataSource.first_name} {dataSource.last_name}</Text>
                            </Row>
                            <Row style={{backgroundColor: '', height: '18%',alignItems: 'center',}}>
                                <Text style={{fontSize: 12,color: 'gray', opacity: 0.7}}>{dataSource.address}, {dataSource.city}</Text>
                            </Row> 
                            <Row style={{backgroundColor: '', height: '15%',flexDirection: 'row',}}>
                                <Col style={{backgroundColor: '',width: '7%',justifyContent: 'center', alignItems: 'flex-start'}}>
                                    <Image style={{height: 12 , width: 12,}}  
                                        source={require('../../../images/Location2-Pin-Gray-512.png')}
                                    />
                                    
                                </Col>
                                <Col style={{backgroundColor: '',justifyContent: 'center', alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 12,color: 'gray', opacity: 0.7}}>{dataSource.state}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    
                    <Col style={{borderWidth: 1, borderColor: '#102b46',borderRadius:5,marginLeft: normalize(10), marginRight: normalize(10),marginBottom: '5%',}}>
					<Collapse
					isCollapsed={this.state.collapsed}
					onToggle={(isCollapsed) => this.setState({ collapsed: !this.state.collapsed })}>
						{(collapsed == true) ?(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 18,fontWeight: 'bold',
									color:'#ffffff',}}>Event 1</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../../images/down-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>):(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 18,fontWeight: 'bold',
									color:'#ffffff',}}>Event 1</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../../images/right-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>)}
                      <CollapseBody>
                        <Row style={{backgroundColor: '#102b46', height: normalize(65),borderTopWidth: 1,borderColor: '#fff',borderBottomWidth: 1, borderBottomColor: '#2F465D',}}> 
                            <Col style={{justifyContent: 'center', alignItems: 'flex-start',marginLeft: normalize(30),width: normalize(55)}}>
                                <Image style={{height: 28, width: 28,}}
									source={require('../../../images/interest.png')}/>
                            </Col>
                            <Col style={{marginBottom: normalize(7), marginTop: normalize(7 )}}>
                                <Row style={{backgroundColor: '',justifyContent: 'flex-start',alignItems: 'center',}}> 
                                    <Text style={{color: '#fff', fontSize: 13}}>Event Name</Text>
                                </Row>
                                <Row style={{backgroundColor: '',justifyContent: 'flex-start',alignItems: 'center',}}> 
                                    <Text style={{color: '#fff', fontSize: 11}}>Public Event</Text>
                                </Row> 
                            </Col>
                        </Row>
                        
                        <Row style={{backgroundColor: '#102b46', height: normalize(65),borderBottomColor: '#2F465D',borderBottomWidth: 1,}}> 
                            <Col style={{justifyContent: 'center', alignItems: 'flex-start',marginLeft: normalize(30),width: normalize(55)}}>
                                <Image style={{height: 28, width: 28,}}
									source={require('../../../images/date-yellow-512.png')}/>
                            </Col>
                            <Col style={{marginBottom: normalize(7), marginTop: normalize(7 )}}>
                                <Row style={{backgroundColor: '',justifyContent: 'flex-start',alignItems: 'center',}}> 
                                    <Text style={{color: '#fff', fontSize: 13}}>Event Date</Text>
                                </Row>
                                <Row style={{backgroundColor: '',justifyContent: 'flex-start',alignItems: 'center',}}> 
                                    <Text style={{color: '#fff', fontSize: 11}}>January 14,2020</Text>
                                </Row> 
                            </Col>
                        </Row>
                        
                        <Row style={{backgroundColor: '#102b46', height: normalize(65),borderBottomColor: '#2F465D',borderBottomWidth: 1,}}> 
                            <Col style={{justifyContent: 'center', alignItems: 'flex-start',marginLeft: normalize(30),width: normalize(55)}}>
                                <Image style={{height: 28, width: 28,}}
									source={require('../../../images/Event_Location.png')}/>
                            </Col>
                            <Col style={{marginBottom: normalize(7), marginTop: normalize(7 )}}>
                                <Row style={{backgroundColor: '',justifyContent: 'flex-start',alignItems: 'center',}}> 
                                    <Text style={{color: '#fff', fontSize: 13}}>Place</Text>
                                </Row>
                                <Row style={{backgroundColor: '',justifyContent: 'flex-start',alignItems: 'center',}}> 
                                    <Text style={{color: '#fff', fontSize: 11}}>kullu street , Maiagao ,USA</Text>
                                </Row> 
                            </Col>
                        </Row>
                        
                        <Row style={{backgroundColor: '#102b46', height: normalize(65),borderBottomColor: '#2F465D',borderBottomWidth: 1,}}> 
                            <Col style={{justifyContent: 'center', alignItems: 'flex-start',marginLeft: normalize(30),width: normalize(55)}}>
                                <Image style={{height: 28, width: 28,}}
									source={require('../../../images/Event_time.png')}/>
                            </Col>
                            <Col style={{marginBottom: normalize(7), marginTop: normalize(7 )}}>
                                <Row style={{backgroundColor: '',justifyContent: 'flex-start',alignItems: 'center',}}> 
                                    <Text style={{color: '#fff', fontSize: 13}}>Start Time</Text>
                                </Row>
                                <Row style={{backgroundColor: '',justifyContent: 'flex-start',alignItems: 'center',}}> 
                                    <Text style={{color: '#fff', fontSize: 11}}>05:00</Text>
                                </Row> 
                            </Col>
                        </Row>
                        
                        <Row style={{backgroundColor: '#102b46', height: normalize(65),borderBottomColor: '#2F465D',borderBottomWidth: 1,}}> 
                            <Col style={{justifyContent: 'center', alignItems: 'flex-start',marginLeft: normalize(30),width: normalize(55)}}>
                                <Image style={{height: 28, width: 28,}}
									source={require('../../../images/Event_time.png')}/>
                            </Col>
                            <Col style={{marginBottom: normalize(7), marginTop: normalize(7 )}}>
                                <Row style={{backgroundColor: '',justifyContent: 'flex-start',alignItems: 'center',}}> 
                                    <Text style={{color: '#fff', fontSize: 13}}>End Time</Text>
                                </Row>
                                <Row style={{backgroundColor: '',justifyContent: 'flex-start',alignItems: 'center',}}> 
                                    <Text style={{color: '#fff', fontSize: 11}}>08:00</Text>
                                </Row> 
                            </Col>
                        </Row>
                        
        			  </CollapseBody>
					</Collapse>
			    </Col>
            </ScrollView>
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
    container:
    { 
        flex: 1,
        backgroundColor: '#ffffff',
    },
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