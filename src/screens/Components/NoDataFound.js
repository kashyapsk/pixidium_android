import React, { Component } from 'react'
import {View,Text,Dimensions} from 'react-native'
export default class NoDataFound extends Component {
    render() {
        return (
            <View style={{flex:1,height:Dimensions.get('window').height - 120,alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'black'}}>{this.props.title}</Text>
            </View>
        )
    }
}
