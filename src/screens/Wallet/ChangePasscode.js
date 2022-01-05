

import React, { Component } from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    Alert,
    Text
  } from 'react-native';
 import CustomeFont from '../../../CustomeFont';
import images from '../../../assets'
import TextInputView from '../Components/TextInputView';
import CommonLoginHeader from '../Components/CommonLoginHeader'
import SmartLoader from '../Components/SmartLoader';
import MyStatusBar from '../Components/MyStatusBar'
import Appcolor from '../../../Appcolor'
import {
  getUserType,
 getAccessToken,
} from '../../Utilities/LocalStorage';




export default class ChangePasscode extends Component {
   
  constructor(props){
    super(props);
    this.state={
      accessToken:'',
      isLoading:false,
      newPasscode : '',
      oldPassword:''
    };
  }

  componentDidMount()
{
  
  const { navigation } = this.props;
  this.focusListener = navigation.addListener("focus", () => {
     this.load()
    
  });

  
}

load = () =>{
  if (this.state.accessToken === undefined || this.state.accessToken === '')
  {
    getAccessToken().then(token=>{
      console.log(token)
      this.setState({
        accessToken:token
      })
    }) 
  }
  
 
}
   
callUpdatePasscodeApi = () => {
 if (this.state.oldPassword === "")
 {
  alert('Please enter current password')
 }
  else if (this.state.newPasscode === "")
  {
      alert('Please enter new passcode')
  }
  else if (this.state.newPasscode !== this.state.confirmPasscode)
  {
     alert("New passcode doesn't match with confirmed passcode")
  }
  else
  {
  const formData = new FormData();
  formData.append('passcode', this.state.newPasscode);
  formData.append('password', this.state.oldPassword);

  
   this.setState({
    isLoading: true,
  });
console.log(this.state.newPasscode)
  // loginApi(formData).then(data=>{
  //     console.log(data.status)
  // })
  const requestOptions = {
    method: 'POST',
    headers: {accept: 'application/json',"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken},
    body: formData,
  };
  console.log(requestOptions);
  fetch('https://dev.pixidium.net/rest/passcode/change_passcode/', requestOptions)
    .then(response => {
      return response.json();
    })
    .then(data => {
        console.log('kkkk ')
      console.log(data); //REF 1;
      this.setState({
        isLoading: false,
      });
      if (data !== undefined && data.status === 200) {
          Alert.alert(
              data.message,
              "",
              [
                
                { text: "Ok", onPress: () => {
                  this.props.navigation.pop()
                }}
              ]
            );
           
           
      }
      else if (data.non_field_errors !== undefined)
      {
          alert(data.non_field_errors[0].message)
      }
      else if (data.message !== undefined)
      {
          alert(data.message)
      }
      else if (data.error !== undefined)
      {
          alert(data.error)  
      }
    })
    .catch(err => {
      console.log('ERROR: ' + err);
      this.setState({
        isLoading: false,
      });
    });
  }
};



    
    
      render() {
        return (
          <View style={{backgroundColor:'white',flex: 1,}}>
             <SmartLoader isLoading={this.state.isLoading}/>
          <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />
<CommonLoginHeader isBackBtn={true} pop={()=>{this.props.navigation.pop()}} openProfile={()=>{
                  this.props.navigation.navigate('Account')
                }} isProfileBtn={true} pageTitle={"PIXIDIUM"} onPress={()=>{
    this.props.navigation.replace('Login')
}}/>
             <ScrollView style={{flex:1}} >
                 {/* <View style={this.styles.container} > */}
          <View style={{marginHorizontal:20,flex:1}}>
         <TextInputView
          subtitleName="Current Password"
          placeholder="********"
          returnType="next"
          autoCapitalize='none'
          maxLength = {50}
          imageName={images.password}
         // value={email.value}
          onTextChange={(text) => {
            this.setState({
              oldPassword:text
            })
          }}
          
        />
        <TextInputView
        subtitleName="New Passcode"
        placeholder= "********"
        returnType="next"
        imageName={images.password}
        maxLength = {4}
       // value={email.value}
       onTextChange={(text) => {
        this.setState({
          newPasscode:text
        })
      }}   
      />
      <TextInputView
      subtitleName="Confirm Passcode"
      placeholder="********"
      returnType="next"
      imageName={images.password}
      maxLength={4}
      onTextChange={(text) => {
        this.setState({
          confirmPasscode:text
        })
      }}
       
    />
             </View>
             {/* <LinearGradient colors={['#3C91CF', '#255C84']} style={{...this.styles.socialButton,height:48,width:'80%',marginTop:30}}> */}
          <TouchableOpacity
            style={this.styles.socialButton}
            onPress={()=>{this.callUpdatePasscodeApi()}}>
            <Text style={this.styles.socialText}>SAVE</Text>
          </TouchableOpacity>
          {/* </LinearGradient> */}
         {/* </View> */}
         </ScrollView>
             </View>
        );
      }

      styles = StyleSheet.create({
          container:{
            flex: 1,
            justifyContent:'center',
            alignItems:'center'
           },
            
          socialButton: {
            height: 44,
           marginHorizontal:20,
           flexDirection: 'row',
           justifyContent: 'center',
           alignItems: 'center',
           borderRadius: 8,
           backgroundColor:Appcolor.buttonBGColor,
           marginTop:20
         },socialText: {
          color: 'white',
          fontFamily:CustomeFont.Helvetica,
          fontSize: 16,
      height:19
          },
          
      })
    }