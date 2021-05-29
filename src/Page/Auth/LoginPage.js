import React, { Component } from "react";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  ImageBackground,
  Linking,
  StatusBar,
  Alert,
  PointPropType,
  AsyncStorage,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { storage } from '../../util/storage.js';
import normalize from 'react-native-normalize';
import DropdownAlert from 'react-native-dropdownalert';
import { Col, Row } from "react-native-easy-grid";
import { ActivityIndicator } from "react-native-paper";
import Dialog, {
  DialogContent,
  SlideAnimation,
  DialogTitle,
  DialogButton,
  DialogFooter,
} from "react-native-popup-dialog";
import validate from "validate.js";
import { loginAction } from "../../util/action";
import {t} from '../../../locals';

export default class LoginPage extends Component {
  /*Login=()=>{
        Alert.alert(
          'Alert',
          'Login SuccessFully.',
          [                    
            {text: 'OK', onPress: ()=>this.props.navigation.navigate('Dashboard')}
          ],
        )
      }*/

  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      Password: "",
      visible: false,
      validationError: "",
      loader: false,
      // Token: '',
      // PopupError: '',
    };
  }

  async componentDidMount() {
    this.setState({ loader: true });
    let email = await AsyncStorage.getItem('email');
    let password = await AsyncStorage.getItem('password');
    this.setState({ email: email, Password: password })
    this.setState({ loader: false });
  }
  
  async login() {
    const { navigate } = this.props.navigation;
    const { email, Password } = this.state;

    var constraints = {
      email: {
        presence: {
          allowEmpty: false,
          message: "^" + t("Email is required"),
        },
        email: {
          message: t("doesn't look like a valid"),
        },
      },
      Password: {
        presence: {
          allowEmpty: false,
          message: "^" + t("password is required"),
        },
      },
    };

    const result = validate(
      { email: this.state.email, Password: this.state.Password },
      constraints
    );

    if (result) {
      // if(result.email && result.password){
      //   this.setState({ PopupError: result.email && result.password})
      //   this.setState({ visible: true });
      //   return false;
      // }
      if (result.email) {
        this.dropdown.alertWithType('error', t('Error'), result.email);
        // this.setState({ validationError: result.email });
        // this.setState({ visible: true });
        return false;
      }
      if (result.Password) {
        this.dropdown.alertWithType('error', t('Error'), result.Password);
        // this.setState({ validationError: result.Password });
        // this.setState({ visible: true });
        return false;
      }
    }
    
    const loginData = {
      username: this.state.email,
      password: this.state.Password,
      role: "customer",
      access_token: this.state.token,
    }
    if (!result) {
    this.setState({ loader: true });
          
      var response = loginAction(loginData).then(function (responseJson) {
        console.log(responseJson)
        if (responseJson.status == 1) {
          this.setState({ loader: false });
          navigate('App');
          AsyncStorage.setItem('email', this.state.email);
          AsyncStorage.setItem('password', this.state.Password);
          storage.storeUserDetail(responseJson.result).then((data) => {
            
          })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.setState({ loader: false });
          navigate("Auth");
          // alert(responseJson.error);
          this.dropdown.alertWithType('error', t('Error'), responseJson.error);
        }
      }.bind(this));
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    const { loader , email , Password } = this.state;
    if (!loader) {
      return (
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={require("../../images/Login-BG-Image.png")}
            style={styles.bg_image}
          >
            <StatusBar />
            <KeyboardAvoidingView
              behavior={Platform.select({ android: "height", ios: "padding" })}
              style={{ flex: 1 }}
            >
              <ScrollView style={{ flexGrow: 1 }}>
                <Col style={{ marginBottom: "10%", marginTop: "30%" }}>
                  <Col
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "4%",
                    }}
                  >
                    <Image
                      style={styles.image}
                      source={require("../../images/Logo.png")}
                    />
                  </Col>

                  <Row style={styles.input}>
                    <Col style={{ width: "15%", justifyContent: "center" }}>
                      <Image
                        style={styles.icon_image}
                        source={require("../../images/Email.png")}
                      />
                    </Col>
                    <Col>
                        <TextInput
                          style={styles.input_email}
                          value={email}
                          onChangeText={email => this.setState({ email : email })}
                          maxLength={30}
                          placeholderTextColor="#ffffff"
                          placeholder={t("Email")}
                          
                        />
                    </Col>
                  </Row>

                  <Row style={styles.input}>
                    <Col style={{ width: "15%", justifyContent: "center" }}>
                      <Image
                        style={styles.icon_image}
                        source={require("../../images/Password.png")}
                      />
                    </Col>
                    <Col>
                        <TextInput 
                          style={styles.input_password}
                          value={Password}
                          onChangeText={ Password => this.setState({ Password : Password })}
                          placeholderTextColor="#ffffff"
                          placeholder={t("Password")}
                          secureTextEntry
                        />
                    </Col>
                  </Row>

                  <TouchableOpacity
                    style={styles.btn}
                    onPress={this.login.bind(this)}
                  >
                    <Row style={styles.btn_container}>
                      <Text style={styles.btn_text}>{t("Login")}</Text>
                    </Row>
                  </TouchableOpacity>

                  <Dialog
                    align="center"
                    visible={this.state.visible}
                    width={0.9}
                    dialogAnimation={
                      new SlideAnimation({
                        slideFrom: "bottom",
                      })
                    }
                    dialogTitle={<DialogTitle title={t("Error")} />}
                    footer={
                      <DialogFooter>
                        <DialogButton
                          text={t("OK")}
                          onPress={() => {
                            this.setState({ visible: false });
                          }}
                        />
                      </DialogFooter>
                    }
                  >
                    <DialogContent>
                      <Text>{this.state.validationError}</Text>
                    </DialogContent>
                  </Dialog>
                  <Row style={styles.signup_container}>
                    <TouchableOpacity style={{width: normalize(220), height: normalize(40),justifyContent: 'center', alignItems: 'center',}}
                      onPress={() =>
                        this.props.navigation.navigate("RegistrationPage")
                      }
                    >
                      <Text style={styles.signup_text}>{t("Signup with Email")}</Text>
                    </TouchableOpacity>
                  </Row>
                </Col>
              </ScrollView>
            </KeyboardAvoidingView>
          </ImageBackground>
          <DropdownAlert ref={ref => (this.dropdown = ref)}/>
        </View>
      );
    } else {
      return (
        <View style={{shadowOffset: { width: 0, height: 1, },elevation: 300,height: Dimensions.get('window').height,backgroundColor:'rgba(0,0,0,0)',}}>
          <ImageBackground
            source={require("../../images/Login-BG-Image.png")}
            style={styles.bg_image}
          >
            <StatusBar />
            <KeyboardAvoidingView
              behavior={Platform.select({ android: "height", ios: "padding" })}
              style={{ flex: 1 }}
            >
              <ScrollView style={{ flexGrow: 1 }}>
                <Col style={{ marginBottom: "10%", marginTop: "30%" }}>
                  <Col
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "4%",
                    }}
                  >
                    <Image
                      style={styles.image}
                      source={require("../../images/Logo.png")}
                    />
                  </Col>

                  <Row style={styles.input}>
                    <Col style={{ width: "15%", justifyContent: "center" }}>
                      <Image
                        style={styles.icon_image}
                        source={require("../../images/Email.png")}
                      />
                    </Col>
                    <Col>
                        <TextInput
                          style={styles.input_email}
                          value={email}
                          onChangeText={email => this.setState({ email : email })}
                          maxLength={30}
                          placeholderTextColor="#ffffff"
                          placeholder={t("Email")}
                          
                        />
                    </Col>
                  </Row>

                  <Row style={styles.input}>
                    <Col style={{ width: "15%", justifyContent: "center" }}>
                      <Image
                        style={styles.icon_image}
                        source={require("../../images/Password.png")}
                      />
                    </Col>
                    <Col>
                        <TextInput 
                          style={styles.input_password}
                          value={Password}
                          onChangeText={ Password => this.setState({ Password : Password })}
                          placeholderTextColor="#ffffff"
                          placeholder={t("Password")}
                          secureTextEntry
                        />
                    </Col>
                  </Row>

                  <TouchableOpacity
                    style={styles.btn}
                    onPress={this.login.bind(this)}
                  >
                    <Row style={styles.btn_container}>
                      <Text style={styles.btn_text}>{t("Login")}</Text>
                    </Row>
                  </TouchableOpacity>

                  <Dialog
                    align="center"
                    visible={this.state.visible}
                    width={0.9}
                    dialogAnimation={
                      new SlideAnimation({
                        slideFrom: "bottom",
                      })
                    }
                    dialogTitle={<DialogTitle title={t("Error")} />}
                    footer={
                      <DialogFooter>
                        <DialogButton
                          text="OK"
                          onPress={() => {
                            this.setState({ visible: false });
                          }}
                        />
                      </DialogFooter>
                    }
                  >
                    <DialogContent>
                      <Text>{this.state.validationError}</Text>
                    </DialogContent>
                  </Dialog>
                  <Row style={styles.signup_container}>
                    <TouchableOpacity style={{width: normalize(220), height: normalize(40),justifyContent: 'center', alignItems: 'center',}}
                      onPress={() =>
                        this.props.navigation.navigate("RegistrationPage")
                      }
                    >
                      <Text style={styles.signup_text}>{t("Signup with Email")}</Text>
                    </TouchableOpacity>
                  </Row>
                </Col>
              </ScrollView>
            </KeyboardAvoidingView>
          </ImageBackground>
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color="#102b46"
            />
        </View>
      );
    }
  }
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emailcontainer: {
    marginRight: "5%",
    marginLeft: "5%",
    backgroundColor: "red",
  },
  input: {
    borderBottomColor: "#848485",
    borderBottomWidth: 1,
    marginRight: "5%",
    marginLeft: "5%",
    // marginTop: "4%",
    // paddingBottom: "4%",
  },
  input_email: {
    color: "#ffffff",
    width: normalize(310),
    height: normalize(50),
    paddingRight: "4%",
    paddingLeft: "2%",
    fontSize: 16,
    fontFamily:'Poppins-Medium'
  },
  icon_image: {
    height: 22,
    left: 20,
    width: 22,
    //justifyContent: 'center',
    //backgroundColor: "blue",
    //opacity: 0.6,
    //marginBottom: '4%',
  },
  passwordcontainer: {
    alignItems: "center",
    opacity: 0.7,
    height: "6%",
  },
  input_password: {
    //height: '80%',
    //width: '100%',
    color: "#ffffff",
    width: normalize(310),
    height: normalize(50),
    //opacity: 0.5,
    //borderBottomWidth: 1,
    //borderBottomColor: 'white',
    paddingRight: "4%",
    //marginRight: '5%',
    paddingLeft: "2%",
    fontSize: 16,
    fontFamily:'Poppins-Medium'
    //paddingBottom: '2%',
  },
  bg_image: {
    flex: 1,
    resizeMode: "stretch",
    //position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  image: {
    height: 140,
    width: 140,
    alignSelf: "center",
  },
  btn: {
    backgroundColor: "#F1C40E",
    alignItems: "center",
    borderRadius: 20,
    //height: '9%',
    marginTop: "8%",
    alignItems: "center",
    marginRight: "5%",
    marginLeft: "5%",
  },
  btn_container: {
    //justifyContent: 'center',
    alignItems: "center",
    height: 40,
  },
  btn_text: {
    color: "#000000",
    fontSize: 18,
    justifyContent: "center",
    fontFamily: 'Poppins-Medium'
  },
  signup_container: {
    //opacity: 0.7,
    //height: '4%',
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5%",
  },
  signup_text: {
    color: "#ffffff",
    //opacity: 0.5,
    fontSize: 17,
    fontFamily: 'Poppins-Medium'
  },
  login_container: {
    marginTop: "7%",
    justifyContent: "center",
    opacity: 0.7,
    height: "4%",
    justifyContent: "center",
  },
  login_text: {
    color: "#ffffff",
    opacity: 0.5,
    fontSize: 17,
  },
  logo_container: {
    opacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "30%",
  },
  errorMsg: {
    color: "red",
    opacity: 0.3,
    paddingLeft: "8%",
  },
  loader: {
    shadowOffset: { width: 0, height: 1, },
    elevation: 300,
    height: Dimensions.get('window').height,
    backgroundColor:'rgba(0,0,0,0.8)',
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  login: {
    marginTop: 70,
    zIndex: 111111,
  },
});
