import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import Appcolor from '../../../Appcolor';
import images from '../../../assets';
import CustomeFont from '../../../CustomeFont';

export default class CommonLoginHeader extends Component {

  render() {
    return (
      <View style={{width: '100%', paddingTop: 10,backgroundColor:'white'}}>
        <View style={{flexDirection: 'row',alignItems:'center',backgroundColor:'white'}}>
         {this.props.isBackBtn === true ?
         
         <TouchableOpacity
         onPress={() => {
           this.props.pop();
           console.log('ddddddd');
         }}
         style={{
           justifyContent: 'center',
           alignItems: 'center',
           width: 40,
           height: 40,
          // backgroundColor: 'red',
           marginStart: 5,
         }}>
         <Image source={images.arrow_back} style={{width: 25, height: 25,tintColor:Appcolor.appColor}} width={25} height={25} resizeMethod={'resize'} resizeMode={'contain'}/>
       </TouchableOpacity>
         
         : null}
          <Image
            source={images.app_logo}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
               marginStart: this.props.isBackBtn === true ? 10 : 20,
            }}
            resizeMode={'contain'}
          />
          <Text style={{flex:1,textAlign:'center',fontFamily:CustomeFont.Helvetica_Bold,
            fontSize:17,paddingStart: this.props.paddingStart,color:Appcolor.appColor,paddingEnd:this.props.paddingEnd}}>{this.props.pageTitle}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              //flex: 1,
              paddingRight: 20,
              alignItems: 'center',
             // backgroundColor:'red'
            }}>
            {/* <TouchableOpacity style={{marginEnd: 15}}>
              <Text style={{fontFamily: CustomeFont.Helvetica_Bold, fontSize: 15}}>
                Sign Up
              </Text>
            </TouchableOpacity>
            <Text style={{fontFamily: CustomeFont.Helvetica, fontSize: 14}}>
              or
            </Text> */}
            {this.props.isLoginBtn === true ?
            <TouchableOpacity
            onPress={this.props.onPress}
              style={{
                 paddingVertical: 4,
                paddingHorizontal: 15,
                borderRadius:4,
                backgroundColor:Appcolor.buttonBGColor
              }}>
              <Text style={{fontFamily: CustomeFont.Helvetica_Bold, fontSize: 15,color:'white'}}>
                Login
              </Text>
            </TouchableOpacity>
  : null}
  {this.props.isProfileBtn === true ? 
  
  <TouchableOpacity
            onPress={this.props.openProfile}
              style={{
                 justifyContent:'center',
                 alignItems:'center',
                borderRadius:25,
                width:50,
                height:50,
               borderWidth:2,
               borderColor:Appcolor.buttonBGColor,
               backgroundColor:'white'
              }}>
              <Image source={images.user} width={30} height={30} style={{width:30,height:30}} 
              />
            </TouchableOpacity>
  : null}
  {this.props.isLogoutBtn === true ? 
  
  <TouchableOpacity
            onPress={this.props.logoutAction}
              style={{
                 justifyContent:'center',
                 alignItems:'center',
                 height:50,
                borderColor:Appcolor.buttonBGColor,
               backgroundColor:'white'
              }}>
                <Text style={{fontFamily:CustomeFont.Helvetica_Bold,fontSize:15,color:Appcolor.appColor}}>LogOut</Text>
            </TouchableOpacity>
  : null}
          </View>
        </View>
        <View
          style={{
            height: 6,
            backgroundColor: Appcolor.buttonBGColor,
            marginHorizontal: 4,
            marginTop: 10,
          }}></View>
      </View>
    );
  }
}

