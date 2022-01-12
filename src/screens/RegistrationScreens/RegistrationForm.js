import React, {Component} from 'react';
import {
  Text,
  Dimensions,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  Image,
  Alert
} from 'react-native';
import Header from '../Components/HeaderView';
import images from '../../../assets';
import CustomeFont from '../../../CustomeFont';
import RegistrationTextField from '../Components/RegistrationTextField';
import Appcolor from '../../../Appcolor';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import GooglePlacesInput from '../Components/AutoCompletePage'; 
import SmartLoader from '../Components/SmartLoader';
 import {launchCamera, launchImageLibrary} from 'react-native-image-picker'; // Migration from 2.x.x to 3.x.x => showImagePicker API is removed.
 import ImagePicker from 'react-native-image-crop-picker';
 import Resizer from "react-image-file-resizer";
import MyStatusBar from '../Components/MyStatusBar';

const width = Dimensions.get('window').width;

export default class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      endUserRadio: true,
      selectedIndex: 0,
      showAutoComplete : false,
      resourcePath: {},
      username:"",
      firstname:"",
      lastname:"",
      email:"",
      password:"",
      confirmpassword:"",
      website:"",
      clientid:"",
      profession:"",
      hobbies:"",
      desc:"",
      selectedAddress:"",
      city:"",
      state:"",
      lat:"",
      long:"",
      country:"",
      postcode:""
    };
  }


