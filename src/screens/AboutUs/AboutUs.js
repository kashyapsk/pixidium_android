import React, { Component } from 'react'
import { Image, View,StyleSheet,TouchableOpacity,FlatList,Dimensions,Text } from 'react-native'
import CommonLoginHeader from '../Components/CommonLoginHeader'
import images from '../../../assets'
import Appcolor from '../../../Appcolor'
import CustomeFont from '../../../CustomeFont'
import MyStatusBar from '../Components/MyStatusBar'
import {getAccessToken} from '../../Utilities/LocalStorage'

export default class AboutUs extends Component {
   
    constructor(props){
        super(props);
        this.state={
          accessToken:'',
          campaignsArray:[],
          isLoading:false,
          showLoginBtn:true,
           campaignsArray :[]
    
        };
        console.log('home token == ')
    
      }
    
     
      componentDidMount()
      {
        this.load()
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("focus", () => {
           this.load()
          
        });
      
        
      }
      
      load = () =>{
         if (this.state.accessToken !== undefined || this.state.accessToken === '')
        {
            getAccessToken().then((token)=>{
                this.setState({
                    accessToken:token
                },()=>{
                    if (this.state.accessToken !== '' && this.state.accessToken !== undefined)
                    {
                        this.setState({
                            showLoginBtn:false
                        })
                    }
                    else
                    {
                        this.setState({
                            showLoginBtn:true
                        })
                    }
                })
            })
        }
        else if (this.state.accessToken !== '' && this.state.accessToken !== undefined)

        {
                this.setState({
                    showLoginBtn:false
                })   
        }
       
      }
    
   
    render() {
        return (
            <View style={{backgroundColor:'white', flex:1}}>
            <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />

<CommonLoginHeader openProfile={()=>{
                  this.props.navigation.navigate('Account')
                }} isProfileBtn={!this.state.showLoginBtn} paddingStart={20} isLoginBtn={this.state.showLoginBtn} pageTitle={"ABOUT US"} onPress={()=>{
    this.props.navigation.replace('Login')
}}/>
<Text style={{fontFamily:CustomeFont.Helvetica,fontSize:15,marginHorizontal:15,marginTop:15,color:'black'}}>
Pixidium Digital Leaflet promotions for your business is a great and probably the best place to promote and link your business with your community.
{'\n\n'}
- Pixidium takes care of your digital campaigning efforts giving you a little creative flair and a lot of promotional landscape to help you expose your business.
{'\n\n'}
- Learn from our insights to avoid the pit falls and mistakes other distributors make and improve your business to set your mark as an official eco campaigner.
{'\n\n'}
- Pixidium manage the logistics, ambassadors and reporting on your behalf, this makes selecting ambassadors from our database that much more efficient.
</Text>
</View>
        )
    }
}
