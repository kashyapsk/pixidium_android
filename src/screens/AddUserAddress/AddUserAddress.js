import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import MyStatusBar from '../Components/MyStatusBar';
import CommonLoginHeader from '../Components/CommonLoginHeader';
import Appcolor from '../../../Appcolor';
import images from '../../../assets';
import CustomeFont from '../../../CustomeFont';
import {getAccessToken} from '../../Utilities/LocalStorage';
import SmartLoader from '../Components/SmartLoader';
import {TextInput} from 'react-native-gesture-handler';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class AddUserAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      isLoading: false,
      showLoginBtn: true,
      selectedItems: this.props.route.params.selectedItems,
      campaign_id:this.props.route.params.campaign_id,
      name: '',
      email: '',
      phoneNumber: '',
      billing_address: '',
      delivery_address: '',
      isMarckChecked: false,
    };
    console.log('selectedItems = ' + this.state.selectedItems);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 4000);
    this.load();
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.load();
    });
  }

  load = () => {
    if (this.state.accessToken === undefined || this.state.accessToken === '') {
      getAccessToken().then(token => {
        this.setState(
          {
            accessToken: token,
          },
          () => {
            if (
              this.state.accessToken !== '' &&
              this.state.accessToken !== undefined
            ) {
              this.setState({
                showLoginBtn: false,
              });
            } else {
              this.setState({
                showLoginBtn: true,
              });
            }
          },
        );
      });
    } else if (
      this.state.accessToken !== '' &&
      this.state.accessToken !== undefined
    ) {
      this.setState({
        showLoginBtn: false,
      });
    }

    this.setState({
      isLoading: true,
    });
  };

  saveData() {
    if (this.state.name === '') {
      alert('Please enter name');
    } else if (this.state.email === '') {
      alert('Please enter email');
    } else if (this.state.phoneNumber === '') {
      alert('Please enter phone number');
    } else if (this.state.billing_address === '') {
      alert('Please enter billing address');
    } else if (this.state.delivery_address === '') {
      alert('Please enter delivery address');
    } else {
      this.props.navigation.navigate('PaymentSelection', {
        orderObject: {
          name: this.state.name,
          email: this.state.email,
          phoneNumber: this.state.phoneNumber,
          billing_address: this.state.billing_address,
          delivery_address: this.state.delivery_address,
          selectedItems: this.state.selectedItems,
          campaign_id:this.state.campaign_id
        },
      });
    }
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <MyStatusBar
          backgroundColor={Appcolor.appColor}
          barStyle="light-content"
        />
        <CommonLoginHeader
          isBackBtn={true}
          pop={() => {
            this.props.navigation.pop();
          }}
          openProfile={() => {
            this.props.navigation.navigate('Account');
          }}
          isProfileBtn={true}
          pageTitle={'PIXIDIUM'}
          onPress={() => {
            this.props.navigation.replace('Login');
          }}
        />
        <ScrollView style={{flex: 1}}>
          <View style={{height: 15, width: '100%'}}></View>
           
          {this.TextField(
            'Enter Your Name',
            'Enter your name',
             1,
            this.state.name,
            (onChangeText = text => {
              console.log(text);
              this.setState({
                name: text,
              });
            }),
            
          )}
          {this.TextField(
            'Enter Your Email',
             'Enter your email',
            1,
            this.state.email,
            (onChangeText = text => {
              console.log(text);
              this.setState({
                email: text,
              });
            }),
            
          )}
          {this.TextField(
            'Enter Your Phone Number',
            'Enter your phone',
             1,
             this.state.phoneNumber,
            (onChangeText = text => {
              console.log(text);
              this.setState({
                phoneNumber: text,
              });
            }),
            
          )}
          {this.TextField(
            'Enter Billing Address',
           'Enter your address',
            4,
            this.state.billing_address,
            (onChangeText = text => {
              console.log(text);
              this.setState({
                billing_address: text,
              });
            }),
             
          )}
          {this.TextField(
            'Enter Delivery Address',
            'Enter your address',
            4,
            this.state.delivery_address,
            (onChangeText = text => {
              console.log(text);
              this.setState({
                delivery_address: text,
              });
            }),
            
          )}
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 20,
              marginTop: 10,
              alignItems: 'center',
              marginBottom:20
            }}>
                {this.state.isMarckChecked ? 
                 <TouchableOpacity
                 onPress={()=>{
                     this.setState({
                         isMarckChecked:!this.state.isMarckChecked
                     },()=>{
                        this.setState({
                           delivery_address:'' 
                        })
                    })
                 }}
                 activeOpacity={1}
                 style={{
                   borderColor: '#bcbcbc',
                   borderWidth: 1,
                   width: 15,
                   height: 15,
                   borderRadius: 2,
                 }}>
                    <Image
                         source={images.check_mark}
                         width={14}
                         height={14}
                         style={{width: 14, height: 14}}
                         resizeMode={'contain'}
                       />
   
                 </TouchableOpacity>
                :  
            <TouchableOpacity
            onPress={()=>{
                this.setState({
                    isMarckChecked:!this.state.isMarckChecked
                },()=>{
                    this.setState({
                       delivery_address:this.state.billing_address 
                    })
                })
            }}
              activeOpacity={1}
              style={{
                borderColor: '#bcbcbc',
                borderWidth: 1,
                width: 15,
                height: 15,
                borderRadius: 2,
              }}>
                 
              </TouchableOpacity>}
            <Text
              style={{
                fontSize: 11,
                marginStart: 10,
                fontFamily: CustomeFont.Helvetica,
                color: 'black',
              }}>
              Same as billing address
            </Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            this.saveData();
          }}
          style={this.styles.button}>
          <Text style={this.styles.buttontitle}>Save Address</Text>
        </TouchableOpacity>
      </View>
    );
  }

  TextField = (title, placeholder, numberOfLine,str, onChangeText) => {
    return (
      <View style={this.styles.textFieldContainer}>
        <Text style={this.styles.textTitle}>{title}</Text>
        <TextInput
          onChangeText={onChangeText}
          value={str}
          autoCapitalize="none"
          multiline={numberOfLine === 1 ? false : true}
          numberOfLines={3}
          placeholder={placeholder}
          style={{
            ...this.styles.textField,
            height: numberOfLine === 1 ? 35 : 80,
          }}
        />
      </View>
    );
  };

  styles = StyleSheet.create({
    textFieldContainer: {
      marginHorizontal: 20,
      paddingVertical: 4,
      marginBottom: 4,
    },
    textField: {
      height: 35,
      color: 'black',
      fontFamily: CustomeFont.helvetica_light,
      fontSize: 13,
      borderWidth: 0.3,
      paddingStart: 6,
      borderRadius: 4,
      borderColor: '#bcbcbc',
    },
    textTitle: {
      color: 'black',
      fontFamily: CustomeFont.Helvetica,
      fontSize: 16,
      marginBottom: 10,
    },
    button: {
      height: 44,
      backgroundColor: Appcolor.buttonBGColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 2,
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 4,
    },
    buttontitle: {
      fontFamily: CustomeFont.Helvetica,
      fontSize: 17,
      color: Appcolor.white,
      letterSpacing: 1,
    },
  });
}
