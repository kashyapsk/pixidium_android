import React from 'react'
import { TouchableOpacity, Image, StyleSheet,View,Text } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Appcolor from '../../../Appcolor'
import images from '../../../assets'
import CustomeFont from '../../../CustomeFont'

export default function Header({ goBack,title,textColor ,buttonColor}) {
  return (
    <View style={styles.mainV}>
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <Image
        style={{...styles.image,    tintColor: buttonColor !== undefined ? buttonColor : 'black'
      }}
        source={images.arrow_back}
      />
    </TouchableOpacity>
    <Text style={{...styles.titleText,    color: textColor === undefined ? Appcolor.appColor : textColor
}}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
  marginStart:10,marginTop:12
  },
  image: {
    width: 24,
    height: 24,
  },
  mainV:{
    width:'100%',
    height:44 + getStatusBarHeight(),
    flexDirection:'row',
    alignItems:'center',
   },
  titleText:{
    fontFamily:CustomeFont.Helvetica,
    fontSize:19,
    flex:1,
    marginEnd:30,
    marginTop:12,
    textAlign:'center',
  }

})
