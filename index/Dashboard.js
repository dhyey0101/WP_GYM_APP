import React,{Component} from 'react';
import { TouchableOpacity,StyleSheet, View , TextInput, Text, Image , ImageBackground , Linking, StatusBar, Alert} from 'react-native';
import { Col, Row } from 'react-native-easy-grid';

export default class Dashboard extends Component {
  

    render(){
        const {navigate} = this.props.navigation;
        return(

            <View style={styles.container}>
                <StatusBar />
                    <ImageBackground source={require('./img/Login-BG-Image.png')} style={styles.bg_image}>
                    <Row style={{height: "15%"}}>
                        <TouchableOpacity style={{width:"33.33%"}}>
                            <Col>
                                <Row style={{backgroundColor:"gray", height:"70%" , justifyContent: "center",paddingTop: "10%"}}>
                                <Image style={styles.icon }
                                    source={require('./img/Workout.png')}
                                />
                                </Row>
                                <Row style={{backgroundColor:"gray" , justifyContent: "center",}}>
                                    <Text style={styles.text}>Workouts</Text>
                                </Row>
                            </Col>
                        </TouchableOpacity>

                        <TouchableOpacity style={{width:"33.33%"}}>
                            <Col>
                                <Row style={{backgroundColor:"gray", height:"70%" , justifyContent: "center",paddingTop: "10%"}}>
                                <Image style={styles.icon }
                                    source={require('./img/Schedule.png')}
                                />
                                </Row>
                                <Row style={{backgroundColor:"gray" , justifyContent: "center",}}>
                                    <Text style={styles.text}>Workouts</Text>
                                </Row>
                            </Col>
                        </TouchableOpacity>

                        <TouchableOpacity style={{width:"33.33%"}}>
                            <Col>
                                <Row style={{backgroundColor:"gray", height:"70%" , justifyContent: "center",paddingTop: "10%"}}>
                                <Image style={styles.icon }
                                    source={require('./img/Plan.png')}
                                />
                                </Row>
                                <Row style={{backgroundColor:"gray" , justifyContent: "center",}}>
                                    <Text style={styles.text}>Workouts</Text>
                                </Row>
                            </Col>
                        </TouchableOpacity>
                    </Row>
                    </ImageBackground>
             </View>
        );
    }
}

const styles = StyleSheet.create({

    container: 
    {
         flex: 1,
    },
    bg_image: 
    {
        flex: 1,
    },
    text:
    {
        color: '#fff',
        fontSize: 16 ,
        opacity: 0.5,
    }, 
    icon:
    {
        height: 40,
        width: 40,
        opacity: 0.5,
     
    }, 
})