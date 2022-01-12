import React, { Component } from 'react'
 import { Button, View, Text,Image } from 'react-native';
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';  
import AboutUs from '../AboutUs/AboutUs';
import Account from '../Account/Account';
import Compaigns from '../Compaigns/Compaigns';
import Dashboard from '../Dashboard/Dashboard';
import Home from '../Home/Home';
import InProgress from '../InProgress/InProgress';
import Notifications from '../Notification/Notifications';
import CategoryView from '../CategoryView/CategoryView';
import CampaignDetails from '../CampaignDetails/CampaignDetails';
import images from '../../../assets'
import CustomeFont from '../../../CustomeFont';
import CampaignPreview from '../CampaignPreview/CampaignPreview';
import AddUserAddress from '../AddUserAddress/AddUserAddress';
import AddBankDetails from '../AddBankDetails/AddBankDetails';
import PaymentSelection from '../PaymentSelection/PaymentSelection'; 
import Wallet from '../Wallet/Wallet';
import PasscodeVerification from '../Wallet/PasscodeVerification';
import ChangePasscode from '../Wallet/ChangePasscode';
import SetPasscode from '../Wallet/SetPasscode';
import Appcolor from '../../../Appcolor';
import {getUserType,getAccessToken} from '../../Utilities/LocalStorage'
import SmartLoader from '../Components/SmartLoader';


const Tab = createBottomTabNavigator();
Stack = createStackNavigator()

 export default class Tabbar extends Component {

constructor(props)
{
  super(props);
   this.state={
    userType:'',
    isLoading:true,
    count:0,
    accessToken:''
   }
}

componentDidMount()
{
  
  
  getUserType().then((type)=>{
    this.setState({
      userType:type
    },()=>{
      console.log('rrrr  === ')
      console.log(this.state.userType)
      this.setState({
        isLoading:false
      })
    })
  })
  setTimeout(() => {
    this.setState({
      isLoading:false
    })
  }, 4000);
  
  
}


componentWillReceiveProps(nextProps) {
  console.log(nextProps)
this.load()
 }


 load = () =>{
  console.log('inside tab')

  if (this.state.accessToken === undefined || this.state.accessToken === '')
 {
     getAccessToken().then((token)=>{
         this.setState({
             accessToken:token
         },()=>{
          if (this.state.accessToken !== '' && this.state.accessToken !== undefined)
          {
            this.getNotifications()
          }
         })
     })
 }
 else if (this.state.accessToken !== '' && this.state.accessToken !== undefined)
 {
  this.getNotifications()
 }
 

}


 getNotifications() {

  const requestOptions = {
      method: 'GET',
      headers: { 'Accept': 'application/json','Content-Type': 'application/json',"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken
  },
     
  };
  console.log(requestOptions)
   fetch("https://www.pixidium.net/rest/notifications/", requestOptions)
      .then(response => {
         return response.json()
      }
          )
      .then(responseData =>
        {
          
            console.log(responseData)
             if (responseData !== undefined && responseData.status === 200 )
            {
              this.setState({
                count:responseData.notifications_count
              })
            }
             
      })
              .catch(error =>{ console.log(error)
              this.setState({
                isLoading:false
              })});   
}


  DashboardNavStack = () =>{
    return (
        <Stack.Navigator>
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false ,gestureEnabled: false}}/> 
          <Stack.Screen name="AddBankDetails" component={AddBankDetails} options={{ headerShown: false,gestureEnabled: false }}/> 
          <Stack.Screen name="CampaignDetails" component={CampaignDetails} options={{ headerShown: false,gestureEnabled: false }}/>

          
         </Stack.Navigator>
      );
}
 
AboutUsNavStack = () =>{
    return (
        <Stack.Navigator>
          <Stack.Screen name="AboutUs" component={AboutUs} options={{ headerShown: false,gestureEnabled: false }}/>
          </Stack.Navigator>
      );
}

