import React from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, Text, View, ScrollView, Image, AsyncStorage } from 'react-native';
import { Row, Col } from 'react-native-easy-grid';
import { singleMemberAction } from "../../../util/action.js";
import moment from 'moment';
import { t } from '../../../../locals';

// import Member-ID from '../../../images/Member-ID.png';

export default class PersonalDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      dataSource: [],
    };
  }

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
    this.setState({ dataSource: [] });
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
      console.log(responseJson);
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
        <View style={styles.container}>
          <ScrollView
            refreshControl={
              <RefreshControl
                colors={["#102b46"]}
                refreshing={this.state.loading}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
          >
            <Col>

              <Row style={{ backgroundColor: '', alignItems:'center', paddingVertical: 20, marginLeft: '5%', marginRight: '5%', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', }}>
                <Col style={{ backgroundColor: '', width: '23%', justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ height: 35, width: 35, }}
                    source={require('../../../images/Group-Yellow-512.png')}
                  />
                </Col>
                <Col style={{ justifyContent:'center' }}>
                  <Row style={{ alignItems:'center', }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Bold' , color: '#102b46', }}>{t("Membership")}</Text>
                  </Row>
                  <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                    <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Poppins-Regular' , opacity: 0.7 }}>{dataSource.membership_name}</Text>
                  </Row>
                </Col>
              </Row>

              <Row style={{ backgroundColor: '', alignItems:'center', paddingVertical: 20, marginLeft: '5%', marginRight: '5%', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', }}>
                <Col style={{ backgroundColor: '', width: '23%', justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ height: 35, width: 35, }}
                    source={require('../../../images/date-yellow-512.png')}
                  />
                </Col>
                <Col style={{ justifyContent:'center' }}>
                  <Row style={{ alignItems:'center' }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Bold' , color: '#102b46', }}>{t("Expiry Date")}</Text>
                  </Row>
                  <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                    <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Poppins-Regular' , opacity: 0.7 }}>{dataSource.membership_valid_to}</Text>
                  </Row>
                </Col>
              </Row>

              <Row style={{ backgroundColor: '', alignItems:'center', paddingVertical: 20, marginLeft: '5%', marginRight: '5%', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', }}>
                <Col style={{ backgroundColor: '', width: '23%', justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ height: 35, width: 35, }}
                    source={require('../../../images/Class-Yellow-512.png')}
                  />
                </Col>
                <Col style={{ justifyContent:'center' }}>
                  <Row style={{ alignItems:'center' }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Bold' , color: '#102b46', }}>{t("Classes")}</Text>
                  </Row>
                  {(dataSource.class_name != null) ? (
                    <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                      <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Poppins-Regular' , opacity: 0.7 }}>{dataSource.class_name}</Text>
                    </Row>
                  ) : (
                    <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                      <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Poppins-Regular' , opacity: 0.7 }}>{t("Not available class")}</Text>
                    </Row>
                  )}

                </Col>
              </Row>

              <Row style={{ backgroundColor: '', alignItems:'center', paddingVertical: 20, marginLeft: '5%', marginRight: '5%', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', }}>
                <Col style={{ backgroundColor: '', width: '23%', justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ height: 35, width: 35, }}
                    source={require('../../../images/interest.png')}
                  />
                </Col>
                <Col style={{ justifyContent:'center' }}>
                  <Row style={{ alignItems:'center' }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Bold' , color: '#102b46', }}>{t("Interest Area")}</Text>
                  </Row>
                  {(dataSource.interest_area != null) ? (
                    <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                      <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Poppins-Regular' , opacity: 0.7 }}>{dataSource.interest_area}</Text>
                    </Row>
                  ) : (
                    <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                      <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Poppins-Regular' , opacity: 0.7 }}>{t("Not available interest area")}</Text>
                    </Row>
                  )}

                </Col>
              </Row>

              <Row style={{ backgroundColor: '', alignItems:'center', paddingVertical: 20, marginLeft: '5%', marginRight: '5%', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', }}>
                <Col style={{ backgroundColor: '', width: '23%', justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ height: 35, width: 35, }}
                    source={require('../../../images/Staff Member-Yellow-512.png')}
                  />
                </Col>
                <Col style={{ justifyContent:'center' }}>
                  <Row style={{ alignItems:'center' }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Bold' , color: '#102b46', }}>{t("Staff Member")}</Text>
                  </Row>
                  {(dataSource.staff_member_name != null) ? (
                    <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                      <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Poppins-Regular' , opacity: 0.7 }}>{dataSource.staff_member_name}</Text>
                    </Row>
                  ) : (
                    <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                      <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Poppins-Regular' , opacity: 0.7 }}>{t("Not available staff member name")}</Text>
                    </Row>
                  )}

                </Col>
              </Row>

              <Row style={{ backgroundColor: '', alignItems:'center', paddingVertical: 20, marginLeft: '5%', marginRight: '5%', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', }}>
                <Col style={{ backgroundColor: '', width: '23%', justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ height: 35, width: 35, }}
                    source={require('../../../images/Status-Yellow-512.png')}
                  />
                </Col>
                <Col style={{ justifyContent:'center' }}>
                  <Row style={{ alignItems:'center' }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Bold' , color: '#102b46', }}>{t("Status")}</Text>
                  </Row>
                  <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                    <Text style={{ fontSize: 12, color: 'gray', opacity: 0.7 , fontFamily: 'Poppins-Regular'}}>{dataSource.membership_status}</Text>
                  </Row>
                </Col>
              </Row>

              <Row style={{ backgroundColor: '', alignItems:'center', paddingVertical: 20, marginLeft: '5%', marginRight: '5%', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', }}>
                <Col style={{ backgroundColor: '', width: '23%', justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ height: 35, width: 35, }}
                    source={require('../../../images/Group-Yellow-512.png')}
                  />
                </Col>
                <Col style={{ justifyContent:'center' }}>
                  <Row style={{ alignItems:'center' }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Bold' , color: '#102b46', }}>{t("Groups")}</Text>
                  </Row>
                  {(dataSource.group_name != null) ? (
                    <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                      <Text style={{ fontSize: 12, color: 'gray', opacity: 0.7 , fontFamily: 'Poppins-Regular'}}>{dataSource.group_name}</Text>
                    </Row>
                  ) : (
                    <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                      <Text style={{ fontSize: 12, color: 'gray', opacity: 0.7 , fontFamily: 'Poppins-Regular'}}>{t("Not available Groups")}</Text>
                    </Row>
                  )}

                </Col>
              </Row>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});