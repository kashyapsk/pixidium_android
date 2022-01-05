import React, {Component} from 'react';
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Text,
  KeyboardAvoidingView,
  Alert,
  TextInput
} from 'react-native';
import CommonLoginHeader from '../Components/CommonLoginHeader';
import images from '../../../assets';
import Appcolor from '../../../Appcolor';
import CustomeFont from '../../../CustomeFont';
import MyStatusBar from '../Components/MyStatusBar';
import RegistrationTextField from '../Components/RegistrationTextField';
import {
  saveAccessToken,
  getUserType,
  getAccessToken,
} from '../../Utilities/LocalStorage';
import SmartLoader from '../Components/SmartLoader';
import ImagePicker from 'react-native-image-crop-picker';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endUserRadio: false,
      selectedIndex: 0,
      isLoading: false,
      username: '',
      firstname: '',
      lastname: '',
      email: '',
        website: '',
      accessToken: '',
      isLoading: false,
      showLoginBtn: true,
      profile_image:'',
      resourcePath: {},
      userType:'',
      profession:''

    };
  }

  componentDidMount() {
    getUserType().then(type=>{
      this.setState({
        userType:type
      },()=>{
        
          this.setState({
            endUserRadio: type === 'ambassdor' ? false : true
          })
        
      })
    })
    this.load();
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      getUserType().then(type=>{
        this.setState({
          userType:type
        },()=>{
          
            this.setState({
              endUserRadio: type === 'ambassdor' ? false : true
            })
          
        })
      })
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
              },()=>{
                this.getProfileData()
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
      },()=>{
        this.getProfileData()
      });
    }

    this.setState({
      isLoading: true,
    });
  };

  getProfileData() {
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.accessToken,
      },
    };
    console.log(requestOptions);
    fetch('https://dev.pixidium.net/rest/profile/', requestOptions)
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        this.setState(
          {
            isLoading: false,
          },
          () => {
            console.log(responseData);
            if (responseData !== undefined && responseData.status === 200) {
              this.setState({
                username: responseData.data.username,
                firstname:responseData.data.first_name,
                lastname:responseData.data.last_name,
                website:responseData.data.website,
                desc:responseData.data.description,
                profession:responseData.data.profession,
                hobbies:responseData.data.hobbies,
                profile_image:responseData.data.profile_image
              });
            }
          },
        );
      })
      .catch(error => {
        console.log(error);
        this.setState({
          isLoading: false,
        });
      });
  }


  selectFile = (type) => {
    if (type === 'camera')
    {

      ImagePicker.openCamera({
        width: 100,
        height: 100,
        cropping: true,
        mediaType:'photo'
      }).then(image => {
        console.log(image)
         console.log(image.sourceURL);
        console.log(image.path);
         this.setState({
          resourcePath:image,
          profile_image:image.path
        })
      });
    }
    else
    {
      ImagePicker.openPicker({
        width: 100,
        height: 100,
        cropping: true,
        mediaType:'photo'
      }).then(image => {
        console.log(image)
        console.log(image.sourceURL);
        console.log(image.path);
  
        this.setState({
          resourcePath:image,
          profile_image:image.path

        })
      });
  
    }
 
  };

  mediaPickerAlert = () =>
  Alert.alert(
    "Choose Option",
    "",
    [
      {
        text: "Camera",
        onPress: () => {
          this.selectFile("camera")
        },
        
      },
      {
        text: "Gallery",
        onPress: () => {
          this.selectFile("photo")
        },
        
      },
      { text: "Cancel", onPress: () => console.log("OK Pressed") }
    ]
  );


  showLogoutAlert() {
    Alert.alert('Are you sure you want to logout?', '', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          this.logout();
        },
      },
    ]);
  }

  logout() {
    this.setState({
      isLoading: true,
    });
    saveAccessToken('');
    this.setState(
      {
        isLoading: false,
      },
      () => {
        this.props.navigation.replace('Login');
      },
    );
  }



  checkValidation = async () =>{
    var alertmsg = ""
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

     if (this.state.firstname === "")
    {
    alertmsg = "Please enter first name"
    }
    else if (this.state.firstname.length < 3)
    {
      alertmsg = "First name should be minimum 3 characters long"
    }
    else  if (this.state.lastname === "")
    {
    alertmsg = "Please enter last name"
    }
    else if (this.state.lastname.length < 3)
    {
      alertmsg = "Last name should be minimum 3 characters long"
    }
    // else if (this.state.website === "")
    // {
    //   alertmsg = "Please enter website"
    // }
   else if (this.state.userType !== 'enduser')
    {
     if (this.state.profession === "")
    {
      alertmsg = "Please enter profession"
    }
    else if (this.state.hobbies === "")
    {
      alertmsg = "Please enter hobbies"
    }
    else if (this.state.desc === "")
    {
      alertmsg = "Please enter description"
    }
   if (alertmsg === "")
    {
 
  const formData = new FormData()
  formData.append('username', this.state.username);
  formData.append('first_name', this.state.firstname);
  formData.append('last_name', this.state.lastname);
  formData.append('email', this.state.email);
   formData.append('website', this.state.website);
  formData.append('lat', this.state.lat);
  formData.append('long', this.state.long);
  formData.append('city', this.state.city);
  formData.append('state', this.state.state);
  formData.append('country', this.state.country);
  formData.append('location_str', this.state.selectedAddress);
  formData.append('postal_code', this.state.postcode);
  formData.append('description', this.state.desc);
  formData.append('hobbies', this.state.hobbies);
  formData.append('profession', this.state.profession);

  if (this.state.resourcePath.path !== undefined)
  {
    console.log("this.state.resourcePath.sourceURL,")
    formData.append('profile_image', {
      name: 'profile_image',
      type: 'image/jpeg',
      uri: this.state.resourcePath.path,
    });
  }
  
this.setState({
  isLoading:true
})
this.updateProfile(formData)
return
    }
    else
    {
      alert(alertmsg)
      return
    }
    }
    else if (this.state.profession === "")
      {
        alertmsg = "Please enter profession"
      }
      else if (this.state.hobbies === "")
      {
        alertmsg = "Please enter hobbies"
      }
      else if (this.state.desc === "")
      {
        alertmsg = "Please enter description"
      }
      
    
    if (alertmsg === "")
{
   
    const formData = new FormData()
    formData.append('username', this.state.username);
    formData.append('first_name', this.state.firstname);
    formData.append('last_name', this.state.lastname);
    formData.append('email', this.state.email);
     formData.append('website', this.state.website);
    formData.append('lat', this.state.lat);
    formData.append('long', this.state.long);
    formData.append('city', this.state.city);
    formData.append('state', this.state.state);
    formData.append('country', this.state.country);
    formData.append('location_str', this.state.selectedAddress);
    formData.append('postal_code', this.state.postcode);
    formData.append('description', this.state.desc);
    formData.append('profession', this.state.profession);
    formData.append('hobbies', this.state.hobbies);
    formData.append('user_type', 'EndUser');

    if (this.state.resourcePath.path !== undefined)
  {
    formData.append('profile_image', {
      name: 'profile_image',
      type: 'image/jpeg',
      uri: this.state.resourcePath.path,
    });
  }
  this.setState({
    isLoading:true
  })
  this.updateProfile(formData) 
  return
}
else{
  alert(alertmsg)
  return
}
  }

  updateProfile(parameters) {

    const requestOptions = {
      method: 'POST',
     
    headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data',Authorization: 'Bearer ' + this.state.accessToken
    },
        body: parameters
    };
    console.log(JSON.stringify(parameters))
    console.log(requestOptions)
     fetch("https://dev.pixidium.net/rest/api/update-profile/", requestOptions)
        .then(response => {
           return response.json()
        }
            )
        .then(responseData =>
          {
            this.setState({
              isLoading:false
            },()=>{
              console.log(responseData)
               if (responseData !== undefined && responseData.status === 200 )
              {
                Alert.alert(
                  "Profile Updated Successfully",
                  "",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        this.props.navigation.goBack();
                      },
                      
                    }
                  ]
                );
              }
              else if (responseData.error !== undefined)
              {
                alert(responseData.error)
              }
              {

              }
          })       
        })
                .catch(error =>{ console.log(error)
                this.setState({
                  isLoading:false
                })});


     
  }


  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <MyStatusBar
          backgroundColor={Appcolor.appColor}
          barStyle="light-content"
        />
        <SmartLoader isLoading={this.state.isLoading} />

        <CommonLoginHeader
          pop={() => {
            this.props.navigation.pop();
          }}
          isBackBtn={true}
          pageTitle={'PIXIDIUM'}
          onPress={() => {
            this.props.navigation.replace('Login');
          }}
          isLogoutBtn={false}
          logoutAction={() => {
            this.showLogoutAlert();
          }}
          paddingEnd={70}
        />
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        <KeyboardAvoidingView   behavior={Platform.OS === "ios" ? "padding" : null}  >

             <View style={this.styles.imageContainer}>
              <View style={this.styles.imageView}>
                {this.state.profile_image === '' ? null :
                <Image
                   //source={{ uri: this.state.resourcePath.path }}
                   source={{uri:this.state.profile_image}}
                   style={this.styles.imageView}
                />}
              </View>
              <TouchableOpacity onPress={this.mediaPickerAlert}  style={this.styles.cameraView}>
                <Image
                  source={images.camera}
                  style={{width: 14, height: 10, tintColor: 'gray'}}
                />
            </TouchableOpacity>
            </View>
            <RegistrationTextField
              editable={false}
              value={this.state.username}
              title={'Username:'}
              placeholder={'Username'}
              keyboardType={'ascii-capable'}
              oncallback={text => {
                this.setState({
                  username: text,
                });
              }}
            />
            <RegistrationTextField
            editable={true}
              value={this.state.firstname}
              title={'First Name:'}
              placeholder={'First Name'}
              keyboardType={'ascii-capable'}
              oncallback={text => {
                this.setState({
                  firstname: text,
                });
              }}
            />
            <RegistrationTextField
            editable={true}
              value={this.state.lastname}
              title={'Last Name:'}
              placeholder={'Last Name'}
              keyboardType={'ascii-capable'}
              oncallback={text => {
                this.setState({
                  lastname: text,
                });
              }}
            />
            <RegistrationTextField
            editable={false}
            value={this.state.email}
              title={'Email:'}
              placeholder={'Email'}
              keyboardType={'email-address'}
              oncallback={text => {
                this.setState({
                  email: text,
                });
              }}
            />
           
            {this.state.endUserRadio ? false : (
              <View>
                <RegistrationTextField
                editable={true}
                value={this.state.website}
                  title={'Website:'}
                  placeholder={'Website'}
                  keyboardType={'ascii-capable'}
                  oncallback={text => {
                    this.setState({
                      website: text,
                    });
                  }}
                />
                
              </View>
            )}
            <RegistrationTextField
            editable={true}
            value={this.state.profession}
              title={'Profession:'}
              placeholder={'Profession'}
              keyboardType={'ascii-capable'}
              oncallback={text => {
                this.setState({
                  profession: text,
                });
              }}
            />
            {}
            <RegistrationTextField
            editable={true}
            value={this.state.hobbies}
              title={'Hobbies:'}
              placeholder={'Hobbies'}
              keyboardType={'ascii-capable'}
              oncallback={text => {
                this.setState({
                  hobbies: text,
                });
              }}
            />
            

