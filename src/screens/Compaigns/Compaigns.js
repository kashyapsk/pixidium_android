import React, { Component } from 'react'
import { Image, View,StyleSheet,TouchableOpacity,FlatList,Dimensions,Text } from 'react-native'
import CommonLoginHeader from '../Components/CommonLoginHeader'
import images from '../../../assets'
import Appcolor from '../../../Appcolor'
import CustomeFont from '../../../CustomeFont'
import MyStatusBar from '../Components/MyStatusBar'
import {saveUserType,getUserType,getAccessToken} from '../../Utilities/LocalStorage'
import SmartLoader from '../Components/SmartLoader';
import NoDataFound from '../Components/NoDataFound';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


export default class Compaigns extends Component {

  

  constructor(props){
    super(props);
    this.state={
      accessToken:'',
      campaignsArray:[],
      isLoading:false,
      isLoginBtn:true,
      userType : 'enduser',
      showBackBtn: (this.props.route.params !== undefined && this.props.route.params.showBackBtn === true)

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
          this.getCampaingns()
              })
      }) 
    }
    else
    {
      this.getCampaingns()
    }
    
    this.setState({
      isLoading:true
    })
    
  }
  

getCampaingns() {

  const requestOptions = {
      method: 'GET',
      headers: { 'Accept': 'application/json','Content-Type': 'application/json',"Authorization": this.state.userType === 'ambassdor' ?  "Bearer " + this.state.accessToken : ''
  },
     
  };
  console.log(requestOptions)
   var url = this.state.userType === 'ambassdor' ? 'https://www.pixidium.net/rest/campaigns-to-allocate/' : "https://www.pixidium.net/rest/campaigns/"
   console.log(url)
   fetch(url, requestOptions)
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



 accept_reject_Api(id,action,index){
 
     
   
    const formData = new FormData();
    formData.append('id', id);
    formData.append('action', action);
    this.setState({
      isLoading: true,
    });

     const requestOptions = {
      method: 'POST',
      headers: { accept: 'application/json',"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken},
      body: formData,
    };
    console.log(requestOptions);
    fetch('https://www.pixidium.net/rest/accept-campaign/', requestOptions)
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
          // if (action === 'accept')
          // {
            var tmp = this.state.campaignsArray
            
            tmp.splice(index, 1);
            this.setState({
              campaignsArray:tmp,
              isLoading:false
            })
         // }
             
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
 

    render() {
        return (
            <View style={{backgroundColor:'white', flex:1}}>
                                <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />
                                <SmartLoader isLoading={this.state.isLoading}/>

                <CommonLoginHeader 
                isBackBtn={this.state.showBackBtn} pop={()=>{this.props.navigation.pop()}}
                isLoginBtn={this.state.showLoginBtn} onPress={()=>{
                  this.props.navigation.replace('Login')
              }}
                openProfile={()=>{
                  this.props.navigation.navigate('Account')
                }} paddingStart={10} isProfileBtn={ this.state.userType === 'ambassdor' ? true : !this.state.isLoginBtn  }  pageTitle={"PIXIDIUM"}/>
                <FlatList
          style={{marginBottom: 0}}
          data={this.state.campaignsArray}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NoDataFound title={'No Data Found'}/>}
          renderItem={({item,index}) => (
            this.categoryRow(item,index)
          )}
        />
            </View>
        )
    }

categoryRow= (item,index) =>{
  let Image_Http_URL ={ uri: item.cover_image};

    return (
      <View style={{flex:1, shadowColor: 'gray',
      shadowOffset: {x: 0, y: 2},
      shadowRadius: 3,
      shadowOpacity: 0.8, }}>
        <TouchableOpacity onPress={()=>{
          if (this.state.userType !== 'ambassdor')
          {
            this.props.navigation.navigate('CampaignPreview',{camp_id:item.campaign_id})

          } 
        }}>
<View style={this.styles.itemRow}>
              <Image
                style={{ width: this.state.userType !== 'ambassdor' ? '100%' : '88%',
                height: this.state.userType !== 'ambassdor' ? '100%' : '60%',
                }}
                source={Image_Http_URL}
                resizeMode={'cover'}
              />
              {this.state.userType === 'ambassdor' ? 

              <View style={{flexDirection:'row',justifyContent:'center',marginTop:10}}>
                  <TouchableOpacity onPress={()=>{
                    this.accept_reject_Api(item.id,'accept',index)
                  }} style={{justifyContent:'center',alignItems:'center',height:30}}><Text style={this.styles.buttonTitle}>Accept</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=>{
                    this.accept_reject_Api(item.id,'reject',index)
                  }} style={{justifyContent:'center',alignItems:'center',height:30}}><Text style={this.styles.buttonTitle}>Reject</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=>{
                      this.props.navigation.navigate('CampaignDetails',{campaingn_id:item.campaign_id})
                  }} style={{justifyContent:'center',alignItems:'center',height:30}}><Text style={this.styles.buttonTitle}>Preview</Text></TouchableOpacity>

              </View>
              : null}
            </View>
            </TouchableOpacity>
            </View>
    )
}

    styles = StyleSheet.create({
        itemRow: {
          width: width / 2 - 20,
          height: 140,
          marginTop: 14,
          marginHorizontal: 10,
          justifyContent:'center',
          alignItems:'center',
           borderRadius:4,
          backgroundColor:'white',
          elevation:5
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
            fontSize:11,
            textAlign:'center',
            textDecorationLine:'underline',
            color:Appcolor.appColor,
              width:52
        }
      });
    }
    