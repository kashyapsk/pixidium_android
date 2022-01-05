import AsyncStorage from '@react-native-async-storage/async-storage';
 
 
export async function saveUserType (type) {
    try {
      await AsyncStorage.setItem(
        'usertype',
        type
      );
    } catch (error) {
      // Error saving data
    }
  }; 


export async function saveAccessToken (token){
  try {
    await AsyncStorage.setItem(
      'token',
      token
    );
  } catch (error) {
    // Error saving data
  }
}; 


export async function getAccessToken ()  {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      // We have data!!
      console.log('data get done tokemnnnn')
      console.log(JSON.stringify(token));
      return token
    }
  } catch (error) {
    console.log('token expired')
    // Error retrieving data
  }
};

  export async function getUserType () {
    try {
      const value = await AsyncStorage.getItem('usertype');
      if (value !== null) {
        // We have data!!
        console.log('data get done')
        console.log(value);
        return value
      }
    } catch (error) {
      // Error retrieving data
    }
  };