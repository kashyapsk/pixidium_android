

import React, { Component } from 'react'
import { Image, View,StyleSheet,TouchableOpacity,FlatList,Dimensions,Text,ScrollView } from 'react-native'
import CommonLoginHeader from '../Components/CommonLoginHeader'
import images from '../../../assets'
import Appcolor from '../../../Appcolor'
import CustomeFont from '../../../CustomeFont'
import MyStatusBar from '../Components/MyStatusBar'
import {saveUserType,getUserType,getAccessToken} from '../../Utilities/LocalStorage'
import SmartLoader from '../Components/SmartLoader';
import NoDataFound from '../Components/NoDataFound'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


export default class InProgress extends Component {


  constructor(props){
    super(props);
    this.state={
      accessToken:'',
      campaignsArray:[],
      isLoading:false,
      userType : getUserType()

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
        },()=>{
          console.log('yyyyyyyyyy888888 ====  ')
          console.log(token)
          this.getInProcess()
              })
      }) 
    }
    else
    {
      this.getInProcess()
    }
    
    this.setState({
      isLoading:true
    })
    
  }
  

getInProcess() {

  const requestOptions = {
      method: 'GET',
      headers: { 'Accept': 'application/json','Content-Type': 'application/json',"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken
  },
     
  };
  console.log(requestOptions)
   fetch("https://www.pixidium.net/rest/in-progress/", requestOptions)
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
        })       
      })
              .catch(error =>{ console.log(error)
              this.setState({
                isLoading:false
              })});


   
}


 
    nextPage =(item)=>{
this.props.navigation.navigate('CampaignPreview',{isFromInProgress:true,camp_id:item.campaign_id,id:item.id})
    }

    render() {
        return (
          <View style={{backgroundColor:'white', flex:1}}>
          <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />
          <SmartLoader isLoading={this.state.isLoading}/>

<CommonLoginHeader openProfile={()=>{
                  this.props.navigation.navigate('Account')
                }} isProfileBtn={true} pageTitle={"PIXIDIUM"}/>
                 <Text style={{fontFamily:CustomeFont.Helvetica_Bold,fontSize:17,color:'black', textDecorationLine:'underline',textAlign:'center',marginTop:10,marginBottom:25}}>In-Progress</Text>
                <FlatList
           data={this.state.campaignsArray}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListFooterComponentStyle={{height:20}}
          ListEmptyComponent={<NoDataFound title={"No Data Found"}/>}
          ListFooterComponent={()=>{return<View style={{height:20,width:"100%"}}></View>}}
          renderItem={({item}) => (
            this.categoryRow(item)
          )}
        />
             </View>
        )
    }

categoryRow= (item) =>{
  let Image_Http_URL ={ uri: item.cover_image};

    return (
      <View style = {{...this.styles.itemRow, shadowColor: 'gray',
      shadowOffset: {x: 0, y: 2},
      shadowRadius: 3,
      shadowOpacity: 0.8,marginTop:10,marginHorizontal:10}}>
            <TouchableOpacity style={{...this.styles.itemRow, elevation:4}} onPress={()=>{this.nextPage(item)}}>
              <Image
                style={this.styles.imageV}
                source={Image_Http_URL}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            </View>
    )
}

    styles = StyleSheet.create({
        itemRow: {
          width: width / 2 - 20 ,
          height: 140,
          // marginVertical: 3,
          // marginHorizontal: 10,
          justifyContent:'center',
          alignItems:'center',
          borderRadius:4,
          backgroundColor:'white',
         
          
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
            textAlign:'center',
            textDecorationLine:'underline',
            color:'black',
            marginEnd:10,
            marginTop:15
        }
      });
    }
    