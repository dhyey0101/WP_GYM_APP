import React from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, Text, View, Image, ScrollView, AsyncStorage } from 'react-native';
import { Row, Col } from 'react-native-easy-grid'
import { singleMemberAction } from "../../../util/action.js";
import moment from 'moment';
import { t } from '../../../../locals';

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

              <Row style={{ backgroundColor: '', alignItems:'center', paddingVertical: 20,  marginLeft: '5%', marginRight: '5%', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', }}>
                <Col style={{ backgroundColor: '', width: '23%', justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ height: 35, width: 35, }}
                    source={require('../../../images/Account-Yellow-512.png')}
                  />
                </Col>
                <Col style={{ justifyContent: 'center' }}>
                  <Row style={{ alignItems:'center',}}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Bold' , color: '#102b46', }}>{t("Member ID")}</Text>
                  </Row>
                  <Row style={{ alignItems: 'center', }}>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular',color: 'gray', opacity: 0.7 }}>{dataSource.member_id}</Text>
                  </Row>
                </Col>
              </Row>

              <Row style={{ backgroundColor: '',alignItems:'center', paddingVertical: 20,marginLeft: '5%', marginRight: '5%', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', }}>
                <Col style={{ backgroundColor: '', width: '23%', justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ height: 35, width: 35, }}
                    source={require('../../../images/date-yellow-512.png')}
                  />
                </Col>
                <Col style={{ justifyContent:'center' }}>
                  <Row style={{ alignItems:'center', }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Bold' , color: '#102b46', }}>{t("Membership Joining Date")}</Text>
                  </Row>
                  <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                    {/* <Text style={{ fontSize: 12, color: 'gray', opacity: 0.7 }}>{moment(dataSource.membership_valid_from).format('MMMM DD,YYYY')}</Text> */}
                    <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Poppins-Regular' , opacity: 0.7 }}>{dataSource.membership_valid_from}</Text>
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
                  <Row style={{ alignItems:'center', }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Bold', color: '#102b46', }}>{t("Membership End Date")}</Text>
                  </Row>
                  <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                    {/* <Text style={{ fontSize: 12, color: 'gray', opacity: 0.7 }}>{moment(dataSource.membership_valid_to).format('MMMM DD,YYYY')}</Text> */}
                    <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Poppins-Regular' , opacity: 0.7 }}>{dataSource.membership_valid_to}</Text>
                  </Row>
                </Col>
              </Row>

              <Row style={{ backgroundColor: '', alignItems:'center', paddingVertical: 20, marginLeft: '5%', marginRight: '5%', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', }}>
                <Col style={{ backgroundColor: '', width: '23%', justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ height: 35, width: 35, }}
                    source={require('../../../images/Membership-Type-Yellow-512.png')}
                  />
                </Col>
                <Col style={{ justifyContent:'center' }}>
                  <Row style={{ alignItems:'center' }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Bold' , color: '#102b46', }}>{t("Member Type")}</Text>
                  </Row>
                  <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                    <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Poppins-Regular' , opacity: 0.7 }}>{dataSource.member_type}</Text>
                  </Row>
                </Col>
              </Row>

              <Row style={{ backgroundColor: '', alignItems:'center', paddingVertical: 20, marginLeft: '5%', marginRight: '5%', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', }}>
                <Col style={{ backgroundColor: '', width: '23%', justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ height: 35, width: 35, }}
                    source={require('../../../images/sand-clock-Yellow-512.png')}
                  />
                </Col>
                <Col style={{ justifyContent:'center' }}>
                  <Row style={{ alignItems:'center' }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins-Bold' ,  color: '#102b46', }}>{t("Membership Status")}</Text>
                  </Row>
                  <Row style={{ backgroundColor: '', alignItems: 'center', }}>
                    <Text style={{ fontSize: 12, color: 'gray', opacity: 0.7 , fontFamily: 'Poppins-Regular'}}>{dataSource.membership_status}</Text>
                  </Row>
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