import React, { Component } from 'react';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';
import AppNavigator from './src/Routes';
import { useFonts } from 'expo-font';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

export default props => {

	let [fontsLoaded] = useFonts({
		'Poppins-Regular': require('./assets/Fonts/Poppins-Regular.ttf'),
		'Poppins-Medium': require('./assets/Fonts/Poppins-Medium.ttf'),
		'Poppins-SemiBold': require('./assets/Fonts/Poppins-SemiBold.ttf'), 
		'Poppins-Bold': require('./assets/Fonts/Poppins-Bold.ttf'), 
	});

	if (!fontsLoaded) {
		return (
			<ActivityIndicator
				style={styles.loading}
				size="large"
				color="#102b46"
			/>
		);
	} else {
		return (
			<AppNavigator style={styles.container} />
		);
	}
};


// export default class App extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       fontLoaded: false
//     }
//   }

//   componentDidMount() {
//     this._loadFontsAsync();
//   }
//   _loadFontsAsync = async () => {
//     // loadAsync returns true | error
//     let fontsLoaded = await Font.loadAsync({
//       // add as many fonts as you want here .... 
//       'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
//     });
//     this.setState({ fontLoaded: fontsLoaded });
//   };
  
//     // async componentDidMount() {
//   //   try {
//   //     await Font.loadAsync({
//   //       'Poppins-Bold': require('./assets/Fonts/Poppins-Bold.ttf'),
//   //     })
//   //     this.setState({ fontLoaded: true })
//   //   } catch (error) {
//   //     console.log(error)
//   //     return
//   //   }
//   // }

//   // render() {
//   //   const { fontLoaded } = this.state

//     render() {
//       const { fontLoaded } = this.state

//       if (!fontLoaded) {
//         return <ActivityIndicator
//         style={styles.loading}
//         size="large"
//         color="#65be44"
//       />;
//       }
//       // from the custom App we return the component we assigned to RootApp.
//       return <AppNavigator style={styles.container} />;
//     }


//     // if (!fontLoaded) {
//     //   return (
//     //     <ActivityIndicator
//     //       style={styles.loading}
//     //       size="large"
//     //       color="#65be44"
//     //     />
//     //   )
      
//     // }
//     // return (
//     //   <AppNavigator style={styles.container} />
//     // );

//   // }
// }


const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '100%',
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
})
