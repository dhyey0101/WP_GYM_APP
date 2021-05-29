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
import moment from 'moment';
import { nutritionlistAction } from '../../../util/action.js';
import { t } from '../../../../locals';


const { width, height } = Dimensions.get("screen");

export default class Nutritionplan extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        // this.setState({ loader: true });
        const { navigation } = this.props;
        this.setState({ loader: true })
        this.nutritionlist();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.nutritionlist();
        });
        // this.setState({ loader: false })
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
            } else {
                this.setState({ loader: false });
            }
        });
    }

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick); 
    }

    onRefresh() {
        this.setState({ dataSource: [] });
        this.nutritionlist();
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('Dashboard')
    renderItem=({item})=>{
        return(
            <View>
                <TouchableOpacity onPress={()=> this.props.navigation.navigate('nutritionschudule',{paramKey1:item.start_date,paramKey2:item.end_date})}>
                    
                    <Row style={{borderBottomWidth: 0.4,borderBottomColor: 'black',height: 80,marginRight: '5%',marginLeft: '5%'}}>
                            <Col style={{backgroundColor: '',width: '25%', justifyContent: 'center', alignItems: 'center',}}>  
                                <Col style={{alignItems: 'center',justifyContent: 'center',backgroundColor: '#eabf0e',borderRadius: 30,borderWidth: 1, height: 60, width: 60,}}>
                                    <Image style={{height: 35, width: 35,}}
                                        source={require('../../../images/Date-blue-512.png')}
                                    />
                                </Col>
                            </Col>
                            <Col style={{justifyContent: 'center',backgroundColor: ''}}>
                                <Row style={{backgroundColor: '',height: '30%',alignItems: 'center',}}>
                                    <Text style={{fontStyle:'Poppins-Medium', color: '#102b46',fontSize: 15,}}>{t("Start From")} : </Text>
                                    {/* <Text style={{ color: 'gray', }}>{moment(item.start_date).format('DD MMMM, YYYY')}</Text> */}
                                    <Text style={{ fontStyle:'Poppins-Medium', color: 'gray',fontSize: 15 }}>{item.start_date}</Text>
                                </Row>

                                <Row style={{backgroundColor: '',height: '30%',alignItems: 'center',}}>  
                                    <Text style={{fontStyle:'Poppins-Medium',color: '#102b46',fontSize: 15,}}>{t("To")} : </Text>
                                    {/* <Text style={{color: 'gray',}}>{moment(item.end_date).format('DD MMMM, YYYY')}</Text> */}
                                    <Text style={{color: 'gray', fontStyle:'Poppins-Medium', fontSize: 15}}>{item.end_date}</Text>
                                </Row>
                            </Col>
                        </Row>

                        </TouchableOpacity>
            </View>
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
                            <TouchableOpacity onPress={() => navigate("Dashboard")} style={styles.back_arrow}>
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
                    
                <FlatList
                    data={dataSource}
                    renderItem={this.renderItem}
                    keyExtractor={(item)=>item.toString()}
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
                            <TouchableOpacity onPress={() => navigate("Dashboard")} style={styles.back_arrow}>
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
        fontFamily:'Poppins-Regular'

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
                width: normalize(195)
            }, 
            android:{
                justifyContent: 'center',
                alignItems: 'center',
                width: normalize(210),
            }})
        
    },
})