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
    FlatList,
    KeyboardAvoidingView
} from "react-native";
import normalize from 'react-native-normalize';
import validate from 'validate.js';
import { Col, Row } from 'react-native-easy-grid';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import { classSchedultListAction } from '../../../util/action.js';
import CalendarStrip from 'react-native-calendar-strip';
import { ListItem } from "native-base";
import { t } from '../../../../locals';

const { width, height } = Dimensions.get("screen");

export default class Configuration extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            days: { "0": "Sunday", "1": "Monday", "2": "Tuesday", "3": "Wednesday", "4": "Thursday", "5": "Friday", "6": "Saturday" },
            selectedDate: moment(),
            dataSource: [],
            data: [],
            /*crunch_sets:'',
            fixed_weights_sets:'',
            resisted_crunch_sets:'',
            crunch_kg:'',
            fixed_weights_kg:'',
            resisted_crunch_kg:'',
            crunch_reps:'',
            fixed_weights_reps:'',
            resisted_crunch_reps:'',
            crunch_repstime:'',
            fixed_weights_repstime:'',
            resisted_crunch_repstime:'',
            crunch_notes:'',
            fixed_weights_notes:'',
            resisted_crunch_notes:'',
           */

        };
        // this.onDayPress = this.onDayPress.bind(this);
    }

    onRefresh() {
        this.setState({ dataSource: [], data: [] });
        this.classSchedultList();
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
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    componentDidMount() {
        this.setState({ loader: true })
        const { navigation } = this.props;
        this.classSchedultList();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.classSchedultList();
        });
        this.setState({ loader: false })
    }

    async classSchedultList() {
        this.setState({ loader: true });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");
        const userData = {
            "current_user_id": Id,
            "access_token": Token,
        };
        classSchedultListAction(userData).then(responseJson => {        
            if (responseJson.status == 1) {
                this.setState({
                    dataSource: responseJson.result,
                    loader: false,
                });
                this.rendershow();
            } else {
                this.setState({ loader: false });
            }
        });
    }
    renderItem = ({ item }) => {
        return (
            <View style={styles.container}>

                <Row style={{ backgroundColor: '', marginRight: normalize(30), marginLeft: normalize(30), marginTop: normalize(35), borderBottomWidth: 1, borderBottomColor: '#777777' }}>
                    <Col style={{ width: '100%', paddingBottom: normalize(10) }}>
                        <Row style={{ backgroundColor: '', alignItems: 'flex-end', }}>
                            <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold' , color: '#102b46', }}>{item[1].class_name}</Text>
                        </Row>
                        <Row style={{ justifyContent: 'center', alignItems: 'center', height: normalize(30) }}>
                            <Col style={{ width: '7%', justifyContent: 'center', backgroundColor: '',}}>
                                <Image style={{ height: 17, width: 17, }}
                                    source={require('../../../images/Time-512.png')}
                                />
                            </Col>
                            <Col style={{ justifyContent: 'center', backgroundColor: '',paddingTop: normalize(5)}}>
                                <Text style={{ color: '#777777', fontSize: 12, fontFamily: 'Poppins-Regular'}}>{item[1].start_time} - {item[1].end_time}</Text>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </View>
        )
    }
    rendershow() {
        if (this.state.dataSource) {
            const x = Object.entries(this.state.dataSource).map((item) => item)
            //console.log(x)
            var date = moment(this.state.selectedDate).day()
            //console.log(date)
            //var day=date.day()
            //console.log(this.state.days[date])
            //console.log(x[date][1])
            this.setState({ data: Object.entries(x[date][1]).map((item1) => item1) })
        }
    }
    render() {
        /*let datesWhitelist = [{
        start: moment().subtract(1, 'days'), // yesterday
        end: moment().add(1, 'days')  // tomorrow
        }];*/
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
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                colors={["#102b46"]}
                                refreshing={false}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    >
                        <CalendarStrip
                            // scrollable
                            highlightDateNameStyle={{ color: '#f1c40e', borderBottomColor: '#f1c40e', borderBottomWidth: 2 , fontFamily: 'Poppins-Bold' , fontSize: 15}}
                            selectedDate={this.state.selectedDate}
                            onDateSelected={selectedDate => this.setState({ selectedDate }, () => this.rendershow())}
                            numDaysInWeek={7}
                            showDayNumber={false}
                            markedDatesStyle={{ color: 'yellow' , fontFamily: 'Poppins-Bold'}}
                            style={{ height: 100, paddingTop: 20, backgroundColor: '', borderBottomWidth: 0.15, borderBottomColor: 'black', }}
                            calendarHeaderStyle={{ color: '#102b46', fontSize: 15, fontFamily: 'Poppins-Bold'}}
                            //dateNumberStyle={{color: '#102b46' ,fontWeight: 'bold',}}
                            dateNameStyle={{ color: '#102b46', fontSize: 15, fontFamily: 'Poppins-Bold' }}
                            iconContainer={{ flex: 0.1, }}
                        />
                        <FlatList
                            data={this.state.data}
                            renderItem={this.renderItem}
                            // renderItem={({item}) => <Text> {item.title}</Text>}
                            keyExtractor={(item) => item.toString()}
                            ListEmptyComponent={
                                <EmptyComponent title={t("Data not available")} />
                            }
                        />
                    </ScrollView>
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
const EmptyComponent = ({ title }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{title}</Text>
    </View>
);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        fontFamily: 'Poppins-Regular'
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
    WorkoutDataCol: {
        borderBottomWidth: 1,
        marginRight: '5%',
        marginLeft: '5%',
        borderColor: "#d4d4d4",
        marginBottom: '5%',
        paddingBottom: '5%'
    },
    WorkoutDataLastCol: {
        marginRight: '5%',
        marginLeft: '5%',
        borderColor: "#d4d4d4",
        marginBottom: '5%',
    },
    WorkoutTitle: {
        marginBottom: 8,
        height: 25
    },
    WorkoutDataContainer: {
        height: 30,
        marginBottom: "5%"
    },

    WorkoutFieldContainer: {
        borderWidth: 1,
        borderRadius: 30,
        width: "90%",
        backgroundColor: '#fcfbfb',
        borderColor: '#ecebeb'
    },
    WorkoutFieldSubContainer1: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderColor: '#ecebeb'
    },
    WorkoutFieldSubContainer2: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    TextInputRow: {
        borderWidth: 1,
        borderRadius: 40,
        backgroundColor: '#fcfbfb',
        borderColor: '#ecebeb',
        justifyContent: 'center',
    },
    btn:
    {
        backgroundColor: '#F1C40E',
        alignItems: 'center',
        borderRadius: 20,
        marginRight: '5%',
        marginLeft: '5%',
        marginBottom: "5%"
    },
    btn_container:
    {
        alignItems: 'center',
        height: 40,
    },
    btn_text:
    {
        color: '#233842',
        fontSize: 18,
        fontWeight: "bold",
        justifyContent: 'center',
    },
})