
import React, { Component } from 'react'
import { Image, View,StyleSheet,TouchableOpacity,FlatList,Dimensions,Text } from 'react-native'
import CommonLoginHeader from '../Components/CommonLoginHeader'
import images from '../../../assets'
import Appcolor from '../../../Appcolor'
import CustomeFont from '../../../CustomeFont'
import MyStatusBar from '../Components/MyStatusBar'
import {
   getUserType,
  getAccessToken,
} from '../../Utilities/LocalStorage';
 import SmartLoader from '../Components/SmartLoader';
 import NoDataFound from '../Components/NoDataFound';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


export default class Notifications extends Component {

  constructor(props){
    super(props);
    this.state={
      accessToken:'',
      notificationDataArray:[],
      isLoading:false,
      userType : 'enduser',

    };
  }

 
componentDidMount()
{
  getUserType().then((type)=>{
    this.setState({
      userType:type
    })
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
      },()=>{
        if (
          this.state.accessToken !== '' &&
          this.state.accessToken !== undefined
        ) {
          this.setState({
            showLoginBtn: false,
          });
        } else {
          this.setState({
            showLoginBtn: true,
          });
        }
        this.getNotifications()
      })
    }) 
  }
  else
  {
    this.getNotifications()
  }
  
  this.setState({
    isLoading:true
  })
 
}

componentWillUnmount() {
  // Remove the event listener
 }
 

    getNotifications() {

      const requestOptions = {
          method: 'GET',
          headers: { 'Accept': 'application/json','Content-Type': 'application/json',"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken
      },
         
      };
      console.log(requestOptions)
       fetch("https://dev.pixidium.net/rest/notifications/", requestOptions)
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
                  this.setState({
                    notificationDataArray:responseData.data
                  })
                }
                this.clearNotifications()
            })       
          })
                  .catch(error =>{ console.log(error)
                  this.setState({
                    isLoading:false
                  })});
       
    }


    clearNotifications() {

      const requestOptions = {
          method: 'POST',
          headers: { accept: 'application/json',"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken
      },
         
      };
      console.log(requestOptions)
       fetch("https://dev.pixidium.net/rest/api/seen-notifications/", requestOptions)
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
                 this.props.navigation.setParams({abc:66})
            })       
          })
                  .catch(error =>{ console.log(error)
                  this.setState({
                    isLoading:false
                  })});
  
  
       
    }


    render() {
        return (
          <View style={{backgroundColor:'white', flex:1}}>
            <SmartLoader isLoading={this.state.isLoading}/>
          <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />
<CommonLoginHeader  isBackBtn={false} pop={()=>{this.props.navigation.pop()}} openProfile={()=>{
                  this.props.navigation.navigate('Account')
                }}  isProfileBtn={!this.state.showLoginBtn}
                isLoginBtn={this.state.showLoginBtn} pageTitle={"PIXIDIUM"} onPress={()=>{
    this.props.navigation.replace('Login')
}}/>
                <Text style={{fontFamily:CustomeFont.Helvetica_Bold,fontSize:17,color:'black', textDecorationLine:'underline',textAlign:'center',marginTop:10,marginBottom:25}}>Notifications</Text>
                <FlatList
          style={{marginBottom: 0}}
          data={this.state.notificationDataArray}
           ListEmptyComponent={<NoDataFound title={"No Data Found"} />}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            this.categoryRow(item)
          )}
        />
            </View>
        )
    }

categoryRow= (item) =>{
    return (
<View style={this.styles.itemRow}>
              
              <View style={{flex:1,backgroundColor:'white',borderRadius:4,elevation:4}}>
                  <TouchableOpacity onPress={()=>{
                    if (this.state.userType === 'ambassdor')
                    {
                      this.props.navigation.navigate('Compaigns',{showBackBtn:true});

                    }
        }} activeOpacity={1}><Text style={this.styles.buttonTitle}>{item.text}</Text></TouchableOpacity>
                
    {/* <Text style={{fontFamily:CustomeFont.Helvetica,
            fontSize:11,textAlign:'right',marginEnd:10,marginBottom:4,color:'gray'}}>10 minutes ago</Text> */}
              </View>
            </View>
    )
}

    styles = StyleSheet.create({
        itemRow: {
         // width: width - 40,
           
          marginVertical: 6,
          marginHorizontal: 10,
        
          // borderWidth:1,
          // borderColor:'black',
          borderRadius:4,
          shadowColor: 'gray',
          shadowOffset: {x: 0, y: 1},
          shadowRadius: 2,
          shadowOpacity: 0.8,
    
        },
        imageV: {
          width: '90%',
          height: '90%',
          
        },
        topV: {
          paddingVertical: 12,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          flexDirection: 'row',
          borderBottomColor: Appcolor.appColor,
          marginTop: 20,
        },
        title: {
          fontFamily: CustomeFont.Helvetica,
          fontSize: 17,
          flex: 1,
          textAlign: 'center',
          marginStart: -25,
        },
        buttonTitle:{
            fontFamily:CustomeFont.Helvetica,
            fontSize:13,
            // textDecorationLine:'underline',
            color:'black',
            marginEnd:10,
            paddingVertical:6,
            paddingStart:10
        }
      });
    }
    