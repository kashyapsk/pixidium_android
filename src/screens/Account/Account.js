
import React, { Component } from 'react'
import { Image, View,StyleSheet,TouchableOpacity,ScrollView,Alert,Text } from 'react-native'
import CommonLoginHeader from '../Components/CommonLoginHeader'
import images from '../../../assets'
import Appcolor from '../../../Appcolor'
import CustomeFont from '../../../CustomeFont'
import MyStatusBar from '../Components/MyStatusBar'
import {getAccessToken,saveAccessToken} from '../../Utilities/LocalStorage'
 export default class Account extends Component {


    constructor(props){
        super(props);
        this.state={
          accessToken:'',
          campaignsArray:[],
          isLoading:false,
          showLoginBtn:true,
           campaignsArray :[]
    
        };
        console.log('home token == ')
    
      }
    
     
      componentDidMount()
      {
        this.load()
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("focus", () => {
           this.load()
          
        });
      
        
      }
      
      load = () =>{
         if (this.state.accessToken === undefined || this.state.accessToken === '')
        {
            getAccessToken().then((token)=>{
                this.setState({
                    accessToken:token
                },()=>{
                    if (this.state.accessToken !== '' && this.state.accessToken !== undefined)
                    {
                        this.setState({
                            showLoginBtn:false
                        })
                    }
                    else
                    {
                        this.setState({
                            showLoginBtn:true
                        })
                    }
                })
            })
        }
        else if (this.state.accessToken !== '' && this.state.accessToken !== undefined)
        {
                this.setState({
                    showLoginBtn:false
                })   
        }
       
      }
    


    render() {
        return (
            <View style={{backgroundColor:'white', flex:1}}>
            <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />

<CommonLoginHeader openProfile={()=>{
                  this.props.navigation.navigate('Account')
                }} isProfileBtn={!this.state.showLoginBtn} paddingStart={20} isLoginBtn={this.state.showLoginBtn} pageTitle={"ACCOUNT"} onPress={()=>{
    this.props.navigation.replace('Login')
}}/>
</View>
        )
    }
    
    


   logoutAction = () =>{
    Alert.alert(
      "Are you sure you want to logout?",
      "" 
      ,
      [
        
        { text: "Yes", onPress: () => {
        saveAccessToken('')
        this.props.navigation.replace('Login')}
     },
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      {
        cancelable: true,
        // onDismiss: () =>
        //   Alert.alert(
        //     "This alert was dismissed by tapping outside of the alert dialog."
        //   ),
      }
    );
  }

showLoginRequired(){
    Alert.alert(
        'Login Required','',[
          { text: "Login", onPress: () => {
            this.props.navigation.replace('Login')
          }},
          { text: "Cancel", onPress: () => {
           }}
        ]
    )
}

      render() {
        return (
            <View style={{backgroundColor:'white', flex:1}}>
            <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />

<CommonLoginHeader  isBackBtn={true}
          pop={() => {
            this.props.navigation.pop();
          }} openProfile={()=>{
                  this.props.navigation.navigate('Account')
                }} isProfileBtn={!this.state.showLoginBtn} paddingStart={20} isLoginBtn={this.state.showLoginBtn} pageTitle={"ACCOUNT"} onPress={()=>{
    this.props.navigation.replace('Login')
}}/>
             <ScrollView>
              <TouchableOpacity style={this.styles.subContainer}
        onPress={() =>{
            if (this.state.showLoginBtn)
            {
                this.showLoginRequired()
            }
            else
            {
                this.props.navigation.navigate('Profile')
            }
          
        }}
        >
          <Image
            source={images.passcode}
            style={this.styles.imageStyle}
            width={14}
            height={14}
            resizeMode={'contain'}
          />
          <Text style={this.styles.textStyle}>Profile</Text>
        </TouchableOpacity>
            
        
        <View style={this.styles.seperatorV}></View>
 
        <TouchableOpacity style={this.styles.subContainer}
        onPress={() =>{
            if (this.state.showLoginBtn)
            {
                this.showLoginRequired()
            }
            else
            {
          this.props.navigation.navigate('SetPasscode',{isFromPassVeri:false})
            }
        }}
        >
          <Image
            source={images.passcode}
            style={this.styles.imageStyle}
            width={14}
            height={14}
            resizeMode={'contain'}
          />
          <Text style={this.styles.textStyle}>Set Passcode</Text>
        </TouchableOpacity>
        <View style={this.styles.seperatorV}></View>

        <TouchableOpacity style={this.styles.subContainer}
         onPress={() =>{
            if (this.state.showLoginBtn)
            {
                this.showLoginRequired()
            }
            else
            {
            this.props.navigation.navigate('ChangePasscode')
            }
        }}
        >
          <Image
            source={images.passcode}
            style={this.styles.imageStyle}
            width={14}
            height={14}
            resizeMode={'contain'}
          />
          <Text style={this.styles.textStyle}>Forgot Passcode</Text>
        </TouchableOpacity>
        {this.state.showLoginBtn ? null :
        <>
        <View style={this.styles.seperatorV}></View>
        <TouchableOpacity style={{...this.styles.subContainer, marginBottom: 20}}
        onPress={()=>{this.logoutAction()}}
        >
          <Image
            source={images.logout}
            style={this.styles.imageStyle}
            width={14}
            height={14}
            resizeMode={'contain'}
          />
          <Text style={this.styles.textStyle}>Logout</Text>
        </TouchableOpacity>
        </>
      }
             </ScrollView>
             </View>
        );
      }


      styles = StyleSheet.create({
        topV: {
          flexDirection: 'row',
          alignContent: 'center',
          paddingHorizontal: 22,
          paddingTop: 25,
        },
        imageContainer: {
          height: 66,
          width: 66,
          borderRadius: 33,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        },
        nameEmailContainer: {
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingHorizontal: 20,
          flex: 1,
        },
        sectionViewText: {
          fontFamily: CustomeFont.Helvetica,
          fontSize: 13,
          color: '#979797',
          marginTop: 5,
          marginBottom: 3,
          paddingHorizontal: 20,
        },
        textStyle: {
          fontFamily: CustomeFont.Helvetica,
          fontSize: 12,color:'black'
        },
        imageStyle: {
          width: 15,
          height: 15,
          marginEnd: 10,
        },
        subContainer: {
          flexDirection: 'row',
           paddingVertical: 10,
        },
        seperatorV: {
          height: 1,
        marginHorizontal:20,
          backgroundColor: 'gray',
          marginVertical: 7,
        },
      });

    }