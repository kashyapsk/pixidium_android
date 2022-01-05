/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {Component} from 'react';
 import { StripeProvider } from '@stripe/stripe-react-native';
  import Splash from './src/screens/splash';
  import messaging from '@react-native-firebase/messaging';
 

import {getAccessToken,saveAccessToken} from './src/Utilities/LocalStorage'
 
   export default class App extends Component {
 
    constructor(props){
      super(props);
      this.state={
        islogin:false
      };
      messaging().getToken()
      .then(fcmToken => {
        console.log("tokkkkk==  ",fcmToken)
          //alert(fcmToken)
          
      }).catch(error => {
          let err = `FCm token get error${error}`
         //alert(err)
   })
    }

 
    render() {
      return (
        <StripeProvider  publishableKey={'pk_test_zMWvwrrnjaRTG93fuuefEWM700i72GZAiX'}
        >
        <Splash isLogin={this.state.islogin}/>
  </StripeProvider>
  );
      }
};

 


  


 