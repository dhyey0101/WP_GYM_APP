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
    TouchableHighlight,
} from 'react-native';
import PDFReader from 'rn-pdf-reader-js';
import normalize from 'react-native-normalize';
import { Col, Row } from 'react-native-easy-grid';
import { viewInvoiceAction, sendInvoiceMailAction } from '../../../util/action.js';
import { NavigationEvents } from 'react-navigation';
import { t } from '../../../../locals';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import DropdownAlert from 'react-native-dropdownalert';


//import * as Permissions from 'expo-permissions';

const { width, height } = Dimensions.get("screen");

export default class viewinvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            InvoiceSource: '',
            EmailResponse: '',
            loader: false,
            Name: '',
            ImageLoading: true,
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

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }
    componentDidMount() {
        const { navigation } = this.props;
        this.setState({ loader: true })
        this.viewInvoice();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.viewInvoice();
        });
        this.setState({ loader: false })
    }

    onRefresh() {
        this.viewInvoice();
    }

    async viewInvoice() {

        const data = this.props.navigation.getParam('memberinvoicekey',);
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const Invoice = {
            "current_user_id": Id,
            "access_token": Token,
            "invoice_type": "membership_invoice",
            "invoice_id": data,
        };
        this.setState({ loader: true });
        viewInvoiceAction(Invoice).then(responseJson => {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    InvoiceSource: responseJson.resource,
                    Name: data,
                    loader: false,
                });
                // console.log(this.state.InvoiceSource)
            } else {
                this.setState({ loader: false });
            }
        });
    }

    historyDownload = async (url) => {
        //const Name = this.props.navigation.getParam('membership_name');
        let fileUri = FileSystem.documentDirectory + "Invoice-" + this.state.Name.replace(" ", "") + '.pdf';
        FileSystem.downloadAsync(url, fileUri)
            .then(({ uri }) => {

                this.saveFile(uri);
            })
            .catch(error => {
                console.error(error);
            })
    }
    async sendMail(){
        const data = this.props.navigation.getParam('memberinvoicekey',);
        const Id = await AsyncStorage.getItem("id");
        const Token = await AsyncStorage.getItem("access_token");

        const Invoice = {
            "current_user_id": Id,
            "access_token": Token,
            "invoice_id": data,
        };
        this.setState({ loader: true });
        sendInvoiceMailAction(Invoice).then(responseJson => {
            console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    EmailResponse: responseJson.resource,
                    // Name: data,
                    loader: false,
                });
                // console.log(this.state.InvoiceSource)
                this.dropdown.alertWithType('success', t('Success'), responseJson.error);
            } else {
                this.setState({ loader: false });
                this.dropdown.alertWithType('error', t('Error'), responseJson.error);

            }
        });
    }
    saveFile = async (uri) => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
            Alert.alert(t("File Downloaded!"));
            //const asset = await MediaLibrary.createAssetAsync(uri);
            //MediaLibrary.createAlbumAsync("Download", asset);
            try {
                const asset = await MediaLibrary.createAssetAsync(uri);
                const album = await MediaLibrary.getAlbumAsync('Download');
                if (album == null) {
                    await MediaLibrary.createAlbumAsync('Download', asset, false);
                } else {
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                }
            } catch (e) {
                console.log(e);
            }
        }
        else {
            Alert.alert(t("Permission Not Granted!!"));
            this.saveFile(uri);
        }
    }
    _handleBackButtonClick = () => this.props.navigation.navigate('Feespayment')

    render() {
        const { InvoiceSource, loader } = this.state;
        const { navigate } = this.props.navigation;
        //console.log(this.state);
        if (!loader && InvoiceSource != '') {
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
                            <TouchableOpacity onPress={() => navigate('Feespayment')} style={styles.back_arrow}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("Invoice")}</Text>
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

                    <Row>
                        <PDFReader
                            onLoad={(e) => this.setState({ ImageLoading: true })}
                            onLoadEnd={(e) => this.setState({ ImageLoading: false })}
                            source=
                            {{
                                uri: InvoiceSource
                            }} />
                        <ActivityIndicator
                            style={styles.loading}
                            animating={this.state.ImageLoading}
                            size="large"
                            color="#102b46"
                        />
                    </Row>
                    {Platform.OS == "ios" ? (
                        (InvoiceSource != "") ? (
                            <View>
                                <Row style={{ height: normalize(80), justifyContent: 'flex-end', alignItems: 'center', paddingRight: normalize(20), backgroundColor: '#525659' }}>
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.sendMail();
                                        }}
                                        underlayColor={'#102B46'}
                                        style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#102B46', height: normalize(45), width: normalize(150), borderRadius: 10 }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'Poppins-Bold' , color: '#F1C40E', }}>Send Mail</Text>
                                    </TouchableHighlight>
                                </Row>
                            </View>
                        ) : (
                            <View>
                            </View>
                        )
                    ) : (
                        (InvoiceSource != "") ? (
                            <View>
                                <Row style={{ height: normalize(80), justifyContent: 'flex-end', alignItems: 'center', paddingRight: normalize(20), backgroundColor: '#525659' }}>
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.historyDownload(InvoiceSource);
                                        }}
                                        underlayColor={'#102B46'}
                                        style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#102B46', height: normalize(45), width: normalize(150), borderRadius: 10 }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'Poppins-Bold' , color: '#F1C40E', }}>Download Pdf</Text>
                                    </TouchableHighlight>
                                </Row>
                            </View>
                        ) : (
                            <View>
                            </View>
                        )
                    )}

                    <DropdownAlert ref={ref => this.dropdown = ref} />

                    {/* <TouchableOpacity onPress={() => {
                        this.historyDownload(InvoiceSource);
                        }}
                        style={{
                            height:(50),
                            shadowOffset: {width: 0, height: 0},
                            shadowOpacity: 1,
                            shadowRadius:(8),
                            elevation:(8),
                            borderRadius:(25),
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            paddingLeft:(20),
                            paddingRight:(20),
                        }}>
                        <Text
                            style={{
                            fontSize:(16),
                            }}>
                        Download Pdf
                    </Text>
                    </TouchableOpacity> */}
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
                            <TouchableOpacity onPress={() => navigate('Feespayment')} style={styles.back_arrow}>
                                <Image style={styles.Naveicon}
                                    source={require('../../../images/Back-Arrow-White.png')}
                                />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.name_col}>
                            <Text style={styles.NaveText}>{t("Invoice")}</Text>
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
                height: normalize(50),
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
        fontFamily: 'Poppins-Regular' ,
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