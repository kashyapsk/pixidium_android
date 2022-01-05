import React, { Component } from 'react'
import { Image, View,StyleSheet,TouchableOpacity,FlatList,Dimensions,Text } from 'react-native'
import images from '../../assets'
import Appcolor from '../../Appcolor'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/LoginScreen/Login'
import RegistrationForm from '../screens/RegistrationScreens/RegistrationForm'
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword'
import Tabbar from '../screens/Tabbar/Tabbar';
import Profile from '../screens/Profile/Profile'; 
import Account from './Account/Account';
import PasscodeVerification from './Wallet/PasscodeVerification';
import ChangePasscode from './Wallet/ChangePasscode';
import SetPasscode from './Wallet/SetPasscode';
import {getAccessToken} from '../Utilities/LocalStorage'

 const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

export default class Splash extends Component {

    constructor(props){
        super(props);
        this.state={
            flag:true,
            islogin:false
        }
        console.log(this.props)
        this.MainStackScreen = this.MainStackScreen.bind(this);

      }
  
componentDidMount(){
    getAccessToken().then(token=>{
        console.log("yyyy ==",token)
        this.setState({
          islogin:(token !== undefined && token !== ""),
          flag:false
        },()=>{
          console.log('yyyyyyyyyy ====  ')
          console.log(token)
        })
      })
}
    MainStackScreen() {
        return (
          <MainStack.Navigator
          initialRouteName= { this.state.islogin === true ? 'Tabbar' : "Login"} 
          screenOptions={{
            headerShown: false,
          }}>
           <MainStack.Screen name="Login" component={Login} options={{gestureEnabled: false}}/>
           <MainStack.Screen name="RegistrationForm" component={RegistrationForm} options={{gestureEnabled: false}}/>
           <MainStack.Screen name="ForgotPassword" component={ForgotPassword} options={{gestureEnabled: false}}/>
           <MainStack.Screen name="Profile" component={Profile} options={{gestureEnabled: false}}/>
           <MainStack.Screen name="Account" component={Account}  options={{gestureEnabled: false}}/>
           <MainStack.Screen name="PasscodeVerification" component={PasscodeVerification}  options={{gestureEnabled: false}}/>
           <MainStack.Screen name="ChangePasscode" component={ChangePasscode}  options={{gestureEnabled: false}}/>
           <MainStack.Screen name="SetPasscode" component={SetPasscode}  options={{gestureEnabled: false}}/>
           <MainStack.Screen name="Tabbar" component={Tabbar}  options={{gestureEnabled: false}}/>
          </MainStack.Navigator>
        );
      }

    render() {
        return (
            this.state.flag === true ?
            <View style={{flex:1,backgroundColor:Appcolor.white,alignItems:'center', justifyContent:'center'}}>
                    <Image source={images.app_logo} resizeMode={'contain'} style={{ width:200,height:200}} width={200} height={200}/>
            </View>
            :
               <NavigationContainer>
    <RootStack.Navigator mode="modal">
    <RootStack.Screen
      name="Main"
      component={this.MainStackScreen}
      options={{ headerShown: false }}
    />
   </RootStack.Navigator>
    </NavigationContainer>
        )
    }
}