//     resizeFile = (file) =>
//   new Promise((resolve) => {
//     Resizer.imageFileResizer(
//       file,
//       300,
//       400,
//       "JPEG",
//       50,
//       0,
//       (uri) => {
//         resolve(uri);
//       },
//       "base64"
//     );
//   });
//   dataURIToBlob = (dataURI) => {
//   const splitDataURI = dataURI.split(",");
//   const byteString =
//     splitDataURI[0].indexOf("base64") >= 0
//       ? atob(splitDataURI[1])
//       : decodeURI(splitDataURI[1]);
//   const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
//   const ia = new Uint8Array(byteString.length);
//   for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
//   return new Blob([ia], { type: mimeString });
// };

  checkValidation = async () =>{
    var alertmsg = ""
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (this.state.endUserRadio === false)
      {
        if (this.state.username === "")
        {
        alertmsg = "Please enter username"
        alert(alertmsg)
        return
        }
        else if (this.state.username.length < 3)
        {
          alertmsg = "Username should be minimum 3 characters long"
          alert(alertmsg)
        return
        }
        else  if (this.state.firstname === "")
        {
        alertmsg = "Please enter first name"
        alert(alertmsg)
        return
        }
        else if (this.state.firstname.length < 3)
        {
          alertmsg = "First name should be minimum 3 characters long"
          alert(alertmsg)
        return
        }
        else  if (this.state.lastname === "")
        {
        alertmsg = "Please enter last name"
        alert(alertmsg)
        return
        }
        else if (this.state.lastname.length < 3)
        {
          alertmsg = "Last name should be minimum 3 characters long"
          alert(alertmsg)
        return
        }
        else  if (this.state.email === "")
        {
        alertmsg = "Please enter email"
        alert(alertmsg)
        return
        }
        else if (reg.test(this.state.email) === false)
        {
          alertmsg = "Please enter valid email"
          alert(alertmsg)
        return
        }
        else if (this.state.password === "")
        {
          alertmsg = "Please enter password"
          alert(alertmsg)
        return
        }
        else if (this.state.confirmpassword === "")
        {
          alertmsg = "Please enter confirm password"
          alert(alertmsg)
        return
        }
        else if (this.state.website === "")
        {
          alertmsg = "Please enter website"
          alert(alertmsg)
        return
        }
       else if (this.state.profession === "")
        {
          alertmsg = "Please enter profession"
          alert(alertmsg)
        return
        }
        else if (this.state.hobbies === "")
        {
          alertmsg = "Please enter hobbies"
          alert(alertmsg)
        return
        }
        else if (this.state.desc === "")
        {
          alertmsg = "Please enter description"
          alert(alertmsg)
        return
        }
        else if (this.state.selectedAddress === "")
        {
          alertmsg = "Please select your location"
          alert(alertmsg)
        return
        }
        else
        {
          const formData = new FormData()
          formData.append('username', this.state.username);
          formData.append('first_name', this.state.firstname);
          formData.append('last_name', this.state.lastname);
          formData.append('email', this.state.email);
          formData.append('password', this.state.password);
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
          if (this.state.clientid.length > 0)
          {
            formData.append('unique_client_id', this.state.clientid);

          }
         
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
        this.signUpApi(formData)
        }

  }
  else
    {
      if (this.state.username === "")
      {
      alertmsg = "Please enter username"
      alert(alertmsg)
      return
      }
      else if (this.state.username.length < 3)
      {
        alertmsg = "Username should be minimum 3 characters long"
        alert(alertmsg)
      return
      }
      else  if (this.state.firstname === "")
      {
      alertmsg = "Please enter first name"
      alert(alertmsg)
      return
      }
      else if (this.state.firstname.length < 3)
      {
        alertmsg = "First name should be minimum 3 characters long"
        alert(alertmsg)
      return
      }
      else  if (this.state.lastname === "")
      {
      alertmsg = "Please enter last name"
      alert(alertmsg)
      return
      }
      else if (this.state.lastname.length < 3)
      {
        alertmsg = "Last name should be minimum 3 characters long"
        alert(alertmsg)
      return
      }
      else  if (this.state.email === "")
      {
      alertmsg = "Please enter email"
      alert(alertmsg)
      return
      }
      else if (reg.test(this.state.email) === false)
      {
        alertmsg = "Please enter valid email"
        alert(alertmsg)
      return
      }
      else if (this.state.password === "")
      {
        alertmsg = "Please enter password"
        alert(alertmsg)
      return
      }
      else if (this.state.confirmpassword === "")
      {
        alertmsg = "Please enter confirm password"
        alert(alertmsg)
      return
      }
      else if (this.state.profession === "")
      {
        alertmsg = "Please enter profession"
        alert(alertmsg)
        return
      }
      else if (this.state.hobbies === "")
      {
        alertmsg = "Please enter hobbies"
        alert(alertmsg)
        return
      }
      else if (this.state.desc === "")
      {
        alertmsg = "Please enter description"
        alert(alertmsg)
        return
      }
      else if (this.state.selectedAddress === "")
      {
        alertmsg = "Please select your location"
        alert(alertmsg)
        return
      }
      else
      {
        const formData = new FormData()
        formData.append('username', this.state.username);
        formData.append('first_name', this.state.firstname);
        formData.append('last_name', this.state.lastname);
        formData.append('email', this.state.email);
        formData.append('password', this.state.password);
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
      this.signUpApi(formData) 
      return
      }

  }
    
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
        console.log(image);
        console.log(image.path);
  
        this.setState({
          resourcePath:image
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
         console.log(image.path);
  
        this.setState({
          resourcePath:image
        })
      });
  
    }
   


  };



  signUpApi(parameters) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data',
    },
        body: parameters
    };
    console.log(parameters)
    console.log(requestOptions)
     fetch("https://www.pixidium.net/rest/signup/", requestOptions)
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
                  "Profile Created Successfully",
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

  render() {
    return (
      <ScrollView style={{ backgroundColor:'white'}}>
<SmartLoader isLoading={this.state.isLoading}/>
<MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />

        <KeyboardAvoidingView   behavior={Platform.OS === "ios" ? "padding" : null}  >
          <GooglePlacesInput modalVisible={this.state.showAutoComplete} callback={(data)=>{
           if (data !== undefined)
           {
            // {formattedAddress:details.formatted_address,geometryData:details.geometry,city:city,
              // country:country,pincode:pincode,state:state}
           console.log(data)
            this.setState({
              showAutoComplete:false,
              selectedAddress:data.formattedAddress,
              city:data.city,
              state:data.state,
              country:data.country,
              lat:data.geometryData.location.lat,
              long:data.geometryData.location.lng,
              postcode:data.pincode
            })
          }
          else
          {
            this.setState({
              showAutoComplete:false,
             })
          }
          }}/>
          <View style={{flexDirection:'row',height:64}}>
          <Header
            goBack={() => {
              this.props.navigation.goBack();
            }}
            title={'Registration'}
          />
          <Text style={{flex:1,color:'black'}}>Registration</Text>
          </View>
          <View style={{justifyContent:'center',width:'100%',alignItems:'center',marginTop:15,flexDirection:'row'}}>
          <SegmentedControl
            values={['End User', 'Ambassador']}
            selectedIndex={this.state.selectedIndex}
            backgroundColor={'#F8F8F8'}
            tintColor={Appcolor.appColor}
            fontStyle ={{color:Appcolor.appColor}}
            activeFontStyle = {{color:'white'}}
             style={{width:320}}
             onChange={event => {
              this.setState({
                selectedIndex: event.nativeEvent.selectedSegmentIndex,
              },()=>{
                 
                  this.setState({
                    endUserRadio:this.state.selectedIndex == 0 ? true : false
                  })
                 
              });
            }}
          />
          {/* <TouchableOpacity onPress={()=>{
            this.setState({
              selectedIndex:0
            })
          }} style={{backgroundColor:this.state.selectedIndex == 0 ? Appcolor.appColor:'white',width:140,height:35,justifyContent:'center',alignItems:'center',marginEnd:15,borderWidth:1,borderRadius:2}}>
            <Text style={{color: this.state.selectedIndex == 0 ? 'white' : Appcolor.appColor,fontFamily:CustomeFont.Helvetica,fontSize:15}}>End User</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            this.setState({
              selectedIndex:1
            })
          }} style={{backgroundColor:this.state.selectedIndex == 1 ? Appcolor.appColor:'white',width:140,height:35,justifyContent:'center',alignItems:'center',borderWidth:1,borderRadius:2}}>
            <Text style={{color: this.state.selectedIndex == 1 ? 'white' : Appcolor.appColor,fontFamily:CustomeFont.Helvetica,fontSize:15}}>Ambassador</Text>
          </TouchableOpacity> */}
          </View>
          <View style={this.styles.imageContainer}>
            <View style={this.styles.imageView}>
              <Image
               // source={images.user}
                 source={{ uri: this.state.resourcePath.path }}
                 style={this.styles.imageView}
              />
            </View>
            <TouchableOpacity onPress={this.mediaPickerAlert}  style={this.styles.cameraView}>
              <Image
                source={images.camera}
                style={{width: 14, height: 10, tintColor: 'gray'}}
              />
            </TouchableOpacity>
          </View>
          <RegistrationTextField
          editable={true}
            oncallback={(text)=>{
              this.setState({
                username:text
              })
            }}
            title={'Username:'}
            placeholder={'Username'}
            keyboardType={'ascii-capable'}
          />
          <RegistrationTextField
          editable={true}
           oncallback={(text)=>{
            this.setState({
              firstname:text
            })
          }}
            title={'First Name:'}
            placeholder={'First Name'}
            keyboardType={'ascii-capable'}
          />
          <RegistrationTextField
          editable={true}
           oncallback={(text)=>{
            this.setState({
              lastname:text
            })
          }}
            title={'Last Name:'}
            placeholder={'Last Name'}
            keyboardType={'ascii-capable'}
          />
          <RegistrationTextField
          editable={true}
           oncallback={(text)=>{
            this.setState({
              email:text
            })
          }}
            title={'Email:'}
            placeholder={'Email'}
            keyboardType={'email-address'}
          />
          <RegistrationTextField
          editable={true}
           oncallback={(text)=>{
            this.setState({
              password:text
            })
          }}
            title={'Password:'}
            placeholder={'********'}
            keyboardType={'ascii-capable'}
            secureTextEntry={true}
          />
          <RegistrationTextField
          editable={true}
           oncallback={(text)=>{
            this.setState({
              confirmpassword:text
            })
          }}
            title={'Confirm Password:'}
            placeholder={'********'}
            keyboardType={'ascii-capable'}
            secureTextEntry={true}

          />
         
         <RegistrationTextField
              editable={true}
               oncallback={(text)=>{
                this.setState({
                  website:text
                })
              }}
                title={'Website:'}
                placeholder={'Profession'}
                keyboardType={'ascii-capable'}
              />
               {this.state.endUserRadio ? null : (
            <View>
               
              <RegistrationTextField
              editable={true}
               oncallback={(text)=>{
                this.setState({
                  clientid:text
                })
              }}
                title={'Client Id:'}
                placeholder={'Profession'}
                keyboardType={'ascii-capable'}
              />
            </View>
          )}
          <RegistrationTextField
          editable={true}
           oncallback={(text)=>{
            this.setState({
              profession:text
            })
          }}
            title={'Profession:'}
            placeholder={'Profession'}
            keyboardType={'ascii-capable'}
          />
          <RegistrationTextField
          editable={true}
           oncallback={(text)=>{
            this.setState({
              hobbies:text
            })
          }}
            title={'Hobbies:'}
            placeholder={'Hobbies'}
            keyboardType={'ascii-capable'}
          />
          <RegistrationTextField
          editable={true}
           oncallback={(text)=>{
            this.setState({
              desc:text
            })
          }}
            title={'Description:'}
            placeholder={'Description'}
            keyboardType={'ascii-capable'}
          />
         

<View style={{  marginVertical:4,flexDirection:'row',marginHorizontal:30,alignItems:'center'}}>
                <Text style={{fontFamily:CustomeFont.Helvetica,fontSize:13,marginEnd:5,width:115}}>Location:</Text>
                <View style={{borderColor:'rgba(0,0,0,0.3)',borderRadius:2,borderWidth:1,flex:1,height:35,justifyContent:'center',paddingHorizontal:10,paddingTop:4 }}>
                <TouchableOpacity onPress={()=>{
            this.setState({showAutoComplete:true})
          }}>
          
                <View>
                <Text 
                   style={{fontFamily:CustomeFont.Helvetica,fontSize:14,height:35,paddingTop:Platform.OS === 'android' ? 0 : 0}}
                >{this.state.selectedAddress}</Text>
                 
                </View>
                </TouchableOpacity>
                </View>
            </View>

          <TouchableOpacity disabled={this.state.isLoading} style={this.styles.button} onPress={()=>{
            this.checkValidation()
          }}>
            <Text style={this.styles.buttontitle}>SUBMIT</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }

  styles = StyleSheet.create({
    imageContainer: {
      // position: 'absolute',
      marginTop: 35,
      width: width,
      height: 80,
      //left : width
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
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

 