WalletNavStack = () =>{
  return (
      <Stack.Navigator>
                <Stack.Screen name="PasscodeVerification" component={PasscodeVerification} options={{ headerShown: false,gestureEnabled: false }}/>
        <Stack.Screen name="Wallet" component={Wallet} options={{ headerShown: false,gestureEnabled: false }}/>
        <Stack.Screen name="ChangePasscode" component={ChangePasscode} options={{ headerShown: false,gestureEnabled: false }}/>
        <Stack.Screen name="SetPasscode" component={SetPasscode} options={{ headerShown: false,gestureEnabled: false }}/>

        
        </Stack.Navigator>
    );
}


AccountNavStack = () =>{
    return (
        <Stack.Navigator>
          <Stack.Screen name="Account" component={Account} options={{ headerShown: false ,gestureEnabled: false}}/>
          <Stack.Screen name="ChangePasscode" component={ChangePasscode} options={{ headerShown: false,gestureEnabled: false }}/>
          <Stack.Screen name="PasscodeVerification" component={PasscodeVerification} options={{ headerShown: false,gestureEnabled: false }}/>
          <Stack.Screen name="SetPasscode" component={SetPasscode} options={{ headerShown: false,gestureEnabled: false }}/>
          <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false,gestureEnabled: false }}/>

          </Stack.Navigator>
      );
}

CompaignsNavStack = () =>{
    return (
        <Stack.Navigator>
          <Stack.Screen name="Compaigns" component={Compaigns} options={{ headerShown: false,gestureEnabled: false }}/>
          <Stack.Screen name="CampaignDetails" component={CampaignDetails} options={{ headerShown: false,gestureEnabled: false }}/>
          <Stack.Screen name="CampaignPreview" component={CampaignPreview} options={{ headerShown: false,gestureEnabled: false }}/>

          
         </Stack.Navigator>
      );
}

HomeNavStack = () =>{
  return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false,gestureEnabled: false }}/>
        <Stack.Screen name="CategoryView" component={CategoryView} options={{ headerShown: false,gestureEnabled: false }}/>
        <Stack.Screen name="CampaignPreview" component={CampaignPreview} options={{ headerShown: false,gestureEnabled: false }}/>
        <Stack.Screen name="AddUserAddress" component={AddUserAddress} options={{ headerShown: false ,gestureEnabled: false}}/>
        <Stack.Screen name="PaymentSelection" component={PaymentSelection} options={{ headerShown: false,gestureEnabled: false }}/>

        
       </Stack.Navigator>
    );
}

InProgressNavStack = () =>{
  return (
      <Stack.Navigator>
        <Stack.Screen name="InProgress" component={InProgress} options={{ headerShown: false,gestureEnabled: false }}/>
        <Stack.Screen name="CampaignPreview" component={CampaignPreview} options={{ headerShown: false,gestureEnabled: false }}/>

       </Stack.Navigator>
    );
}