<View style={{  marginVertical:4,marginHorizontal:30,alignItems:'flex-start'}}>
                <Text  style={{fontFamily:CustomeFont.Helvetica,fontSize:12,marginEnd:5,marginBottom:6,width:115}}>Description:</Text>
                <View style={{borderRadius:2,flex:1,height:80,borderColor:'rgba(0,0,0,0.3)',
                borderWidth:1,justifyContent:'center',paddingHorizontal:10,paddingTop:12,width:width-60 }}>
                <TextInput 
                multiline
               // ellipsizeMode={'head'}
                  value={this.state.desc}
                onChangeText={(text)=>{
                    console.log(text)
                    this.setState({
                      desc: text,
                    })
                }}
                autoCapitalize='none'
                keyboardType={'ascii-capable'}
                 style={{color:'black',paddingVertical:0,fontFamily:CustomeFont.Helvetica,fontSize:14,height:80,paddingBottom:Platform.OS === 'android' ? 0 : 0}}
                />
                </View>
            </View>

            {/* <RegistrationTextField
            title={'Location:'}
            placeholder={'Location'}
            keyboardType={'ascii-capable'}
            oncallback={(text)=>{
              this.setState({
                username:text
              })
            }}
          /> */}
            <TouchableOpacity onPress={()=>{
              this.checkValidation()
            }} style={this.styles.button}>
              <Text style={this.styles.buttontitle}>SUBMIT</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }

  styles = StyleSheet.create({
    imageContainer: {
      // position: 'absolute',
      marginTop: 25,
      width: width,
      height: 80,
      //left : width
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    imageView: {
      width: 80,
      height: 80,
      //position:'absolute',
      backgroundColor: 'white',
      borderRadius: 80 / 2,
      borderWidth: 2,
      borderColor: 'gray',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioTitle: {
      fontFamily: CustomeFont.Helvetica,
      fontSize: 14,
      textAlign: 'left',
      marginEnd: 10,
      width: 170,
    },
    cameraView: {
      width: 26,
      height: 26,
      position: 'absolute',
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 13,
      bottom: 0,
      left: width / 2 + 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingStart: 2,
      // left: 10,
    },
    radioView: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'black',
    },
    radiocontainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 60,
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
