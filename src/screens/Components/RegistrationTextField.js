import React, { Component } from 'react'
import { Text, View ,TextInput, Platform} from 'react-native'
import CustomeFont from '../../../CustomeFont'

export default class RegistrationTextField extends Component {
    render() {
        return (
            <View style={{  marginVertical:4,flexDirection:'row',marginHorizontal:30,alignItems:'center'}}>
                <Text style={{fontFamily:CustomeFont.Helvetica,fontSize:12,marginEnd:5,width:115,color:'black'}}>{this.props.title}</Text>
                <View style={{borderRadius:2,flex:1,height:35,borderColor:'rgba(0,0,0,0.3)',borderWidth:1,justifyContent:'center',paddingHorizontal:10,paddingTop:4 }}>
                <TextInput 
                // placeholder={this.props.placeholder}
                editable={this.props.editable}
                value={this.props.value}
                onChangeText={(text)=>{
                    console.log(text)
                    this.props.oncallback(text)
                }}
                autoCapitalize='none'
                keyboardType={this.props.keyboardType}
                secureTextEntry={this.props.secureTextEntry}
                style={{color:'black',fontFamily:CustomeFont.Helvetica,fontSize:14,height:35,paddingTop:Platform.OS === 'android' ? 0 : 0}}
                />
                </View>
            </View>
        )
    }
}
