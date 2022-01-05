import React, { Component } from 'react'
import { Text, View,TextInput,StyleSheet,Image } from 'react-native'
import Appcolor from '../../../Appcolor';
import CustomeFont from '../../../CustomeFont'
export default class TextField extends Component {

constructor(props)
{
    super(props);
}


    render() {
        return (
            <View style={this.styles.container} >
                    <View style={this.styles.imageContainer}> 
                        <Image source={this.props.image} style={this.styles.image} resizeMode={'contain'}/>
                    </View>
                    <TextInput
                    placeholder={this.props.placeholder}
                    onChangeText={this.props.onChangeText}
                    style={this.styles.textInput}
                    secureTextEntry={this.props.secureTextEntry}
                    autoCapitalize='none'
                    />
                    <View style={{width:15,height:'100%'}}></View>
                </View>
        )
    }

    styles = StyleSheet.create({
        container:{
               flexDirection:'row',
                marginHorizontal:30,
                backgroundColor:Appcolor.white,
                borderRadius:10,
                marginBottom:20,
                overflow:'hidden',
                borderWidth:1,
                borderColor:Appcolor.appColor
         },
        image:{
            width:25,
            height:25,
            tintColor:Appcolor.white
        },
        imageContainer:{
            backgroundColor:Appcolor.buttonBGColor,
            width:65,
            height:50,
            justifyContent:'center',
            alignItems:'center',
            borderTopStartRadius:10,
            borderBottomStartRadius:10
        },
        textInput:{
            fontFamily:CustomeFont.Helvetica_Bold,
            fontSize:16,
            color:Appcolor.black,
            marginStart:10,
             backgroundColor:Appcolor.white,
             flex:1
           // width:'60%',
         }
    })
}
