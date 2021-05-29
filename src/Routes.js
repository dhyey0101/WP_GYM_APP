import React,{Component} from 'react';
import { View , AsyncStorage , ActivityIndicator , StyleSheet } from 'react-native';
import { createSwitchNavigator , createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';

import LoginPage from './Page/Auth/LoginPage';
import RegistrationPage from './Page/Auth/RegistrationPage';
import DrawerStack from './Page/App/DrawerStack';



class AuthLoadingScreen extends Component{

    constructor(){
        super();
        this.state = {
            // loader: false,
        };
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('access_token');
        
        this.props.navigation.navigate(userToken ? 'App' : 'Auth' );
        // this.props.navigation.navigate(userToken ? 'App' : 'App' );
    };

    render(){
        // const { loader } = this.state;
        return(
            <View style={styles.container}>
                {/* <ActivityIndicator 
                    style={styles.loader}
                    size="large"
                    color="#0f4471"
                /> */}
            </View>
        );
    }
}

const AppStack = createStackNavigator({DrawerStack: { screen: DrawerStack} } , { headerMode: 'screen' , })
const AuthStack = createStackNavigator({LoginPage:LoginPage , RegistrationPage: RegistrationPage});

export default createAppContainer(createSwitchNavigator(
    
    {
         AuthLoading: AuthLoadingScreen,
         App: DrawerStack,
         Auth: AuthStack,

    },
    {
        initialRouteName: 'AuthLoading',
    }
));
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

    // loader: {
	// 	position: 'absolute',
	// 	left: 0,
	// 	right: 0,
	// 	top: 0,
	// 	bottom: 0,
	// 	alignItems: 'center',
	// 	justifyContent: 'center'
	// },
});









