import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {Modal,View,TouchableOpacity,Image,Text} from 'react-native';
import Appcolor from '../../../Appcolor';
import images from '../../../assets'
import MyStatusBar from '../Components/MyStatusBar'
import CustomeFont from '../../../CustomeFont';
 
const GooglePlacesInput = (props) => {
  return (
      <Modal  animationType="slide"
      transparent={false}
      visible={props.modalVisible}>
                    <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />
              <View style={{ paddingTop:10,paddingRight:15,height:44,backgroundColor:Appcolor.appColor,flexDirection:'row'}}>
              <Text style={{fontFamily:CustomeFont.Helvetica_Bold,fontSize:16,color:'white',flex: 1,textAlign:'center',marginStart:70}}>Search Location</Text>
                <TouchableOpacity onPress={()=>{
                   props.callback()
                }}>
                  <Text style={{fontFamily:CustomeFont.Helvetica_Bold,fontSize:16,color:'white'}}>CLOSE</Text>
                </TouchableOpacity>
              </View>
    <GooglePlacesAutocomplete
    keyboardShouldPersistTaps={'handled'}
    keepResultsAfterBlur={true}
      placeholder='Search'
      returnKeyType={'Search'}
  fetchDetails={true}
      onPress={(data, details = null) => {
        console.log(details)
        var country = ""
        var city = ""
        var state = ""
        var pincode = ""
         details.address_components.forEach(addressComp => {
          if (addressComp.types[0] === "country")
          {
            country = addressComp.long_name
          }
          if (addressComp.types[0] === "administrative_area_level_1")
          {
            state = addressComp.long_name
          }
          if (addressComp.types[0] === "locality")
          {
            city = addressComp.long_name
          }
          if (addressComp.types[0] === "postal_code")
          {
            pincode = addressComp.long_name
          }
        });
        var tmpData  = {formattedAddress:details.formatted_address,geometryData:details.geometry,city:city,
          country:country,pincode:pincode,state:state}

         props.callback(tmpData)
       }}
      styles={{
        container: {
            flex: 1,
           },
        textInputContainer: {
           borderBottomColor:'black',
          borderBottomWidth:1
          },
        textInput: {
          height: 34,
          color: 'black',
          fontSize: 16,
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
        },
      }}
      query={{
        key: 'AIzaSyB6zcqpYvp50hRZ7V7coZM4K9nBBXu5aSo',
        language: 'en',
      }}
    />
    </Modal>
  );
};

export default GooglePlacesInput;