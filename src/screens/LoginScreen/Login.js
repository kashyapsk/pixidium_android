import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import App from '../../../App';
import Appcolor from '../../../Appcolor';
import images from '../../../assets';
import CustomeFont from '../../../CustomeFont';
import TextField from '../Components/TextField';
import {
  saveUserType,
  getUserType,
  saveAccessToken,
} from '../../Utilities/LocalStorage';
 import SmartLoader from '../Components/SmartLoader';
import {loginApi} from '../../NetworkCalls/NetworkCall'
import MyStatusBar from '../Components/MyStatusBar';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username: '',
      password: '',
    };
  }

  showNextScreen = isEndUser => {
    console.log('hfhfghf');
    this.props.navigation.reset({
      index: 0,
      routes: [{name: 'Tabbar', params: {isEndUser: isEndUser}}],
    });
  };

loginApi1= (params)=>{
  const requestOptions = {
    method: 'POST',
    headers: {'Accept': 'application/json'},
    body: params,
  };
  console.log('parameters',params)
  console.log(requestOptions);
  fetch('https://dev.pixidium.net/rest/api/token/', requestOptions)
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
        saveAccessToken(data.access);
        if (data.role !== "Staff")
        {
          saveUserType('enduser')
          this.showNextScreen(false)
        }
        else
        {
          saveUserType('ambassdor')
          this.showNextScreen(false)
        }
           
      }
      else if (data.non_field_errors !== undefined)
      {
          alert(data.non_field_errors[0].message)
      }
      else if (data.error !== undefined)
      {
        alert(data.error)
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

  callLoginApi = () => {

    if (this.state.username === "")
    {
        alert('Please enter username')
    }
    else if (this.state.password === "")
    {
        alert('Please enter password')
    }
    else
    {
    const formData = new FormData();
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);
    this.setState({
      isLoading: true,
    });
    this.loginApi1(formData)
    // loginApi(formData).then(data=>{
    //     console.log(data.status)
    // })
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={this.styles.background} behavior={Platform.OS === "ios" ? "padding" : null}>
        <SmartLoader isLoading={this.state.isLoading} />
        <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />

        <View style={{...this.styles.imagecontainer,marginBottom:60}}>
          <Image
            source={images.app_logo}
            style={this.styles.app_logo}
            resizeMethod={'resize'}
            resizeMode={'contain'}
          />
          <TouchableOpacity
            onPress={() => {
              saveUserType('enduser');
              this.showNextScreen(true);
            }}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: CustomeFont.Helvetica,
                fontSize: 15,
                color: Appcolor.appColor,
              }}>
              SKIP
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Text style={this.styles.title}>Login</Text> */}
        <TextField
          image={images.user}
          placeholder={'Username'}
          onChangeText={text => {
            console.log(text);
            this.setState({
              username: text,
            });
          }}
        />
        <TextField
          secureTextEntry={true}
          image={images.lock}
          placeholder={'********'}
          onChangeText={text => {
            console.log(text);
            this.setState({
              password: text,
            });
          }}
        />
        <View
          style={{
            marginHorizontal: 30,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('ForgotPassword');
            }}>
            <Text style={this.styles.forgottitle}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={this.styles.button}
          onPress={() => {
           
            this.callLoginApi();
          }}>
          <Text style={this.styles.buttontitle}>LOGIN</Text>
        </TouchableOpacity>
        <View
          style={{
            marginHorizontal: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...this.styles.forgottitle,
              marginBottom: 15,
              fontSize: 12,
            }}>
            or
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('RegistrationForm');
            }}>
            <Text style={this.styles.forgottitle}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  styles = StyleSheet.create({
    background: {
      backgroundColor: Appcolor.white,
      flex: 1,
    },
    title: {
      fontFamily: CustomeFont.Helvetica_Bold,
      fontSize: 25,
      color: Appcolor.appColor,
      width: '100%',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 50,
    },
    app_logo: {
      width: '80%',
      height: 120,
       marginStart: 60,
    },
    imagecontainer: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: '100%',
      paddingTop: 50,
      paddingEnd: 20,
      flexDirection: 'row',
      //backgroundColor:'red'
    },
    forgottitle: {
      color: Appcolor.appColor,
      fontFamily: CustomeFont.Helvetica,
      fontSize: 15,
    },
    button: {
      marginHorizontal: 30,
      height: 48,
      backgroundColor: Appcolor.buttonBGColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 20,
      borderRadius: 10,
    },
    buttontitle: {
      fontFamily: CustomeFont.Helvetica,
      fontSize: 17,
      color: Appcolor.white,
      letterSpacing: 1,
    },
  });
}
