
import React, { Component } from 'react'
import { Text, View,StyleSheet,Linking,TouchableOpacity,FlatList,Dimensions,Image } from 'react-native'
 import images from '../../../assets'
import Appcolor from '../../../Appcolor'
import CustomeFont from '../../../CustomeFont'
import MyStatusBar from '../Components/MyStatusBar'
import CommonLoginHeader from '../Components/CommonLoginHeader'
import {
  getUserType,
 getAccessToken,
} from '../../Utilities/LocalStorage';
import SmartLoader from '../Components/SmartLoader';
import NoDataFound from '../Components/NoDataFound'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


export default class Dashboard extends Component {

  constructor(props){
    super(props);
    this.state={
      accessToken:'',
      campaignsArray:[],
      isLoading:false
    };
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
    if (this.state.accessToken === undefined || this.state.accessToken === '')
    {
      getAccessToken().then(token=>{
        console.log(token)
        this.setState({
          accessToken:token
        },()=>{
          console.log('yyyyyyyyyy888888 ====  ')
          console.log(token)
          this.getDashboard()
              })
      }) 
    }
    else
    {
      this.getDashboard()
    }
    
    this.setState({
      isLoading:true
    })
    
  }
  

getDashboard() {

  const requestOptions = {
      method: 'GET',
      headers: { 'Accept': 'application/json','Content-Type': 'application/json',"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken
  },
     
  };
  console.log(requestOptions)
   fetch("https://dev.pixidium.net/rest/dashboard/", requestOptions)
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
                campaignsArray:responseData.data
              })
            }
            else
            {

              this.setState({
                campaignsArray:[]
              })
            }
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
            <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />
            <SmartLoader isLoading={this.state.isLoading}/>

        <CommonLoginHeader openProfile={()=>{
                  this.props.navigation.navigate('Account')
                }} isProfileBtn={true} isBackBtn={false} pageTitle={"PIXIDIUM"}/>
              
                 <View style={{flexDirection:'row',justifyContent:'space-evenly',marginTop:20}}>
                <TouchableOpacity
                onPress={()=>{this.props.navigation.navigate('AddBankDetails')}}
              style={this.styles.topButton}
              
              activeOpacity={.8}
              >
              <Text style={this.styles.topButtonTitle}>
                Add Bank Details
              </Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={this.styles.topButton}
              activeOpacity={.8}
              onPress={()=>{
                
                Linking.canOpenURL("https://connect.stripe.com/login").then(supported => {
                    if (supported) {
                      Linking.openURL("https://connect.stripe.com/login");
                    } else {
                      console.log("Don't know how to open URI: ");
                    }
                  });
              }}
              >
              <Text style={this.styles.topButtonTitle}>
                Connect Stripe
               </Text>
              </TouchableOpacity>
            </View>
            <Text style={{...this.styles.topButtonTitle,marginHorizontal:20,marginVertical:15,color:'black',fontSize:13,fontFamily:CustomeFont.Helvetica}}>Recent Campaigns:</Text>

            {this.state.campaignsArray.length > 0 ? 
            
            <FlatList
            style={{height:height - 210,backgroundColor:'white',marginHorizontal:10,
            marginBottom:10}}
            data={this.state.campaignsArray}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={this.ListHeader()}
            renderItem = {({item,index}) => 
            this.rowView(index + 1,item.client_name,item.campaign_title,"",0)}
           />
         
            : 
            
            <NoDataFound title={"No Data Found"}/>
            }
           
             

            </View>
        )
    }
    ListHeader = () => {
        //View to set in Header
        return (
        //   <View style={this.styles.headerFooterStyle}>
            this.rowView("S.No.","Client Name","Title","Action",1)
        //   </View>
        );
      };
    
      rowView = (t1,t2,t3,t4,topBorder) =>{
          return (
              <View style={{...this.styles.rowViewContainer,borderBottomWidth:0, borderStartWidth:0,
                borderStartColor:'black',borderBottomColor:'black', borderTopWidth: 0,borderTopColor:'black',backgroundColor: topBorder === 1 ? Appcolor.buttonBGColor : 'white'}}>
                   <View style={{...this.styles.rowTitleContainer,width:50,backgroundColor: topBorder === 1 ? Appcolor.appColor : 'white'}}>
                  <Text numberOfLines={1} style={{...this.styles.rowHeaderTitle, color : topBorder === 1 ? 'white' : 'black'}}>{t1}</Text>
                  {/* <View style={this.styles.separatorVertical}></View> */}
                  </View>
                  <View style={{justifyContent:'space-evenly',flexDirection:'row',flex:1}}>
                  <View style={{...this.styles.rowTitleContainer, flex:1}}>
                  <Text numberOfLines={1} style={{...this.styles.rowHeaderTitle,color : topBorder === 1 ? 'white' : 'black'}}>{t2}</Text>
                  {/* <View style={this.styles.separatorVertical}></View> */}
                  </View>
                  <View style={{...this.styles.rowTitleContainer, flex:1}}>
                  <Text numberOfLines={1} style={{...this.styles.rowHeaderTitle, color : topBorder === 1 ? 'white' : 'black'}}>{t3}</Text>
                  {/* <View style={this.styles.separatorVertical}></View> */}
                  </View>
                  <View style={{...this.styles.rowTitleContainer, flex:1}}>
                      <TouchableOpacity onPress={()=>{
                     topBorder === 1 ? null : this.props.navigation.navigate('CampaignDetails',{campaingn_id:this.state.campaignsArray[t1-1].id})
                  }}  activeOpacity={topBorder} style={{justifyContent:'center',alignItems:'center'}}>
                    {t4 === "" ? 
                    <Image source={images.eye} style={{width:20,height:20,tintColor:Appcolor.buttonBGColor}} width={20} height={20} resizeMode={'contain'}/>
                    : 
                    
                  <Text numberOfLines={1} style={{...this.styles.rowHeaderTitle,textDecorationLine: topBorder === 0 ? 'underline' : 'none',color : topBorder === 1 ? 'white' : Appcolor.buttonBGColor}}>{t4}</Text>
                  
                }</TouchableOpacity>
                  {/* <View style={this.styles.separatorVertical}></View> */}
                  </View>
                  </View>
              </View>
          )
      }

    styles = StyleSheet.create({
        itemRow:{
            width:(width/2 - 20),
            paddingVertical:15,
            justifyContent:'center',
            alignItems:'center', 
            marginVertical:7,
            marginHorizontal:8
        },
        imageV:{
            width:'100%',
            height:'100%',
             
        },
        topV:{
            paddingVertical:12,
            justifyContent:'center',
            alignItems:'center',
           // borderBottomWidth:1,
            borderBottomColor:Appcolor.appColor,
            marginTop:20
        },
        title:{
            fontFamily:CustomeFont.Helvetica,
            fontSize:17
        },
        subtitle:{
            fontFamily:CustomeFont.helvetica_light,
            fontSize:13,
            paddingStart:15,
            marginVertical:15
        },
        rowTitle:{
            fontFamily:CustomeFont.MYRIADPRO_BOLD,
            fontSize:21,
            paddingTop:4
        },
        button:{
            marginHorizontal:30,
            height:48,
            backgroundColor:Appcolor.buttonBGColor,
            justifyContent:'center',
            alignItems:'center',
            marginTop:20,
            marginBottom:20,
            borderRadius:10
         },
         buttontitle:{
             fontFamily:CustomeFont.MYRIADPRO_BOLD,
             fontSize:20,
             color:Appcolor.white,
             letterSpacing:1
         },
         headerFooterStyle: {
            width: '100%',
            height: 45,
            backgroundColor: 'white',
            //borderTopWidth:1,
            borderTopColor:'black',
           
           },
          textStyle: {
            textAlign: 'center',
            color: '#fff',
            fontSize: 18,
            padding: 7,
          },
        rowViewContainer:{
            flexDirection:'row',
            width:'100%',
            height:40,
           // alignItems:'center'
        },
        rowHeaderTitle:{
            fontFamily:CustomeFont.Helvetica_Bold,
            fontSize:14,
            color:'black',
            textAlign:'center'
           // backgroundColor:'red'
        },
        separatorVertical:{
            height:48,
            //width:1,
            backgroundColor:'black',
            marginHorizontal:7 
        },
        rowTitleContainer:{
            height:40,
            justifyContent:'center',
           // backgroundColor:'red',
            alignContent:'center',
           // borderRightWidth:1,
            borderRightColor:'black'
         },
         topButton:{
            paddingVertical: 10,
              width:'45%',
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:Appcolor.buttonBGColor,
            borderRadius:4
          },
          topButtonTitle:{
            fontFamily: CustomeFont.Helvetica_Bold, 
            fontSize: 15,
            color:'white'
          }
    })
}


