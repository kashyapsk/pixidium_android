
import React, { Component } from 'react'
import { Text, KeyboardAvoidingView,View,Dimensions,StyleSheet,ScrollView,TouchableOpacity } from 'react-native'
import MyStatusBar from '../Components/MyStatusBar'
import CommonLoginHeader from '../Components/CommonLoginHeader'
import Appcolor from '../../../Appcolor'
import images from '../../../assets'
import CustomeFont from '../../../CustomeFont'
import { TextInput } from 'react-native-gesture-handler'
import {saveUserType,getUserType,getAccessToken} from '../../Utilities/LocalStorage'
import SmartLoader from '../Components/SmartLoader';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class AddBankDetails extends Component {

    constructor(props){
        super(props);
        this.state={
          accessToken:'',
           isLoading:false,
           name_in_bank:'',
           bank_name:'',
           sort_code:'',
           account_number:'',
           iban_number:''
        };
      }
    
     
      componentDidMount()
      {
        this.setState({
          userType:getUserType()
        })
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("focus", () => {
           this.load()
          
        });
      
        
      }
      
      load = () =>{
        if (this.state.accessToken === undefined || this.state.accessToken === '')
        {
          getAccessToken().then(token=>{
            console.log(token)
            this.setState({
              accessToken:token
            })
          }) 
        }
        
        
      }
      


addBankDetailsApi(){
 
     if (this.state.name_in_bank === '')
     {
         alert('Please enter your name in bank')
     }
     else if (this.state.bank_name === '')
     {
         alert('Please enter you bank name')
     }
     else if (this.state.sort_code === '')
     {
         alert('Please enter sort code')
     }
     else if (this.state.account_number === '')
     {
         alert('Please enter account number')
     }
     else if (this.state.iban_number === '')
     {
         alert('Please enter IBAN number')
     }
     else  
     {
         
   
    const formData = new FormData();
    formData.append('name_in_bank', this.state.name_in_bank);
    formData.append('bank_name', this.state.bank_name);
    formData.append('sort_code', this.state.sort_code);
    formData.append('account_number', this.state.account_number);
    formData.append('iban_number', this.state.iban_number);

   
    this.setState({
      isLoading: true,
    });

     const requestOptions = {
      method: 'POST',
      headers: { accept: 'application/json',"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken},
      body: formData,
    };
    console.log(requestOptions);
    fetch('https://www.pixidium.net/rest/api/add-bank-details/', requestOptions)
      .then(response => {
        return response.json();
      })
      .then(data => {
          console.log('kkkk ')
        console.log(data); //REF 1;
        this.setState({
          isLoading: false,
        });
        if (data !== undefined && data.status === 200) {
           
            this.props.navigation.pop()
        }
        else if (data.non_field_errors !== undefined)
        {
            alert(data.non_field_errors[0].message)
            this.setState({
              isLoading:false
            })
        }
      })
      .catch(err => {
        console.log('ERROR: ' + err);
        this.setState({
          isLoading: false,
        });
      });
     }

 }


    render() {
        return (
            <View style={{backgroundColor:'white', flex:1}}>
            <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />
<CommonLoginHeader onPress={()=>{
    this.props.navigation.replace('Login')
}} isBackBtn={true} pop={()=>{this.props.navigation.pop()}} pageTitle={"PIXIDIUM"}/>
               <SmartLoader isLoading={this.state.isLoading}/>

    <ScrollView style={{flex:1,marginBottom:0}}>
    <KeyboardAvoidingView  enabled={true} behavior={Platform.OS === "ios" ? "padding" : null}  >

    <View style={{height:15,width:'100%'}}></View>
            {this.TextField(title='Name in Bank *', placeholder='Enter your name',numberOfLine=1,oncallback=(text)=>{
                this.setState({
                    name_in_bank:text
                })
            })}
            {this.TextField(title='Bank Name *', placeholder='Enter bank name',numberOfLine=1,oncallback=(text)=>{
                this.setState({
                    bank_name:text
                })
            })}
            {this.TextField(title='Sort Code *', placeholder='Enter sort code',numberOfLine=1,oncallback=(text)=>{
                this.setState({
                    sort_code:text
                })
            })}
            {this.TextField(title='Account Number *', placeholder='Enter account number',numberOfLine=1,oncallback=(text)=>{
                this.setState({
                    account_number:text
                })
            })}
            {this.TextField(title='IBAN Number', placeholder='Enter iban number',numberOfLine=1,oncallback=(text)=>{
                this.setState({
                    iban_number:text
                })
            })}
            
           </KeyboardAvoidingView>
             </ScrollView>
             <TouchableOpacity 
             onPress={()=>{
                 this.addBankDetailsApi()
             }}
            style={this.styles.button}>
            <Text style={this.styles.buttontitle}>Save Details</Text>
          </TouchableOpacity>
             </View>
        )
    }


    TextField = (title,placeholder,numberOfLine,oncallback) =>{
        return (
            <View style={this.styles.textFieldContainer}>
                <Text style={this.styles.textTitle}>{title}</Text>
                <TextInput                 autoCapitalize='none'
 onChangeText={(text)=>{
                    console.log(text)
                     oncallback(text)
                }} multiline = {numberOfLine === 1 ? false : true} numberOfLines={3} placeholder={placeholder} style={{...this.styles.textField,height:numberOfLine === 1 ? 35 : 80}} />
            </View>
        )
    }

    styles = StyleSheet.create({
        textFieldContainer:{
            marginHorizontal:20,
            paddingVertical:4,
            marginBottom:4
        },
        textField:{
            height:35,
            color:'black',
            fontFamily:CustomeFont.helvetica_light,
            fontSize:13,
            borderWidth:0.3,
            paddingStart:6,
            borderRadius:4,
            borderColor:'#bcbcbc'

        },
        textTitle:{
            color:'black',
            fontFamily:CustomeFont.Helvetica,
            fontSize:16,
            marginBottom:10
        },
        button: {
            height: 44,
           backgroundColor: Appcolor.buttonBGColor,
           justifyContent: 'center',
           alignItems: 'center',
            marginTop:2,
             marginHorizontal:20,
             marginBottom:20,
             borderRadius:4
         },
         buttontitle: {
           fontFamily: CustomeFont.Helvetica,
           fontSize: 17,
           color: Appcolor.white,
           letterSpacing: 1,
         },
    })
}
