import { AsyncStorage } from "react-native";

export const storage = {
    
    storeUserDetail: async (userData) => {

        await AsyncStorage.setItem('display_name', userData.display_name);
        await AsyncStorage.setItem('first_name', userData.first_name);
        await AsyncStorage.setItem('Last_name', userData.last_name);
        await AsyncStorage.setItem('City_name', userData.city_name);
        await AsyncStorage.setItem('Address', userData.address);
        await AsyncStorage.setItem('email', userData.email);
        // await AsyncStorage.setItem('name', userData.name);
        // await AsyncStorage.setItem('password', userData.password);
        await AsyncStorage.setItem('id',JSON.stringify(userData.id));
        await AsyncStorage.setItem('profile_image',userData.image);
        await AsyncStorage.setItem('access_token', userData.access_token);
                
    },
    
    // updateUserDetail: async (updateData) => {
    //     await AsyncStorage.setItem('address',updateData.address);
    //     await AsyncStorage.setItem('profile_image',updateData.iamge);
    // },

    getUserDetail: async () => {
        let Token = await AsyncStorage.getItem('access_token');
    }
}
