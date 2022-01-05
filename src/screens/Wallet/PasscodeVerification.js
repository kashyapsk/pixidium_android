import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import images from '../../../assets';
import Appcolor from '../../../Appcolor';
import CustomeFont from '../../../CustomeFont';
import MyStatusBar from '../Components/MyStatusBar';
import CommonLoginHeader from '../Components/CommonLoginHeader';
import {saveUserType,getUserType,getAccessToken} from '../../Utilities/LocalStorage'
import SmartLoader from '../Components/SmartLoader';

export default class PasscodeVerification extends Component {
  constructor(props) {
    super(props);
    this.textField1 = React.createRef();
    this.textField2 = React.createRef();
    this.textField3 = React.createRef();
    this.textField4 = React.createRef();

    this.state = {
      text1: '',
      text2: '',
      text3: '',
      text4: '',
      accessToken:'',
      isLoading:false,
     isLoginBtn:false,
    };
    console.log(props);
  }


  componentDidMount()
      {
        getUserType().then((type)=>{
          this.setState({
            userType:type
          })
        })
        
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
              accessToken:token,
             },()=>{
              console.log('yyyyyyyyyy888888 ====  ')
              console.log(token)
               if (this.state.accessToken !== '' && this.state.accessToken !== undefined)
              {
                  this.setState({
                      showLoginBtn:false
                  },()=>{
                    this.checkPasscodeApi()
                  })
              }
              else
              {
                Alert.alert(
                  "Login required",
                  "",
                  [
                    
                    { text: "Login", onPress: () => {
                      this.props.navigation.replace('Login')
                    }},
                    { text: "Cancel", onPress: () => {
                      this.props.navigation.navigate('Home')
                    }},
                  ]
                );
                  
              }
              
                  })
          }) 
        }
        else if (this.state.accessToken.length > 0)
        {
          this.checkPasscodeApi()
        }
        
        this.setState({
           text1:'',
          text2:'',
          text3:'',
          text4:''
        })
        
      }

      checkPasscodeApi = () => {
 
         
           this.setState({
          isLoading: true,
        });
        
        const requestOptions = {
          method: 'POST',
          headers: {accept: 'application/json',"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken},
           
        };
        console.log(requestOptions);
        fetch('https://dev.pixidium.net/rest/passcode/check_passcode/', requestOptions)
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
            }
            else if (data.status === 400)
            {
              this.props.navigation.navigate('SetPasscode',{isFromPassVeri:true});
            }
          })
          .catch(err => {
            console.log('ERROR: ' + err);
            this.setState({
              isLoading: false,
            });
          });
         
      };


      callVerifyPasscodeApi = () => {
 
        if (this.state.text1 === "" || this.state.text2 === "" || this.state.text3 === "" || this.state.text4 === "")
        {
            alert('Please enter passcode')
        }
        
        else
        {
        const formData = new FormData();
        formData.append('passcode', this.state.text1+this.state.text2+this.state.text3+this.state.text4);
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
        fetch('https://dev.pixidium.net/rest/passcode/verify_passcode/', requestOptions)
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
              this.props.navigation.navigate('Wallet');
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
    

  handleText = tag => {
    switch (tag) {
      case 1:
        this.textField2.focus();
        break;
      case 2:
        this.textField3.focus();

        break;
      case 3:
        this.textField4.focus();

        break;
      case 4:
        this.showNextScreen();
        break;

      default:
        break;
    }
  };

  setTextValue = str => {
    if (this.state.text1 === '') {
      console.log(11);

      this.setState(
        {
          text1: str,
        },
        () => {
          if (str !== '') {
            this.handleText(1);
          }
        },
      );
    } else if (this.state.text2 === '') {
      console.log(22);

      this.setState(
        {
          text2: str,
        },
        () => {
          if (str !== '') {
            this.handleText(2);
          }
        },
      );
    } else if (this.state.text3 === '') {
      console.log(33);

      this.setState(
        {
          text3: str,
        },
        () => {
          if (str !== '') {
            this.handleText(3);
          }
        },
      );
    } else if (this.state.text4 === '') {
      console.log(44);

      this.setState(
        {
          text4: str,
        },
        () => {
          if (str !== '') {
            this.handleText(4);
          }
        },
      );
    }
  };

  showNextScreen = () => {
    this.callVerifyPasscodeApi()
    
  };

  render() {
    return (
      <View style={{backgroundColor:'white', flex:1}}>
        <SmartLoader isLoading={this.state.isLoading}/>

      <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />
        <CommonLoginHeader
          openProfile={() => {
            this.props.navigation.navigate('Account');
          }}
          isProfileBtn={true}
          pageTitle={'PIXIDIUM'}
          onPress={() => {
            this.props.navigation.replace('Login');
          }}
        />
        <ScrollView style={this.styles}>
          <View style={{alignContent:'center',justifyContent:'center',flex: 1,marginTop:80}}>
          <KeyboardAvoidingView
            style={{alignItems: 'center', paddingVertical: 15}} enabled={true} behavior={Platform.OS === "ios" ? "padding" : null}>
            <Text
              style={{
                marginBottom: 10,
                marginTop: 30,
                 fontFamily: CustomeFont.Helvetica,
                fontSize: 12,
              }}>
              Enter Passcode
            </Text>

            <View style={this.styles.inputContainer}>
              <View style={this.styles.inputContainerSubV}>
                <TextInput
                                autoCapitalize='none'

                  value={this.state.text1}
                  style={this.styles.inputText}
                  secureTextEntry={true}
                  maxLength={1}
                  onChangeText={value => {
                    this.setState({text1: value}, () => {
                      if (value !== '') {
                        this.handleText(1);
                      }
                    });
                  }}
                  ref={ref => {
                    this.textField1 = ref;
                  }}
                />
                {/* <View style={this.styles.textInputSV}></View> */}
              </View>
              <View style={this.styles.inputContainerSubV}>
                <TextInput
                  value={this.state.text2}
                  secureTextEntry={true}
                  style={this.styles.inputText}
                  maxLength={1}
                  onChangeText={value => {
                    this.setState({text2: value}, () => {
                      if (value !== '') {
                        this.handleText(2);
                      }
                    });
                  }}
                  ref={ref => {
                    this.textField2 = ref;
                  }}
                />
                {/* <View style={this.styles.textInputSV}></View> */}
              </View>
              <View style={this.styles.inputContainerSubV}>
                <TextInput
                  value={this.state.text3}
                  secureTextEntry={true}
                  style={this.styles.inputText}
                  maxLength={1}
                  onChangeText={value => {
                    this.setState({text3: value}, () => {
                      if (value !== '') {
                        this.handleText(3);
                      }
                    });
                  }}
                  ref={ref => {
                    this.textField3 = ref;
                  }}
                />
                {/* <View style={this.styles.textInputSV}></View> */}
              </View>
              <View style={this.styles.inputContainerSubV}>
                <TextInput
                  value={this.state.text4}
                  secureTextEntry={true}
                  style={this.styles.inputText}
                  maxLength={1}
                  onChangeText={value => {
                    this.setState({text4: value}, () => {
                      if (value !== '') {
                        this.handleText(4);
                      }
                    });
                  }}
                  ref={ref => {
                    this.textField4 = ref;
                  }}
                />
                {/* <View style={this.styles.textInputSV}></View> */}
              </View>
            </View>

            <View style={this.styles.numberRow}>
              <TouchableOpacity
                style={this.styles.numberV}
                onPress={() => {
                  this.setTextValue('1');
                }}>
                <Text style={this.styles.numberText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={this.styles.numberV}
                onPress={() => {
                  this.setTextValue('2');
                }}>
                <Text style={this.styles.numberText}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={this.styles.numberV}
                onPress={() => {
                  this.setTextValue('3');
                }}>
                <Text style={this.styles.numberText}>3</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={this.styles.numberV}
                onPress={() => {
                  this.setTextValue('4');
                }}>
                <Text style={this.styles.numberText}>4</Text>
              </TouchableOpacity>
            </View>
            <View style={this.styles.numberRow}>
              <TouchableOpacity
                style={this.styles.numberV}
                onPress={() => {
                  this.setTextValue('5');
                }}>
                <Text style={this.styles.numberText}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={this.styles.numberV}
                onPress={() => {
                  this.setTextValue('6');
                }}>
                <Text style={this.styles.numberText}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={this.styles.numberV}
                onPress={() => {
                  this.setTextValue('7');
                }}>
                <Text style={this.styles.numberText}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={this.styles.numberV}
                onPress={() => {
                  this.setTextValue('8');
                }}>
                <Text style={this.styles.numberText}>8</Text>
              </TouchableOpacity>
            </View>
            <View style={this.styles.numberRow}>
              <TouchableOpacity
                style={this.styles.numberV}
                onPress={() => {
                  this.setTextValue('9');
                }}>
                <Text style={this.styles.numberText}>9</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={this.styles.numberV}
                onPress={() => {
                  this.setTextValue('0');
                }}>
                <Text style={this.styles.numberText}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                 // this.props.navigation.pop();
                }}
                style={{...this.styles.numberV, paddingTop: 10}}>
                <Image
                  source={images.lessThan}
                  style={{width: 15, height: 15}}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{...this.styles.numberV, opacity: 0}}>
                <Text style={{...this.styles.numberText, opacity: 0}}>""</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          <TouchableOpacity onPress={()=>{
            this.props.navigation.navigate('ChangePasscode')
           }}>
          <Text
            style={{
              marginStart: 50,
              fontFamily: CustomeFont.Helvetica,
              fontSize: 13,
              color: '#434343',
              marginTop: 4,
            }}>
            Forgot Passcode?
          </Text></TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    );
  }

  styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 20,
    },
    textInputSV: {
      width: 24,
      height: 2,
      backgroundColor: Appcolor.appColor,
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignContent: 'center',
    },
    inputText: {
       fontFamily: CustomeFont.Helvetica_Bold,
      fontSize: 30,
      width: 30,
      textAlign: 'center',
      color: 'black',
       textAlign:'center',
      // backgroundColor:'green',
       alignSelf:'baseline'
     },
    inputContainerSubV: {
       justifyContent:'center',
      height:70,
     // backgroundColor:'red',
      alignContent:'center'
    },
    numberRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      width: '90%',
      marginTop: 30,
    },
    numberV: {
      flexDirection: 'column',
      width: 35,
      height: 35,
      borderRadius: 28,
      borderWidth: 0,
      borderColor: '#448CCD',
      justifyContent: 'center',
    },
    numberText: {
      fontFamily: CustomeFont.Helvetica,
      fontSize: 30,
      color: 'black',
      textAlign: 'center',
    },
  });
}
