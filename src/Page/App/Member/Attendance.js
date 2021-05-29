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
    FlatList
} from "react-native";
import normalize from 'react-native-normalize';
import { Col, Row } from 'react-native-easy-grid';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Thumbnail, List, ListItem, Separator } from 'native-base';
import { singleMemberAction, classListAction, viewMemberAttendanceListAction } from "../../../util/action.js";
import moment from 'moment';
import { t } from '../../../../locals';

const today = moment().format('YYYY-MM-DD');
const { id, token } = "";
export default class Attendances extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            date: '',
            selectedDate: '',
            dataSource: [],
            classdata: [],
            attendancedata: [],
            collapsed: false,
            markedDay: {},
            selecttitle: t('Select Class'),
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
        this.setState({ loader: true })
        this.singleMember();
        this.ClassList();
        this.viewMemberAttendance();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.singleMember();
            this.ClassList();
            this.viewMemberAttendance();
        });
        this.setState({ loader: false })
    }

    onRefresh() {
        this.setState({ dataSource: [], classdata: [], });
        this.ClassList();
        this.singleMember();
    }
    async ClassList() {
        this.setState({ loader: true });
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");
        this.id = Id;
        this.token = Token;
        const listdata = {
            "current_user_id": Id,
            "access_token": Token,
        };
        classListAction(listdata).then(responseJson => {
            if (responseJson.status == 1) {

                this.setState({
                    classdata: responseJson.result,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
            }
        });
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

    async viewMemberAttendance(cid = null, cname = null) {
        this.setState({ attendancedata: [] });
        const userData = {
            "member_id": this.id,
            "start_date": "2021-01-01",
            "end_date": moment().format("YYYY-MM-DD"),
            "current_user_id": this.id,
            "access_token": this.token,
            "class_id": cid
        };
        this.setState({ collapsed: false, });
        viewMemberAttendanceListAction(userData).then(responseJson => {
            console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({
                    attendancedata: responseJson.result,
                    selecttitle: cname,
                });
                this.setState({ markedDay: this.setDates() });
            }
        });
    }
    setDates() {
        let markedDay = {};
        Object.entries(this.state.attendancedata).map((item) => {
            var d = item[1].date
            if (d === today && item[1].status === "Absent") {
                markedDay[d] = { selected: true, marked: true, dotColor: 'red', selectedColor: '#102b46', selectedborderColor: 'yellow', selectedborderWidth: 1, }
            }
            else if (d === today && item[1].status === "Present") {
                markedDay[d] = { selected: true, marked: true, dotColor: 'green', selectedColor: '#102b46', selectedborderColor: 'yellow', selectedborderWidth: 1, }
            }
            else if (item[1].status === "Absent") {
                markedDay[d] = { marked: true, dotColor: 'red' }
            }
            else {
                markedDay[d] = { marked: true, dotColor: 'green' }
            }
        })

        return markedDay;
    }
    renderItem = ({ item }) => {
        return (
            <View style={styles.container}>
                <CollapseBody style={{ backgroundColor: '#102b46', }}>
                    <ListItem style={{ borderBottomWidth: 2, marginLeft: '5%', marginRight: '5%' }}>
                        <TouchableOpacity onPress={() => { this.viewMemberAttendance(item.class_id, item.class_name,) }} >
                            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Regular', color: '#ffffff', paddingLeft: '5%', }}>{item.class_name}</Text>
                        </TouchableOpacity>
                    </ListItem>
                </CollapseBody>
            </View>
        );
    };


    render() {
        const { dataSource, classdata, collapsed, loader } = this.state;
        console.log(this.state);
        if (!loader) {
            return (
                <View style={{ flex: 1 }}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                colors={["#102b46"]}
                                refreshing={this.state.loading}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    >
                        <Row style={{ height: normalize(50), alignItems: 'center', marginRight: '5%', marginLeft: '5%', }}>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: '#102b46' }}>{dataSource.first_name} {dataSource.last_name}</Text>
                        </Row>

                        <Collapse
                            isCollapsed={this.state.collapsed}
                            onToggle={(isCollapsed) => this.setState({ collapsed: !this.state.collapsed })}
                            style={{ borderWidth: 1, borderColor: '#102b46', borderRadius: 5, marginLeft: '5%', marginRight: '5%', marginBottom: '5%', }}>
                            {(collapsed == true) ? (<CollapseHeader>
                                <Row style={{ paddingLeft: '5%', height: 45, backgroundColor: '#102b46', justifyContent: 'center', alignItems: 'center', }}>
                                    <Col style={{ width: '90%', }}>
                                        <Text style={ClassText}>{this.state.selecttitle}</Text>
                                    </Col>
                                    <Col style={{ width: '10%', }}>
                                        <Image style={{ height: 20, width: 20, }}
                                            source={require('../../../images/down-arrow.png')} />
                                    </Col>
                                </Row>
                            </CollapseHeader>) : (<CollapseHeader>
                                <Row style={{ paddingLeft: '5%', height: 45, backgroundColor: '#102b46', justifyContent: 'center', alignItems: 'center', }}>
                                    <Col style={{ width: '90%', }}>
                                        <Text style={styles.ClassText}>{this.state.selecttitle}</Text>
                                    </Col>
                                    <Col style={{ width: '10%', }}>
                                        <Image style={{ height: 20, width: 20, }}
                                            source={require('../../../images/right-arrow.png')} />
                                    </Col>
                                </Row>
                            </CollapseHeader>)}
                            <CollapseBody style={{ backgroundColor: '#102b46', }}>
                                <FlatList
                                    data={this.state.classdata}
                                    renderItem={this.renderItem}
                                    // renderItem={({item}) => <Text> {item.title}</Text>}
                                    keyExtractor={(item) => item.class_id.toString()}
                                    ListEmptyComponent={
                                        <EmptyComponent title={t("Data not available")} style={{ color: 'white' }} />
                                    }
                                />
                            </CollapseBody>
                        </Collapse>
                        <Calendar
                            monthFormat={'MMMM, yyyy'}
                            theme={{
                                textSectionTitleColor: '#b6c1cd',
                                textSectionTitleDisabledColor: '#102b46',
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#00adf5',
                                dayTextColor: '#2d4150',
                                textDisabledColor: '#d9e1e8',
                                dotColor: '#00adf5',
                                selectedDotColor: 'white',
                                arrowColor: '#102b46',
                                disabledArrowColor: '#d9e1e8',
                                monthTextColor: '#102b46',
                                indicatorColor: '#102b46',
                                textDayFontFamily: 'Poppins-Medium',
                                textMonthFontFamily: 'Poppins-SemiBold',
                                textDayHeaderFontFamily: 'Poppins-Medium',
                                textDayHeaderFontWeight: '300',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 16
                            }}
                            markedDates={{ [today]: { selected: true, marked: true, selectedColor: '#102b46', selectedborderColor: 'yellow', selectedborderWidth: 1, }, }, this.state.markedDay}
                        />
                        <Row style={{ backgroundColor: '', marginLeft: '5%', marginRight: '5%', height: normalize(70), paddingLeft: '5%', borderTopWidth: 1, borderTopColor: '#F4F4F4' }}>
                            <Col style={{ backgroundColor: '', alignItems: 'flex-start', justifyContent: 'center', width: '8%', }}>
                                <Col style={{ backgroundColor: 'green', borderRadius: 50, height: 16, width: 16, borderWidth: 1, borderColor: 'green', }}>
                                </Col>
                            </Col>
                            <Col style={{ backgroundColor: '', alignItems: 'flex-start', justifyContent: 'center', width: '26%', }}>
                                <Text style={{ fontFamily: 'Poppins-Regular', }}>{t("Presente")}</Text>
                            </Col>
                            <Col style={{ backgroundColor: '', alignItems: 'flex-start', justifyContent: 'center', width: '8%', }}>
                                <Col style={{ backgroundColor: 'red', borderRadius: 50, height: 16, width: 16, borderWidth: 1, borderColor: 'red', }}>
                                </Col>
                            </Col>
                            <Col style={{ backgroundColor: '', alignItems: 'flex-start', justifyContent: 'center', width: '26%', }}>
                                <Text style={{ fontFamily: 'Poppins-Regular' }}>{t("Absent")}</Text>
                            </Col>
                        </Row>
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
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: normalize(100),
        marginTop: normalize(50)
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
    emptyText: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        fontSize: 18,
        color: "#fff",
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
    ClassText:{
        ...Platform.select({
            ios:{
                height: 25,
                fontSize: 18, fontFamily: 'Poppins-Bold',
                color: '#ffffff',
            },
            android:{
                fontSize: 18, fontFamily: 'Poppins-Bold',
                color: '#ffffff',
            }
        })
    }
})