import React, { Component } from 'react'
import { Image, View,StyleSheet,TouchableOpacity,ScrollView,Dimensions,Text } from 'react-native'
import CommonLoginHeader from '../Components/CommonLoginHeader'
import images from '../../../assets'
import Appcolor from '../../../Appcolor'
import CustomeFont from '../../../CustomeFont'
import MyStatusBar from '../Components/MyStatusBar'
import {saveUserType,getUserType,getAccessToken} from '../../Utilities/LocalStorage'
import SmartLoader from '../Components/SmartLoader';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class Wallet extends Component {
    


    constructor(props){
        super(props);
        this.state={
          accessToken:'',
           isLoading:false,
          isLoginBtn:true,
          pixi_cash:0,
          total_amount:0,
          total_bonus:0,
          total_cash:0,
          userType : getUserType()
    
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
              accessToken:token,
             },()=>{
              console.log('yyyyyyyyyy888888 ====  ')
              console.log(token)
              this.getWalletDetails()
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
        else
        {
          this.getWalletDetails()
        }
        
        this.setState({
          isLoading:true
        })
        
      }
      
    
    getWalletDetails() {
    
      const requestOptions = {
          method: 'GET',
          headers: { 'Accept': 'application/json','Content-Type': 'application/json'
          ,"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken
      },
         
      };
      console.log(requestOptions)
       fetch("https://www.pixidium.net/rest/api/wallet-dashboard/", requestOptions)
          .then(response => {
             return response.json()
          }
              )
          .then(responseData =>
            {
               this.setState({
                isLoading:false
              },()=>{
                  console.log('fff')
                  if (responseData !== undefined && responseData.status === 200 )
                {
                  this.setState({
                    pixi_cash:responseData.data.pixi_cash,
                    total_amount:responseData.data.total_amount,
                    total_bonus:responseData.data.total_bonus,
                    total_cash:responseData.data.total_cash,

                  })
                }
            })       
          })
                  .catch(error =>{ console.log(error)
                  this.setState({
                    isLoading:false
                  })});
    
    
       
    }
    
    convertBonusApi(){
        const requestOptions = {
            method: 'GET',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'
            ,"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken
        },
           
        };
        console.log(requestOptions)
         fetch("https://www.pixidium.net/rest/api/convert-bonus-to-cash/", requestOptions)
            .then(response => {
               return response.json()
            }
                )
            .then(responseData =>
              {
                 this.setState({
                  isLoading:false
                },()=>{
                    console.log('fff')
                   
              })       
            })
                    .catch(error =>{ console.log(error)
                    this.setState({
                      isLoading:false
                    })});
      
      
    }

    withdrawApi(){
        const requestOptions = {
            method: 'GET',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'
            ,"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken
        },
           
        };
        console.log(requestOptions)
         fetch("https://www.pixidium.net/rest/api/withdraw-cash/", requestOptions)
            .then(response => {
               return response.json()
            }
                )
            .then(responseData =>
              {
                 this.setState({
                  isLoading:false
                },()=>{
                    console.log('fff')
                    
              })       
            })
                    .catch(error =>{ console.log(error)
                    this.setState({
                      isLoading:false
                    })});
      
      
    }

    nextPage =(item)=>{
        this.withdrawApi()
        //this.props.navigation.navigate('PasscodeVerification')
            }

    render() {
        return (
          <View style={{backgroundColor:'white', flex:1}}>
          <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />
          <SmartLoader isLoading={this.state.isLoading}/>

<CommonLoginHeader isBackBtn={true} pop={()=>{this.props.navigation.pop()}} isLoginBtn={this.state.showLoginBtn} onPress={()=>{
                  this.props.navigation.replace('Login')
              }}
                openProfile={()=>{
                  this.props.navigation.navigate('Account')
                }} paddingStart={10} isProfileBtn={ this.state.userType === 'ambassdor' ? true : this.state.isLoginBtn  } pageTitle={"PIXIDIUM"} />
               <ScrollView >
                   <View style={this.styles.topV}>
                    <Image style={this.styles.imgSize} source={images.wallet_subimg2} width={150} height={150} resizeMethod={'resize'} resizeMode={"contain"}/>
                   </View>
                   <View style={this.styles.topV}>
        <TouchableOpacity style={this.styles.buttonV} 
        onPress={()=>{
            if (this.state.userType === 'ambassdor')
            {
                this.convertBonusApi()
            }
        }}
        >
            <Text style={this.styles.buttonTitle}>Convert</Text>
        </TouchableOpacity>
        <TouchableOpacity style={this.styles.buttonV}>
            <Text style={this.styles.buttonTitle}>Redeem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={this.styles.buttonV}>
            <Image source={images.share} width={15} height={15} style={{width:15,height:15,tintColor:'white',paddingHorizontal:8}} resizeMode={'contain'}/>
        </TouchableOpacity>
                   </View>
                   <View style={this.styles.priceV}>
                       <Text style={this.styles.title}>Bonuses</Text>
                       <Text style={this.styles.priceTitle}>{this.state.total_bonus}</Text>
                       </View>
                       <View style={this.styles.seperatorV}></View>
                       <View style={this.styles.priceV}>
                       <Text style={this.styles.title}>MY PORTFOLIO</Text>
                        </View>
                        <View style={this.styles.priceV2}>
                       <Text style={this.styles.title2}>CURRENT BALANCE</Text>
                       <Text style={this.styles.priceTitle}>{this.state.total_amount}</Text>
                       </View>
                       <View style={this.styles.priceV2}>
                       <Text style={this.styles.title2}>Cash</Text>
                       <Text style={{...this.styles.priceTitle,marginEnd: 25}}>{this.state.total_cash}</Text>
                       <TouchableOpacity onPress={()=>{
                           if (this.state.userType === 'ambassdor')
                           {
                               this.withdrawApi()
                           }
                       }} style={this.styles.buttonV}>
            <Text style={this.styles.buttonTitle}>Withdraw</Text>
        </TouchableOpacity>
                       </View>
                       <View style={this.styles.priceV2}>
                            <Image source={images.wallet_subimg1} width={40} height={40} resizeMode={'contain'} style={{width:40,height:40,marginEnd:110}}/>
                         <Text style={this.styles.priceTitle}>{this.state.pixi_cash}</Text>
                       </View>
                       <View style={this.styles.priceV}>
                       <Text style={this.styles.title}>ADVERTS</Text>
                        </View>
                        <View style={this.styles.advertV}>

                        </View>
                   </ScrollView> 
            </View>
        )
    }

    styles = StyleSheet.create({
         
        topV: {
          paddingVertical: 12,
          justifyContent:'center',
           alignItems: 'center',
           marginTop: 15,
           flexDirection:'row'
        },
        priceV: {
            alignItems: 'center',
            paddingVertical: 12,
              marginTop: 10,
             flexDirection:'row',
              marginHorizontal:30
          },
          priceV2: {
            alignItems: 'center',
            paddingVertical: 6,
              marginTop: 4,
             flexDirection:'row',
              marginHorizontal:35
          },
        imgSize:{
            width:150,
            height:150
        },
        title: {
          fontFamily: CustomeFont.Helvetica,
          fontSize: 14,
            marginEnd:100,
            color:'black'
        },
        title2:{
            fontFamily: CustomeFont.Helvetica,
          fontSize: 13,width:150,color:'black'
        },
        buttonV:{
            paddingHorizontal:6,
            height:26,
            backgroundColor:Appcolor.buttonBGColor,
            borderRadius:2,
            marginEnd:15,
            justifyContent:'center',
            alignItems: 'center',
        },
        buttonTitle:{
            fontFamily:CustomeFont.Helvetica,
            fontSize:15,
            // textDecorationLine:'underline',
            color:'white',
            marginEnd:10,
            paddingVertical:3,
            paddingStart:10
        },
        priceTitle:{
            fontFamily:CustomeFont.Helvetica,
            fontSize:12,
            color:'black'
             },
        seperatorV:{
            height:2,
            backgroundColor:Appcolor.buttonBGColor,
            marginHorizontal:10,
            marginTop:10
        },
        advertV:{
            height:50,
            marginHorizontal:25,
            borderRadius:10,
            shadowColor: 'gray',
    shadowOffset: {x: 0, y: 2},
    shadowRadius: 1,
    shadowOpacity: 0.8,
    backgroundColor:'white',
    marginBottom:40
        }
      });
    }
