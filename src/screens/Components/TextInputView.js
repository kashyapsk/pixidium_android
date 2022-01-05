import React from 'react'
import { View, StyleSheet, Image, Text,TextInput } from 'react-native'
import CustomeFont from '../../../CustomeFont'
 
export default function TextInputView({ imageName, subtitleName, placeholder,
  errorMsg,isError,returnType,keyboardType,isForPhone,phoneCode,
  value,secureTextEntry,onTextChange,maxLength}) {
  return (
    <View style={styles.container}>
      <View style={styles.subTitleContainer}>
        <Image source={imageName} width={20} height ={20} style={styles.imageStyle} resizeMode={'contain'}/>
        <Text style={styles.subTitileStyle}>{subtitleName}</Text>
      </View>
      <View style={styles.inputVContainer}>
      {isForPhone === true ? 
      <View style={{flexDirection:'row',alignItems:'center',marginEnd:4}}>
        <Text style={{color:'black'  }}>+{phoneCode}</Text>
        <View style={{height:16,width:1,backgroundColor:'#bcbcbc',marginHorizontal:6}}>
          </View>
          </View>
      : null}
      <TextInput
        style={styles.input}
        placeholder = {placeholder}
        keyboardType = {keyboardType}
        returnKeyType = {returnType}
        onChangeText={onTextChange}
        maxLength={maxLength}
        value={value}
         numberOfLines={1}
        secureTextEntry={true}
        />
                </View>

       <View style={styles.seperatorV}></View>
      {isError === true ? <Text style={styles.error}>{errorMsg}</Text> : null}
    </View>
  )
}
  
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 1,
    marginTop:20
  },
  input: {
    // backgroundColor: theme.colors.surface,
    height:40,
    fontFamily:CustomeFont.Helvetica,
    fontSize:14,
    color:'black',
    flex:1,
    marginTop:4
  },
  description: {
    fontSize: 13,
    // color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    // color: theme.colors.error,
    paddingTop: 0,
    fontFamily:CustomeFont.Helvetica,
    color:'black'
  },
  subTitleContainer:{
    flexDirection:'row',
    alignContent:'flex-start'
  },
  subTitileStyle:{
fontSize:13,
marginStart : 4,
paddingTop:2,
color:'black',
fontFamily:CustomeFont.Helvetica
  },
  imageStyle:{
width:20,
height:20
  },
  searchIcon: {
    padding: 10,
  },
  seperatorV:{
    height:1,
    backgroundColor:'#2f2f2f',
    opacity:0.3,
    marginBottom:10
  },
  inputVContainer:{
    flexDirection:'row',
   }
})