NotificationsNavStack = () =>{
  return (
      <Stack.Navigator>
        <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false,gestureEnabled: false }}/>
        <Stack.Screen name="Compaigns" component={Compaigns} options={{ headerShown: false,gestureEnabled: false }}/>

       </Stack.Navigator>
    );
}

  MainScreen = () =>{
    const imageSize = 65
    const fontSize = 11
    return (
   this.state.userType !== "ambassdor" ?
    
    <Tab.Navigator
    screenOptions={({ route }) => ({
     tabBarIcon: ({color }) => {
     if (route.name === 'Home') {
         
       return <Image source={images.home_tab} style={{width:imageSize,height:imageSize,tintColor:color}}  />
       ;
     } else if (route.name === 'Campaigns') {
       return <Image source={images.camp_tab} style={{width:imageSize,height:imageSize,tintColor:color}}  />
       ;
     }else if (route.name === 'AboutUs') {
       return <Image source={images.about_us_tab} style={{width:imageSize,height:imageSize,tintColor:color}}  />
       ;
     } else if (route.name === 'Notifications') {
       return <Image source={images.notification_tab} style={{width:imageSize,height:imageSize,tintColor:color}}  />
       ;
     } 
     else if (route.name === 'PasscodeVerification') {
      return <Image source={images.wallet_tab} style={{width:imageSize,height:imageSize,tintColor:color}}  />
      ;
    } 
       },
       tabBarLabelStyle:{
        fontFamily:CustomeFont.Helvetica,
        fontSize:fontSize,
        paddingBottom:6
      }
     })}
     tabBarOptions={{
     activeTintColor: Appcolor.appColor,
     inactiveTintColor: 'gray',
     
     tabStyle:{
      borderTopWidth:1,
     borderTopColor:'#12987d'
 },showLabel: false
     }}
   >
      
       <Tab.Screen name="Home" component={this.HomeNavStack} options={{ headerShown: false ,gestureEnabled: false}} />
       <Tab.Screen name="Campaigns" component={this.CompaignsNavStack} options={{ headerShown: false,gestureEnabled: false }}/>
       <Tab.Screen name="AboutUs" component={this.AboutUsNavStack} options={{ headerShown: false,gestureEnabled: false }}/>
       <Tab.Screen name="Notifications" component={this.NotificationsNavStack} options={{ headerShown: false,gestureEnabled: false,tabBarBadge:  this.state.count === 0 ? null : this.state.count,tabBarBadgeStyle:{opacity:this.state.count > 0 ? 1 : 0} }} />
       <Tab.Screen name="PasscodeVerification" component={this.WalletNavStack} options={{ headerShown: false ,gestureEnabled: false}}/>

  </Tab.Navigator>
    
    : 

    <Tab.Navigator
    screenOptions={({ route }) => ({
     tabBarIcon: ({color }) => {
     if (route.name === 'Dashboard') {
         
       return <Image source={images.dashboard_tab} style={{width:imageSize,height:imageSize,tintColor:color}}  />
       ;
     } else if (route.name === 'Campaigns') {
       return <Image source={images.camp_tab} style={{width:imageSize,height:imageSize,tintColor:color}}  />
       ;
     }else if (route.name === 'InProgress') {
       return <Image source={images.in_process_tab} style={{width:imageSize,height:imageSize,tintColor:color}}  />
       ;
     } else if (route.name === 'Notifications') {
       return <Image source={images.notification_tab} style={{width:imageSize,height:imageSize,tintColor:color}}  />
       ;
     } 
     else if (route.name === 'PasscodeVerification') {
      return <Image source={images.wallet_tab} style={{width:imageSize,height:imageSize,tintColor:color}}  />
      ;
    } 
       },
       tabBarLabelStyle:{
        fontFamily:CustomeFont.Helvetica,
        fontSize:fontSize,
        paddingBottom:6
      }
     })}
     tabBarOptions={{
      activeTintColor: Appcolor.appColor,
      inactiveTintColor: 'gray',
      tabStyle:{
         borderTopWidth:1,
        borderTopColor:'#12987d'
    },
    showLabel: false
     }}
   >
      
       <Tab.Screen name="Dashboard" component={this.DashboardNavStack} options={{ headerShown: false,gestureEnabled: false }}/>
       <Tab.Screen name="Campaigns" component={this.CompaignsNavStack} options={{ headerShown: false,gestureEnabled: false }} />
       <Tab.Screen name="InProgress" component={this.InProgressNavStack} options={{ headerShown: false,gestureEnabled: false }}/>
       <Tab.Screen name="Notifications" component={this.NotificationsNavStack} options={{ headerShown: false,gestureEnabled: false ,tabBarBadge: this.state.count === 0 ? null : this.state.count,tabBarBadgeStyle:{opacity:this.state.count > 0 ? 1 : 0}}}/>
       <Tab.Screen name="PasscodeVerification" component={this.WalletNavStack} options={{ headerShown: false,gestureEnabled: false }}/>

   </Tab.Navigator>
   
   )
  
}
 
    render() {
      
        return (
          this.state.isLoading === true ? 
          <Text>loading..</Text>
         // <SmartLoader isLoading={this.state.isLoading}/>
          :
          this.MainScreen()
           );
    }
}



  
 