 
import React, { Component } from 'react'
import { Text, View,StyleSheet,Alert,Image,TextInput,KeyboardAvoidingView } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import App from '../../../App'
import Appcolor from '../../../Appcolor'
import images from '../../../assets'
import CustomeFont from '../../../CustomeFont'
import TextField from '../Components/TextField'
import HeaderView from '../Components/HeaderView'
import SmartLoader from '../Components/SmartLoader';
import MyStatusBar from '../Components/MyStatusBar'

export default class ForgotPassword extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
          isLoading: false,
          email: '',
         };
      }

    callForgotPasswdApi = () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (this.state.email === "")
        {
            alert('Please enter email')
        }
        else if (reg.test(this.state.email) === false)
        {
           alert("Please enter valid email")
        }
         
        else
        {
        const formData = new FormData();
        formData.append('email', this.state.email);
         this.setState({
          isLoading: true,
        });
    console.log(this.state.email)
        // loginApi(formData).then(data=>{
        //     console.log(data.status)
        // })
        const requestOptions = {
          method: 'POST',
          headers: {accept: 'application/json'},
          body: formData,
        };
        console.log(requestOptions);
        fetch('https://www.pixidium.net/rest/api/forget-password/', requestOptions)
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
          <ScrollView style={this.styles.background}>
            <KeyboardAvoidingView style={this.styles.background} enabled={true} behavior={Platform.OS === "ios" ? "padding" : null}>
                               <SmartLoader isLoading={this.state.isLoading}/>
                               <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />

                 <HeaderView
            goBack={() => {
              this.props.navigation.goBack();
            }}
            title={'Forgot Password'}
            textColor={Appcolor.appColor}
            buttonColor={Appcolor.appColor}
          />
                <View style={this.styles.imagecontainer}>
                <Image source={images.app_logo} style={this.styles.app_logo} resizeMethod={'resize'} resizeMode={'contain'}/>
                </View>
                <Text style={this.styles.title}>Forgot password</Text>
                 <TextField onChangeText={(text)=>{
                     this.setState({
                         email:text
                     })
                 }} image={images.email} placeholder={"Your Email"} style={{color:'black'}}/>
                 <View style={{marginHorizontal:30,justifyContent:'center',alignItems:'flex-end'}}>
            
                </View>
            <TouchableOpacity style={this.styles.button} onPress={()=>{
                this.callForgotPasswdApi()
            }}>
            <Text style={this.styles.buttontitle}>Send Reset Link</Text>
            </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        )
    }


    styles = StyleSheet.create({
        background:{
            backgroundColor:Appcolor.white,
            flex:1
        },
        title:{
            fontFamily:CustomeFont.Helvetica_Bold,
            fontSize:25,
            color:Appcolor.appColor,
            width:'100%',
            textAlign:'center',
            marginTop:20,
            marginBottom:50
        },
        app_logo:{
            width:"80%",
            height: 120,
         },
        imagecontainer:{
            alignItems:'center',
            justifyContent:'center',
            width:'100%',
            paddingTop:50
         },
         forgottitle:{
             color:Appcolor.appColor,
             fontFamily:CustomeFont.Helvetica,
             fontSize:15
         },
         button:{
             marginHorizontal:30,
             height:48,
             backgroundColor:Appcolor.buttonBGColor,
             justifyContent:'center',
             alignItems:'center',
             marginTop:30,
             marginBottom:20,
             borderRadius:10
          },
          buttontitle:{
              fontFamily:CustomeFont.Helvetica,
              fontSize:17,
              color:Appcolor.white,
              letterSpacing:1
          }
    })
}
